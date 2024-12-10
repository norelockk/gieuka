import { Vector } from 'engine/utils';

import { MouseState } from 'types';

export class Mouse {
  public angle: number = 0;
  public state: MouseState = MouseState.IDLE;
  public position: Vector = new Vector(0, 0);

  public up(): void {
    this.state = MouseState.UP;
  }

  public down(): void {
    this.state = MouseState.DOWN;
  }

  public idle(): void {
    this.state = MouseState.IDLE;
  }
}