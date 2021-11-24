import { Document, model, Schema } from 'mongoose';

export interface ITask extends Document {
  enterprise: string;
  accountable: string;
  description: string;
  reward: string;
}

const taskSchema: Schema = new Schema(
  {
    enterprise: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'enterprise',
    },
    accountable: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    description: { type: String, required: true },
    reward: { type: Schema.Types.ObjectId, required: true, ref: 'walelt' },
  },
  {
    timestamps: true,
  }
);

const Task = model<ITask>('task', taskSchema);
export { Task };
