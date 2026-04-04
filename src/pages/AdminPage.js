import React, { useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import UploadMaterial from '../components/Admin/UploadMaterial';
import ManageSubjects from '../components/Admin/ManageSubjects';
import UserManagement from '../components/Admin/UserManagement';
import AccessLogs from '../components/Admin/AccessLogs';
import ManageAnnouncements from '../components/Admin/ManageAnnouncements';
import ManageContributions from '../components/Admin/ManageContributions';
import AdminSupportPanel from '../components/Admin/AdminSupportPanel';
import './AdminPage.scss';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const tabs = [
    { key: 'upload', label: 'Upload Material' },
    { key: 'contributions', label: 'Contributions' },
    { key: 'support', label: 'Support Chats' },
    { key: 'manageSubjects', label: 'Manage Subjects' },
    { key: 'manageAnnouncements', label: 'Announcements' },
    { key: 'userManagement', label: 'User Management' },
    { key: 'accessLogs', label: 'Access Logs' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload': return <UploadMaterial />;
      case 'contributions': return <ManageContributions />;
      case 'support': return <AdminSupportPanel />;
      case 'manageSubjects': return <ManageSubjects />;
      case 'userManagement': return <UserManagement />;
      case 'accessLogs': return <AccessLogs />;
      case 'manageAnnouncements': return <ManageAnnouncements />;
      default: return <UploadMaterial />;
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-page">
        <h2>Admin Panel</h2>
        <nav className="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;
