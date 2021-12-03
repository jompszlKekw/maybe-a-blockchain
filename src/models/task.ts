import { Document, model, Schema } from 'mongoose';

export interface ITask extends Document {
  enterprise: string | Schema.Types.ObjectId;
  accountable: string | Schema.Types.ObjectId;
  description: string;
  reward: string | Schema.Types.ObjectId;
}

const taskSchema: Schema = new Schema<ITask>(
  {
    enterprise: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'enterprise',
    },
    accountable: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    description: { type: String, required: true },
    reward: { type: Schema.Types.ObjectId, required: true, ref: 'wallet' },
  },
  {
    timestamps: true,
  }
);

const Task = model<ITask>('task', taskSchema);
export { Task };
