export enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',

}


export const StatusLabels: { [key in Status]: string } = {
  [Status.OPEN]: 'Ouvert',
  [Status.IN_PROGRESS]: 'En cours',
  [Status.CLOSED]: 'Fermé',
};

export function getStatusClass(status: string): string {
  switch (status) {
    case Status.OPEN:
      return 'open';
    case Status.IN_PROGRESS:
      return 'in-progress';
    case Status.CLOSED:
      return 'closed';
    default:
      return '';
  }
}
export function getStatusIcon(status: string): string {
  switch (status) {
    case Status.OPEN:
      return 'pi pi-tag';
    case Status.IN_PROGRESS:
      return 'pi pi-hourglass';
    case Status.CLOSED:
      return 'pi pi-verified';
    default:
      return '';
  }
}

// function to get the right advanced search type according to the search typ
export const StatusDropdownLabels: {label: string, value: string}[] = Object.entries(Status).map(([value, label]) => ({label, value}));
