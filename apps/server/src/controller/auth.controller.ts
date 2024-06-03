import { HydratedDocument } from 'mongoose';

import { NextFunction, Request, Response } from 'express';
import { Customer } from '../models/Customer';
import AuthService from '../services/AuthService';
// import CustomerService from '../services/CustomerService';

export const handleRegister = async (
  req: Request<object, object, Customer>,
  res: Response<HydratedDocument<Customer>>,
  next: NextFunction
) => {
  try {
    const customer = await AuthService.register(req.body);
    res.json(customer);
  } catch (err) {
    console.error(`Could not register the User`);
    next(err);
  }
};

export const handleLogin = async (
  req: Request<object, object, Customer>,
  res: Response<HydratedDocument<Customer>>,
  next: NextFunction
) => {
  try {
    // const customer = await CustomerService.findOne({ email: req.body.email });
    res.json(req.user);
  } catch (err) {
    console.error(`Could not login the User`);
    next(err);
  }
};
