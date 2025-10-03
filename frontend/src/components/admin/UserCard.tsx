import React from 'react';
import { motion } from 'framer-motion';
import { User, UserRole } from '../../types/auth.types';
import Badge from '../shared/Badge';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onToggleStatus?: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete, onToggleStatus }) => {
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.CHAIRMAN:
        return 'danger';
      case UserRole.SECRETARY:
        return 'warning';
      case UserRole.EXECUTIVE:
        return 'info';
      case UserRole.VOTER:
        return 'success';
      default:
        return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {getInitials(user.name)}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{user.name}</h3>
            <p className="text-sm text-gray-600">NIC: {user.nic}</p>
            <p className="text-sm text-gray-600">Phone: {user.phone}</p>
            {user.email && <p className="text-sm text-gray-600">Email: {user.email}</p>}

            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant={getRoleColor(user.role)}>{user.role}</Badge>
              <Badge variant={user.isActive ? 'success' : 'danger'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {user.customFields && Object.keys(user.customFields).length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {Object.entries(user.customFields).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.lastLogin && (
              <p className="text-xs text-gray-500">
                Last login: {new Date(user.lastLogin).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ml-2">
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit user"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(user)}
              className={`p-2 ${user.isActive ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'} rounded-lg transition-colors`}
              title={user.isActive ? 'Deactivate user' : 'Activate user'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={user.isActive ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(user)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete user"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
