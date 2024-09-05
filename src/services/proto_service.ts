import * as protobuf from "protobufjs";

class ProtobufService {
    private static instance: ProtobufService;
    private root: protobuf.Root | null = null;

    private constructor() {}

    // 获取单例实例
    public static getInstance(): ProtobufService {
        if (!ProtobufService.instance) {
            ProtobufService.instance = new ProtobufService();
        }
        return ProtobufService.instance;
    }

    // 初始化方法，在程序启动时调用一次
    public async initialize(filePath: string): Promise<void> {
        if (!this.root) {
            this.root = await protobuf.load(filePath) as protobuf.Root;
        }
    }

    public encode(cmd: number, payload: object): ArrayBuffer {
        if (!this.root) {
            throw new Error("Protobuf root is not initialized.");
        }

        const Message = this.root.lookupType(`pba.m_${cmd}_tos`);
        const message = Message.create(payload);
        const buffer = Message.encode(message).finish();
        return this.pack(cmd, buffer);
    }

    public decode(payload: ArrayBuffer): { cmd: number; data?: object; errorCode?: number } {
        const reply = this.unpack(payload);

        if (reply.errorCode === 0) {
            if (!this.root) {
                throw new Error("Protobuf root is not initialized.");
            }

            const Message = this.root.lookupType(`pba.m_${reply.cmd}_toc`);
            
            if (reply.msg) {
                const data = Message.decode(reply.msg);
                return {
                    cmd: reply.cmd,
                    data: data
                };
            } else {
                throw new Error("Message is undefined.");
            }
        } else {
            return {
                cmd: reply.cmd,
                errorCode: reply.errorCode
            };
        }
    }

    private pack(cmd: number, data: Uint8Array): ArrayBuffer {
        const dataSize = data.byteLength;
        const buf = new ArrayBuffer(dataSize + 2);
        const packView = new DataView(buf);
        packView.setInt16(0, cmd);
        for (let i = 0; i < dataSize; i++) {
            packView.setInt8(i + 2, data[i]);
        }
        return buf;
    }

    private unpack(bin: ArrayBuffer): { cmd: number; errorCode: number; msg?: Uint8Array } {
        const size = bin.byteLength;
        const recvView = new DataView(bin);
        const errorCode = recvView.getInt16(0, false);
        const cmd = recvView.getInt16(2, false);

        if (errorCode === 0) {
            const messageBuffer = new ArrayBuffer(size - 4);
            const messageView = new DataView(messageBuffer);
            for (let i = 0; i < size - 4; i++) {
                messageView.setInt8(i, recvView.getInt8(4 + i));
            }
            const messageArray = new Uint8Array(messageBuffer);
            return {
                cmd: cmd,
                errorCode: errorCode,
                msg: messageArray
            };
        } else {
            return {
                cmd: cmd,
                errorCode: errorCode
            };
        }
    }
}

export const protoService = ProtobufService.getInstance();
