export class CanvasRendererError extends Error {
  constructor(message: string) {
    super(message);
    
    this.name = 'CanvasRendererError';
  }
}