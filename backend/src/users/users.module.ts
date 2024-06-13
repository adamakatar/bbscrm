import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigsModule } from 'src/app-configs/app-configs.module';
import { AuthModule } from 'src/auth/auth.module';
import { BusinessSchema } from 'src/business/business.entity';
import { BusinessService } from 'src/business/business.service';
import { DraftBusinessSchema } from 'src/business/draftbusiness.entity';
import { ChatSchema } from 'src/chats/chat.entity';
import { ChatsModule } from 'src/chats/chats.module';
import { ChatsService } from 'src/chats/chats.service';
import { RoomSchema } from 'src/chats/room.entity';
import { DataRoomModule } from 'src/data-room/data-room.module';
import { LeadSchema } from 'src/leads/lead.entity';
import { LeadsModule } from 'src/leads/leads.module';
import { MailsModule } from 'src/mails/mails.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ProjectSchema } from 'src/projects/entities/project.entity';
import { SocketsModule } from 'src/sockets/sockets.module';
import { EmailService } from 'src/utils/utils.email.service';
import { UtilsModule } from 'src/utils/utils.module';
import { S3Storage } from 'src/utils/utils.s3';
import { UserSchema } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { AppConfigsService } from 'src/app-configs/app-configs.service';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { Email, EmailSchema } from 'src/sendgrid/sendgrid.schema';
import {
  ContactSchema,
  SCallSchema,
  SSMSSchema,
} from 'src/communication/communication.entity';
import { CommunicationService } from 'src/communication/communication.service';
import { AppConfigSchema } from 'src/app-configs/app-config.entity';

@Module({
  imports: [
    NotificationsModule,
    UtilsModule,
    AuthModule,
    DataRoomModule,
    ChatsModule,
    MailsModule,
    LeadsModule,
    SocketsModule,
    AppConfigsModule,
    MongooseModule.forFeature([
      { name: 'AppConfigs', schema: AppConfigSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Business', schema: BusinessSchema },
      { name: 'DraftBusiness', schema: DraftBusinessSchema },
      { name: 'Lead', schema: LeadSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Room', schema: RoomSchema },
      { name: 'Chat', schema: ChatSchema },
      { name: Email.name, schema: EmailSchema },
      { name: 'Contact', schema: ContactSchema },
      { name: 'SSMS', schema: SSMSSchema },
      { name: 'SCall', schema: SCallSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    S3Storage,
    EmailService,
    BusinessService,
    ChatsService,
    SendgridService,
    CommunicationService,
    
  ],
  exports: [UsersService],
})
export class UsersModule {}
