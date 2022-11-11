/*
 * @Description: 地球视角设置
 * @Version: 1.0
 * @Autor: yangrong
 * @Date: 2022-05-18 14:56:57
 */
import { getMapCamList, getJsonData } from '@/baseTi/api';

interface MapMarkerParam { // 自定义气泡
  size?: number, // marker大小 默认 2
  type?: string, // 支持图片(image),模型(model),矢量(vector) 默认取basex气泡
  url?: string, // type为image代表图片资源路径,type为model代表模型资源的路径 默认使用basex气泡地址
  color?: any, // type=vector时 填充色
}
export default class mapCamInfo {
    mapSourceList:any[]
    mapName: any
    constructor(type?:string) {
        // 初始化地图瓦片列表
        this.mapSourceList = [];
        this.mapName = type;
        this.getMapSourceList();
    }

    getMapSourceList() {
        getMapCamList().then((res:any)=>{
            this.mapSourceList = res.data;
            if (this.mapSourceList) {
                this.findTypeView(this.mapName);
            }
        });
    }

    /**
   * @author yangrong
   * @param {String} name 地图瓦片的名称
   */

    // 获取不同类型地图分类视角
    findTypeView(mapName:any) {
        const nameArr = this.mapSourceList.map(item => item.name);
        window.uino.mapList = nameArr;
        // 若传的参数为default,默认使用第一个地图
        if (mapName === 'default') {
            mapName = nameArr[0];
        }
        // 若没有设置视角则使用地图资源包默认视角
        if (!mapName || nameArr.lastIndexOf(mapName) === -1) return;
        const target = this.mapSourceList.find(item => item.name === mapName);
        const final = JSON.parse(target.defaultCamInfo);
        this.changeMapView(final.position, final.target);
    }

    // 改变地球视角
    changeMapView(position:any, target:any) {
        // console.log( CMAP.Util.convertWorldToLonlat(position), target);
        uino.app.camera.earthFlyTo({
            target,
            lonlat: CMAP.Util.convertWorldToLonlat(position),
            time: 0,
            complete: () => {
                // this.getMapPoints();
            }
        });
    }

    // 获取地图点位
    async getMapPoints(code:string, el?:MapMarkerParam, cb?:Function) {
        const res:any = await getJsonData({
            '[]': {
                [code]: {
                    '@order': 'create_time-'
                }
            },
            'Twin_class': {
                '@column': 'id;data_type;bubble_info_id;things_model_uuid',
                'code': code
            },
            'Sys_bubble_info': {
                'id@': '/Twin_class/bubble_info_id',
                '@column': 'id;img;name'
            },
            'Sys_file_info': {
                'id@': '/Sys_bubble_info/img',
                '@column': 'id;file_bucket;file_object_name'
            }
        });
        if (res.ok) {
            if (res['[]']) {
                const data = res['[]'];
                const bubble = res.Sys_file_info;
                const type = res.Twin_class.data_type;
                const model = res.Twin_class.things_model_uuid;
                switch (type) {
                    case 'POINT':
                    // 创建点
                        this.getMapPointData(
                            data, 0, code, bubble, model, type, el, cb
                        );
                        break;
                    case 'SURFACE':
                        // 创建面
                        this.getMapPolygonData(
                            data, 0, code, type, bubble, el, cb
                        );
                        break;
                    case 'LINE':
                        this.getMapPolygonData(
                            data, 0, code, type, bubble, el, cb
                        );
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // 创建地图点位类型为 点
    getMapPointData(
        data:any, index:number, code:any, bubble:any, model:any, type:string, el?:MapMarkerParam, cb?:Function
    ) {
        const element = data[index];
        if (element[code].cb_data) {
            const cbData = JSON.parse(element[code].cb_data);
            if (cbData) {
                const urls = `${window.config.previewModelUrl}model/${model}/0/gltf`;
                uino.app.create({
                    type: 'GeoPoint',
                    name: 'point',
                    userData: element[code],
                    offsetHeight: cbData.gis_height,
                    id: element[code].uuid,
                    coordinates: JSON.parse(element[code].wgs84_position),
                    pivot: [0.6, 1], // 指定轴心点位置为图片x方向中点y方向最下
                    renderer: {
                        type: 'model', // type有'image','model','vector'三种
                        url: urls,
                        size: cbData.size // 对于image,vector 是一个数字 代表缩放倍数 对于model 是一个数组 代表xyz轴向的缩放比例
                    },
                    complete: () => {
                        this.loadNext(
                            data, index, code, bubble, model, type, el, cb
                        );
                        this.createMapBubble(
                            cbData, element[code], bubble, type, el, cb
                        );
                    },
                    error() {
                        if (cb) {
                            cb(false);
                        }
                    }
                });
            }
        }
    }

    // 递归加载下一个点位
    loadNext(
        data:any, index:number, code:any, bubble:any, model:any, type:string, el?:MapMarkerParam, cb?:Function
    ) {
        if (index < data.length - 1) {
            const i = index + 1;
            this.getMapPointData(
                data, i, code, bubble, model, type, el, cb
            );
        } else if (cb) {
            cb();
        }
    }

    // 创建地图点位类型为 面、线

    getMapPolygonData(
        data:any, index:number, code:any, type:string, bubble:any, el?:MapMarkerParam, cb?:Function
    ) {
        const element = data[index];
        if (element[code].cb_data) {
            const cbData = JSON.parse(element[code].cb_data);
            uino.app .create({
                type: type === 'LINE' ? 'GeoLine' :'GeoPolygon',
                name: 'GeoPolygon',
                userData: element[code],
                offsetHeight: cbData.gis_height,
                uuid: element[code].uuid,
                coordinates: JSON.parse(element[code].wgs84_position),
                pivot: [0.6, 1], // 指定轴心点位置为图片x方向中点y方向最下
                renderer: {
                    type: 'vector', // type有'image','model','vector'三种
                    color: cbData.customColor,
                    size: cbData.size // 对于image,vector 是一个数字 代表缩放倍数 对于model 是一个数组 代表xyz轴向的缩放比例
                },
                complete: () => {
                    this.loadNextPolygon(
                        data, index, code, type, bubble, el, cb
                    );
                    this.createMapBubble(
                        cbData, element[code], bubble, type, el, cb
                    );
                },
                error() {
                    if (cb) {
                        cb(false);
                    }
                }
            });
        }
    }
    // 递归创建线、面
    loadNextPolygon(
        data:any, index:number, code:any, type:any, bubble:string, el?:MapMarkerParam, cb?:Function
    ) {
        if (index < data.length - 1) {
            const i = index + 1;
            this.getMapPolygonData(
                data, i, code, type, bubble, el, cb
            );
        } else if (cb) {
            cb();
        }
    }
    // 创建地球气泡
    createMapBubble(
        bubleData:any, obj:any, bubble:any, type:string, el?:MapMarkerParam, cb?:Function
    ) {
        const lonat = JSON.parse(obj.wgs84_position);
        if (el?.url) console.error('请传入对应模型地址或者图片地址');
        const urls = window.config.previewUrl + `${bubble.file_bucket}`+ '/' + `${bubble.file_object_name}`;
        uino.app.create({
            type: 'GeoPoint',
            name: 'marker',
            id: obj.uuid,
            offsetHeight: bubleData.gis_height,
            coordinates: type === 'POINT' ? lonat : lonat[0],
            pivot: [0.6, 1], // 指定轴心点位置为图片x方向中点y方向最下
            renderer: {
                type: el?.type === 'vector' ? 'vector' : el?.type === 'model' ? 'model': 'image', // type有'image','model','vector'三种
                url: el?.type === 'model' ? el.url : urls,
                size: el?.size ? el?.size : 2,
                color: el?.type === 'vector' ? el?.color : null
            },
            complete: () => {
                if (cb) {
                    cb();
                }
            }
        });
    }
}

