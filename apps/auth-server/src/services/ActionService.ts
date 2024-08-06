import db from '../models';
import { ActionSchema } from '../models/schema';
import BaseService from './BaseService';

const ActionService = new BaseService(ActionSchema, db.query.ActionSchema);

export default ActionService;
