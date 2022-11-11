/*
 * @Description: 日志操作
 * @Version: 1.0
 * @Autor: hasaiki
 * @Date: 2022-03-07 14:58:47
 * @LastEditors: lxy
 * @LastEditTime: 2022-05-27 11:49:35
 */
interface logParam {
  logName: string,
  operationType: number,
  message: string,
  browser: string,
  screeInfo: string,
  url: string,
  opTime: string,
  account: string,
  appCode: string,
}
import { saveLog } from '@/api/defaultApi/dictType';
import { notification } from 'ant-design-vue';
export default class frontLog {
    /**
   * @description 保存前端日志
   * @author hasaiki
   * @date 2022/03/07
   * @param {string} [logName='']
   * @param {number} [type=0]
   * @param {string} [msg='']
   * @memberof frontLog
   */
    saveLog(logName:string='', type:number=0, msg:string='') {
        const param:logParam = {
            logName: logName,
            operationType: type,
            message: msg,
            browser: window.navigator.userAgent,
            screeInfo: this.getScreenInfo(),
            url: window.location.href,
            opTime: this.formatNowDate(),
            account: '',
            appCode: 'BaseX'
        };
        saveLog(param).then((res:any)=>{
            if (res.code === 200) {
                notification.success({
                    message: '成功',
                    description: '日志保存成功'
                });
            } else {
                notification.error({
                    message: '失败',
                    description: '日志保存失败'
                });
            }
        });
    }
    /**
     * @description 当前日期格式化
     * @author hasaiki
     * @date 2022/03/07
     * @return {*} 日期
     * @memberof frontLog
     */
    formatNowDate() {
        const date = new Date();
        const y = date.getFullYear();
        let m:any = date.getMonth() + 1;
        let d:any = date.getDate();
        let h:any = date.getHours();
        let i:any = date.getMinutes();
        let s:any = date.getSeconds();
        if (m < 10) {
            m = `0${m}`;
        }
        if (d < 10) {
            d = `0${d}`;
        }
        if (h < 10) {
            h = `0${h}`;
        }
        if (i < 10) {
            i = `0${i}`;
        }
        if (s < 10) {
            s = `0${s}`;
        }
        const t = `${y}-${m}-${d} ${h}:${i}:${s}`;
        return t;
    }
    /**
     * 获取屏幕信息-分辨率-可视宽高
     * @return 返回屏幕信息
     */

    getScreenInfo() {
        return `{"width":${window.screen.width},"height":${window.screen.height},"availHeight":${window.document.body.clientHeight},"availWidth":${window.document.body.clientWidth}}`;
    }
}
