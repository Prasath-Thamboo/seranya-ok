// components/Badge.tsx
import React from 'react';

interface BadgeProps {
  role: string;
}

const Badge: React.FC<BadgeProps> = ({ role }) => {
  let badgeStyle = '';

  switch (role.toUpperCase()) {
    case 'ADMIN':
      badgeStyle = 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/30';
      break;
    case 'USER':
      badgeStyle = 'bg-blue-400/10 text-blue-400 ring-blue-400/30';
      break;
    case 'EDITOR':
      badgeStyle = 'bg-yellow-400/10 text-yellow-500 ring-yellow-400/20';
      break;
    default:
      badgeStyle = 'bg-gray-400/10 text-gray-400 ring-gray-400/20';
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ring-1 ring-inset ${badgeStyle}`}
    >
      {role.toUpperCase()}
    </span>
  );
};

export default Badge;
