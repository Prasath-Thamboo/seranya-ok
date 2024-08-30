import React from 'react';

interface BadgeProps {
  type?: string;
  role?: string;
}

const Badge: React.FC<BadgeProps> = ({ type, role }) => {
  let badgeStyle = '';

  if (type) {
    // Badges pour les types d'unité
    switch (type.toUpperCase()) {
      case 'CHAMPION':
        badgeStyle = 'bg-red-600/10 text-red-600 ring-red-600/30 font-bold'; // Rouge-orangé pour "CHAMPION"
        break;
      case 'UNIT':
        badgeStyle = 'bg-gray-300/10 text-black ring-gray-300/20 font-bold'; // Gris avec texte noir pour "UNIT"
        break;
      default:
        badgeStyle = 'bg-gray-400/10 text-gray-400 ring-gray-400/20 font-bold'; // Style par défaut pour autres types
        break;
    }
  } else if (role) {
    // Badges pour les rôles utilisateurs
    switch (role.toUpperCase()) {
      case 'ADMIN':
        badgeStyle = 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/30 font-bold';
        break;
      case 'USER':
        badgeStyle = 'bg-blue-400/10 text-blue-400 ring-blue-400/30 font-bold';
        break;
      case 'EDITOR':
        badgeStyle = 'bg-yellow-400/10 text-yellow-500 ring-yellow-400/20 font-bold';
        break;
      default:
        badgeStyle = 'bg-gray-400/10 text-gray-400 ring-gray-400/20 font-bold';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ring-1 ring-inset ${badgeStyle}`}
    >
      {type?.toUpperCase() || role?.toUpperCase()}
    </span>
  );
};

export default Badge;
