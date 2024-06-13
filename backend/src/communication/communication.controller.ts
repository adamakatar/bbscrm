import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  Param,
  BadRequestException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateContactDto } from 'src/users/dto/create-contact.dto';
import { CommunicationService } from './communication.service';
import { ErrorHanldingFn } from 'src/utils/utils.helper';
import * as Twilio from 'twilio';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordUserDto } from 'src/users/dto/resetPassword-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles-guard.guard';
import { IUser } from 'src/users/interfaces/user.interface';
import { Schema } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { EmailService } from 'src/utils/utils.email.service';

@Controller('/api/v1/communication')
export class CommunicationController {
  private sharedVariable;
  private client;

  constructor(
    private communicationService: CommunicationService,
    private readonly sendGridService: SendgridService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService
  ) {
    this.client= Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  }

  @Post('send-sms')
  async sendSms(@Body('to') to: string, @Body('body') body: string) {
    const client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    await client.messages.create({
      body,
      from: process.env.TWILIO_NUMBER,
      to,
    });

    return 'Message sent!';
  }

  @Post('receive-email')
  @UseInterceptors(FileInterceptor('body'))
  async receiveEmail(
      @UploadedFile() body: any, 
      @Body() content: string, 
      @Req() req: Request
  ) {
    //Grab Name
    await this.communicationService.scrapEmail(
      content, 
      req
    );
  }

  @Post('contact-regist')
  async contactRegist(
    @Body() createContactDto: CreateContactDto,
    @Req() req: Request,
  ) {
    try {
      const newUser = await this.communicationService.contactRegist(
        createContactDto,
      );

      const passwordSetupLink = `${req.protocol}://${req.get(
        'host',
      )}/api/v1/auth/resetPassword/${newUser.passwordResetToken}`;

      await this.emailService.sendPasswordReset(
          {
            email: createContactDto.email,
            firstName: createContactDto.firstName,
            name: createContactDto.firstName,
          },
          {
            url: passwordSetupLink,
            email: "",
            contact: "",
            address: "",
          },
        );
        await this.communicationService.resetNotification();  
        return { status: 'success', result: newUser.passwordResetToken };
    } catch (error) {
      console.log({ error });
      return ErrorHanldingFn(error);
    }
  }

  @Post('resetPassword/:token')
  async resetPassword(
    @Body() resetPasswordUserDto: ResetPasswordUserDto,
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    try {
      resetPasswordUserDto.token = token;
      const rs = await this.communicationService.resetPassword(
        resetPasswordUserDto,
      );

      if (rs.result) {
        const newUserDto = new CreateUserDto();
        newUserDto.firstName = rs.user.firstName;
        newUserDto.lastName = rs.user.lastName;
        newUserDto.email = rs.user.email;
        newUserDto.password = rs.password;
        newUserDto.passwordConfirm = rs.password;
        (newUserDto.fcmToken = rs.token),
          (newUserDto.contact = `+${rs.user.contact}`);
        const data = await this.authService.signup(newUserDto);

        res.status(200).json({ message: 'Password reset successfully', data });
      } else {
        throw new BadRequestException({
          message: 'Sorry, cannot set password at the moment.',
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
        baseUrl: this.configService.get('API_HOSTED_URL'),
      });
    }
  }

  @Post('receive-sms')
  receiveSms(@Body('From') from: string, @Body('To') to: string, @Body('Body') body: string) {
    console.log(`Received a message from ${from}: ${body}`);
    return this.communicationService.receiveSms(from, to, body);
  }

  @Get('/token')
  getToken(@Query('identity') identity: string) {
    this.sharedVariable = identity;

    const AccessToken = Twilio.jwt.AccessToken;
    const { VoiceGrant } = AccessToken;

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true,
    });

    const token = new AccessToken(
      process.env.TWILIO_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { identity },
    );

    token.addGrant(voiceGrant);

    // Include token in a JSON response
    return token.toJwt();
  }

  @Post('/call/transfer')
  async transferCall(@Body('first') first: string, @Body('second') second: string) {
    const callSid = await this.communicationService.extractSid(first);
    if(callSid != '-1')
      this.client.calls(callSid).update({
          twiml: `<Response><Dial>${second}</Dial></Response>`
        });
  }

  @Post('/call/record')
  async recordCall(@Body('to') to: string) {

//    const callSid = await this.communicationService.extractSid(to);
//    if(callSid != '-1')
//      this.client.calls(callSid).recordings.create();

}

  @Post('/call/record/link') 
  linkRecord(@Body('to') to: string) {
    return this.communicationService.audioLink(to);
  }

  @Post('/call/hangup')
  async hangupCall(@Body('to') to: string) {
    const callSid = await this.communicationService.extractSid(to);
    if(callSid != '-1')
      this.client.calls(callSid).update({
          twiml: '<Response><Hangup/></Response>'
        });
    return callSid;
  }

  @Post('/call/hold')
  async holdCall(@Body('to') to: string, @Res() res: Response) {
    const callSid = await this.communicationService.extractSid(to);
    if(callSid != '-1')
      this.client.calls(callSid).update({
          twiml: '<Response><Play loop="true">You are on hold</Play></Response>'
      });
  }

  @Post('/call/unhold')
  async unholdCall(@Body('to') to: string, @Res() res: Response) {
    const callSid = await this.communicationService.extractSid(to);
    if(callSid != '-1')
      this.client.calls(callSid).update({
        twiml: `<Response><Dial>${to}</Response>`
      });
  }

  @Post('/call/conference')
  async conferenceCall(@Body('participants') participants: string, @Body('initiate') initiate: string, @Res() res: Response) {

      const confList = await this.client.conferences.list();
      const conferenceSid = confList[0].sid;
      if(participants != "") {
        this.client.conferences(conferenceSid).participants.create({
          from: this.configService.get('TWILIO_NUMBER'),
          to: participants,
          startConferenceOnEnter: true
        });
    }
  }

  @Post('/call/conference/hangup')
  async conferenceHangup(@Body() participant: string[]) {
    this.client.conferences.list({ friendlyName: "room" }, function (err, data) {
      const conferenceSid = data.conferences[0].sid;
      this.client.conferences(conferenceSid).participants.list(function (err, data) {
        data.participants.forEach(childSid => {
          this.client.calls(childSid).update({
	          twiml: '<Response><Hangup/></Response>'
          });
        });
      });
    });
  }

  @Post('/call/conference/hold')
  async conferenceHold(@Body() participant: string[]) {
    this.client.conferences.list({ friendlyName: "room" }, function (err, data) {
      const conferenceSid = data.conferences[0].sid;
      this.client.conferences(conferenceSid).participants.list(function (err, data) {
        data.participants.forEach(childSid => {
          this.client.calls(childSid).update({
            hold: true
          });
        });
      });
    });
  }

  @Post('/call/conference/unhold')
  async conferenceUnhold(@Body() participant: string[]) {
    this.client.conferences.list({ friendlyName: "room" }, function (err, data) {
      const conferenceSid = data.conferences[0].sid;
      this.client.conferences(conferenceSid).participants.list(function (err, data) {
        data.participants.forEach(childSid => {
          this.client.calls(childSid).update({
            hold: false
          });
        });
      });
    });
  }

  @Post('/call/forward')
  async forwardCall(@Body('num') num: string) {
    const myNumber = this.configService.get('TWILIO_NUMBER');
    const callSid = await this.communicationService.extractSid(myNumber);
    if(callSid != '-1')
      this.client.calls(callSid).update({
        twiml:`<Response><Dial>${num}</Dial><Say>You are forwarding to ${num}</Say></Response>`
      });
  }

  @Post('/recording-status')
  handleRecordingStatus(@Body() body: any, @Res() res: Response) {
    res.sendStatus(200);
  }
  
  @Post('/voice')
  getVoice(@Body('number') number: string, @Res() res: Response) {
    const VoiceResponse = Twilio.twiml.VoiceResponse;
    const voiceResponse = new VoiceResponse();

    const dial = voiceResponse.dial({
        callerId: process.env.TWILIO_NUMBER,
        record: 'record-from-answer',
        recordingStatusCallback: 'https://buybiznow.net/api/v1/communication/recording-status',
      	recordingStatusCallbackEvent: ['completed'] 
    }, number);

//    dial.conference({
//      startConferenceOnEnter: true,
//      endConferenceOnExit: true,
//      record: 'record-from-start',
//      recordingStatusCallback: 'https://buybiznow.net/api/v1/communication/recording-status',   
//    }, "room");

    res.type('text/xml');
    res.send(voiceResponse.toString());
  }

  @Post('/voice/incoming')
  async voiceIncoming(@Body('From') From: string, @Res() res: Response) {
    await this.communicationService.clearReadUserIds(From);

/*    const VoiceResponse = Twilio.twiml.VoiceResponse;
    const voiceResponse = new VoiceResponse();
    const dial = voiceResponse.dial({
      callerId: From,
      answerOnBridge: true,
    });
    dial.client(this.sharedVariable);
    dial.conference({
      startConferenceOnEnter: true,
      endConferenceOnExit: true,
      record: 'record-from-start',
      recordingStatusCallback: 'https://buybiznow.net/api/v1/communication/recording-status',   
    }, "room");
    res.type('text/xml');
    res.send(voiceResponse.toString()); */
   const VoiceResponse = Twilio.twiml.VoiceResponse;
    const voiceResponse = new VoiceResponse();

      const dial = voiceResponse.dial();
      dial.conference("room");

    res.type('text/xml');
    res.send(voiceResponse.toString());
  }

  @Post('call-status')
  callStatus(@Body() body: any) {
    console.log(body.CallStatus);
  }

  @Get('handle-call')
  handleCall(@Query('From') from: string) {
    const twiml = new Twilio.twiml.VoiceResponse();
    twiml.say('Hello, you have reached the automated response system.');
    return twiml.toString();
  }

  @Get('contact-gain')
  async contactGain() {
    return this.communicationService.contactGain();
  }

  @Get('sms-history')
  getSmsHistory() {
    return this.communicationService.getSmsHistory();
  }

  @Get('call-history')
  getCallHistory() {
    return this.communicationService.getCallHistory();
  }

  @Post('read-conversation')
  readConversation(
    @Body('contactId') contactId: string,
    @Body('userId') userId: string,
  ) {
    return this.communicationService.readConversation(contactId, userId);
  }

  @Get('s-contacts')
  @UseGuards(AuthGuard(), RolesGuard)
  getSContacts(@GetUser() user: IUser) {
    return this.communicationService.getSContacts(user);
  }

  @Get('s-get-conversations/:contactId')
  @UseGuards(AuthGuard(), RolesGuard)
  getSConversations(
    @GetUser() user: IUser,
    @Param('contactId') contactId: string,
  ) {
    return this.communicationService.getSConversations(user, contactId);
  }

  @Post('s-send-sms')
  @UseGuards(AuthGuard(), RolesGuard)
  async sSendSms(
    @Body('from') from: string,
    @Body('to') to: string,
    @Body('body') body: string,
  ) {
    try {
      const sms = await this.communicationService.sSendSms(from, to, body);
      return sms;
    } catch (error) {
      return error.toString();
    }
  }

  @Post('s-make-call')
  @UseGuards(AuthGuard(), RolesGuard)
  async sMakeCall(@Body('from') from: string, @Body('to') to: string) {
    try {
      const call = await this.communicationService.sMakeCall(from, to);
      return call;
    } catch (error) {
      return error.toString();
    }
  }

  @Post('s-mark-read')
  @UseGuards(AuthGuard(), RolesGuard)
  async sMarkRead(
    @Body('contactId') contactId: Schema.Types.ObjectId,
    @Body('userId') userId: Schema.Types.ObjectId,
  ) {
    try {
      const contact = await this.communicationService.sMarkReadConversation(
        contactId,
        userId,
      );
      return contact;
    } catch (error) {
      return error.toString();
    }
  }
}
