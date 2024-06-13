import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Meeting2Service } from './meeting-2.service';
import { IReqDataOfCreateMeeting, IReqDataOfGetMeetings } from './meeting-2.interfaces';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles-guard.guard';

@Controller({ path: '/api/v1/meeting-2' })
export class Meeting2Controller {
  constructor(private readonly meetingService: Meeting2Service) { }

  @Post('create')
  @UseGuards(AuthGuard(), RolesGuard)
  createMeeting(@Body() reqData: IReqDataOfCreateMeeting) {
    return this.meetingService.createMeeting(reqData);
  }

  @Get('get-calendar-data')
  getCalendarData(
    @Query('userId') userId: string,
    @Query('startAt') startAt: string,
    @Query('endAt') endAt: string
  ) {
    return this.meetingService.getCalendarData(userId, startAt, endAt);
  }

  @Put('update/:meetingId')
  @UseGuards(AuthGuard(), RolesGuard)
  updateMeeting(@Param('meetingId') meetingId: string, @Body() reqData: any) {
    return this.meetingService.updateMeeting(meetingId, reqData);
  }

  @Delete('delete/:meetingId')
  @UseGuards(AuthGuard(), RolesGuard)
  deleteMeeting(@Param('meetingId') meetingId: string) {
    return this.meetingService.deleteMeeting(meetingId);
  }
}
