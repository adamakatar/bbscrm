import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { MeetingService } from './meeting.service';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  createMeeting(@Body() meetingDetails: any, @Body() user: any) {
    return this.meetingService.createMeeting(meetingDetails, user);
  }

  @Get(':meetingId/signature')
  generateSignature(@Param('meetingId') meetingId: number, @Body() role: number) {
    return this.meetingService.generateSignature(meetingId, role);
  }
}
