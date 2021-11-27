import { Schema, Document, model } from 'mongoose';

export interface ICoinCreator extends Document {
  namecreator: string;
  nameEnterprise: string;
  namecoin: string;
  namecoinhash: string;
  objectivecoin: string;
  currentmarketvalue: number;
  _doc: object;
}

const coinCreatorSchema: Schema = new Schema(
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
