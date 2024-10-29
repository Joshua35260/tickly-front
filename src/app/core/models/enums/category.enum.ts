export enum Category  {
  Support = 'Support',
  FeatureRequest = 'FeatureRequest',

}


export const CategoryLabels: { [key in Category]: string } = {
  Support: 'Support',
  FeatureRequest: 'Fonctionnalité',
};


// function to get the right advanced search type according to the search typ
export const CategoryDropdownLabels: {label: string, value: string}[] = Object.entries(Category).map(([value, label]) => ({label, value}));
