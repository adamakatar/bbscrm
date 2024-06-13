import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, Roles } from 'src/auth/decorators/user.decorator';
import { RolesGuard } from 'src/roles-guard.guard';
import { IUser } from 'src/users/interfaces/user.interface';
import { ErrorHanldingFn } from 'src/utils/utils.helper';
import { pagination } from 'src/utils/utils.types';
import { CreateEventDto } from './dto/create-event.dto';
import { CalendarService } from './calendar.service';

@Controller({ path: '/api/v1/events' })
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }

  @Get('/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async getAllEvents(@Query() query: pagination) {
    try {
      const rs = await this.calendarService.getAllEvents(query);
      return rs;
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Get('/calendar')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'seller',
    'buyer',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async getAllEventsAccToCalendar(
    @GetUser() user: IUser,
    @Query('date') date: string,
    @Query('type') type: string,
    @Query('agenda') agenda: string,
  ) {
    try {
      const rs = await this.calendarService.getAllEventsAccToCalendar(
        user,
        date,
        type,
        agenda,
      );
      return { ...rs };
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Get('/calendar-of-day')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'seller',
    'buyer',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async getAllDayEventsAccToCalendar(
    @GetUser() user: IUser,
    @Query('type') type: string,
    @Query('date') date: string,
    @Query('agenda') agenda: string,
    @Query('offset') offset: string,
  ) {
    try {
      const offsetCalc = !!offset ? Number(offset) : 0;

      const rs = await this.calendarService.getAllDayEventsAccToCalendar({
        user,
        type,
        date,
        agenda,
        offset: offsetCalc,
      });

      console.log({ rs: rs.events });
      return { ...rs };
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  // GET ALL CALENDARS FOR ADMIN
  @Get('/admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async eventsCalendarForAdmin(
    @GetUser() user: IUser,
    @Query('date') date: string,
    @Query('type') type: string,
    @Query('agenda') agenda: string,
    @Query('involvedTasks') involvedTasks: string,
  ) {
    try {
      const rs = await this.calendarService.eventsCalendarForAdmin(
        user,
        date,
        type,
        agenda,
        involvedTasks,
      );
      return { ...rs };
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Post('/create')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: IUser,
  ) {
    try {
      const rs = await this.calendarService.createEvent(createEventDto, user);
      return rs;
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Patch('/update/:calendarId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async updateEvent(
    @Param('calendarId') calendarId: string,
    @Body() createEventDto: CreateEventDto,
  ) {
    try {
      const rs = await this.calendarService.updateEvent(
        calendarId,
        createEventDto,
      );
      return rs;
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Delete('/delete/:eventId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async deleteEvent(@Param('eventId') eventId: string, @GetUser() user: IUser) {
    try {
      const rs = await this.calendarService.deleteEvent(eventId, user);
      return rs;
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Delete('/delete-2/:eventId')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async deleteEvent2(@Param('eventId') eventId: string) {
    try {
      const rs = await this.calendarService.deleteEvent2(eventId);
      return rs;
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }

  @Get('get-events-by-user')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(
    'admin',
    'broker',
    'seller',
    'buyer',
    'financial-analyst',
    'buyer-concierge',
    'seller-concierge',
    'executive',
  )
  async getEventsByUser(
    @Query('userId') userId: string,
    @Query('startAt') startAt: string,
    @Query('endAt') endAt: string,
  ) {
    try {
      const rs = await this.calendarService.getEventsByUser(
        userId,
        startAt,
        endAt
      );
      return { ...rs };
    } catch (error) {
      throw ErrorHanldingFn(error);
    }
  }
}
