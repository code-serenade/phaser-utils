import config from '../../public/config.json';
import { protoService } from './proto_service';
import { dataManager } from './data_manager';

export class WebSocketService {
    private static instance: WebSocketService;
    private socket: WebSocket;
   

    // 私有构造函数，防止直接通过 new 创建实例
    private constructor() {
        const url = config.socket_url;
        this.socket = new WebSocket(url);
        this.initialize();
    }

    // 获取单例实例的静态方法
    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    private initialize() {
        this.socket.onopen = () => {
            console.log('Connected to WebSocket server');
            // this.send('Hello Server!');
        };

        this.socket.onmessage = (event) => {
            const blob = event.data;
        
            // 将 Blob 转换为 ArrayBuffer
            blob.arrayBuffer().then((buffer: ArrayBuffer) => {
                const message = protoService.decode(buffer);
                dataManager.updateMessage(message.cmd, message.data);
                // console.log(`Message from server: ${JSON.stringify(message)}`);
                // 处理接收到的消息
            }).catch((error: any) => {
                console.error("Error converting Blob to ArrayBuffer:", error);
            });
        };
        

        this.socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    public send(cmd: number, data: object) {
        if (this.socket.readyState === WebSocket.OPEN) {
            let message = protoService.encode(cmd, data);
            this.socket.send(message);
        } else {
            console.error('WebSocket is not open. Ready state:', this.socket.readyState);
        }
    }

    public close() {
        this.socket.close();
    }

    // 这里可以添加更多功能，例如事件订阅、自动重连等
}

export const socket = WebSocketService.getInstance();