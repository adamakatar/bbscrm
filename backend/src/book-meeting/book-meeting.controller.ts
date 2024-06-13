import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BookMeetingService } from './book-meeting.service';

@Controller({ path: '/api/v1/book-meeting' })
export class BookMeetingController {
  constructor(private readonly meetingService: BookMeetingService) {}

  @Post('/')
  createMeeting(@Body() meetingDetails: any) {
    return this.meetingService.createMeeting(meetingDetails);
  }

  @Get(':meetingId/signature')
  generateSignature(
    @Param('meetingId') meetingId: number,
    @Body() role: number,
  ) {
    return this.meetingService.generateSignature(meetingId, role);
  }
}
