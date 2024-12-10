export class Vector {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  public sub(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  public mul(vector: Vector): Vector {
    return new Vector(this.x * vector.x, this.y * vector.y);
  }

  public div(vector: Vector): Vector {
    return new Vector(this.x / vector.x, this.y / vector.y);
  }

  public scale(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  public dot(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y;
  }

  public mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalize(): Vector {
    const mag = this.mag();
    return new Vector(this.x / mag, this.y / mag);
  }

  public angle(vector: Vector): number {
    return Math.acos(this.dot(vector) / (this.mag() * vector.mag()));
  }

  public rotate(angle: number): Vector {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  public copy(): Vector {
    return new Vector(this.x, this.y);
  }

  public toString(): string {
    return `Vector(${this.x}, ${this.y})`;
  }
}