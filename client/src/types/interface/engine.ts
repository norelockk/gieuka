import { TElementorData } from '../type';
import { ElementorPrintMethod } from '../enum';

// Engine interfaces
// Canvas renderer
export interface ICanvasRenderer {
  visible: boolean;
  priority: number;

  render: () => void;
  initialize?: () => void;
}

// Elementor
export interface IElementorBuildConfig {
  templateNode: HTMLTemplateElement | HTMLElement;
  templateData?: TElementorData;
  printTargetNode: HTMLElement;
  printMethod: ElementorPrintMethod;
};