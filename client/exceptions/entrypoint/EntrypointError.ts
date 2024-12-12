export class EntrypointError extends Error {
  constructor(message: string) {
    super(message);
    
    this.name = 'EntrypointError';
  }
}