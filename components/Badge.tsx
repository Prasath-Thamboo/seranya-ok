import React from 'react';

interface BadgeProps {
  type?: string;
  role?: string;
  classes?: Array<{ title: string; color?: string }>; // Nouvelle prop pour les classes
}

const Badge: React.FC<BadgeProps> = ({ type, role, classes }) => {
  // Si des classes sont fournies et qu'elles existent
  if (classes && classes.length > 0) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {classes.map((classItem, index) => (
          <span
            key={index}
            className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-bold uppercase neon-effect font-iceberg`}
            style={{
              color: classItem.color || '#000000', // Texte avec couleur de classe ou noir
              boxShadow: `0 0 8px ${classItem.color || '#000000'}`, // Effet néon avec couleur de classe
              border: `1px solid ${classItem.color || '#000000'}`, // Bordure avec couleur de classe ou noir
              padding: '6px 12px', // Ajout d'un padding-y léger
              textShadow: `0 0 5px ${classItem.color || '#000000'}`, // Ajout de l'ombre de texte avec la couleur de la classe
            }}
          >
            {classItem.title} {/* Affiche le titre de la classe */}
          </span>
        ))}
      </div>
    );
  }

  // Code existant pour afficher les badges basés sur "type" ou "role"
  let badgeStyle = 'font-iceberg uppercase'; // Police Iceberg par défaut avec uppercase

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
      className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ring-1 ring-inset ${badgeStyle}`}
    >
      {type?.toUpperCase() || role?.toUpperCase()}
    </span>
  );
};

export default Badge;
