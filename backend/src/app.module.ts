import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { AppConfigsModule } from './app-configs/app-configs.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './business/business.module';
import { CategoriesModule } from './categories/categories.module';
import { ChatsModule } from './chats/chats.module';
import { CmsModule } from './cms/cms.module';
import { CronsModule } from './crons/crons.module';
import { DatabaseModule } from './database/database.module';
import { FaqsModule } from './faqs/faqs.module';
import { LeadsModule } from './leads/leads.module';
import { MailsModule } from './mails/mails.module';
import { NewslettersModule } from './newsletters/newsletters.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SocketsModule } from './sockets/sockets.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './utils/utils.logger';
import { UtilsModule } from './utils/utils.module';
import { S3Storage } from './utils/utils.s3';
// import { RingcentralModule } from './ringcentral/ringcentral.module';
import { APP_FILTER } from '@nestjs/core';
import { CalendarModule } from './calendars/calendar.module';
import { CoreValuesModule } from './core-values/core-values.module';
import { DataRoomModule } from './data-room/data-room.module';
import { GroupsModule } from './groups/groups.module';
import { OurTeamModule } from './our-team/our-team.module';
import { ProjectsModule } from './projects/projects.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ServicesModule } from './services/services.module';
import { TaskTemplatesModule } from './task-templates/task-templates.module';
import { TasksModule } from './tasks/tasks.module';
import { TemplatesModule } from './templates/templates.module';
import { ForbiddenExceptionFilter } from './utils/utils.ForbiddenExceptionException';
import { InternalServerErrorExceptionFilter } from './utils/utils.InternalServerErrorExceptionException';
import { NotFoundExceptionFilter } from './utils/utils.NotFoundException';
import { PayloadTooLargeExceptionFilter } from './utils/utils.PayloadTooLargeException';
import { UnauthorizedExceptionFilter } from './utils/utils.UnauthorizedException';
import { ValuationModule } from './valuation/valuation.module';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { CommunicationModule } from './communication/communication.module';
import { NotesModule } from './notes/notes.module';
import { MeetingModule } from './meeting/meeting.module';
import { BookMeetingModule } from './book-meeting/book-meeting.module';
import { Meeting2Module } from './meeting-2/meeting-2.module';
import { EmailService } from './utils/utils.email.service';

const envFilePath: string = join(
  'src',
  'configs',
  `config.${process.env.NODE_ENV}.env`,
);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      // ignoreEnvFile:true
    }),
    AuthModule,
    ScheduleModule.forRoot(),
    CronsModule,
    DatabaseModule,
    UsersModule,
    UtilsModule,
    SocketsModule,
    NotificationsModule,
    CmsModule,
    ChatsModule,
    CategoriesModule,
    FaqsModule,
    NewslettersModule,
    TestimonialsModule,
    AppConfigsModule,
    LeadsModule,
    BusinessModule,
    MailsModule,
    CalendarModule,
    TasksModule,
    ProjectsModule,
    // RingcentralModule,
    ValuationModule,
    DataRoomModule,
    TemplatesModule,
    TaskTemplatesModule,
    ServicesModule,
    ReviewsModule,
    OurTeamModule,
    CoreValuesModule,
    GroupsModule,
    SendgridModule,
    CommunicationModule,
    NotesModule,
    MeetingModule,
    BookMeetingModule,
    Meeting2Module
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
    { provide: APP_FILTER, useClass: PayloadTooLargeExceptionFilter },
    { provide: APP_FILTER, useClass: InternalServerErrorExceptionFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
    AppService,
    S3Storage,
    EmailService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
