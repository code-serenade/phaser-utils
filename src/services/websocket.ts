import { protoService } from "./proto_service";
import { dataManager } from "./data_manager";
import { eventManager } from "./events";

export class WebSocketService {
  private static instance: WebSocketService;
  private static url: string;
  private socket: WebSocket;
  private reconnectAttempts: number = 0;
  private static maxReconnectAttempts: number = 5;
  private static reconnectInterval: number = 3000;
  private pendingMessages: { cmd: number; data: object }[] = []; // 暂存待发送的消息队列

  private constructor() {
    if (!WebSocketService.url) {
      throw new Error(
        "WebSocket URL is not set. Use WebSocketService.setUrl() before getting the instance."
      );
    }
    this.connect();
  }

  public static setUrl(url: string) {
    WebSocketService.url = url;
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public static setMaxReconnectAttempts(attempts: number) {
    WebSocketService.maxReconnectAttempts = attempts;
  }

  public static setReconnectInterval(interval: number) {
    WebSocketService.reconnectInterval = interval;
  }

  private connect() {
    this.socket = new WebSocket(WebSocketService.url);
    this.initialize();
    eventManager.emit("Connected");
  }

  private initialize() {
    this.socket.onopen = () => {
      console.log("Connected to WebSocket server");
      this.reconnectAttempts = 0;
      this.flushPendingMessages(); // 重新连接后发送所有暂存的消息
    };

    this.socket.onmessage = (event) => {
      const blob = event.data;
      blob
        .arrayBuffer()
        .then((buffer: ArrayBuffer) => {
          const message = protoService.decode(buffer);
          dataManager.updateMessage(message.cmd, message.data);
        })
        .catch((error: any) => {
          console.error("Error converting Blob to ArrayBuffer:", error);
        });
    };

    this.socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.handleReconnect();
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < WebSocketService.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${WebSocketService.maxReconnectAttempts})`
      );
      setTimeout(() => {
        this.connect();
      }, WebSocketService.reconnectInterval);
    } else {
      console.error(
        "Max reconnect attempts reached. Could not reconnect to WebSocket server."
      );
    }
  }

  public send(cmd: number, data: object): boolean {
    if (this.socket.readyState === WebSocket.OPEN) {
      let message = protoService.encode(cmd, data);
      this.socket.send(message);
      return true;
    } else {
      console.error(
        "WebSocket is not open. Storing message to send after reconnect."
      );
      this.pendingMessages.push({ cmd, data }); // 将消息暂存
      return false;
    }
  }

  // 在重新连接后发送所有暂存的消息
  private flushPendingMessages() {
    const messages = [...this.pendingMessages]; // 复制当前队列
    this.pendingMessages = []; // 清空原队列

    messages.forEach(({ cmd, data }) => {
      this.send(cmd, data);
    });
  }

  public close() {
    this.socket.close();
  }
}
