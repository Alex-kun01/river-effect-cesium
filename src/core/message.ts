import {
    notification, Modal, message
} from 'ant-design-vue';

export default {
    install: (app: any) => {
        app.config.globalProperties.$XXVSuccess = (msg:any) => {
            notification.success({
                message: '提示',
                description: msg
            });
        };
        app.config.globalProperties.$XXVError = (msg:any) => {
            notification.error({
                message: '提示',
                description: msg
            });
        };
        app.config.globalProperties.$confirm = Modal.confirm;
        app.config.globalProperties.$message = message;
        app.config.globalProperties.$notification = notification;
        app.config.globalProperties.$info = Modal.info;
        app.config.globalProperties.$success = Modal.success;
        app.config.globalProperties.$error = Modal.error;
        app.config.globalProperties.$warning = Modal.warning;
    }
};
