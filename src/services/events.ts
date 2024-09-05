import {Events} from 'phaser';

class GlobalEventManager extends Events.EventEmitter {}

export const eventManager = new GlobalEventManager();
