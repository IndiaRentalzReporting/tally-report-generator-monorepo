import { HydratedDocument } from 'mongoose';

import { Customer } from '../models/Customer';
import { BadRequestError, CustomError, NotFoundError } from '../errors';
import CustomerService from './CustomerService';

class AuthService {
  public static async register(
    data: Customer
  ): Promise<HydratedDocument<Customer>> {
    const doesUserAlreadyExists = await CustomerService.findOne({
      email: data.email
    });
    console.log(doesUserAlreadyExists);
    if (doesUserAlreadyExists != null) {
      throw new CustomError('User Already Exists', 409);
    }
    const customer = await CustomerService.createOne(data);
    return customer;
  }

  public static async login(data: Pick<Customer, 'email' | 'password'>) {
    const { email, password } = data;
    const customer = await CustomerService.findOne({ email });

    if (!customer) {
      throw new NotFoundError('User does not exist');
    }

    const passwordMatch = await customer.comparePassword(password);
    if (!passwordMatch) {
      throw new BadRequestError('Wrong Password');
    }

    console.log({ passwordMatch, customer });
    return customer;
  }
}

export default AuthService;
