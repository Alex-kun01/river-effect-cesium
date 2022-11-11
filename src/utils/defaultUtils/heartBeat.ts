class HeartBeat {
    timeout: number; // 0.5分钟
    timeoutObj: any;
    serverTimeoutObj: any;
    constructor() {
        this.timeout = 30000;
        this.serverTimeoutObj=null;
        this.timeoutObj = null;
    }
    start(ws:any) {
        // const self = this;
        if (this.timeoutObj) {
            clearTimeout(this.timeoutObj);
        }
        if (this.serverTimeoutObj) {
            clearTimeout(this.serverTimeoutObj);
        }
        this.timeoutObj = setTimeout(() => {
            // 这里发送一个心跳，后端收到后，返回一个心跳消息，
            // onmessage拿到返回的心跳就说明连接正常
            // const message = {
            //     data: {
            //         type: '95001', // 事件类型编码
            //         info: '{}', // 消息主体内容,业务组件自定义,可为空字符串或JSON字符串
            //         time: new Date().getTime(), // 时间
            //         deviceId: '', // 设备编码
            //         traceId: '', // 染色ID
            //         spanId: '0', // 日志ID
            //         terminalID: '', // 前端页面的终端编码（唯一），可为空串
            //     },
            // };
            // ws.send(JSON.stringify(message));// 数据格式这里默认是字符串，是字符串还是JSON格式看你们的后台开发而定
            // self.serverTimeoutObj = setTimeout(() => {
            //     ws.onclose();
            // }, self.timeout);
            ws.send('ping');
        }, this.timeout);
    }
    reset(ws:any) {
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        this.start(ws);
    }
}

export default new HeartBeat();

