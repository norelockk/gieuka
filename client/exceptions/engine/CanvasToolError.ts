export class CanvasToolError extends Error {
  constructor(message: string) {
    super(message);
    
    this.name = 'CanvasToolError';
  }
}