import { Document, model, Schema } from 'mongoose';

export interface IProduct extends Document {
  enterprise: string | Schema.Types.ObjectId;
  proprietor: string | Schema.Types.ObjectId;
  name: string;
  description: string;
  value: number;
  objective: string;
  quantity: number;
  sold: boolean;
}

const productSchema: Schema = new Schema<IProduct>(
  {
    enterprise: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'enterprise',
    },
    proprietor: { type: Schema.Types.ObjectId, ref: 'user' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: Number, required: true },
    objective: { type: String, required: true },
    sold: { type: Boolean, required: true, default: false }, // if false is still company, if it is true the field proprietor will is filled with the owner
  },
  {
    timestamps: true,
  }
);

const Product = model<IProduct>('product', productSchema);
export { Product };
