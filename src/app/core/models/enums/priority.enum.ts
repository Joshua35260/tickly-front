export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
};


export const PriorityLabels = {
  [Priority.LOW]: 'Faible',
  [Priority.MEDIUM]: 'Moyenne',
  [Priority.HIGH]: 'Élevée',
};

export function getClass(priority: Priority): string {
  switch (priority) {
    case Priority.LOW:
      return 'low';
    case Priority.MEDIUM:
      return 'medium';
    case Priority.HIGH:
      return 'high';
    default:
      return '';
  }
}

// function to get the right advanced search type according to the search typ
export const PriorityDropdownLabels: {label: string, value: string}[] = Object.entries(Priority).map(([value, label]) => ({label, value}));
