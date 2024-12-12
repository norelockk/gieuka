import { CanvasRenderer } from './renderer';

import { TEasingFunction } from 'types';
import { TransitionError } from 'exceptions';

export class Transition extends CanvasRenderer {
  private _startTime: number | null = null;
  private _duration: number = 1000; // 1 second
  private _easingFunction: TEasingFunction = (t) => t;
  private _onUpdate: (progress: number) => void = () => {};
  private _onComplete: () => void = () => {};
  private _isRunning: boolean = false;

  constructor(
    duration: number = 1000,
    easingFunction: TEasingFunction = (t) => t
  ) {
    super();

    this._duration = duration;
    this._easingFunction = easingFunction;
  }

  public setDuration(duration: number): void {
    if (duration <= 0)
      throw new TransitionError('duration must be greater than zero');

    this._duration = duration;
  }

  public setEasingFunction(easingFunction: TEasingFunction): void {
    if (typeof easingFunction !== 'function')
      throw new TransitionError('easingFunction must be a function');

    this._easingFunction = easingFunction;
  }

  public onUpdate(callback: (progress: number) => void): void {
    if (typeof callback !== 'function')
      throw new TransitionError('onUpdate callback must be a function');

    this._onUpdate = callback;
  }

  public onComplete(callback: () => void): void {
    if (typeof callback !== 'function')
      throw new TransitionError('onComplete callback must be a function');

    this._onComplete = callback;
  }

  public start(): void {
    if (this._isRunning)
      throw new TransitionError('transition is already running');

    this._startTime = performance.now();
    this._isRunning = true;
  }

  update(): void {
    if (!this._isRunning || this._startTime === null) return;

    const elapsedTime = performance.now() - this._startTime;
    const progress = Math.min(elapsedTime / this._duration, 1);
    const easedProgress = this._easingFunction(progress);

    this._onUpdate(easedProgress);

    if (progress > 1) {
      this._isRunning = false;
      this._onComplete();
    }
  }

  public stop(): void {
    this._isRunning = false;
    this._startTime = null;
  }

  render(): void {
    console.warn(`${this.constructor.name}.render() not implemented`);
  }
}