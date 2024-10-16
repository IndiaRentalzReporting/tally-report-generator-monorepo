import { memo } from 'react';
import { DeleteEntity } from './DeleteEntity';
import { UpdateEntity } from './UpdateEntity';

interface ActionsCellProps {
  module: {
    id: string;
    name: string;
    type: string;
  };
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  module: { id, name, type }
}) => {
  console.log({
    type
  });
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

export default memo(ActionsCell);
