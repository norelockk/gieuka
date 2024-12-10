import { setupCanvas } from '@/engine';
import { CANVAS_ELEMENT } from '@/constants';

export * from './functions';
export * from './constants';

export function loadGame(): void {
  // setup the canvas
  setupCanvas(CANVAS_ELEMENT!);
}