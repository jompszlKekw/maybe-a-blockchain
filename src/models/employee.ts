import { Document, model, Schema } from 'mongoose';

export interface IEmployee extends Document {
  enterprise: string | Schema.Types.ObjectId;
  employee: Array<string>;
  salary: number;
  nextsalary: string;
}

const employeeSchema: Schema = new Schema<IEmployee>(
  {
    enterprise: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'enterprise',
    },
    employee: [
      {
        employeeid: { type: Schema.Types.ObjectId, ref: 'user' },
        employeename: { type: String },
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
