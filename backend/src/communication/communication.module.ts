import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/user.entity';
import {
  ContactSchema,
  SCallSchema,
  SSMSSchema,
} from 'src/communication/communication.entity';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { AuthModule } from 'src/auth/auth.module';
import { EmailSchema } from 'src/sendgrid/sendgrid.schema';
import { EmailService } from 'src/utils/utils.email.service';
import { AppConfigsModule } from 'src/app-configs/app-configs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Contact', schema: ContactSchema },
      { name: 'Email', schema: EmailSchema },
      { name: 'SSMS', schema: SSMSSchema },
      { name: 'SCall', schema: SCallSchema },
    ]),
    SendgridModule,
    AuthModule,
    AppConfigsModule
  ],
  controllers: [CommunicationController],
  providers: [CommunicationService, EmailService]
})
export class CommunicationModule {}
