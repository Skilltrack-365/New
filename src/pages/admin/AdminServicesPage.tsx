import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminServices from '../../components/admin/AdminServices';

const AdminServicesPage: React.FC = () => {
  return (
    <AdminLayout>
      <AdminServices />
    </AdminLayout>
  );
};

export default AdminServicesPage;