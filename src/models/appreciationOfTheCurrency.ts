import { Document, model, Schema } from 'mongoose';

export interface IApperciation extends Document {
  coin: string;
  nameHashCoin: string;
  prevValue: Array<string>;
  currentvalue: number;
  totalcoinspurchase: number;
}

const appreciationSchema: Schema = new Schema<IApperciation>(
  {
    coin: { type: String, required: true, ref: 'creatorcoin' },
    nameHashCoin: { type: String, required: true },
    prevValue: [
      {
        value: { type: Number, required: true },
        dateUpdate: { type: Date, required: true, default: new Date() },
      },
    ],
    currentvalue: { type: Number, required: true },
    totalcoinspurchase: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Appreciation = model<IApperciation>(
  'currencyappreciation',
  appreciationSchema
);
export { Appreciation };
