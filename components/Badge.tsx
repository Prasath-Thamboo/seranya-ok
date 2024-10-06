import React from 'react';

interface BadgeProps {
  type?: string;
  role?: string;
  classes?: Array<{ title: string; color?: string }>; // Nouvelle prop pour les classes
}

const Badge: React.FC<BadgeProps> = ({ type, role, classes }) => {
  if (classes && classes.length > 0) {
    // Si des classes sont fournies, on affiche des badges pour chaque classe
    return (
      <div className="flex flex-wrap gap-2">
        {classes.map((classItem, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset"
            style={{
              backgroundColor: classItem.color || 'rgba(0, 0, 0, 0.1)', // Utilisation de la couleur de la classe
              color: classItem.color ? '#fff' : '#000', // Texte blanc si couleur définie, noir sinon
            }}
          >
            {classItem.title} {/* Affiche le titre de la classe */}
          </span>
        ))}
      </div>
    );
  }

  // Code existant pour afficher les badges basés sur "type" ou "role"
  let badgeStyle = 'font-iceberg'; // Police Iceberg par défaut

  if (type) {
    switch (type.toUpperCase()) {
      case 'CHAMPION':
        badgeStyle += ' bg-yellow-600/10 text-yellow-400 ring-yellow-400/30 neon-gold font-bold';
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
        badgeStyle += ' bg-yellow-600/10 text-yellow-400 ring-yellow-400/30 neon-gold font-bold';
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
