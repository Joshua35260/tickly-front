export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',

}


export const PriorityLabels: { [key in Priority]: string } = {
  Low: 'Faible',
  Medium: 'Moyenne',
  High: 'Élevée',
};


// function to get the right advanced search type according to the search typ
export const PriorityDropdownLabels: {label: string, value: string}[] = Object.entries(Priority).map(([value, label]) => ({label, value}));
