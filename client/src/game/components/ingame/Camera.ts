import { canvasCenterHeight, canvasCenterWidth, Ease2d, easeOutQuad, canvasDelta as delta } from '@/engine';

export class Camera extends Ease2d {
  private delay: number = 0;
  private forcedDelay: number = 0;

  public update(): void {
    if (this.forcedDelay > 0) {
      this.forcedDelay -= delta;
      return;
    }

    // TODO: implement camera follow
  }

  constructor() {
    super(easeOutQuad, 0, 0.4, 0, 0, canvasCenterWidth, canvasCenterHeight, canvasCenterWidth, canvasCenterHeight);
  }
}