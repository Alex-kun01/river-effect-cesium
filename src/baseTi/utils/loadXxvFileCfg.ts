/*
 * @Description:
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-02-25 16:08:38
 * @LastEditors: 'luxiaoyao' 'luxiaoyao@uino.com'
 * @LastEditTime: 2022-05-30 09:45:40
 */

import { xxvWebAssetsList } from '@/baseTi/api';

/**
 * @description: 加载js
 * @param {string} url 需要加载的url地址
 * @param {Function} callback 回调
 * @param {string} flag
 */
export function loadScript(url: string, callback: Function, flag?: string) {
    const script: any = document.createElement('script');
    if (flag) {
        script.class = flag;
    }
    if (script.readyState) {
        // IE
        script.onreadystatechange = function () {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        // 其他浏览器
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

export function dynLoadJs(urlArr: Array<string>, callback: Function, flag?: string) {
    const cb = callback || function () { }; // 加载完成后回调方法
    for (let i = 0, len = urlArr.length; i < len; i++) { // 遍历需要加载的列表
        const sp: any = document.createElement('script');
        sp.type = 'text/javascript'; // 设置 script 的ype类型
        if (flag) {
            sp.class = flag;
        }
        if (i == len - 1) { // 判断最后一个文件
            if (sp.readyState) { // IE
                sp.onreadystatechange = function () { // IE 加载完成
                    if (sp.readyState == 'loaded' || sp.readyState == 'complete') {
                        sp.onreadystatechange = null;
                        console.warn('IE 动态加载最后一个文件完成！');
                        setTimeout(() => {
                            cb(); // 执行回调
                        }, 100);
                    }
                };
            } else { // 其他浏览器
                sp.onload = function () { // 加载完成
                    console.warn('非IE 动态加载最后一个文件完成！');
                    setTimeout(() => {
                        cb(); // 执行回调
                    }, 100);
                };
            }
        }
        sp.src = urlArr[i]; // 设置 script 的src属性
        document.getElementsByTagName('head')[0].appendChild(sp);
    }
}


/**
 * @description: 加载basex启用的thingjs和uearth等文件
 * @param {string} url：需要加载的url地址
 * @param {Function} callback：回调
 * @param {string} flag
 */

function loadScripts(
    urls: string[], index: number, callback: Function, flag?: string
) {
    if (index >= urls.length) {
        return false;
    }
    const url: string = urls[index];
    const script: any = document.createElement('script');
    if (flag) {
        script.class = flag;
    }
    if (script.readyState) {
        // IE
        script.onreadystatechange = function () {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                // callback();
                if (index < urls.length) {
                    loadScripts(urls, index + 1, callback);
                }
                if (index === urls.length - 1) {
                    callback();
                }
            }
        };
    } else {
        // 其他浏览器
        script.onload = function () {
            if (index < urls.length) {
                loadScripts(urls, index + 1, callback);
            }
            if (Boolean(urls.length - 1 === index).valueOf()) {
                callback();
            }
        };
    }
    if (index < urls.length) {
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}


/**
 * @description: 加载basex启用的thingjs和uearth文件
 * @param {Function} callback 参数描述
 * @param {*} need 需要加载的js文件类型，对应basexweb资源code(默认只加载thingjs)
 */
export function loadJsFiles(callback: Function, need = ['thingjs']) {
    xxvWebAssetsList().then((res: any) => {
        const fileArr: any[] = [];
        const urls: string[] = [];
        need.forEach(str => {
            fileArr.push(res.data.find((it: any) => it.assetsCode === str));
        });
        fileArr.forEach((item) => {
            const { assetsUrls, assetsCode } = item;
            if (assetsUrls.length > 1) {
                const url = assetsUrls.find((it: any) => it.indexOf(assetsCode) !== -1);
                // urls.push({ url: `${window.config.previewUrl}${url}`, id: i+1, parent: i });
                urls.push(`${window.config.previewUrl}${url}`);
            } else {
                urls.push(`${window.config.previewUrl}${assetsUrls[0]}`);
                // urls.push(`${window.config.previewUrl}${assetsUrls[0]}`);
            }
        });
        loadScripts(urls, 0, function () {
            console.log('进入');
            callback();
        });
    });
}
export function dateFormat(parseDate: Date, parseStr?: string) {
    if (!parseStr) {
        parseStr = 'yyyy-MM-dd hh:mm:ss';
    }
    let currenDate = null;
    // 日期格式化方法
    function format(date: Date, fmt: string) {
        let fmt1 = fmt;
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        if (/(y+)/.test(fmt1)) {
            fmt1 = fmt1.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const k in o) {
            if (new RegExp(`(${k})`).test(fmt1)) {
                fmt1 = fmt1.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length));
            }
        }
        return fmt1;
    }
    try {
        currenDate = new Date(parseDate);
        if (currenDate instanceof Date) {
            return format(currenDate, parseStr);
        }
    } catch (e) {
        console.error(e);
        return '';
    }

    return currenDate;
}


/**
 * @description: 根据键对数组分类
 * @param  {} :
 * @return {}
 */
interface IGroupArrayByKey<T> {
    data: T[]
    key: string
}

export const groupArrayByKey = <T>({ data, key }: IGroupArrayByKey<T>): object => {
    return data.reduce((acc: any, item: any) => {
        return { ...acc, [item[key]]: [...(acc[item[key]] || []), item] };
    }, {});
};
