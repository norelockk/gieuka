// Mouse controller states
export enum MouseState {
  UP = 1,
  DOWN = 0,
  IDLE = 2
}

// Keyboard controller states
export enum KeyboardState {
  UP = 0,
  DOWN = 1
}

export enum KeyboardMappings {
  CTRL = 17,
  SPACE = 32,
  ARROW_UP = 38,
  ARROW_DOWN = 40,
  ARROW_LEFT = 37,
  ARROW_RIGHT = 39
}

// Elementor
export enum ElementorPrintMethod {
  AFTER_END = 'afterend',
  BEFORE_END = 'beforeend',
  AFTER_BEGIN = 'afterbegin',
  BEFORE_BEGIN = 'beforebegin'
}