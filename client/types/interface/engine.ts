import { TElementorData } from '../type';
import { ElementorPrintMethod } from '../enum';

// Engine interfaces
// Canvas renderer
export interface ICanvasRenderer {
  loaded: boolean;
  visible: boolean;
  priority: number;

  render: () => void;
  update?: () => void;
  destroy?: () => void;
  initialize?: (() => void) | undefined;
}

// Elementor
export interface IElementorBuildConfig {
  templateNode: HTMLTemplateElement | HTMLElement;
  templateData?: TElementorData;
  printTargetNode: HTMLElement;
  printMethod: ElementorPrintMethod;
};