import { Schema, Document, model } from 'mongoose';

export interface IWallet extends Document {
  amount: number;
  index: number;
  prevHash: Array<string>;
  hash: string;
  currentowner: string;
  transactions: Array<string>;
  avaibleforpurchase: Boolean;
  codingforbuy: string;
  publickey: string;
  privatekey: string;
  _doc: object;
}

const walletSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    index: { type: Number, required: true, default: 0 },
    prevHash: [{ type: String, required: true, default: '0' }],
    hash: { type: String, required: true },
    currentowner: { type: String, required: true, ref: 'user' },
    transactions: [{ type: String, ref: 'transaction' }],
    avaibleforpurchase: { type: Boolean, required: true, default: false },
    codingforbuy: { type: String },
    publickey: { type: String, required: true },
    privatekey: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Wallet = model<IWallet>('wallet', walletSchema);
export { Wallet };
