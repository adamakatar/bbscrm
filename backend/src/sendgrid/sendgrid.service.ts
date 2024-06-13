import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { Email } from './sendgrid.schema';
import { ContactItem } from 'src/communication/communication.service';
import { IUser } from 'src/users/interfaces/user.interface';
import { ERROR, MSG_UNKNOWN_ERROR } from 'src/utils/utils.constants';
import axios from 'axios';
import { join } from 'path';
import { renderFile } from 'ejs';
import { htmlToText } from 'html-to-text';
import { IAppConfig } from 'src/app-configs/interfaces/appConfig.interface';

// import {SendEmailDto} from './sendgrid.dto';

@Injectable()
export class SendgridService {
  private baseUrl : string;
  private webUrl : string;

  constructor(
    private readonly configService: ConfigService,

    @InjectModel('AppConfigs') 
    private readonly AppConfigs: Model<IAppConfig>,

    @InjectModel(Email.name)
    private emailModel: Model<Email>,

    @InjectModel('Contact')
    private readonly Contact: Model<ContactItem>,

    @InjectModel('User')
    private readonly User: Model<IUser>,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.baseUrl = this.configService.get('API_HOSTED_URL');
    this.webUrl = this.configService.get('WEB_HOSTED_URL');
  }

  async sendEmail(to: string, from: string, subject: string, text: string): Promise<Email | string> {
    const email = new this.emailModel({ to, from, subject, text });
    const msg = {
      to: to,
      from,
      subject: subject,
      text: text,
      html: `<strong>${text}</strong>`,
    };

    try {
      await sgMail.send(msg);
      await email.save();
      console.log(`Email sent to ${to}`);
      return email;
    } catch (error) {
      console.log('error');
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
        if (error.response.body?.errors) {
          let message = '';
          for (let err of error.response.body.errors) {
            message += `${err.message} `;
          }

          return message;
        }
      }
      return ERROR;
    }
  }

  async saveIncomingEmail(to: string, from: string, subject: string, text: string): Promise<Email> {
    const email = new this.emailModel({ to, from, subject, text, isRead: false });
    await email.save();
    console.log(`Email received from ${from}`);
    return email;
  }

  async getEmailHistory(): Promise<Email[]> {
    return this.emailModel.find().exec();
  }

  async markEmailAsRead(emailId: string): Promise<Email> {
    const email = await this.emailModel.findById(emailId);
    email.isRead = true;
    await email.save();
    console.log(`Email marked as read: ${emailId}`);
    return email;
  }

  async sendPasswordSetupEmail(to: string, passwordSetupLink: string): Promise<Email | string> {
    const subject = 'Set up your password';
    const text = `Welcome! Click <a style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'; font-size: 16px;" target="_blank" href="${passwordSetupLink}">here</a> to set up your password.`;
    return this.sendEmail(to, process.env.EMAIL_FROM, subject, text);
  }


  // rest of the methods...
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

  async createSender(user: IUser, email: string, nickname: string) {
    const name = `${user.firstName} ${user.lastName}`;
    const data = {
      nickname,
      from_email: email,
      from_name: name,
      reply_to: email,
      reply_to_name: name,
      address: user.nda?.streetAddress || 'default address',
      address2: 'default address2',
      state: user.nda?.state || 'DS',
      city: user.city || 'default city',
      country: 'US',
      zip: user.zipCode || '4600024',
    };
    try {
      const res = await axios.create({
        baseURL: 'https://api.sendgrid.com',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
        }
      }).post('/v3/verified_senders', data);

      console.log('>>>>> res.data => ', res.data);

      return res.data;
    } catch (error) {
      console.log('>>>>>>>> error of createSender => ', error?.response?.data);
      if (error?.response?.data?.errors) {
        let msg = '';
        for (let err of error.response.data.errors) {
          msg += `${data[err.field]}: ${err.message}`
        }
        return msg;
      }
      return MSG_UNKNOWN_ERROR;
    }
  }

  async sSendEmail(to: string, from: string, subject: string, text: string) {
    try {
      console.log('>>>>>>>> to => ', to);
      console.log('>>>>>>>> from =>', from);
      console.log('>>>>>>>> subject => ', subject);
      console.log('>>>>>>>> text => ', text);

      const email = new this.emailModel({ to, from, subject, text });
      const appConfigs = await this.AppConfigs.findOne({'ContactInfo.email' : from }).exec();
      const _path : string = join( 
         __dirname,
        '..',
        '..',
        'views',
        'custom.ejs'
      );

      const html = await renderFile(_path, { 
        payload: htmlToText(text),
        baseUrl: this.baseUrl,
        webUrl: this.webUrl,  
        url: this.baseUrl,
        contactInfo: appConfigs.ContactInfo
      });


      const msg = {
        to: to,
        from: from,
        subject: subject,
        html: html,
        text: htmlToText(html),
     };

      await sgMail.send(msg);
      await email.save();
      return email;
    } catch (error) {
      if (error.response) {
        console.error(error.response.body)
        if (error.response.body?.errors) {
          let message = '';
          for (let err of error.response.body.errors) {
            message += `${err.message} `;
          }

          return message;
        }
      }
      return error.toString();
    }
  }
}