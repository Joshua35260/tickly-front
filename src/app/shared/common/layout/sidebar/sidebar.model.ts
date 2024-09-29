import { RightPanelSection } from '../../../../core/models/enums/right-panel-section.enum';

export interface MenuSidebar {
  panel: RightPanelSection;
  title?: string;
  icon: string;
  iconSpan: number;
  hide?: boolean;
}
