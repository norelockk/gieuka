// canvas drawing functions idea:
// so we can draw on the canvas from anywhere, but we need make priority to draw some things
// for example, the background should be the first thing to draw, so we can see the other things
// so we can create a list of functions to draw, and we can sort them by priority
// so we can draw the canvas in the order of the list

import { ICanvasRenderer } from 'types';

import { CanvasRendererError } from 'exceptions';

export const canvasRenderers: Map<string, ICanvasRenderer> = new Map();

export class CanvasRenderer implements ICanvasRenderer {
  [x: string]: any;

  private readonly _id: string = `${Math.random().toString(36).substring(2)}.${Date.now()}`;
  
  public loaded: boolean = false;
  public visible: boolean = false;
  public priority: number = 0;

  constructor() {
    if (canvasRenderers.has(this._id))
      return;

    canvasRenderers.set(this._id, this);

    try {
      if (this.initialize)
        this.initialize();
      else
        console.warn(`${this.constructor.name}.initialize() not implemented`);
    } catch (error: any) {
      throw new CanvasRendererError(`${this.constructor.name}.initialize() failed: ${error.message}`);
    }

    this.loaded = true;
  }

  public setVisible(visible: boolean): void {
    this.visible = visible;
    canvasRenderers.get(this._id)!.visible = visible;
  }

  public setPriority(priority: number): void {
    this.priority = priority;
    canvasRenderers.get(this._id)!.priority = priority;
  }

  render(): void {
    throw new CanvasRendererError(`${this.constructor.name}.render() not implemented`);
  }

  destroy(): void {
    canvasRenderers.delete(this._id);
  }
}