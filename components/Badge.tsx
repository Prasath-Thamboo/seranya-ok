import React from 'react';

interface BadgeProps {
  type?: string;
  role?: string;
}

const Badge: React.FC<BadgeProps> = ({ type, role }) => {
  let badgeStyle = 'font-iceberg'; // Police Iceberg par défaut

  if (type) {
    switch (type.toUpperCase()) {
      case 'CHAMPION':
        badgeStyle += ' bg-yellow-600/10 text-yellow-400 ring-yellow-400/30 neon-gold font-bold'; // Doré avec effet néon
        break;
      case 'UNIT':
        badgeStyle += ' bg-gray-300/10 text-black ring-gray-300/20 font-bold';
        break;
      default:
        badgeStyle += ' bg-gray-400/10 text-gray-400 ring-gray-400/20 font-bold';
        break;
    }
  } else if (role) {
    switch (role.toUpperCase()) {
      case 'CHAMPION':
        badgeStyle += ' bg-yellow-600/10 text-yellow-400 ring-yellow-400/30 neon-gold font-bold'; // Badge doré avec effet néon
        break;
      case 'ADMIN':
        badgeStyle += ' bg-indigo-400/10 text-indigo-400 ring-indigo-400/30 font-bold';
        break;
      case 'USER':
        badgeStyle += ' bg-blue-400/10 text-blue-400 ring-blue-400/30 font-bold';
        break;
      default:
        badgeStyle += ' bg-gray-400/10 text-gray-400 ring-gray-400/20 font-bold';
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
