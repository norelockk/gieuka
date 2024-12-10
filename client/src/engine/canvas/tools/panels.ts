import { DEBUG } from 'engine/constants';

class Panel {
  public dom: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private min = Infinity;
  private max = 0;

  constructor(
    private name: string,
    private fg: string,
    private bg: string
  ) {
    const PR = Math.round(window.devicePixelRatio || 1);

    const WIDTH = 80 * PR;
    const HEIGHT = 48 * PR;
    const TEXT_X = 3 * PR;
    const TEXT_Y = 2 * PR;
    const GRAPH_X = 3 * PR;
    const GRAPH_Y = 15 * PR;
    const GRAPH_WIDTH = 74 * PR;
    const GRAPH_HEIGHT = 30 * PR;

    this.dom = document.createElement('canvas');
    this.dom.width = WIDTH;
    this.dom.height = HEIGHT;
    this.dom.style.cssText = 'width:80px;height:48px';

    const context = this.dom.getContext('2d');
    if (!context) {
      throw new Error('Unable to get canvas context.');
    }
    this.context = context;

    this.context.font = `bold ${9 * PR}px monospace`;
    this.context.textBaseline = 'top';

    this.context.fillStyle = bg;
    this.context.fillRect(0, 0, WIDTH, HEIGHT);

    this.context.fillStyle = fg;
    this.context.fillText(name, TEXT_X, TEXT_Y);
    this.context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    this.context.fillStyle = bg;
    this.context.globalAlpha = 0.9;
    this.context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
  }

  public update(value: number, maxValue: number): void {
    const { dom, context, name, fg, bg } = this;
    const PR = Math.round(window.devicePixelRatio || 1);

    const WIDTH = 80 * PR;
    const GRAPH_X = 3 * PR;
    const GRAPH_Y = 15 * PR;
    const GRAPH_WIDTH = 74 * PR;
    const GRAPH_HEIGHT = 30 * PR;
    const TEXT_X = 3 * PR;
    const TEXT_Y = 2 * PR;

    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);

    context.fillStyle = bg;
    context.globalAlpha = 1;
    context.fillRect(0, 0, WIDTH, GRAPH_Y);

    context.fillStyle = fg;
    context.fillText(`${Math.round(value)} ${name} (${Math.round(this.min)}-${Math.round(this.max)})`, TEXT_X, TEXT_Y);

    context.drawImage(
      dom,
      GRAPH_X + PR,
      GRAPH_Y,
      GRAPH_WIDTH - PR,
      GRAPH_HEIGHT,
      GRAPH_X,
      GRAPH_Y,
      GRAPH_WIDTH - PR,
      GRAPH_HEIGHT
    );

    context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(
      GRAPH_X + GRAPH_WIDTH - PR,
      GRAPH_Y,
      PR,
      Math.round((1 - value / maxValue) * GRAPH_HEIGHT)
    );
  }
}

class DebugPanel {
  private container: HTMLDivElement;
  private beginTime: number;
  private prevTime: number;
  private frames = 0;
  private panels: Panel[] = [];
  private fpsPanel: Panel;
  private msPanel: Panel;
  private memPanel?: Panel;

  constructor() {
    this.container = document.createElement('div');
    this.container.style.cssText = 'position:fixed;top:0;right:0;opacity:0.75;z-index:10000';

    this.beginTime = performance.now();
    this.prevTime = this.beginTime;

    this.fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));
    this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));

    if ((performance as any).memory) {
      this.memPanel = this.addPanel(new Panel('MB', '#f08', '#201'));
    }
  }

  private addPanel(panel: Panel): Panel {
    this.container.appendChild(panel.dom);
    this.panels.push(panel);
    return panel;
  }

  public begin(): void {
    this.beginTime = performance.now();
  }

  public end(): number {
    this.frames++;

    const time = performance.now();
    this.msPanel.update(time - this.beginTime, 200);

    if (time >= this.prevTime + 1000) {
      this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);
      this.prevTime = time;
      this.frames = 0;

      if (this.memPanel && (performance as any).memory) {
        const memory = (performance as any).memory;
        this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
      }
    }

    return time;
  }

  public update(): void {
    this.beginTime = this.end();
  }

  get dom(): HTMLDivElement {
    return this.container;
  }
}

export const debugPanel: DebugPanel | undefined = DEBUG ? new DebugPanel() : undefined;