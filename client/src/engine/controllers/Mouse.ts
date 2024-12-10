import { Vector } from 'engine/utils';

import { MouseState } from 'types';

const THRESHOLD: number = 5 * 1000;

export class Mouse {
  private _lastMove: number = 0;
  private _lastPosition: Vector = new Vector(0, 0);
  
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

  public update(now: number): void {
    // Update last mouse position by current position but a bit later
    if (now - this._lastMove > 50 && (this.position.x !== this._lastPosition.x || this.position.y !== this._lastPosition.y) && this.state !== MouseState.IDLE) {
      this._lastPosition.x = this.position.x;
      this._lastPosition.y = this.position.y;
      this._lastMove = now;
      return;
    }

    // Limit mouse state to idle if not moved
    if (this.position.x === this._lastPosition.x || this.position.y === this._lastPosition.y) {
      if ((now - this._lastMove > THRESHOLD) && this.state !== MouseState.IDLE) {
        this.idle();
        this._lastMove = now;
      }
    } else if (this.state === MouseState.IDLE && (this._lastPosition.x !== this.position.x || this._lastPosition.y !== this.position.y)) {
      this.up();
      this._lastMove = 0;
    }
  }
}