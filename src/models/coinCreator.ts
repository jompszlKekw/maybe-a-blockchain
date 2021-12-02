import { Schema, Document, model } from 'mongoose';

export interface ICoinCreator extends Document {
  namecreator: string;
  nameEnterprise: string;
  namecoin: string;
  namecoinhash: string;
  objectivecoin: string;
  currentmarketvalue: number;
  createdAt: Date;
  updateAt: Date;
  _doc: object;
}

const coinCreatorSchema: Schema = new Schema<ICoinCreator>(
  {
    namecreator: { type: String, ref: 'user' },
    nameEnterprise: { type: String, ref: 'enterprise' },
    namecoin: { type: String, required: true },
    namecoinhash: { type: String, required: true },
    objectivecoin: { type: String },
    currentmarketvalue: { type: Number, required: true, default: 1.0 },
  },
  {
    timestamps: true,
  }
);

const CreatorCoin = model<ICoinCreator>('creatorcoin', coinCreatorSchema);
export { CreatorCoin };
