import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@Injectable()
export class MeetingService {
  
createMeeting(meetingDetails: any, user: any) {
  const payload = {
      iss: process.env.API_KEY,
      exp: ((new Date()).getTime() + 5000),
  };

  const token = jwt.sign(payload, process.env.API_SECRET);

  const config = {
      headers: {'Authorization': `Bearer ${token}`}
  };

  // Set up the meeting data according to Zoom's API documentation
  const meetingData = {
      topic: meetingDetails.topic,
      type: meetingDetails.type,
      start_time: meetingDetails.startTime,
      duration: meetingDetails.duration,
      schedule_for: user.zoomUserId,
      // add any other data as required
  };

  return axios.post(`https://api.zoom.us/v2/users/${user.zoomUserId}/meetings`, meetingData, config)
      .then(response => {
          // Return the meeting details from the response
          return response.data;
      })
      .catch(error => {
          // Handle any errors
          console.error(error);
          return null;
      });
}


  generateSignature(meetingNumber: number, role: number) {
    const payload = {
      iss: process.env.API_KEY,
      exp: ((new Date()).getTime() + 5000),
      meetingNumber: meetingNumber,
      role: role
    };

    const signature = jwt.sign(payload, process.env.API_SECRET);

    return { signature };
  }
}
