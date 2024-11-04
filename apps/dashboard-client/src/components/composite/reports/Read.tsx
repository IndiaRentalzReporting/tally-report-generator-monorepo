import React from 'react';
import Sidebar from './Sidebar';
import DataTable from './Table';

const Update: React.FC = () => (
    <>
      <Sidebar />
      <main className="flex flex-col" style={{ width: 'calc(100% - var(--sidebar-width))' }}>
        <DataTable data={[Object]} />
      </main>
    </>
);

export default Update;
