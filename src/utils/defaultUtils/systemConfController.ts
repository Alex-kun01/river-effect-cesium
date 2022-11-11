
import { getMappingList } from '@/api/defaultApi/dictType';
export default class sceneController {
    mainStore:any;
    option: any; // 初始化配置项
    constructor(option: any) {
        this.option = option;
    }

    getBusinessDict(codeStr:any) {
        let code:any =codeStr;
        if (!codeStr) {
            code = this.option.code;
        }
        const promiseArr:any[] = [];
        if (code instanceof Array) {
            code.forEach((it:string)=>{
                promiseArr.push(getMappingList({ code: it }));
            });
            return Promise.all(promiseArr);
        } else if (typeof code === 'string') {
            return getMappingList({ code });
        }
    }
}
