import { canvasContext as context, Transition } from "@/engine";

interface CircleAnimationOptions {
  x: number; // X position
  y: number; // Y position
  initialRadius: number; // Initial radius
  finalRadius: number; // Final radius
  color: string; // Circle fill color
  alpha: number; // Circle transparency (0 to 1)
  strokeWidth: number; // Stroke width
  strokeColor: string; // Stroke color
}

export class CircleAnimation extends Transition {
  private _x: number;
  private _y: number;
  private _initialRadius: number;
  private _finalRadius: number;
  private _currentRadius: number;
  private _color: string;
  private _alpha: number;
  private _strokeWidth: number;
  private _strokeColor: string;

  constructor(
    options: CircleAnimationOptions,
    duration: number,
    easingFunction: (t: number) => number = (t) => t
  ) {
    super(duration, easingFunction);

    this._x = options.x;
    this._y = options.y;
    this._initialRadius = options.initialRadius;
    this._finalRadius = options.finalRadius;
    this._currentRadius = options.initialRadius;
    this._color = options.color;
    this._alpha = options.alpha;
    this._strokeWidth = options.strokeWidth;
    this._strokeColor = options.strokeColor;

    this.onUpdate((progress) => {
      this._currentRadius =
        this._initialRadius + (this._finalRadius - this._initialRadius) * progress;
    });
  }

  render(): void {
    if (!context)
      return;

    // Draw the circle with the current radius
    context.save();
    context.globalAlpha = this._alpha;

    context.beginPath();
    context.arc(this._x, this._y, this._currentRadius, 0, Math.PI * 2, false);
    context.fillStyle = this._color;
    context.fill();

    if (this._strokeWidth > 0) {
      context.lineWidth = this._strokeWidth;
      context.strokeStyle = this._strokeColor;
      context.stroke();
    }

    context.restore();
  }
}
