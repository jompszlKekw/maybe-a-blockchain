import { Document, model, Schema } from 'mongoose';

export interface IEnterprise extends Document {
  name: string;
  owners: Array<string>;
  cnpj: string;
  coins: Array<string>;
  email: string;
  password: string;
  moneyoutcoins: number;
  moneyincoins: number;
  products: Array<string>;
  transactions: Array<string>;
  tasks: Array<string>;
  employees: Array<string>;
  openforhiring: boolean;
  _doc: object;
}

const enterpriseSchema: Schema = new Schema<IEnterprise>(
  {
    name: { type: String, required: true },
    owners: [{ type: Schema.Types.ObjectId, required: true, ref: 'user' }],
    cnpj: { type: String, required: true },
    coins: [{ type: String, ref: 'wallet' }],
    moneyoutcoins: { type: Number, required: true },
    moneyincoins: { type: Number },
    email: { type: String, required: true },
    password: { type: String, required: true },
    products: [
      {
        name: { type: String, required: true },
        product: { type: Schema.Types.ObjectId, ref: 'product' },
      },
    ],
    transactions: [{ type: Schema.Types.ObjectId, ref: 'transaction' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'task' }],
    employees: [{ type: Schema.Types.ObjectId, ref: 'employee' }],
    openforhiring: { type: Boolean, required: true, default: false },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Enterprise = model<IEnterprise>('enterprise', enterpriseSchema);
export { Enterprise };
