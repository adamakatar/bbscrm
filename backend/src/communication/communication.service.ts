import { Document, Model, Schema } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContactDto } from 'src/users/dto/create-contact.dto';
import { Request } from 'express';
import * as Twilio from 'twilio';
import * as crypto from 'crypto';
import { ResetPasswordUserDto } from 'src/users/dto/resetPassword-user.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { MSG_UNKNOWN_ERROR } from 'src/utils/utils.constants';
import { Email } from 'src/sendgrid/sendgrid.schema';
import { ISCall, ISSMS } from './communication.interfaces';
import { EmailService } from 'src/utils/utils.email.service';
import { AppConfigsService } from 'src/app-configs/app-configs.service';

export interface ContactItem extends Document {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  role: string[],
  passwordResetToken: string;
  passwordResetExpires: string;
}

@Injectable()
export class CommunicationService {
  private client: Twilio.Twilio;

  constructor(
    @InjectModel('Contact') private readonly Contact: Model<ContactItem>,
    @InjectModel('User') private readonly User: Model<IUser>,
    @InjectModel('Email') private readonly Email: Model<Email>,
    @InjectModel('SSMS') private readonly SSMS: Model<ISSMS>,
    @InjectModel('SCall') private readonly SCall: Model<ISCall>,
    private readonly emailService : EmailService,
    private readonly appConfigs : AppConfigsService
  ) {
    this.client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  }

  async sendSms(to: string, body: string) {
    await this.client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
  }

  async makeCall(to: string) {
    try {
      await this.client.calls.create({
        url: 'http://demo.twilio.com/docs/voice.xml',
        from: process.env.TWILIO_NUMBER,
        to: to,
      });
    } catch (error) {
      console.error('Error making call:', error);
      throw error; // re-throw the error if it should be handled by the calling function
    }
  }

  async getSmsHistory() {
    const messages = await this.client.messages.list();
    return messages;
  }

  async getCallHistory() {
    const calls = await this.client.calls.list();
    return calls;
  }

  async scrapEmail(content: any, req: Request) {
    
    //this part to scrap all necessary info

    let text = content?.text;
    if(!text.includes("Thank you for"))
      return;
    text = text.replace(/\r\n/g, "");
    const contactNameAfter = text.split("*Name*: ")[1];
    const contactName = contactNameAfter.split("*Email*: ")[0];
    const contactEmailAfter = text.split("*Email*: ")[1];
    const contactEmail = contactEmailAfter.split("*Phone*: ")[0];
    const contactPhoneAfter = text.split("*Phone*: ")[1];
    const contactPhone = contactPhoneAfter.split("*Comments*:")[0];
    const headlineAfter = text.split("interest in:")[1];
    let headline = headlineAfter.split("*")[1];
    
    headline = headline.replace(/([A-Z]|.\b|:|,)/gi, function(word, index) {
        if(word == ' ' || word == ',' || word == ':')
          return '-';
      return word.toLowerCase();
    })
    .replace(/--/g, '-');

    const contactDTO = {
      firstName: contactName.split(" ")[0],
      lastName: contactName.split(" ")[1],
      email: contactEmail,
      contact: contactPhone,
      role: "buyer",
    };

    const contactExists = await this.Contact.find({ email : contactEmail });
    const userExists = await this.User.find({ email : contactEmail });

    const signature = await this.appConfigs.appConfigDetails(process.env.EMAIL_FROM);

    console.log(signature);
    if(contactExists.length >= 1 || userExists.length >= 1) {
      await this.emailService.sendMailToInterest(
        {
          email: contactDTO.email,
          name: contactDTO.firstName,
        },
        {
          slug: headline,
          signature: signature?.ContactInfo
        }
      );      
    } else {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
  
      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
      
      await this.User.create({
        ...contactDTO,
        password: 'NewContactCreate123!',
        passwordConfirm: 'NewContactCreate123!',
        passwordResetToken,
        passwordResetExpires,
      });

      // Store new contact with passwordResetToken and passwordResetExpires
      await this.Contact.create({
        ...contactDTO,
        passwordResetToken,
        passwordResetExpires,
      });

      const passwordSetupLink = `${req.protocol}://${req.get(
        'host',
      )}/api/v1/auth/resetPassword/${passwordResetToken}`;

      await this.emailService.sendMailToInterest(
        {
          email: contactDTO.email,
          name: contactDTO.firstName,
        }, 
        {
          url: passwordSetupLink,
          slug: headline,
          signature: signature?.ContactInfo
        }        
      );
    }
  }
  async contactRegist(createContactDto: CreateContactDto) {
      // Create reset password token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Set token expire time to 10 minutes from now
      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

      const { email } = createContactDto;
      // Store new user with passwordResetToken and passwordResetExpires

      const contactExists = await this.Contact.find({ email });
      const userExists = await this.User.find({ email });

      if(contactExists.length >= 1 || userExists.length >= 1) {
        throw new BadRequestException({
          status: 'fail',
          message: 'Same email already exists.',
        });  
      }

      await this.User.create({
          firstName: createContactDto.firstName,
          lastName: createContactDto.lastName,
          email: createContactDto.email,
          contact: createContactDto.contact,
          role: createContactDto.role,
          password: 'NewContactCreate123!',
          passwordConfirm: 'NewContactCreate123!',
          passwordResetToken,
          passwordResetExpires,
      });

      // Store new contact with passwordResetToken and passwordResetExpires
      await this.Contact.create({
        ...createContactDto,
        passwordResetToken,
        passwordResetExpires,
      });
      console.log(resetToken, 3);

      const contactItems = await this.Contact.find().sort({ _id: -1 });

      return {
        contactItems,
        passwordResetExpires,
        passwordResetToken: resetToken,
      };
  }

  async resetPassword(resetPasswordUserDto: ResetPasswordUserDto) {
    const { password, token } = resetPasswordUserDto;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.Contact.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'Token is invalid or has expired',
      });
    }
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { result: true, user, password, token };
  }

  async contactGain() {
    const contactItems = await this.Contact.find().sort({ _id: -1 });
    return contactItems;
  }

  async receiveSms(from: string, to: string, body: string) {
    const history = await this.client.messages.list();
    const idx = history.findIndex(e => e.to == to && e.from == from);
    await this.SSMS.create(idx);
    return this.clearReadUserIds(from);
  }

  async resetNotification() {
    return await this.User.updateMany({}, { hasNotification: true });
  }

  async clearReadUserIds(from: string) {
    await this.resetNotification();

    const contact = await this.Contact.findOneAndUpdate(
      { contact: from },
      { $set: { readUserIds: [] } }, // Use $set to update a specific field
      { new: true, useFindAndModify: false },
    );

    return contact;
  }

  async readConversation(contactId: string, userId: string) {
    const contact = await this.Contact.findByIdAndUpdate(
      contactId,
      { $addToSet: { readUserIds: userId } }, // Use $push to add a new value to the array
      { new: true, useFindAndModify: false },
    );

    const contactItems = await this.Contact.find();
    let hasNotification = false;
    contactItems.forEach((item: any) => {
      if (!item.readUserIds.includes(userId)) {
        hasNotification = true;
        return;
      }
    });

    await this.User.findByIdAndUpdate(
      userId,
      { $set: { hasNotification } },
      { new: true, useFindAndModify: false },
    );

    return contact;
  }

  async getAContacts() {
    const contacts : any = await this.Contact.find().lean();
    let numbers = [];
    for(let e of contacts) 
      numbers.push(e?._doc?.contact);
    return numbers;
  };

  async getSContacts(user: IUser) {
    try {
      let userEmail = user.email;
      // if (userEmail == 'admin@admin.com') {
      //   userEmail = process.env.EMAIL_FROM; //  mjn@denverbbs.com
      // }

      const contacts = await this.Contact.find({
        email: { $ne: userEmail },
      }).exec();

      const unreadEmails = await this.Email.find({
        to: userEmail,
        isRead: { $ne: true },
      }).exec();

      const unreadCalls = await this.SCall.find({
        to: user?.contact,
        isRead: { $ne: true },
      }).exec();

      const unreadSMSes = await this.SSMS.find({
        to: user?.contact,
        isRead: { $ne: true },
      }).exec();

      const result = [];
      for (let c of contacts) {
        const unreadEmailCount = unreadEmails.filter(
          (email) => email.from == c.email,
        ).length;
        const unreadCallCount = unreadCalls.filter(
          (call) => call.from == c.contact,
        ).length;
        const unreadSMSCount = unreadSMSes.filter(
          (sms) => sms.from == c.contact,
        ).length;
        const existedUser = await this.User.findOne({ email: c.email });

        result.push({
          ...c,
          unreadCount: unreadEmailCount + unreadCallCount + unreadSMSCount,
          isOutsideUser: !existedUser, userId: existedUser?._id
        });
      }

      return result;
    } catch (error) {
      return error ? error.toString() : MSG_UNKNOWN_ERROR;
    }
  }

  async getSConversations(user: IUser, contactId: string) {
    try {
      const contact = await this.Contact.findById(contactId).exec();

/*      const data = {
        from_email: contact?.email,
        reply_to: process.env.TWILIO_FROM,
      }; */

//    const res = await axios.create({
//        baseURL: 'https://api.sendgrid.com',
//        headers: {
//          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
//        }
//      }).post('/v3/messages', data)

//      console.log(res); 
      const emails = await this.Email.find({
        $or: [{ from: contact?.email }, { to: contact?.email }],
      }).exec();

      const calls = await this.SCall.find({
        $or: [{ from: contact?.contact }, { to: contact?.contact }],
      }).exec();

      const smses = await this.SSMS.find({
        $or: [{ from: contact?.contact }, { to: contact?.contact }],
      }).exec();

      // const calls1 = await this.client.calls.list({
      //   from: user.contact,
      //   to: contact.contact,
      // });
      // const calls2 = await this.client.calls.list({
      //   to: user.contact,
      //   from: contact.contact,
      // });
      // const calls = [...calls1, ...calls2];

      // const smses1 = await this.client.messages.list({
      //   from: user.contact,
      //   to: contact.contact,
      // });
      // const smses2 = await this.client.messages.list({
      //   to: user.contact,
      //   from: contact.contact,
      // });
      // const smses = [...smses1, ...smses2];

      return { emails, calls, smses };
    } catch (error) {
      return error ? error.toString() : MSG_UNKNOWN_ERROR;
    }
  }

  async sSendSms(from: string, to: string, body: string) {
    try {
      const sms = await this.client.messages.create({
        body: body,
        from: from || process.env.TWILIO_NUMBER,
        to: to,
      });

      const createdSMS = await this.SSMS.create(sms);
      return createdSMS;
    } catch (error) {
      return error.toString();
    }
  }

  async sMakeCall(from: string, to: string) {
    try {
      const call = await this.client.calls.create({
        url: 'http://demo.twilio.com/docs/voice.xml',
        from: from || process.env.TWILIO_NUMBER,
        to: to,
      });
      const createdCall = await this.SCall.create(call);
      return createdCall;
    } catch (err) {
      return err.toString();
    }
  }

  async sMarkReadConversation(
    contactId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
  ) {
    try {
      const contact = await this.Contact.findByIdAndUpdate(
        contactId,
        { $addToSet: { readUserIds: userId } }, // Use $push to add a new value to the array
        { new: true, useFindAndModify: false },
      );

      const user = await this.User.findById(userId);

      await this.Email.updateMany(
        { from: contact.email, to: user.email },
        { isRead: true },
      );
      await this.SCall.updateMany(
        { from: contact.contact, to: user.contact },
        { isRead: true },
      );
      await this.SSMS.updateMany(
        { from: contact.contact, to: user.contact },
        { isRead: true },
      );

      return contact;
    } catch (err) {
      return err ? err.toString() : MSG_UNKNOWN_ERROR;
    }
  }

  async extractSid(to: string) {
    const calls = await this.client.calls.list();
    console.log(calls);
    for(var i = 0; calls[i]; i++)
       if(calls[i]?.to == to)
          return calls[i].sid;
    return '-1';
  }

  async audioLink(to : string) {
    const calls = await this.client.calls.list({ to: to });
    const records = this.client.recordings.list({ callSid: calls[0]?.parentCallSid });
    let accountSid : string;
    let sid : string;
    let apiVersion : string;

    apiVersion = records[0]?.apiVersion ?? "";
    accountSid = records[0]?.accountSid ?? "";
    sid = records[0]?.sid;
    console.log(to);
    console.log(calls[0]);
    console.log(records[0]);
    return `https://api.twilio.com/${apiVersion}/Accounts/${accountSid}/Recordings/${sid}.mp3`;
  }

}
