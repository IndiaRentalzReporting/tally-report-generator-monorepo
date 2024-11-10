import DeleteEntity from './Delete';
import UpdateEntity from './Update';

interface ActionsCellProps {
  module: {
    id: string | undefined;
    name: string | undefined;
    deleteType: string;
    deleteSideEffect?: Array<string>;
    updateType: string;
  };
}

const Action: React.FC<ActionsCellProps> = ({
  module: {
    id,
    name,
    deleteType,
    deleteSideEffect,
    updateType,
  },
}) => {
  if (!id) throw new Error('Entity ID is required');
  if (!name) throw new Error('Entity name is required');
  return (
    <span className="flex gap-4 items-center">
      <DeleteEntity
        module={{
          id,
          name,
          type: {
            main: deleteType,
            sideEffect: deleteSideEffect
          }
        }}
      />
      <UpdateEntity
        module={{
          id,
          name,
          type: updateType
        }}
      />
    </span>
  );
};

export default Action;
