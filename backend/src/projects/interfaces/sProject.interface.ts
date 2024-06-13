import { Document, Schema } from 'mongoose';

export interface IReqBodyToCreateProject {
  business: Schema.Types.ObjectId;
  creator: Schema.Types.ObjectId;
  name: string;
  slug: string;
  assignees: Array<Schema.Types.ObjectId>;
}

export interface ISProject extends IReqBodyToCreateProject, Document {}
