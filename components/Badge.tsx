import React from 'react';

interface BadgeProps {
  type?: string;
  role?: string;
  classes?: Array<{ title: string; color?: string }>;
}

const BASE =
  'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-sans font-medium tracking-wide ring-1 ring-inset';

const VARIANTS: Record<string, string> = {
  CHAMPION: 'bg-gilt-soft text-gilt ring-gilt/40',
  ADMIN: 'bg-info-soft text-info ring-info/30',
  EDITOR: 'bg-accent-soft text-accent ring-accent/30',
  USER: 'bg-sand-100 text-ink-soft ring-line',
  UNIT: 'bg-sand-100 text-ink-soft ring-line',
  DEFAULT: 'bg-sand-100 text-ink-muted ring-line',
};

const Badge: React.FC<BadgeProps> = ({ type, role, classes }) => {
  // Badges de classes : pastille teintée de la couleur de la classe, sobre
  // (bordure + fond très léger, plus aucun halo néon).
  if (classes && classes.length > 0) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {classes.map((classItem, index) => {
          const c = classItem.color || 'var(--accent)';
          return (
            <span
              key={index}
              className={`${BASE}`}
              style={{
                color: c,
                borderColor: 'transparent',
                boxShadow: `inset 0 0 0 1px ${c}55`,
                backgroundColor: `${c}14`,
              }}
            >
              {classItem.title}
            </span>
          );
        })}
      </div>
    );
  }

  const key = (type || role || 'DEFAULT').toUpperCase();
  const variant = VARIANTS[key] || VARIANTS.DEFAULT;

  return <span className={`${BASE} ${variant}`}>{key}</span>;
};

export default Badge;
