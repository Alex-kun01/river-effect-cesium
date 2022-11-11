import heartBeat from './heartBeat';


class webSocketClass {
    lockReconnect: boolean;
    localUrl:string;
    wsUrl:string;
    globalCallback:any;
    userClose:boolean;
    ws:any;
    constructor(name:string) {
        this.lockReconnect = false;
        this.localUrl = '';
        this.wsUrl = '';
        this.globalCallback = null;
        this.userClose = false;
        this.createWebSocket(name, this.globalCallback);
    }

    createWebSocket(url:string, globalCallback:any) {
        const that = this;
        that.wsUrl = url;
        try {
            that.ws = new WebSocket(that.localUrl + that.wsUrl);
            if (globalCallback) {
                that.globalCallback = globalCallback;
            }
            that.initEventHandle();
        } catch (e) {
            that.reconnect(url);
        }
    }

    // 初始化
    initEventHandle() {
        const that = this;
        // 连接成功建立后响应
        that.ws.onopen = () => {
            console.log('连接成功');
            // 心跳检测重置
            heartBeat.start(that.ws);
        };
        // 连接关闭后响应
        that.ws.onclose = () => {
            if (!that.userClose) {
                that.reconnect(that.wsUrl); // 重连
            }
        };
        that.ws.onerror = () => {
            if (!that.userClose) {
                that.reconnect(that.wsUrl); // 重连
            }
        };
        that.ws.onmessage = () => {
            that.getWebSocketMsg(that.globalCallback);
        };
    }

    reconnect(url:string) {
        const that = this;
        if (that.lockReconnect) return;
        that.lockReconnect = true; // 没连接上会一直重连，设置延迟避免请求过多
        setTimeout(() => {
            that.createWebSocket(url, that.globalCallback);
            that.lockReconnect = false;
        }, 30000);
    }

    webSocketSendMsg(msg:any) {
        const time = setInterval(() => {
            if (this.ws.readyState === 1) {
                clearInterval(time);
                this.ws.send(JSON.stringify(msg));
            }
        }, 1000);
    }

    getWebSocketMsg(callback: any) {
        this.globalCallback = callback;
        this.ws.onmessage = (ev:any) => {
            const redata = ev;// 收到的数据
            if (redata && redata.data === 'ping') { // 后台返回的type=95001的信息，表示这是一个心跳信息
                heartBeat.reset(this.ws);
                return;
            }
            // eslint-disable-next-line no-unused-expressions
            callback && callback(ev);
        };
    }

    closeSocket() {
        const that = this;
        if (that.ws) {
            that.userClose = true;
            that.ws.close();
            console.log('关闭连接');
        }
    }
}
export default webSocketClass;
