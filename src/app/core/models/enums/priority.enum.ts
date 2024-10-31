export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',

}


export const PriorityLabels: { [key in Priority]: string } = {
  LOW: 'Faible',
  MEDIUM: 'Moyenne',
  HIGH: 'Élevée',
};


// function to get the right advanced search type according to the search typ
export const PriorityDropdownLabels: {label: string, value: string}[] = Object.entries(Priority).map(([value, label]) => ({label, value}));
