
export enum RightPanelSection {
  RIGHT_PANEL_SECTION_INFO = 'info',
  RIGHT_PANEL_SECTION_STRUCTURES = 'structures',
  RIGHT_PANEL_SECTION_DOCUMENTS = 'documents',
  RIGHT_PANEL_SECTION_ACTIONS = 'actions',
}


export const RightPanelSectionLabel: {[key in RightPanelSection]: string} = {
  [RightPanelSection.RIGHT_PANEL_SECTION_INFO]: 'Informations',
  [RightPanelSection.RIGHT_PANEL_SECTION_STRUCTURES]: 'Structures',
  [RightPanelSection.RIGHT_PANEL_SECTION_DOCUMENTS]: 'Documents',
  [RightPanelSection.RIGHT_PANEL_SECTION_ACTIONS]: 'Actions',
}
