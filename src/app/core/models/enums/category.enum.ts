export enum Category  {
  SUPPORT = 'SUPPORT',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
}


export const CategoryLabels: { [key in Category]: string } = {
  SUPPORT: 'Support',
  FEATURE_REQUEST: 'Fonctionnalité',
};

export function getClass(category: Category): string {
  switch (category) {
    case Category.SUPPORT:
      return 'support';
    case Category.FEATURE_REQUEST:
      return 'feature-request';
    default:
      return '';
  }
}
// function to get the right advanced search type according to the search typ
// Obtenez les options de catégorie avec les labels traduits
export const CategoryDropdownLabels: {label: string, value: string}[] = Object.entries(Category).map(([value, key]) => ({
  label: CategoryLabels[value], 
  value: value
}));

