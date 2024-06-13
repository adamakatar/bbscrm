import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CalendarModule } from 'src/calendars/calendar.module';
import { Meeting2Service } from './meeting-2.service';
import { CalendarService } from 'src/calendars/calendar.service';
import { Meeting2Controller } from './meeting-2.controller';
import { MeetingSchema } from './meeting-2.entity';
import { CalendarSchema } from 'src/calendars/calendar.entity';
import { ProjectSchema } from 'src/projects/entities/project.entity';

@Module({
  imports: [
    AuthModule,
    CalendarModule,
    MongooseModule.forFeature([
      { name: 'Project', schema: ProjectSchema },
      { name: 'Meeting', schema: MeetingSchema },
      { name: 'Calendar', schema: CalendarSchema }
    ]),
  ],
  controllers: [Meeting2Controller],
  providers: [Meeting2Service, CalendarService],
})
export class Meeting2Module {}
