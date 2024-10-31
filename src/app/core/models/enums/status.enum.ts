export enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',

}


export const StatusLabels: { [key in Status]: string } = {
  OPEN: 'Ouvert',
  IN_PROGRESS: 'En cours',
  CLOSED: 'Fermé',
};


// function to get the right advanced search type according to the search typ
export const StatusDropdownLabels: {label: string, value: string}[] = Object.entries(Status).map(([value, label]) => ({label, value}));
