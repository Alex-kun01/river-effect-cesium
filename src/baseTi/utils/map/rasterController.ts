/*
 * @Description:创建光栅
 * @Version: 1.0
 * @Autor: lxy
 * @Date: 2022-06-01 11:07:49
 */
type rasterOpts = {
    // 光栅id
    id:string
    // 坐标集合
    coordinates:[number, number][]
    // 贴图类型
    type?:string,
    // 光栅名称
    name?:string
    // 拉伸高度
    extrudeHeight?:number
    // 离地高度
    offsetHeight?:number
    // 贴图的地址 实际使用传入数组无效
    imageUrl:string
    // 贴图流速 [x方向流速，y方向流速]
    imageSpeed?:[number, number]
    // 透明贴图流速 [x方向流速，y方向流速]
    alphaImageSpeed?:[number, number]
    // 透明贴图的地址
    alphaImageUrl?:string
    // 光栅颜色 会覆盖图片原本颜色
    color?:string | number |[number, number, number]
    // 光栅透明度
    opacity?:number

    // 横纵贴图次数
    uvRatio?:[number, number]
    // 创建完成回调 ev为当前光栅对象
    finishCallback?:(ev:any)=>void
}
const defaultOpts:rasterOpts = {
    id: 'raster',
    type: 'vertical',
    color: [255, 255, 255],
    extrudeHeight: 500,
    offsetHeight: 0,
    coordinates: [],
    imageUrl: '',
    imageSpeed: [0, 0],
    alphaImageSpeed: [0, 0],
    uvRatio: [1, 1],
    opacity: 1
};
export default class RasterController {
    opts:rasterOpts = defaultOpts
    // 光栅实例集合
    rasterCollections:any
    // 存放光栅图层实例
    rasterLayers:any
    constructor(opts?:rasterOpts) {
        this.opts = { ...this.opts, ...opts };
        this.rasterCollections = {};
        this.rasterLayers = null;
        this.createRasterLayer();
        opts && this.createByCmap(this.opts);
    }

    createRasterLayer() {
        this.rasterLayers = uino.app.create({
            type: 'ThingLayer',
            name: 'RasterLayers'
        });
        uino.map.addLayer(this.rasterLayers);
    }

    /**
     * @description 创建光栅
     */

    createByCmap(opts:rasterOpts) {
        const {
            id, imageUrl, coordinates, extrudeHeight, type, color, alphaImageUrl, imageSpeed, alphaImageSpeed,
            offsetHeight, finishCallback
        } = { ...defaultOpts, ...opts };

        const instance = CMAP.Util._createGeoBoundary({
            coordinates,
            // uuid: `Raster_instance_${id}`,
            // name: 'Raster_instance_Object',
            type,
            extrudeHeight,
            offsetHeight,
            scrollSpeed: imageSpeed, // 墙贴图流动速度
            color,
            blending: false, // 是否混色
            alpha: 10,
            wallImage: imageUrl, // 墙贴图
            alphaImage: alphaImageUrl, // 透明图 竖栅
            alphaSpeed: alphaImageSpeed, // 透明图流动速度
            isBoundary: true,
            uvRatio: [1, 5], // 属性无效
            LineCount: 6
            // userData: { // userData不支持
            //     id: `Raster_instance_${id}`,
            //     name: 'Raster_instance_Object'
            // }
        });
        this.rasterLayers.add(instance);
        this.rasterCollections[`Raster_instance_${id}`] = instance;
        finishCallback && finishCallback(instance);
    }

    /**
     * 通过GeoBoundary创建
     *
    */

    create(opts:rasterOpts) {
        const {
            id, imageUrl, coordinates, extrudeHeight, offsetHeight, color, opacity, imageSpeed, alphaImageUrl, uvRatio, finishCallback
        } = opts;
        let colorOpt = {};
        if (color) {
            colorOpt = {
                color,
                useColor: true
            };
        }
        const instance = uino.app.create({
            type: 'GeoBoundary',
            coordinates,
            extrudeHeight,
            offsetHeight,
            renderer: {
                opacity, // 透明度
                imageUrl, // 贴图路径 数组无效
                speed: imageSpeed, // 贴图流速(x,y方向)
                blending: false, // 是否混色
                uvRatio,
                alphaImageUrl, // 透明图路径 设置无效
                useAlphaMap: true,
                alphaSpeed: [1, 1], // 透明图流速(x,y方向) 设置无效
                ...colorOpt
            },
            complete(ev) {
                finishCallback && finishCallback(ev);
            },
            userData: {
                id: `Raster_instance_${id}`,
                name: 'Raster_instance_Object'
            }
        });
        this.rasterCollections[`Raster_instance_${id}`] = instance;
    }

    /**
     * @description 销毁单个光栅
     */

    destroyById(id:string) {
        if (JSON.stringify(this.rasterCollections) !== '{}') {
            this.rasterCollections[`Raster_instance_${id}`].destroy();
            Reflect.deleteProperty(this.rasterCollections, `Raster_instance_${id}`);
        }
        // uino.app.query(`[userData/id===Raster_instance_${id}]`)[0]?.destroy();
    }

    /**
     * @description 销毁所有光栅
     */
    destroyAll() {
        Object.keys(this.rasterCollections).forEach(key=>{
            this.rasterCollections[key].destroy();
            Reflect.deleteProperty(this.rasterCollections, key);
        });
        // if (this.rasterLayers) {
        //     this.rasterLayers.children.forEach((ele:any) => {
        //         ele.destroy();
        //     });
        // }
    }
}
