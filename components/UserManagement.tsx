import React, { useState } from 'react';
import { User } from '../types';
import UserFormModal from './UserFormModal';
import { PencilIcon, TrashIcon } from './icons';

interface UserManagementProps {
  users: User[];
  onAddUser: (newUser: Omit<User, 'id'>) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: number) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleOpenModalForNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (userData: Omit<User, 'id'> | User) => {
    if ('id' in userData) {
      onUpdateUser(userData);
    } else {
      onAddUser(userData);
    }
    handleCloseModal();
  };
  
  const handleDelete = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
        onDeleteUser(user.id);
    }
  }

  return (
    <main className="p-4 sm:p-6" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
            <button
                onClick={handleOpenModalForNew}
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200"
            >
                Add New User
            </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">User Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {user.name}
                            </th>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.role === 'Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                    user.role === 'Cashier' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-4">
                                    <button 
                                        onClick={() => handleOpenModalForEdit(user)} 
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        <PencilIcon className="w-5 h-5"/>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user)} 
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                    >
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <UserFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveUser}
            user={editingUser}
        />
    </main>
  );
};

export default UserManagement;
