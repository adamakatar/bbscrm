import { Module } from '@nestjs/common';
import { BookMeetingService } from './book-meeting.service';
import { BookMeetingController } from './book-meeting.controller';
import { AuthModule } from '../auth/auth.module';
import { CalendarService } from 'src/calendars/calendar.service';
import { CalendarModule } from 'src/calendars/calendar.module';
import { CalendarSchema } from 'src/calendars/calendar.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    CalendarModule,
    MongooseModule.forFeature([{ name: 'Calendar', schema: CalendarSchema }]),
  ],
  providers: [BookMeetingService, CalendarService],
  controllers: [BookMeetingController],
})
export class BookMeetingModule {}
