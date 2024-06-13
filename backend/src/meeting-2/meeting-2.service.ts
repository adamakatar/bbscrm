import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CalendarService } from 'src/calendars/calendar.service';
import {
  IMeeting,
  IReqData,
  IReqDataOfCreateMeeting,
  IReqDataOfGetMeetings,
  IReqDataOfUpdateMeeting,
  IReturnValueOfGenerateMeeting,
} from './meeting-2.interfaces';
import {
  CALENDAR_TYPE_OF_EVENT,
  MEETING_GAP_IN_MS,
  MSG_UNKNOWN_ERROR,
  STATUS_BAD_REQUEST,
  STATUS_MANY_REQUEST,
  STATUS_NOT_FOUND,
} from 'src/utils/utils.constants';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICalendar } from 'src/calendars/interfaces/calendar.interface';
import { IProject } from 'src/projects/interfaces/project.interface';
import { Schema } from 'mongoose';
//  -------------------------------------------------------------------------------------------------

const MSG_INVALID_MEETING_DURATION = 'Invalid meeting duration.';
const MSG_NOT_EXISTED_MEETING = "That meeting isn't existed.";
const MSG_OVERLAP = 'The new meeting is overlapped by other meetings. Please select other times.';
const EVENT_TITLE_OF_MEETING = 'Meeting';
const EVENT_COLOR_OF_MEETING = '#fc9c02';
const MAXLEN_OF_MEETING_TOPIC = 200;

//  -------------------------------------------------------------------------------------------------

@Injectable()
export class Meeting2Service {
  constructor(
    @InjectModel('Project') private readonly Project: Model<IProject>,
    @InjectModel('Meeting') private readonly Meeting: Model<IMeeting>,
    @InjectModel('Calendar') private readonly Calendar: Model<ICalendar>,
    private readonly calendarService: CalendarService,
  ) { }

  async hasOverlapOrNoGap(startAt: Date, endAt: Date) {
    try {
      const overlappedMeeting = await this.Meeting.findOne({
        $or: [
          {
            startAt: { $lte: startAt },
            endAt: { $gt: startAt },
          },
          {
            startAt: { $lt: endAt },
            endAt: { $gte: endAt },
          },
          {
            startAt: { $gte: startAt },
            endAt: { $lte: endAt },
          },
        ]
      });
      if (overlappedMeeting) {
        return true;
      }

      const beforeMeeting = await this.Meeting.findOne({
        endAt: {
          $gt: new Date(startAt.getTime() - MEETING_GAP_IN_MS),
          $lte: startAt,
        },
      });
      if (beforeMeeting) {
        return true;
      }

      const afterMeeting = await this.Meeting.findOne({
        startAt: {
          $lt: new Date(endAt.getTime() + MEETING_GAP_IN_MS),
          $gte: endAt,
        },
      });
      if (afterMeeting) {
        return true;
      }
      return false;
    } catch (error) {
      return true;
    }
  }

  /**
   * Generate the urls of a zoom meeting
   * @param reqData
   * @returns
   */
  async generateMeetingUrls(
    reqData: IReqData,
  ): Promise<IReturnValueOfGenerateMeeting | string> {
    try {
      //  Environment variables for zoom
      const clientId = process.env.OAUTH2_CLIENT_ID;
      const accountId = process.env.OAUTH2_ACCOUNT_ID;
      const clientSecret = process.env.OAUTH2_CLIENT_SECRET;
      const tokenBaseUrl = process.env.OAUTH2_TOKEN_BASE_URL;
      const scope = process.env.OAUTH2_SCOPE;
      const grantType = process.env.OAUTH2_GRANT_TYPE;

      const { creatorZoomEmail, topic, startAt, endAt, invitees, meetingType } =
        reqData;

      const duration =
        (new Date(endAt).getTime() - new Date(startAt).getTime()) / 60000; //  Get duration in minutes

      if (duration <= 0) {
        return MSG_INVALID_MEETING_DURATION;
      }

      //  Generate an access token for zoom api
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

      const accessToken = response?.data?.access_token;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      //  Prepare a request data for zoom
      const meetingData = {
        topic,
        type: meetingType,
        start_time: startAt,
        duration: duration,
        meeting_invitees: invitees.map((i) => ({
          email: i.email,
        })),
      };

      //  Create a zoom meeting
      const {
        data: { join_url, start_url },
      } = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        meetingData,
        config,
      );

      return {
        joinUrl: join_url,
        startUrl: start_url,
      };
    } catch (error) {
      const parsedError = JSON.parse(JSON.stringify(error));
      if (
        parsedError.status == STATUS_BAD_REQUEST ||
        parsedError.status == STATUS_NOT_FOUND ||
        parsedError.status == STATUS_MANY_REQUEST
      ) {
        return error.response.data.message;
      }
      return MSG_UNKNOWN_ERROR;
    }
  }

  /**
   * Create a meeting and add it to the calendar.
   * @param reqData
   * @returns
   */
  async createMeeting(reqData: IReqDataOfCreateMeeting) {
    try {
      
      const isOverlapped = await this.hasOverlapOrNoGap(new Date(reqData.startAt), new Date(reqData.endAt));

      if (reqData.meetingType == 0){
        reqData.meetingType = 1;
      }

      const {
        user,
        creatorZoomEmail,
        topic: ordinaryTopic,
        startAt,
        endAt,
        invitees,
        meetingType,
      } = reqData;

      if (isOverlapped) {
        return MSG_OVERLAP;
      }

      const topic = ordinaryTopic.slice(0, MAXLEN_OF_MEETING_TOPIC);
      const resOfGenerateMeetingUrls = await this.generateMeetingUrls({
        creatorZoomEmail,
        topic,
        startAt,
        endAt,
        invitees,
        meetingType,
      });

      if (typeof resOfGenerateMeetingUrls == 'string') {
        return resOfGenerateMeetingUrls;
      } else {
        const { joinUrl, startUrl } = resOfGenerateMeetingUrls;
        /* ------------------------------- Record in calendar collection ------------------------------------ */
        const calendarData = {
          attendees: invitees.map((i) => i._id),
          customerAttendees: [],
          name: EVENT_TITLE_OF_MEETING,
          color: EVENT_COLOR_OF_MEETING,
          venue: '',
          agenda: topic,
          description: `
            If you created this meeting, please go to ${startUrl}.
            Else, please go to ${joinUrl}
          `,
          date: reqData.startAt,
          type: CALENDAR_TYPE_OF_EVENT,
        };
        const resOfCalendar = await this.calendarService.createEvent(
          calendarData,
          user,
        );
        console.log('>>>>>>>>>>> resOfCalendar => ', resOfCalendar);

        /* ------------------------------------ Create meeting ----------------------------------------------- */
        if (resOfCalendar?._id) {
          const meeting = await this.Meeting.create({
            creator: user._id,
            creatorZoomEmail,
            topic,
            invitees: invitees.map((i) => i._id),
            joinUrl,
            startUrl,
            startAt: reqData.startAt,
            endAt: reqData.endAt,
            calendar: resOfCalendar._id,
            meetingType,
          });
          return await this.Meeting.findById(meeting._id)
            .populate('invitees', 'firstName lastName photo email')
            .populate('creator', 'firstName lastName photo email');
        }
      }
    } catch (error) {
      console.log('>>>>>>>>> error => ', error);
      return MSG_UNKNOWN_ERROR;
    }
  }

  async getProjectName(taskId: string) {
      const result : any = await this.Project.find().lean();
      for(var i = 0; result[i]; i++) {
        for(var j = 0; result[i]?.stages[j]; j++){
          for(var k = 0; result[i]?.stages[j]?.tasks[k]; k++) {
            var _id : string = String(result[i]?.stages[j]?.tasks[k]);
            var _taskId = taskId.toString();

            console.log(_taskId, _id);
            if(_taskId == _id) {
                console.log(result[i]?.name);
                return result[i]?.name;
            }
          }
        }
      }

      return 'Unassigned to project';
  }

  async getCalendarData(userId: string, startAt: string, endAt: string) {
    try {
      if (userId) {
        const meetings = await this.Meeting.find({
          $or: [{ creator: userId }, { invitees: { $in: [userId] } }],
          startAt: { $gte: startAt, $lte: endAt },
        }).populate('invitees', 'firstName lastName photo email')
          .populate('calendar')
          .populate('creator', 'firstName lastName photo email');

        const events = await this.Calendar.find({
          $or: [
            { creator: userId },
            { attendees: { $in: [userId] } },
            { customerAttendees: { $in: [userId] } },
          ],
          date: { $gte: startAt, $lte: endAt },
        })
          .populate('creator', 'firstName lastName photo email')
          .populate('attendees', 'firstName lastName photo email')
          .populate('customerAttendees', 'firstName lastName photo email')
          .lean();

        const projectName = [];

        for(var i = 0; events[i]; i++)
          {
            if(events[i].task == null || events[i].task == undefined)
              projectName.push("Unassigned to project");
            else {
              let name = await this.getProjectName(events[i].task);
              projectName.push(name);
            }
          }

        return { meetings, events, projectName };
      } else {
        const meetings = await this.Meeting.find({
          startAt: { $gte: startAt, $lte: endAt },
        }).populate('invitees', 'firstName lastName photo email')
          .populate('calendar')
          .populate('creator', 'firstName lastName photo email');
        const events = await this.Calendar.find({
          date: { $gte: startAt, $lte: endAt },
        })
          .populate('creator', 'firstName lastName photo email')
          .populate('attendees', 'firstName lastName photo email')
          .populate('customerAttendees', 'firstName lastName photo email')
          .lean();

        const projectName = [];

        for(var i = 0; events[i]; i++)
          {
            if(events[i].task == null || events[i].task == undefined)
              projectName.push("Unassigned to project");
            else {
              let name = await this.getProjectName(events[i].task);
              projectName.push(name);
            }
          }
  
          return { meetings, events, projectName };
      }
    } catch (error) {
      return MSG_UNKNOWN_ERROR;
    }
  }

  /**
   * Update a meeting
   * @param meetingId 64f0a28223af3382eee0cc78
   * @param reqData
   */
  async updateMeeting(meetingId: string, reqData: IReqDataOfUpdateMeeting) {
    try {
      const {
        creatorZoomEmail,
        topic: ordinaryTopic,
        startAt,
        endAt,
        invitees,
        meetingType,
        calendar: calendarId,
      } = reqData;
      const topic = ordinaryTopic.slice(0, 200);

      const meeting = await this.Meeting.findById(meetingId);

      if (meeting) {
        /* ---------------------------------- Generate meeting urls ------------------------------------ */
        const resOfGenerateMeetingUrls = await this.generateMeetingUrls({
          creatorZoomEmail,
          topic,
          startAt,
          endAt,
          invitees,
          meetingType,
        });

        if (typeof resOfGenerateMeetingUrls == 'string') {
          return resOfGenerateMeetingUrls;
        } else {
          const { startUrl, joinUrl } = resOfGenerateMeetingUrls;
          /* ------------------------------- Record in calendar collection ------------------------------------ */
          const calendarData = {
            attendees: invitees.map((i) => i._id),
            customerAttendees: [],
            name: EVENT_TITLE_OF_MEETING,
            color: EVENT_COLOR_OF_MEETING,
            venue: '',
            agenda: topic,
            description: `
              If you created this meeting, please go to ${startUrl}.
              Else, please go to ${joinUrl}.
            `,
            date: startAt,
            type: CALENDAR_TYPE_OF_EVENT,
          };
          const resOfCalendar = await this.calendarService.updateEvent(
            calendarId,
            calendarData,
          );

          /* ------------------------------------ Update meetings ----------------------------------------------- */
          if (resOfCalendar?._id) {
            await this.Meeting.findByIdAndUpdate(meetingId, {
              creatorZoomEmail,
              topic,
              invitees: invitees.map((i) => i._id),
              joinUrl,
              startUrl,
              startAt,
              endAt,
              meetingType,
            });
            const updatedMeeting = await this.Meeting.findById(
              meetingId,
            ).populate('invitees', 'firstName lastName photo email')
              .populate('creator', 'firstName lastName photo email');
            return updatedMeeting;
          }
        }
      } else {
        return MSG_NOT_EXISTED_MEETING;
      }
    } catch (error) {
      console.log('>>>>>>>>> error => ', error);
      return MSG_UNKNOWN_ERROR;
    }
  }

  /**
   * Delete a meeting
   * @param meetingId
   * @returns
   */
  async deleteMeeting(meetingId: string) {
    try {
      const deletedMeeting = await this.Meeting.findByIdAndDelete(meetingId);
      if (deletedMeeting?.calendar) {
        const deletedCalendar = await this.calendarService.deleteEvent2(
          deletedMeeting.calendar,
        );

        return { deletedMeeting, deletedCalendar };
      }
    } catch (error) {
      console.log('>>>>>>>>>>>> error => ', error);
      return MSG_UNKNOWN_ERROR;
    }
  }
}
