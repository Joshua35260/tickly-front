export enum Category  {
  SUPPORT = 'SUPPORT',
  FEATURE_REQUEST = 'FEATURE_REQUEST',

}


export const CategoryLabels: { [key in Category]: string } = {
  SUPPORT: 'Support',
  FEATURE_REQUEST: 'Fonctionnalité',
};


// function to get the right advanced search type according to the search typ
export const CategoryDropdownLabels: {label: string, value: string}[] = Object.entries(Category).map(([value, label]) => ({label, value}));
