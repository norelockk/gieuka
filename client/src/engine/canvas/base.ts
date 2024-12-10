import { DEBUG } from 'engine/constants';

import { CanvasError } from '@/exceptions';
import { ICanvasRenderer } from '@/types';

import { debugPanel } from './tools';
import { canvasRenderers } from './components';

// canvas variables
let canvas: HTMLCanvasElement | undefined = undefined;
export let canvasContext: CanvasRenderingContext2D | undefined = undefined;

// canvas delta time calculation
let lastCanvasDelta: number = 0;
export let canvasDelta: number = 0;

// canvas properties
export let [ canvasWidth, canvasHeight ]: [number, number] = [0, 0];
export let [ canvasCenterWidth, canvasCenterHeight ]: [number, number] = [0, 0];
export let canvasScale: number = 1;

/**
 * setup the canvas element
 * 
 * @param HTMLCanvasElement element
 * @throws { CanvasError } if canvas already setup or not a canvas element
 * @returns { HTMLCanvasElement, CanvasRenderingContext2D } canvas and canvas context
 */
export function setupCanvas(element: HTMLCanvasElement): void {
  if (canvas) throw new CanvasError('canvas already setup');

  canvas = element;

  try {
    canvasContext = canvas.getContext('2d')!;
  } catch (error) {
    throw new CanvasError('unable to get canvas context');
  }

  // resizing canvas
  function resize(): void {
    canvasWidth = canvas!.width = innerWidth;
    canvasHeight = canvas!.height = innerHeight;
    canvasScale = canvasHeight / 1080;
    canvasCenterWidth = canvasWidth / 2;
    canvasCenterHeight = canvasHeight / 2;
    
    // set canvas style if width and height are different
    canvas?.style.setProperty('width', `${canvasWidth}px`);
    canvas?.style.setProperty('height', `${canvasHeight}px`);

    console.log('canvas resized', canvasScale);
  }
  
  // resize on load
  resize();
  
  // bind resize to body
  document.body.onresize = resize;

  // enable debug panels
  if (DEBUG && debugPanel)
    document.body.append(debugPanel.dom);

  // render canvas
  function render(): void {
    debugPanel && debugPanel.begin();

    // canvas renderers with priority
    const renderers: ICanvasRenderer[] = Array.from(canvasRenderers.values()).sort((a, b) => a.priority - b.priority);

    // calculate delta time
    const now = performance.now();
    canvasDelta = (now - lastCanvasDelta) / 1000;
    lastCanvasDelta = now;
    
    // clear canvas
    canvasContext!.clearRect(0, 0, canvasWidth, canvasHeight);

    // draw black background
    canvasContext!.save();
      canvasContext!.fillStyle = 'black';
      canvasContext!.fillRect(0, 0, canvasWidth, canvasHeight);
    canvasContext!.restore();

    // render renderers
    canvasContext!.save();
      for (const renderer of renderers) {
        if (!renderer.visible)
          continue;
        
        try {
          renderer.render();
        } catch (error) {
          throw error;
        }
      }
    canvasContext!.restore();

    debugPanel && debugPanel.end();

    // loop rendering
    requestAnimationFrame(render);
  }

  // render on load
  requestAnimationFrame(render);
}