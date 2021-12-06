import { Document, model, Schema } from 'mongoose';

export interface ITransaction extends Document {
  coin: string | Schema.Types.ObjectId;
  product: string | Schema.Types.ObjectId;
  amount: number;
  payer: string;
  payee: string;
  codingconfirm: string;
  confirmbuy: boolean;
  buycoin: boolean;
  _doc: object;
}

const transactionSchema: Schema = new Schema<ITransaction>(
  {
    coin: { type: Schema.Types.ObjectId, ref: 'wallet' },
    product: { type: Schema.Types.ObjectId, ref: 'product' },
    amount: { type: Number, required: true, default: 0 },
    payer: { type: String, required: true, default: 'xx' },
    payee: { type: String, required: true, default: 'xx' },
    codingconfirm: { type: String },
    confirmbuy: { type: Boolean },
    buycoin: { type: Boolean }, //if it is true it means it was a currency purchase, if it is false it means it was a normal money transaction
  },
  {
    timestamps: true,
  }
);

const Transaction = model<ITransaction>('transaction', transactionSchema);
export { Transaction };
