export enum Status {
  Open = 'Open',
  InProgress = 'InProgress',
  Closed = 'Closed',

}


export const StatusLabels: { [key in Status]: string } = {
  Open: 'Ouvert',
  InProgress: 'En cours',
  Closed: 'Fermé',
};


// function to get the right advanced search type according to the search typ
export const StatusDropdownLabels: {label: string, value: string}[] = Object.entries(Status).map(([value, label]) => ({label, value}));
