import { Document, Schema, Types } from 'mongoose';
import { IProject } from 'src/projects/interfaces/project.interface';
import { IUser } from 'src/users/interfaces/user.interface';

type comments = {
  user: IUser;
  text: string;
};

export type Task = {
  creator: IUser;
  project: IProject;
  title: string;
  assignedTo: IUser[];
  description: string;
  comments: comments[];
  type: 'task' | 'template';
  active: 'active' | 'in-active';
};

export interface ISTaskStatus extends Document {
  name: string;
}

export interface ITask extends Document {
  creator: IUser;
  project: IProject;
  title: string;
  noOfDays: number;
  assignedTo: IUser[];
  description: string;
  comments: comments[];
  type: 'task' | 'template';
  active: 'active' | 'in-active';
  // order: number;
  deadlineDate: Date;
}

export interface ISTask extends Document {
  creator: IUser;
  project: IProject;
  title: string;
  noOfDays: number;
  assignedTo: IUser[];
  description: string;
  comments: comments[];
  type: 'task' | 'template';
  active: 'active' | 'in-active';
  status: ISTaskStatus;
  deadlineDate: Date;
}

export interface IReqBodyToCreateSTask {
  creator: Schema.Types.ObjectId;
  title: string;
  project: Schema.Types.ObjectId;
  status: Schema.Types.ObjectId;
  assignees: Array<Schema.Types.ObjectId>;
  deadline: string;
  description: string;
}
