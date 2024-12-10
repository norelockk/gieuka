import { Vector } from 'engine/utils';

import { MouseState } from '@/types';

export class Mouse {
  public angle: number = 0;
  public state: MouseState = MouseState.IDLE;
  public position: Vector = new Vector(0, 0);
  private previousPosition: Vector = new Vector(0, 0);

  public up(): void {
    this.state = MouseState.UP;
  }

  public down(): void {
    this.state = MouseState.DOWN;
  }

  public update(): boolean {
    if (this.position.x !== this.previousPosition.x || this.position.y !== this.previousPosition.y) {
      this.previousPosition.x = this.position.x;
      this.previousPosition.y = this.position.y;
      return true;
    }
    return false;
  }
}