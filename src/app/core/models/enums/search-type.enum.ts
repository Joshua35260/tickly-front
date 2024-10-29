export enum SearchType {
  USERS = 'USERS',
  STRUCTURES = 'STRUCTURES',
  TICKETS = 'TICKETS',

}


export const SearchTypeLabels: { [key in SearchType]: string } = {
  USERS: 'Rechercher un utilisateur',
  STRUCTURES: 'Rechercher une structure',
  TICKETS: 'Rechercher un ticket',
};


// function to get the right advanced search type according to the search typ
export const SearchTypeDropdownLabels: {label: string, value: string}[] = Object.entries(SearchType).map(([value, label]) => ({label, value}));
