import { eventManager } from "./events";

class DataManager {
  private static instance: DataManager;
  private messages: { [messageId: number]: any };

  private constructor() {
    this.messages = {};
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  public updateMessage(messageId: number, data: any): void {
    this.messages[messageId] = data;
    eventManager.emit(String(messageId), data);
  }

  public getMessage(messageId: number): any | undefined {
    return this.messages[messageId];
  }

  public reset(): void {
    this.messages = {};
    eventManager.emit("dataReset");
  }
}

export const dataManager = DataManager.getInstance();
