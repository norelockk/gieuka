import { canvasContext, canvasDelta, canvasHeight, CanvasRenderer } from '@/engine';
import { keyboard, mouse, user } from '../constants';

let offset = 0;

export class DebugPreview extends CanvasRenderer {
  private dataToRender: any = {
    'user': null,
    'mouse': null,
    'delta': null,
    'keyboard': null,
  };

  initialize(): void {
    this.setVisible(true);
  }

  render(): void {
    // draw debug preview
    canvasContext!.save();
      // canvasContext!.translate(10, canvasHeight - 890 - offset);

      canvasContext!.font = '14px monospace';
      canvasContext!.fillStyle = 'white';
      canvasContext!.fillText('debug preview', 20, 40);

      for (const [key, value] of Object.entries(this.dataToRender)) {
        if (key === 'delta') {
          this.dataToRender[key] = canvasDelta.toFixed(4);
        } else if (key === 'mouse') {
          const m = { ...mouse };
          // delete m['canvas'];

          this.dataToRender[key] = JSON.stringify(m);
        } else if (key === 'keyboard') {
          const k = { l: keyboard.isLeft, r: keyboard.isRight, t: keyboard.isTop, b: keyboard.isBottom };
          // delete (k as any)['keys'];

          this.dataToRender[key] = JSON.stringify(k);
        }

        // if string is too long, cut it off
        // canvasContext!.fillText(`${key}: ${JSON.stringify(value)}`, 10, 40 + offset);
        offset += 12;
        canvasContext!.font = '10px monospace';
        canvasContext!.fillText(`${key}: ${value}`, 20, 50 + offset);
      }
    canvasContext!.restore();

    offset = 0;
  }
}