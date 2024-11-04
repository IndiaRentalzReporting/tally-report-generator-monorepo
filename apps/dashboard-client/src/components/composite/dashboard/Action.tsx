import { DeleteEntity } from './Delete';
import { UpdateEntity } from './Update';

interface ActionsCellProps {
  module: {
    id: string | undefined;
    name: string;
    type: string;
  };
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  module: { id, name, type }
}) => {
  if (!id) throw new Error('Entity ID is required');
  return (
    <span className="flex gap-4 items-center">
      <DeleteEntity
        module={{
          id,
          name,
          type
        }}
      />
      <UpdateEntity
        module={{
          id,
          name,
          type
        }}
      />
    </span>
  );
};

export default ActionsCell;
