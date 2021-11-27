import { Document, model, Schema } from 'mongoose';

export interface IHiring extends Document {
  sender: string;
  addressee: string;
  curriculum: string;
  hashforhiring: string;
}

const hiringSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    addressee: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'enterprise',
    },
    curriculum: { type: String },
    hashforhiring: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const HiringRequest = model<IHiring>('hiring', hiringSchema);
export { HiringRequest };
