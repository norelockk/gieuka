import { loadGame } from '@/game';
import { NETWORK_CLIENT_VERSION } from 'shared/constants';

loadGame();

console.log(NETWORK_CLIENT_VERSION);