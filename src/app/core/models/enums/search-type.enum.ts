export enum SearchType {
  USERS = 'USERS',
  STRUCTURES = 'STRUCTURES',
  TICKETS = 'TICKETS',

}


export const SearchTypeLabels: { [key in SearchType]: string } = {
  USERS: 'Rechercher un utilisateur par son nom, prénom, email, téléphone ...',
  STRUCTURES: 'Rechercher une structure par nom, adresse, téléphone, email ...',
  TICKETS: 'Rechercher un ticket par numéro, titre, auteur ...',
};


// function to get the right advanced search type according to the search typ
export const SearchTypeDropdownLabels: {label: string, value: string}[] = Object.entries(SearchType).map(([value, label]) => ({label, value}));
