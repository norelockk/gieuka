import { canvasCenterHeight, canvasCenterWidth, canvasContext, canvasDelta, CanvasRenderer, canvasScale } from '@/engine';

declare global {
  interface CanvasRenderingContext2D {
    letterSpacing: string;
  }
}

export class LoadingRenderer extends CanvasRenderer {
  public loadingText: string = 'tofuchat loading';
  private loadingWidth: number = 0;
  private loadingFilled: boolean = false;
  private loadingRotation: number = 0;

  initialize(): void {
    this.setVisible(true);
  }

  render(): void {
    this.loadingRotation += canvasDelta * 10;

    if (this.loadingWidth < 1 && !this.loadingFilled) {
      this.loadingWidth += canvasDelta * 0.55;

      if (this.loadingWidth >= 1)
        this.loadingFilled = true;
    } else {
      this.loadingWidth -= canvasDelta * 0.75;

      if (this.loadingWidth <= 0.02)
        this.loadingFilled = false;
    }

    const startAngle = 0;
    const endAngle = startAngle + Math.PI * this.loadingWidth;

    const CIRCLE_WIDTH: number = 33 * canvasScale;
    const STROKE = (CIRCLE_WIDTH / 4) * canvasScale;

    canvasContext!.save();
      canvasContext!.lineCap = 'round';
      canvasContext!.lineWidth = STROKE;
      canvasContext!.shadowBlur = 100;
      canvasContext!.shadowColor = 'white';
      canvasContext!.strokeStyle = 'white';
      
      canvasContext!.translate(canvasCenterWidth, canvasCenterHeight);
      canvasContext!.rotate(this.loadingRotation);
      
      canvasContext!.beginPath();
      canvasContext!.arc(0, 0, CIRCLE_WIDTH, startAngle, endAngle);
      canvasContext!.stroke();
      canvasContext!.closePath();
      
      canvasContext!.shadowColor = 'blue';
      canvasContext!.strokeStyle = 'blue';
      
      canvasContext!.rotate(this.loadingRotation * 0.34);

      canvasContext!.beginPath();
      canvasContext!.arc(0, 0, CIRCLE_WIDTH, startAngle, endAngle * 0.70);
      canvasContext!.stroke();
      canvasContext!.closePath();
    canvasContext!.restore();

    canvasContext!.save();
      canvasContext!.font = `400 ${24 * canvasScale}px Poppins`;
      canvasContext!.fillStyle = 'white';
      canvasContext!.textAlign = 'center';
      canvasContext!.textBaseline = 'middle';
      canvasContext!.letterSpacing = '-0.015em';

      canvasContext!.translate(canvasCenterWidth, (660 * canvasScale) + STROKE);
      canvasContext!.fillText(this.loadingText, 0, 0);
    canvasContext!.restore();
  }
}