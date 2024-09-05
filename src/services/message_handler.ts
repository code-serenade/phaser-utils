import { dataManager } from './data_manager';

interface PlayerUpdateMessage {
    type: 'playerUpdate';
    playerId: string;
    data: { [key: string]: any };
}

interface GameStatusMessage {
    type: 'gameStatus';
    status: 'waiting' | 'playing' | 'finished';
}

type Message = PlayerUpdateMessage | GameStatusMessage | { type: string };

export function handleMessage(message: Message): void {
    switch (message.type) {
        case 'playerUpdate':
            message as PlayerUpdateMessage
            dataManager.updatePlayer((message as PlayerUpdateMessage).playerId, (message as PlayerUpdateMessage).data);
            break;
        case 'gameStatus':
            dataManager.set('gameStatus', (message as GameStatusMessage).status);
            break;
        default:
            console.warn('Unknown message type:', message.type);
    }
}
