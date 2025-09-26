import React from 'react';
import type { Person } from '../types';
import { XIcon } from './icons';
import clsx from 'clsx';

interface PersonCardProps {
  person: Person;
  index: number;
  isUser?: boolean;
  onRemove?: (personId: string) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, index, isUser = false, onRemove }) => {
  return (
    <div className={clsx(
      "bg-card p-4 rounded-lg flex items-center justify-between shadow-sm dark:shadow-md transition-all duration-300 group",
      {
        'border-2 border-primary ring-2 ring-primary/20': isUser,
        'hover:translate-x-1': !onRemove
      }
    )}>
      <div className="flex items-center">
        <span className="text-lg font-bold text-primary w-8 text-center">{index + 1}</span>
        <p className="ml-4 text-lg text-card-foreground">{person.name}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary">
          Joined: {new Date(person.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {onRemove && (
            <button
              onClick={() => onRemove(person.id)}
              className="p-1.5 rounded-full text-text-secondary/70 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              aria-label={`Remove ${person.name} from queue`}
            >
              <XIcon className="h-5 w-5" />
            </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(PersonCard);