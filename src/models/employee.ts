import { Document, model, Schema } from 'mongoose';

export interface IEmployee extends Document {
  enterprise: string;
  employee: Array<string>;
  salary: number;
  nextsalary: string;
}

const employeeSchema: Schema = new Schema(
  {
    enterprise: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'enterprise',
    },
    employee: [
      {
        id: { type: Schema.Types.ObjectId, ref: 'user' },
        name: { type: String },
      },
    ],
    salary: { type: Number },
    nextsalary: { type: String },
  },
  {
    timestamps: true,
  }
);

const Employee = model<IEmployee>('employee', employeeSchema);
export { Employee };
