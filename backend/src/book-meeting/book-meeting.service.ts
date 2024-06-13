import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { CalendarService } from 'src/calendars/calendar.service';

@Injectable()
export class BookMeetingService {
  constructor(private readonly calendarService: CalendarService) {}

  async createMeeting(reqData: any) {
    try {
      const { meetingDetails, eventData } = reqData;
      const clientId = process.env.OAUTH2_CLIENT_ID;
      const accountId = process.env.OAUTH2_ACCOUNT_ID;
      const clientSecret = process.env.OAUTH2_CLIENT_SECRET;
      const tokenBaseUrl = process.env.OAUTH2_TOKEN_BASE_URL;
      const scope = process.env.OAUTH2_SCOPE;
      const grantType = process.env.OAUTH2_GRANT_TYPE;

      const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
      );

      const params = new URLSearchParams();
      params.append('grant_type', grantType);
      params.append('account_id', accountId);
      params.append('scope', scope);

      const response = await axios.post(tokenBaseUrl, params, {
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = response.data.access_token;

      console.log('>>>>>>> accessToken => ', accessToken);

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      // Set up the meeting data according to Zoom's API documentation
      const meetingData = {
        topic: meetingDetails.topic,
        type: meetingDetails.type,
        start_time: meetingDetails.startAt,
        duration: meetingDetails.duration,
        schedule_for: meetingDetails.zoomEmail,
        meeting_invitees: meetingDetails.meetingInvitees,
        // add any other data as required
      };

      console.log('>>>>>>>> meetingData => ', meetingData);

      const {
        status,
        data: { join_url, start_url },
      } = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        meetingData,
        config,
      );

      if (status == 201) {
        const { payload, user } = eventData;
        if (payload.description) {
          payload.description = `
          If you created this meeting, please go to ${start_url}.
          Else, please go to ${join_url}
        `;
        }
        const resOfCalendar = await this.calendarService.createEvent(
          payload,
          user,
        );
        console.log('>>>>>>>>>> resOfCalendar => ', resOfCalendar);
        return 'ok';
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  generateSignature(meetingNumber: number, role: number) {
    const payload = {
      iss: process.env.API_KEY,
      exp: new Date().getTime() + 5000,
      meetingNumber: meetingNumber,
      role: role,
    };

    const signature = jwt.sign(payload, process.env.API_SECRET);

    return { signature };
  }
}
