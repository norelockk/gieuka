import { User } from './components';
import { Keyboard, Mouse } from '@/engine';
import { LoadingRenderer } from './renderers';

// components (user, etc.)
export const user: User = new User();

// controllers
export const mouse: Mouse = new Mouse();
export const keyboard: Keyboard = new Keyboard();

// renderers
export const loading: LoadingRenderer = new LoadingRenderer();