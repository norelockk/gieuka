import { TEasingFunction } from '@/types';
import { canvasDelta as delta } from 'engine/canvas';

export class LinearAnimation {
  private isIncreasing: boolean;
  private value: number;
  private max: number;
  private min: number;
  private maxSpeed: number;
  private minSpeed: number;

  constructor(
    isIncreasing: boolean,
    value: number,
    max: number,
    min: number,
    maxSpeed: number,
    minSpeed: number
  ) {
    this.isIncreasing = isIncreasing;
    this.value = value;
    this.max = max;
    this.min = min;
    this.maxSpeed = maxSpeed;
    this.minSpeed = minSpeed;
  }

  /**
   * Updates the animation state based on the delta time.
   * @returns `true` if the value reaches the max boundary and stops increasing, otherwise `false`.
   */
  update(): boolean {
    if (this.isIncreasing) {
      const newValue = this.value + delta * this.maxSpeed;

      if (newValue > this.max) {
        this.value = this.max;
        this.isIncreasing = false;

        return true;
      } else
        this.value = newValue;
    } else {
      const newValue = this.value - delta * this.minSpeed;

      if (newValue < this.min) {
        this.value = this.min;
        this.isIncreasing = true;
      } else
        this.value = newValue;
    }

    return false;
  }

  /**
   * Gets the current value of the animation.
   * @returns The current value.
   */
  getValue(): number {
    return this.value;
  }
}

export class Ease {
  private easingFunction: (progress: number) => number;
  private elapsedDuration: number; // Current elapsed time
  private easingMaxDuration: number; // Maximum duration for the ease effect
  private startValue: number; // Starting value of the ease effect
  private currentValue: number; // Current value being eased
  private targetValue: number; // Target value for the ease effect

  constructor(
    easingFunction: (progress: number) => number,
    elapsedDuration: number,
    easingMaxDuration: number,
    startValue: number,
    currentValue: number,
    targetValue: number
  ) {
    this.easingFunction = easingFunction;
    this.elapsedDuration = elapsedDuration;
    this.easingMaxDuration = easingMaxDuration;
    this.startValue = startValue;
    this.currentValue = currentValue;
    this.targetValue = targetValue;
  }

  /**
   * Restarts the ease effect, resetting the current value to the start value
   * and elapsed duration to zero.
   */
  restart(): void {
    this.currentValue = this.startValue;
    this.elapsedDuration = 0;
  }

  /**
   * Applies the easing effect based on the target value and elapsed time.
   * @param targetValue The new target value for the easing effect.
   */
  ease(targetValue: number): void {
    // If the target value changes, restart the easing process
    if (targetValue !== this.targetValue) {
      this.targetValue = targetValue;
      this.startValue = this.currentValue;
      this.elapsedDuration = 0;
    }

    // Update the current value based on the easing function
    if (this.targetValue !== this.currentValue) {
      this.elapsedDuration += delta;

      if (this.elapsedDuration > this.easingMaxDuration) {
        this.currentValue = this.targetValue; // Snap to target if duration is exceeded
      } else {
        const progress = this.elapsedDuration / this.easingMaxDuration;
        const easingFactor = this.easingFunction(progress);
        this.currentValue =
          this.startValue + (this.targetValue - this.startValue) * easingFactor;
      }
    }
  }

  /**
   * Gets the current eased value.
   * @returns The current value.
   */
  getValue(): number {
    return this.currentValue;
  }
}

export class Ease2d {
  private easingFunction: (progress: number) => number;
  private elapsedDuration: number;
  private easingMaxDuration: number;
  private startX: number;
  private startY: number;
  private currentX: number;
  private currentY: number;
  private targetX: number;
  private targetY: number;

  constructor(
    easingFunction: (progress: number) => number,
    elapsedDuration: number,
    easingMaxDuration: number,
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
    targetX: number,
    targetY: number
  ) {
    this.easingFunction = easingFunction;
    this.elapsedDuration = elapsedDuration;
    this.easingMaxDuration = easingMaxDuration;
    this.startX = startX;
    this.startY = startY;
    this.currentX = currentX;
    this.currentY = currentY;
    this.targetX = targetX;
    this.targetY = targetY;
  }

  /**
   * Updates the easing effect with a new target and elapsed time.
   * @param delta Time elapsed since the last update (in seconds).
   * @param target The new target values for the easing effect.
   */
  ease(delta: number, target: { x: number; y: number }): void {
    // Restart ease effect if the target changes
    if (target.x !== this.targetX || target.y !== this.targetY) {
      this.targetX = target.x;
      this.targetY = target.y;
      this.startX = this.currentX;
      this.startY = this.currentY;
      this.elapsedDuration = 0;
    }

    // Update current position based on easing function
    if (this.targetX !== this.currentX || this.targetY !== this.currentY) {
      this.elapsedDuration += delta;

      if (this.elapsedDuration > this.easingMaxDuration) {
        // Snap to target values if easing duration is exceeded
        this.currentX = this.targetX;
        this.currentY = this.targetY;
      } else {
        const progress = this.elapsedDuration / this.easingMaxDuration;
        const easingFactor = this.easingFunction(progress);
        this.currentX = this.startX + (this.targetX - this.startX) * easingFactor;
        this.currentY = this.startY + (this.targetY - this.startY) * easingFactor;
      }
    }
  }

  /**
   * Gets the current eased position.
   * @returns The current X and Y values.
   */
  getValue(): { x: number; y: number } {
    return { x: this.currentX, y: this.currentY };
  }

  get x(): number {
    return this.currentX;
  }

  get y(): number { 
    return this.currentY;
  }
}

export const easeOutQuad: TEasingFunction = (t: number) => t * (2 - t);
export const easeOutCubic: TEasingFunction = (t: number) => (--t) * t * t + 1;
export const easeOutQuart: TEasingFunction = (t: number) => 1 - (--t) * t * t * t;
export const easeOutQuint: TEasingFunction = (t: number) => 1 + (--t) * t * t * t * t;
export const easeInOutQuad: TEasingFunction = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
export const easeInOutCubic: TEasingFunction = (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
export const easeInOutQuart: TEasingFunction = (t: number) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;