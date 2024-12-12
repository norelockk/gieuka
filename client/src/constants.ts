import { EntrypointError } from 'exceptions';

export const CANVAS_ELEMENT: HTMLCanvasElement | null = (() => {
  const element: HTMLCanvasElement | null = document.querySelector('#game_canvas') || document.getElementById('game_canvas') as HTMLCanvasElement;
  if (!element)
    throw new EntrypointError('canvas element not found');

  return element;
})();
