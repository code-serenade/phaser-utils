import { protoService } from "./proto_service";
import { dataManager } from "./data_manager";
import { eventManager } from "./events";

export class WebSocketService {
  private static instance: WebSocketService;
  private static url: string; // 静态属性用于存储 WebSocket 的 URL
  private socket: WebSocket;
  private reconnectAttempts: number = 0; // 当前重连次数
  private static maxReconnectAttempts: number = 5; // 最大重连次数
  private static reconnectInterval: number = 3000; // 每次重连间隔时间（毫秒）

  // 私有构造函数，防止直接通过 new 创建实例
  private constructor() {
    if (!WebSocketService.url) {
      throw new Error(
        "WebSocket URL is not set. Use WebSocketService.setUrl() before getting the instance."
      );
    }
    this.connect();
  }

  // 静态方法设置 WebSocket URL
  public static setUrl(url: string) {
    WebSocketService.url = url;
  }

  // 获取单例实例的静态方法
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  // 动态设置最大重连次数的静态方法
  public static setMaxReconnectAttempts(attempts: number) {
    WebSocketService.maxReconnectAttempts = attempts;
  }

  // 动态设置重连间隔时间的静态方法
  public static setReconnectInterval(interval: number) {
    WebSocketService.reconnectInterval = interval;
  }

  // 连接 WebSocket 的方法
  private connect() {
    this.socket = new WebSocket(WebSocketService.url);
    this.initialize();
    eventManager.emit("Connected");
  }

  private initialize() {
    this.socket.onopen = () => {
      console.log("Connected to WebSocket server");
      this.reconnectAttempts = 0; // 重置重连次数
    };

    this.socket.onmessage = (event) => {
      const blob = event.data;

      // 将 Blob 转换为 ArrayBuffer
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
      this.handleReconnect(); // 调用重连逻辑
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.handleReconnect(); // 发生错误时也调用重连逻辑
    };
  }

  // 重连逻辑
  private handleReconnect() {
    if (this.reconnectAttempts < WebSocketService.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${WebSocketService.maxReconnectAttempts})`
      );
      setTimeout(() => {
        this.connect(); // 再次尝试连接
      }, WebSocketService.reconnectInterval);
    } else {
      console.error(
        "Max reconnect attempts reached. Could not reconnect to WebSocket server."
      );
    }
  }

  public send(cmd: number, data: object) {
    if (this.socket.readyState === WebSocket.OPEN) {
      let message = protoService.encode(cmd, data);
      this.socket.send(message);
    } else {
      console.error(
        "WebSocket is not open. Ready state:",
        this.socket.readyState
      );
    }
  }

  public close() {
    this.socket.close();
  }

  // 这里可以添加更多功能，例如事件订阅、自动重连等
}
