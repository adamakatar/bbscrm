import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { CommunicationService } from '../communication/communication.service';
import { Email } from './sendgrid.schema';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';

@Controller('/api/v1/sendgrid')
export class SendgridController {
  constructor(
    private readonly mailsService: SendgridService,
    private readonly communicationService: CommunicationService,
  ) {}

  @Post('send-email')
  async sendEmail(
    @Body('to') to: string,
    @Body('from') from: string,
    @Body('subject') subject: string,
    @Body('emailContent') text: string,
  ): Promise<Email | string> {
    return this.mailsService.sendEmail(to, from, subject, text);
  }

  @Post('receiveEmail')
  async receiveEmail(@Body() email): Promise<void> {
    await this.mailsService.saveIncomingEmail(email.from, email.to, email.subject, email.text);
    await this.communicationService.clearReadUserIds(email.to);
  }

  @Get('getEmailHistory')
  async getEmailHistory(): Promise<Email[]> {
    return this.mailsService.getEmailHistory();
  }

  @Post('mark-email-as-read')
  async markEmailAsRead(@Body('emailId') emailId: string): Promise<Email> {
    return this.mailsService.markEmailAsRead(emailId);
  }

  @Post('s-send-email')
  
  async sSendEmail(
    @Body('to') to: string,
    @Body('from') from: string,
    @Body('subject') subject: string,
    @Body('emailContent') text: string,
  ): Promise<Email | string> {
    return this.mailsService.sSendEmail(to, from, subject, text);
  }
}