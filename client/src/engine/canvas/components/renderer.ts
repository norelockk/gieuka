// canvas drawing functions idea:
// so we can draw on the canvas from anywhere, but we need make priority to draw some things
// for example, the background should be the first thing to draw, so we can see the other things
// so we can create a list of functions to draw, and we can sort them by priority
// so we can draw the canvas in the order of the list

import { ICanvasRenderer } from '@/types';
import { CanvasRendererError } from '@/exceptions';

export const canvasRenderers: Map<string, ICanvasRenderer> = new Map();

export class CanvasRenderer implements ICanvasRenderer {
  private readonly _now: number = Date.now();
  private readonly _hash: string = Math.random().toString(36).substring(2);
  private readonly _name: string = `${this.constructor.name}.${this._hash}.${this._now}`;

  public visible: boolean = false;
  public priority: number;
  public rendererName: string = this._name;

  constructor(priority: number = 0) {
    if (canvasRenderers.has(this.rendererName))
      throw new CanvasRendererError(`${this.constructor.name} renderer already exists`);

    this.priority = priority;
    canvasRenderers.set(this.rendererName, this);

    try {
      this.initialize();
    } catch (error: any) {
      throw new CanvasRendererError(`${this.constructor.name}.initialize() failed: ${error.message}`);
    }
  }

  render(): void {
    throw new CanvasRendererError(`${this.constructor.name}.render() not implemented`);
  }

  initialize(): void {
    console.warn(`${this.constructor.name}.initialize() not implemented, skipping initialization`);
  }

  public destroy(): void {
    canvasRenderers.delete(this.rendererName);
  }

  public setVisible(visible: boolean): void {
    this.visible = visible;
    canvasRenderers.get(this.rendererName)!.visible = visible;
  }

  public setPriority(priority: number): void {
    this.priority = priority;
    canvasRenderers.get(this.rendererName)!.priority = priority;
  }
}