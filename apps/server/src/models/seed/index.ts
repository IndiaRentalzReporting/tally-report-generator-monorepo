import ActionService from '../../services/ActionService';
import { ActionSelect } from '../schema';

const seedActions = async () => {
  const actions = (
    ['create', 'read', 'update', 'delete'] as ActionSelect['name'][]
  ).map(async (name) => ActionService.createOne({ name }));

  Promise.all(actions);
};

seedActions();
