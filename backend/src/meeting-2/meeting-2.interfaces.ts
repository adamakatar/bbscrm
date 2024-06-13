import { IUser } from 'src/users/interfaces/user.interface';

export interface IReqData {
  creatorZoomEmail: string;
  topic: string;
  startAt: string;
  endAt: string;
  invitees: Array<{
    _id: string;
    email: string;
    id: string;
  }>;
  meetingType: number;
}

export interface IReqDataOfCreateMeeting extends IReqData {
  user: IUser;
}

export interface IReqDataOfUpdateMeeting extends IReqData {
  calendar: string;
}

export interface IMeeting {
  creator: string;
  topic: string;
  invitees: Array<string>;
  startUrl: string;
  joinUrl: string;
  startAt: Date;
  endAt: Date;
  calendar: string;
  task?: string;
}

export interface IReturnValueOfGenerateMeeting {
  joinUrl: string;
  startUrl: string;
}

export interface IReqDataOfGetMeetings {
  startAt: Date;
  endAt: Date;
}
