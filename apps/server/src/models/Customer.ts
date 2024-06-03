import bcrypt from 'bcrypt';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import * as z from 'zod';
import { Customer as ZodCustomerSchema } from '@fullstack_package/interfaces';

declare global {
  namespace Express {
    interface User extends HydratedDocument<Customer> {}
  }
}

export type Customer = z.infer<typeof ZodCustomerSchema> & CustomerMethods;

type CustomerMethods = {
  comparePassword: (password: string) => Promise<boolean>;
};

type CustomerModel = Model<Customer, object, CustomerMethods>;

const CustomerSchema = new mongoose.Schema<
  Customer,
  CustomerModel,
  CustomerMethods
>(
  {
    first_name: {
      type: String,
      minLength: 5,
      maxLength: 20,
      required: [true, 'Please provide a name']
    },
    last_name: {
      type: String,
      minLength: 5,
      maxLength: 20,
      required: [true, 'Please provide a name']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 5
    }
  },
  { timestamps: true }
);

CustomerSchema.pre('save', async function genHash() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(this.password, salt);
  this.password = passwordHash;
});

CustomerSchema.methods.comparePassword = async function comparePassword(
  password: string
) {
  const doesPasswordMatch = await bcrypt.compare(password, this.password);
  return doesPasswordMatch;
};

export const Customer = mongoose.model<Customer, CustomerModel>(
  'Customers',
  CustomerSchema
);
