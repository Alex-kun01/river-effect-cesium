/*
 * @Author: wl
 * @Date: 2022-03-01
 * @LastEditTime: 2022-05-27 11:55:55
 * 创建marker公共方法
 */
/**
 * @description 判断url是否是图片
 * @param {String} str
 * @return {Boolean}
 */
const isImage = (str:string)=> {
    const reg = /\.(png|jpg|gif|jpeg)$/;
    return reg.test(str);
};

// 基础marker的接口参数约定
interface IBaseMarker{
  // 点位id
  id:string,
  // 点位名称
  name:string,
  // 点位位置
  position?:number[],
  // 图片地址
  url?:string,
  // marker是dom时的 dom节点
  ElementDom?:any,
  // 父元素id
  parentId?:string,
  // 父元素uuid
  parentUUid?:string,
  // 基于父元素的相对位置
  localPosition?:[number, number, number],
  // 创建完成回调函数
  callback?:Function,
}

/**
 * @description 创建基础的单个的marker
 * @param {IBaseMarker} args
 * @param {Object} cfg
 */
export const createBaseMarker = (args:IBaseMarker, cfg:any = {}) => {
    const {
        id, name, callback, url, parentId, parentUUid, localPosition,
        ElementDom, position
    } = args;
    const actObj:any = {};
    url && (actObj.url = url);
    ElementDom && (actObj.element = ElementDom);
    position && (actObj.position = position);
    parentId && (actObj.parent = window.uino.app.query(`#${parentId}`)[0]);
    parentUUid && (actObj.parent = window.uino.app.query(`##${parentUUid}`)[0]);
    localPosition && (actObj.localPosition = localPosition);
    window.uino.app.create({
        type: 'Marker',
        ...actObj,
        id,
        name,
        style: {
            // alwaysOnTop: true
        },
        ...cfg,
        complete: (ev: { object: any; }) => {
            callback && callback(ev.object);
        }
    });
};

interface IEarthPoint{
  // 点位id
  id:string,
  // 点位名称
  name?:string,
  // 点位经度
  lon:number,
  // 点位纬度
  lat:number
  // 地址 可以是图片地址 或者模型地址
  url:string
  // 点大小
  size?:number
  // 离地高度
  offsetHeight?:number
  // 信息窗体dom 字符串
  infoWindowDom?:string
  // 信息窗显示方式 0-None 不显示 Always一直显示  Click点击显示 MouseEnter悬浮显示
  displayMode?:string
  // 信息窗偏移位置 x,y,z
  infowindowOffset?:[number, number, number]
  // 信息窗体根据点位显示轴心位置
  infowindowPivot?:[number, number]
  // 标签文字
  labelText?:string
  // 标签文字大小
  labelSize?:number
  // 标签文字颜色
  labelColor?:string
  // 标签背景图片地址
  labelBackgroundImage?:string
  // 标签偏移位置 x,y
  labelOffset:[number, number]
  // 创建后的回调
  callback?:Function
}


// 默认参数
const EarthPointDefault = {
    size: 5,
    offsetHeight: 0,
    infoWindowDom: '',
    infowindowOffset: [0, 0, 0],
    infowindowPivot: [0.5, 0.5],
    displayMode: 'None',
    labelText: '',
    labelSize: 16,
    labelBackgroundImage: '',
    labelColor: '#333',
    labelOffset: [0, 0]
};

/**
 * @description 创建地图上的点位
 * @param {Object} params
 */
export function createPointToEarth(params:IEarthPoint) {
    const {
        name, id, url, size, lon, lat, offsetHeight,
        displayMode, infoWindowDom, labelText, labelSize,
        labelColor, labelBackgroundImage, infowindowOffset,
        infowindowPivot, labelOffset, callback
    } = { ...EarthPointDefault, ...params };
    // infowindow参数
    const ifw:any = {};
    if (infoWindowDom) {
        ifw.infoWindow = {
            type: CMAP.InfoWindowType.Custom,
            customHtml: infoWindowDom,
            displayMode: CMAP.DisplayMode[displayMode],
            offset: infowindowOffset,
            pivot: infowindowPivot
        };
    }
    if (labelText) {
        ifw.label = {
            text: labelText,
            fontSize: labelSize,
            fontColor: labelColor,
            imageUrl: labelBackgroundImage,
            imagePadding: [10, 15],
            offset: labelOffset
        };
    }
    window.uino.app.create({
        type: 'GeoPoint',
        name,
        id,
        userData: params,
        coordinates: [lon, lat],
        offsetHeight: offsetHeight || 0,
        renderer: {
            type: isImage(url)?'image':'model',
            url,
            size
        },
        ...ifw,
        complete(ev:any) {
            callback && callback(ev.object);
        }
    });
}
