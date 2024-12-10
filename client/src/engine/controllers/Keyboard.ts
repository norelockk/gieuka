import { KeyboardMappings, KeyboardState, TKeyboardCode } from 'types';

export class Keyboard {
  // Key mappings for direction keys
  private TOP!: TKeyboardCode;
  private LEFT!: TKeyboardCode;
  private RIGHT!: TKeyboardCode;
  private BOTTOM!: TKeyboardCode;

  // State array for all keys
  private keys: KeyboardState[] = new Array(255).fill(KeyboardState.UP);

  constructor() {
    this.setQwerty(); // Default to QWERTY layout
  }

  // Set AZERTY key mappings
  public setAzerty(): void {
    this.LEFT = 81; // Q
    this.RIGHT = 68; // D
    this.TOP = 90; // Z
    this.BOTTOM = 83; // S
  }

  // Set QWERTY key mappings
  public setQwerty(): void {
    this.LEFT = 65; // A
    this.RIGHT = 68; // D
    this.TOP = 87; // W
    this.BOTTOM = 83; // S
  }

  // Handle keyup event
  public up(evt: KeyboardEvent): void {
    const keyCode = Math.min(evt.keyCode, 254) as TKeyboardCode;
    this.keys[keyCode] = KeyboardState.UP;
  }

  // Handle keydown event
  public down(evt: KeyboardEvent): TKeyboardCode {
    const keyCode = Math.min(evt.keyCode, 254) as TKeyboardCode;

    if (keyCode === this.LEFT || keyCode === KeyboardMappings.ARROW_LEFT) this.pressLeft();
    else if (keyCode === this.TOP || keyCode === KeyboardMappings.ARROW_UP) this.pressTop();
    else if (keyCode === this.BOTTOM || keyCode === KeyboardMappings.ARROW_DOWN) this.pressBottom();
    else if (keyCode === this.RIGHT || keyCode === KeyboardMappings.ARROW_RIGHT) this.pressRight();

    this.keys[keyCode] = KeyboardState.DOWN;

    return keyCode;
  }

  // Directional press handlers
  private pressLeft(): void {
    this.clearDirection(KeyboardMappings.ARROW_RIGHT, this.RIGHT);
  }

  private pressRight(): void {
    this.clearDirection(KeyboardMappings.ARROW_LEFT, this.LEFT);
  }

  private pressTop(): void {
    this.clearDirection(KeyboardMappings.ARROW_DOWN, this.BOTTOM);
  }

  private pressBottom(): void {
    this.clearDirection(KeyboardMappings.ARROW_UP, this.TOP);
  }

  // Clear directional key states
  private clearDirection(...keyCodes: TKeyboardCode[]): void {
    keyCodes.forEach((key) => (this.keys[key] = KeyboardState.UP));
  }

  private clearDirectionalKeys(): void {
    this.clearDirection(
      this.LEFT,
      this.RIGHT,
      this.TOP,
      this.BOTTOM,
      KeyboardMappings.ARROW_LEFT,
      KeyboardMappings.ARROW_RIGHT,
      KeyboardMappings.ARROW_UP,
      KeyboardMappings.ARROW_DOWN
    );
  }

  // Key state checks
  public isKeyActive(key: TKeyboardCode): boolean {
    return this.keys[key] === KeyboardState.DOWN;
  }

  public isLeft(): boolean {
    return this.isKeyActive(this.LEFT) || this.isKeyActive(KeyboardMappings.ARROW_LEFT);
  }

  public isRight(): boolean {
    return this.isKeyActive(this.RIGHT) || this.isKeyActive(KeyboardMappings.ARROW_RIGHT);
  }

  public isTop(): boolean {
    return this.isKeyActive(this.TOP) || this.isKeyActive(KeyboardMappings.ARROW_UP);
  }

  public isBottom(): boolean {
    return this.isKeyActive(this.BOTTOM) || this.isKeyActive(KeyboardMappings.ARROW_DOWN);
  }

  public isCtrl(): boolean {
    return this.isKeyActive(KeyboardMappings.CTRL);
  }

  public isSpace(): boolean {
    return this.isKeyActive(KeyboardMappings.SPACE);
  }
}