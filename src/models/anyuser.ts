import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  age: number;
  cpf: string;
  password: string;
  moneyoutcoins: number;
  totalcoins: Array<string>;
  moneyincoins: number;
  transactions: Array<string>;
  creditsocial: string;
  _doc: object;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    cpf: { type: String, required: true },
    password: { type: String, required: [true, 'please password'] },
    moneyoutcoins: { type: Number, required: true },
    moneyincoins: { type: Number },
    totalcoins: [{ type: String }],
    transactions: [{ type: String, ref: 'transaction' }],
    creditsocial: { type: String, default: 'negative kkkkkkkkkkkkkkkkkkkkk' },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>('user', userSchema);
export { User };
