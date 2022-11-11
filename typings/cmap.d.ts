/**
 * [ThingJS 文档中心](http://192.168.1.238:8080/CMAP.html)
 */

declare namespace CMAP {
  /** 获取Uearth版本信息 */
  const VERSION: string;

  /**
   * 相机根据时间和角度旋转(自身旋转)
   * @param param Properties
   * @example
   * ```
   * //摄影机在10秒钟转360度
   * app.camera.earthCameraRotateByTime({
   *   time:10000,
   *   angle:360,
   *   complete:function(){
   *     THING.Utils.log('earthCameraRotateByTimeFinished');
   * });
   * ```
   */
  function earthCameraRotateByTime(param: {
    /** 旋转角度 */
    angle?: number;
    /** 旋转总时间 */
    time?: number;
    /** 是否顺时针 默认true 如果是false则逆时针旋转 */
    clockwise?: boolean;
    /** 回调函数 */
    complete?: Function;
    [propName: string]: any;
  }): void;

  /**
   * 地球上根据目标点 时间 旋转角度绕点旋转
   * @param param 旋转参数
   * @example
   * ```
   * //摄影机绕目的地旋转 速度为1 停止旋转请使用app.camera.stopEarthFly();
   * /app.camera.earthFlyRotateBySpeed({
   * /  target:[2226621.946229113, 4056906.8892574753, 4388911.615628255],
   * /  speed:1,
   * /  complete: function () {
   * /    THING.Utils.log('earthFlyRotateBySpeedFinished');
   * /  }
   * /});
   * ```
   */
  function earthFlyRotateBySpeed(param: {
    /** 旋转速度 */
    speed?: number;
    /** 目标点世界坐标 */
    target?: Array<number>;
    /** 要旋转的角度 */
    angle?: number;
    /** 是否关闭pick 默认true */
    disablePick?: boolean;
    /** 回调函数 */
    complete?: Function;
    [propName: string]: any;
  }): void;

  /**
   * 地球上根据目标点 时间 旋转角度绕点旋转
   * @param param 旋转参数
   * @example
   * ```
   * //摄影机绕目的地旋转 10秒钟旋转360度 旋转完毕后会停止
   * app.camera.earthFlyRotateByTime({
   *   target:[2226621.946229113, 4056906.8892574753, 4388911.615628255],
   *   time:10000,
   *   angle:360,
   *   complete: function () {
   *     THING.Utils.log('earthFlyRotateByTimeFinished');
   *   }
   * });
   * ```
   */
  function earthFlyRotateByTime(param: {
    /** 旋转速度 */
    speed?: number;
    /** 目标点世界坐标 */
    target?: Array<number>;
    /** 要旋转的角度 */
    angle?: number;
    /** 旋转总时间 单位 毫秒 */
    time?: number;
    /** 是否关闭pick 默认true */
    disablePick?: boolean;
    /** 是否顺时针 默认true 如果是false则逆时针旋转 */
    clockwise?: boolean;
    /** 回调函数 */
    complete?: Function;
    [propName: string]: any;
  }): void;

  /**
   * 地球上的飞
   * @param param 参数列表
   * @example
   * ```
   * //飞到指定位置
   * app.camera.earthFlyTo({
   *   time: 3000,
   *   lonlat: [116.39, 39.96],
   *   height: 5000,
   *   heading: 90,
   *   pitch: 45,
   *   complete: function () {
   *     THING.Utils.log('earth fly finished');
   *   }
   * });
   * //飞到物体
   * let geoPolygon = app.query('.GeoPolygon')[0];
   * app.camera.earthFlyTo({
   *   time: 3000,
   *   object: geoPolygon,
   *   complete: function () {
   *     THING.Utils.log('earth fly finished');
   *   }
   * });
   * ```
   */
  function earthFlyTo(param: {
    /** 旋转总时间 单位 毫秒 */
    time?: number;
    /** 飞到对象 如果传入param,object 则param.lonlat失效 */
    object?: object;
    /** 水平角(方位角) 单位度 */
    heading?: number;
    /** 垂直角(俯仰角) 单位度 */
    pitch?: number;
    /** 要飞到的目标点的经纬度 */
    lonlat?: Array<number>;
    /** 是否关闭pick 默认true */
    disablePick?: boolean;
    /** 摄影机离地高度 */
    height?: number;
    /** 是否沿着直线飞行，不优化路线(可能穿地球而过) 默认false */
    directFly?: number;
    /** 回调函数 */
    complete?: Function;
    [propName: string]: any;
  }): void;

  /**
   * 获取当前map对象
   */
  function getCurrentMap(): CMAP.Map;

  /**
   * 停止地球上的飞行和旋转动作 停止后会自动恢复飞行或旋转前的pick状态
   * @example
   * ```
   * //停止地球上的飞行和旋转动作
   * app.camera.stopEarthFly();
   * ```
   */
  function stopEarthFly(): void;

  /** BigPointLayer 海量点图层的样式 */
  interface BigPointLayerRenderer {
    /** 是否混色 默认false */
    blending: boolean;
    /** 是否开启发光特效 默认false */
    effect: boolean;
    /** effect为true时 设置glowStrength可调节发光强度 默认0.5 */
    glowStrength: number;
    /** 是否开启向上发光特效 默认false */
    postRadialBlur: boolean;
    /** 'image' 使用贴图渲染 'vector'使用矢量渲染 可参考GeoPointRenderer */
    type: string;
    /** type为image代表图片资源路径 */
    url: string;
    /** 图片或矢量的大小 单位像素 默认值10 */
    size: number;
    /**
     * type=vector时 矢量图标的形状，目前有circle(圆形),triangle(三角形),rectangle(正方形),cross(十字
     */
    vectorType: string;
    /** type=vector时 填充色 */
    color: string | Array<any> | number;
    /** type=vector时 边框颜色 如果vectorType为cross 设置该参数代表十字的颜色 */
    lineColor: string | Array<any> | number;
    /** type=vector时 边框不透明度 */
    lineOpacity: boolean;
    /**
     * type=vector时 边框宽度 如果vectorType为cross 设置该参数代表十字的整体尺寸
     */
    lineWidth: number;
    /**
     * 海量点图层范围上的一张黑白图 该图会和海量点进行透明度叠加 黑色代表透明 白色代表不透明
     */
    uvMapUrl: string;
    /** 黑白图滚动速度 默认0 */
    speed: number;
    /** 黑白图滚动循环方式 默认为THING.LoopType.None */
    loopType: string;
  }

  /**
   * BaseLayerCollection 底图图层的集合
   * @see [文档](http://192.168.1.238:8080/CMAP.BaseLayerCollection.html)
   */
  class BaseLayerCollection extends CMAP.LayerCollection {
      /**
     * 重写add方法,添加一个TileLayer对象实例到Selector中
     * @param obj 要添加的图层
     * @param index 添加的位置 在baseLayerCollection中,位置越靠后,图层越靠上 如果不填默认填在最后 index从0开始
     * @override CMAP.LayerCollection#add
     * @example
     * ```
     * map.baseLayers.add(tileLayer);//tileLayer是一个TileLayer实例 要在地图上添加该图层到最上层
     * ```
     */
      add(obj: CMAP.TileLayer, index: number): void;

      /**
     * 移除单个图层
     * @param obj 需要删除的图层。可以是对象(obj传TileLayer对象实例),也可以是图层在BaseLayerCollection中的index(obj传Number)
     * @override CMAP.LayerCollection#remove
     * @example
     * ```
     * map.baseLayers.remove(tileLayer);//tileLayer是一个TileLayer实例 要在地图上移除该图层
     * ```
     */
      remove(obj: CMAP.TileLayer | number): void;
  }

  /**
   * @see [文档](http://192.168.1.238:8080/CMAP.BaseRenderer.html)
   */
  class BaseRenderer {}

  /**
   * 大数据楼图层
   * @see [文档](http://192.168.1.238:8080/CMAP.BigBuildingLayer.html)
   */
  class BigBuildingLayer extends CMAP.BigDataLayer {
      /**
     * 构造函数
     * @param param 参数列表
     * @example
     * ```
     * //该类图层的创建方式和type为GeoBuilding的FeatureLayer类似,但暂时不支持更新样式也无法获取每一个单个的GeoBuilding,适合用作背景图层
     * var bigBuildingLayer = app.create({
     *   type: 'BigBuildingLayer',
     *   dataSource: data, //一个geojson格式的对象
     *   renderer: {
     *       'color': [255, 0, 0],
     *       'opacity': 1,
     *       'type': 'image',
     *       'extrudeField': 'HEIGHT',
     *       'extrudeFactor': 5,
     *       'offsetHeight':100, //离地高度
     *       'offsetHeightField':'height' //离地高度字段 优先级低于offsetHeight
     *       'imageUrl': [{
     *           'condition': '[HEIGHT>20]',
     *           'value': ['uGeo/building.png', 'uGeo/building1.png']
     *       },
     *       {
     *           'condition': '',
     *           'value': ['uGeo/building_top.png', 'uGeo/building1.png']
     *       }
     *       ]
     *     }
     * });
     * ```
     */
      constructor(param: {
      /** 固定值 'BigBuildingLayer' */
      type: 'BigBuildingLayer';
      /** 高度放大倍数,与extrudeField配合使用，默认是1,设置height的时候不会 */
      extrudeFactor?: number;
      /** 高度属性字段读取该字段 */
      extrudeField?: string;
      /** 离地高度 */
      offsetHeight?: number;
      /** 离地高度字段 优先级低于offsetHeight */
      offsetHeightField?: string;
      /** 离地高度字段添加值 在offsetHeightField对应的值基础上再加一个数 */
      offsetHeightFieldAdded?: string;
      /** 建筑的渲染样式 */
      renderer?: object;
      /** 数据源 目前只支持geojson */
      dataSource?: object;
    });
  }

  /**
   * 大数据线图层
   * @see [文档](http://192.168.1.238:8080/CMAP.BigLineLayer.html)
   */
  class BigLineLayer extends CMAP.BigDataLayer {
      /**
     * 构造函数
     * @param param 参数列表
     * @example
     * ```
     * ////该类图层的创建方式和type为GeoLine的FeatureLayer类似,但暂时不支持更新样式也无法获取每一个单个的GeoLine,适合用作背景图层
     * var bigLineLayer = app.create({
     *   type: 'BigLineLayer',
     *   dataSource: data, //一个geojson格式的对象
     *   'imageUrl': [
     *       {
     *           'condition': '[highway=primary]',
     *           'value': 'uGeo/path.png'
     *       },
     *       {
     *           'condition': '[highway=trunk]',
     *           'value': 'uGeo/building1.png'
     *       },
     *       {
     *           'condition': '',
     *           'value': 'uGeo/building_top.png'
     *       }],
     *   'opacity': 1,
     *   'type': 'image',
     *   'lineType': 'Plane',
     *   'numPass': 1,
     *   'effect': false,
     *   'width': 1,
     *   'speed': 0.5
     * });
     * ```
     */
      constructor(param: {
      /** 固定值 'BigLineLayer' */
      type?: 'BigLineLayer';
      /** 如果需要话高低起伏的线 可以设置每个点对应的高度 例如：[200,100,200] */
      heightArray?: number[];
      /** 离地高度 */
      offsetHeight?: number;
      /** 线的渲染样式 */
      renderer?: object;
      /** 数据源 目前只支持geojson */
      dataSource?: object;
    });
  }

  /**
   * 大数据点图层
   * @see [文档](http://192.168.1.238:8080/CMAP.BigPointLayer.html)
   */
  class BigPointLayer extends CMAP.BigDataLayer {
      /**
     * 构造函数
     * @param param 参数列表
     * @example
     * ```
     * ////该类图层的创建方式和type为GeoPoint的FeatureLayer类似,但暂时不支持更新样式也无法获取每一个单个的GeoPoint,适合用作背景图层
     * var bigPointLayer = app.create({
     *   type: 'BigPointLayer',
     *   dataSource: data, //一个geojson格式的对象
     *   renderer:{
     *     color: [0, 100, 255],
     *     opacity: 0.5,
     *     type: 'vector',
     *     size:3,
     *     vectorType:'circle',
     *     lineColor:[255,0,0],
     *     lineOpacity:1
     *   },
     *   offsetHeight:100, //抬高
     *   offsetHeightField:'height' //抬高字段 优先级低于offsetHeight
     * });
     * ```
     */
      constructor(param: {
      /** 固定值 'BigPointLayer' */
      type?: 'BigPointLayer';
      /** 离地高度 */
      offsetHeight?: number;
      /** 离地高度字段 优先级低于offsetHeight */
      offsetHeightField?: string;
      /** 建筑的渲染样式 */
      renderer?: BigPointLayerRenderer;
      /** 数据源 目前只支持geojson */
      dataSource?: object;
    });
  }

  /**
   * EarthCompass 指北针控件
   * @see [文档](http://192.168.1.238:8080/CMAP.EarthCompass.html)
   */
  class EarthCompass extends THING.CompassControl {
      /**
     * 构造函数
     * @param param 参数列表
     * @example
     * ```
     * // 添加指南针控件 使用3d内元素创建
     * var compass = app.addControl(new THING.EarthCompass({
     *     'image': 'https://speech.uinnova.com/static/images/compass.png',
     *     'offset': [50, 50],//选填 偏移值 x y  默认值 25
     *     'position': THING.CornerType.RightTop //选填 默认值 RightBottom
     *   })
     * );
     *
     * function create_html() {
     *       var html
     *           = `<div id='earthCompass' style="position: absolute;top: 50px;right: 50px;z-index: 10;">
     *               <image src='https://www.thingjs.com/uearth/res/compass.png' width=50 height=50></image>
     *       </div>`;
     *       return $(html)[0];
     *   }
     * var elem = create_html();
     *
     * // 添加指南针控件 使用dom元素创建 指北针不在3d内
     * app.addControl(new THING.EarthCompass({
     *       useElement: true,
     *       element: elem,
     *       rotateToNorthSpeed: 0.5
     *   })
     * );
     * ```
     */
      constructor(param: {
      /**
       * 是否使用dom元素实现指北针 默认false dom元素中可自定义指北针图片以及位置 如果不传该参数或者传false 则需指定image offset position
       */
      useElement?: boolean;
      /** 使用的dom元素 */
      element?: HTMLElement;
      /** 指北针复位的速度 点击指北针时会恢复指北 */
      rotateToNorthSpeed?: number;
      /** 使用的指北针图片的url useElement为true时无效 */
      image?: string;
      /** 位置偏移 useElement为true时无效 */
      offset?: Array<any>;
      /**
       * 初始化位置 THING.CornerType.RightTop、THING.CornerType.RightBottom、THING.CornerType.LeftTop、THING.CornerType.LeftBottom useElement为true时无效
       */
      position?: number;
    });
  }

  /**
   * @see [文档](http://192.168.1.238:8080/CMAP.FeatureLayer.html)
   */
  class FeatureLayer extends CMAP.Layer {
      /**
     * 构造函数
     * @param param 参数列表
     * @example
     * ```
     * var pointLayer = app.create({
     *   type: 'FeatureLayer',
     *   name: 'pointLayer',
     *   renderOrder: 1,
     *   dataSource:{
     *         "type": "FeatureCollection",
     *         "features": [{
     *             "type": "Feature",
     *             "properties": {
     *               "type": "rain",
     *               "value": 5
     *             },
     *             "geometry": {
     *               "type": "Point",
     *               "coordinates": [-73.99995803833008, 40.71805432623303]
     *             }
     *           }, {
     *             "type": "Feature",
     *             "properties": {
     *               "type": "water",
     *               "value": 7
     *             },
     *             "geometry": {
     *               "type": "Point",
     *               "coordinates": [-73.98167610168457, 40.726087955120704]
     *             }
     *           }]
     *         },
     *   geometryType:'GeoPoint',
     *   renderer:{
     *     type: 'image',
     *     url:'image/uGeo/pop.png',
     *     size:20
     *   }
     * });
     * map.userLayers.add(pointLayer);
     * ```
     */
      constructor(param: {
      /**
       * 拔起的高度 适用于GeoPolygon和GeoBuilding 单位米
       */
      extrudeHeight?: number;
      /** 离地高度 单位米 */
      offsetHeight?: number;
      /**
       * 离地高度字段 代表从该对象的属性中读取该字段的值作为离地高度 优先级低于offsetHeight
       */
      offsetHeightField?: string;
      /** 高度拉伸倍数 适用于GeoPolygon和GeoBuilding */
      extrudeFactor?: number;
      /** 高度属性字段 适用于GeoPolygon和GeoBuilding */
      extrudeField?: string;
      /** 渲染优先级，默认为0 */
      renderOrder?: number;
      /** 数据类型 目前支持 GeoPoint GeoLine GeoPolygon GeoHeatMap和GeoBuilding */
      geometryType?: string;
      /** 各类型样式 详情见对应的实例的renderer */
      renderer?: object;
      /**
       * 设置显示级别,[最小级别,最大级别]或者是[最小级别],该图层在这个级别范围内才显示 目前只支持初始化时设置
       */
      visibleLevel?: Array<any>;
      /** 图层内对象弹窗信息 */
      infoWindow?: CMAP.InfoWindow;
      /** 图层标注信息 */
      label?: CMAP.Label;
      /** 位置偏移 useElement为true时无效 */
      offset?: Array<any>;
      /**
       * 轴心点位置 适用于GeoPoint
       */
      pivot?: number[];
      /** 数据，目前只支持geojson */
      dataSource?: object;
    });

    /**
     * 数据源，目前只支持geojson格式的对象 设置dataSource属性会重置featureLayer的renderer
     * @example
     * ```
     * featureLayer.dataSource =
     * {
     *   "type": "FeatureCollection",
     *   "features": [{
     *     "type": "Feature",
     *     "properties": {
     *       "type": "rain",
     *       "value": 5
     *     },
     *     "geometry": {
     *       "type": "Point",
     *       "coordinates": [-73.99995803833008, 40.71805432623303]
     *     }
     *   }, {
     *     "type": "Feature",
     *     "properties": {
     *       "type": "water",
     *       "value": 7
     *     },
     *     "geometry": {
     *       "type": "Point",
     *       "coordinates": [-73.98167610168457, 40.726087955120704]
     *     }
     *   }]
     * };
     * ```
     */
    dataSource: object;

    /**
     * 高度拉伸倍数
     * @example
     * ```
     * featureLayer.extrudeFactor = 2; //设置高度放大倍数
     * ```
     */
    extrudeFactor: number;

    /**
     * 高度属性字段
     * @example
     * ```
     * featureLayer.extrudeField = 'height'; //设置高度属性字段，该字段可在每一个对象的userData中找到
     * ```
     */
    extrudeField: string;

    /**
     * 设置FeatureLayer中各对象的拔起高度
     */
    extrudeHeight: number;

    /**
     * 设置FeatureLayer中各对象拔起高度
     * @deprecated
     */
    height: number;

    /**
     * 图层的弹窗信息
     * @example
     * ```
     * //不支持featureLayer.infoWindow = infoWindow这种修改方式
     * //通过这种方式来修改featureLayer中infoWindow的title属性
     * featureLayer.infoWindow.title = '标题';
     * ```
     */
    readonly infoWindow: CMAP.InfoWindow;

    /**
     * 图层的标注信息
     * @example
     * ```
     * //不支持featureLayer.label = label这种修改方式
     * //通过这种方式来修改featureLayer中label的fontSize属性
     * featureLayer.label.fontSize = 12;
     * ```
     */
    readonly label: CMAP.Label;

    /**
     * 设置FeatureLayer中各对象的离地高度字段
     * @example
     * ```
     * featureLayer.offsetHeightField = 50; //设置离地高度字段
     * ```
     */
    offsetHeightAdded: number;

    /**
     * 设置FeatureLayer中各对象的离地高度字段
     * @example
     * ```
     * featureLayer.offsetHeightField = 50; //设置离地高度字段
     * ```
     */
    offsetHeightField: number;

    /**
     * 图层的渲染样式 目前FeatureLayer的renderer可以支持条件分类，但是如果对renderer进行修改，仅支持整体修改暂不支持分类修改
     * @example
     * ```
     * //不支持featureLayer.renderer = renderer这种修改方式
     * //通过这种方式来修改featureLayer中renderer的color属性 这样会影响featureLayer中所有     * 对象的颜色
     * //如果想单独修改某一个地理对象的样式，可以通过featureLayer.objects[0].renderer.     * color = [1,0,0]这种方式修改
     * //对于FeatureLayer来说 如果为FeatureLayer设置样式，会冲掉featureLayer中个体的样式
     * //调用featureLayer.dataSource = xxx;也会重新设置featureLayer的renderer
     * featureLayer.renderer.color = 'rgb(255,0,0)';
     * ```
     */
    readonly renderer: object;

    /**
     * 设置/获取渲染排序值, 数值越小越先渲染，默认值为 0
     * @example
     * ```
     * featureLayer.renderOrder = 5;//设置图层渲染顺序为5
     * ```
     */
    renderOrder: number;

    /**
     * 显示为True,不显示为False
     */
    visible: boolean;

    /**
     * 根据配置项与对象的属性得到符合条件的配置项 ignore
     * @param config 配置项
     * @param attribute 对象属性
     */
    _getValueByCnd(config: object, attribute: object): void;

    /**
     * 添加对象到FeatureLayer,要添加的feature类型必须和FeatureLayer的geometryType一致 添加后dataSource属性不变
     * @param obj 要添加到图层中的对象(GeoPoint,GeoLine,GeoBuilding,GeoPolygon等)
     */
    add(obj: object): void;

    /**
     * 移除Layer中指定的对象 移除后dataSource属性不变
     * @param obj 图层中的对象
     */
    remove(obj: object): void;

    /**
     * 移除layer下的所有对象 移除后dataSource属性不变
     */
    removeAll(): void;

    /**
     * 设置图层渲染样式 这里是整体修改FeatureLayer的样式,如果单独修改某一项,应该使用featureLayer.renderer.xxx=xxx;的方式
     * @param renderItem 图层整体的样式
     * @example
     * ```
     * featureLayer.updateRenderer({
     *   'opacity':1,
     *   'type':'image',
     *   'lineType':'Plane',
     *   'imageUrl':'uGeo/path.png',
     *   'color':[53,77,135,0.27],
     *   'numPass':1,
     *   'effect':true,
     *   'width':5,
     *   'speed':1,
     * });
     * ```
     */
    updateRenderer(renderItem: object): void;
  }

  /**
   * 根据底面和高度拔起的体 一般用于建筑
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoBuilding.html)
   */
  class GeoBuilding extends CMAP.GeoObject {
      /**
     * 构造函数
     * @param param 参数列表
     * @example
     * ```
     * var building = app.create({
     *   type: 'GeoBuilding',
     *   name: 'building0',
     *   coordinates: [ [ [ 116.475707918713994, 39.985123335043497 ], [ 116.475578689721999, 39.985213387812998 ], [ 116.476117035505993, 39.9857163435491 ], [ 116.476246265707005, 39.985626292466002 ], [ 116.475707918713994, 39.985123335043497 ] ] ],
     *   userData: {area:20,address:'北京市朝阳区花家地南街14号',height:18},
     *   extrudeHeight :20,//拔起高度 单位米
     *   label: {
     *       text: '{{address}}', //使用cityName字段的值进行标注
     *       offset: [0, 30],
     *       fontColor: [255, 0, 0],
     *       fontSize: 20
     *   },
     *   renderer: {
     *     extrudeField:'height',//高度字段,在userData中找该字段作为高度，这个高度值的优先级低于设置height
     *     extrudeFactor:1,//高度放大倍数,与extrudeField配合使用，默认是1,设置height的时候不会读取该字段
     *     imageUrl: ['./uGeo/building.png','./uGeo/building1.png'],//贴图url,是一个数组,如果数组长度是1,则整体贴一张图,如果数组长度是2,则第一个url是顶面贴图,第二个url是侧面贴图
     *     blending:false 贴图是否叠加 //贴图叠加时,楼宇的会变得亮一些，因为在相同像素点上如果有多层贴图会进行叠加。
     *   }
     * });
     * ```
     */
      constructor(param: {
      /** 类型'GeoBuilding' */
      type?: 'GeoBuilding';
      /** 楼名称 */
      name?: string;
      /**
       * 楼数据例如：[[116.4408957710001, 39.96151952200006],[116.4408957710001, 39.96151952200006]]
       */
      coordinates?: Array<number[]>;
      /**
       * 楼拔起的高度 单位:米
       */
      extrudeHeight?: number;
      /** 楼属性数据 */
      userData?: object;
      /**
       * 高度放大倍数,与extrudeField配合使用，默认是1,优先级低于extrudeHeight
       */
      extrudeFactor?: number;
      /** 高度属性字段 在userData中找该字段作为高度,优先级低于extrudeHeight */
      extrudeField?: string;
      /**
       * 离地高度字段 代表从该对象的属性中读取该字段的值作为离地高度 优先级低于offsetHeight
       */
      offsetHeightField?: string;
      /** 图层内对象弹窗信息 */
      infoWindow?: CMAP.InfoWindow;
      /** 图层标注信息 */
      label?: CMAP.Label;
      /**
       * 设置楼宇样式,目前仅支持在楼宇初始化的时候设置
       * 来自 CMAP.GeoBuildingRenderer
       */
      renderer?: object;
    });

    /**
     * 高度拉伸倍数
     * @example
     * ```
     * geoBuilding.extrudeFactor = 2; //设置楼高度放大倍数
     * ```
     */
    extrudeFactor: number;

    /**
     * 高度属性字段
     * @example
     * ```
     * geoBuilding.extrudeField = 'height'; //设置楼的高度属性字段，需确保geoBuilding.userData中包含该字段
     * ```
     */
    extrudeField: string;

    /**
     * 拉伸高度(非离地高度) 单位：米
     * @example
     * ```
     * geoBuilding.extrudeHeight = 100;//设置建筑高度为100米
     * ```
     */
    extrudeHeight: number;

    /**
     * 拉伸高度(非离地高度) 单位：米
     * @deprecated
     */
    height: number;

    /**
     * GeoBuilding的弹窗
     */
    readonly infoWindow: CMAP.InfoWindow;
  }

  /**
   *  GeoBuilding样式类
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoBuildingRenderer.html)
   */
  class GeoBuildingRenderer {
      /**
     * @param geoBuilding 要渲染的GeoBuilding实例
     * @param param 参数列表
     */
      constructor(
      geoBuilding: CMAP.GeoBuilding,
      param: {
        /** GeoBuilding的渲染类型 支持vector,image 默认为vector */
        type?: string;
        /** 当type=vector时生效 填充颜色 默认白色 */
        color?: string | Array<any> | number;
        /** 填充不透明度 默认1 */
        opacity?: number;
        /** 当type=image时生效 贴图路径 */
        imageUrl?: Array<any> | string;
        /**
         * 当type=image时生效 贴图循环方式 CMAP.TextureWrapMode.Stretch 拉伸，CMAP.TextureWrapMode.RepeatY 高度方向平铺 CMAP.TextureWrapMode.Repeat 水平和高度方向均平铺 默认CMAP.TextureWrapMode.RepeatY
         */
        textureWrap?: string;
        /**
         * 当type=image且textureWrap为RepeatY或Repeat时生效 代表纹理尺寸 数组的每一个值必须大于0 单位:米 GeoBuilding的默认值是[3,3] GeoPolygon的默认值是多边形区域外包矩形的长和宽(基于WebMercator投影计算)
         */
        textureSize?: any[];
        /** 是否混合 默认不开启 */
        blending?: boolean;
        /**
         * 是否接受光照 type为vector默认是true type为image默认是false type为cool为true切不可修改
         */
        lights?: boolean;
        /** 是否开启窗户效果 type为cool默认true 其他默认false */
        useWindow?: boolean;
        /** 窗户贴图的url */
        windowImageUrl?: string;
        /** 窗户颜色 默认白色 */
        windowColor?: string;
        /** 纹理环绕方式 around--环绕 normal--随贴图 */
        windowTextureWrap?: string;
        /**
         * 窗户纹理尺寸 仅windowTextureWrap为around时生效 数组的每一个值必须大于0 默认值[300,300]
         */
        windowTextureSize?: any[];
        /** 当type=cool时生效 设置窗户贴图的偏移值 array[0]代表x轴偏移，array[1]代表y轴偏移 */
        offset?: any[];
        /**
         * 当type=cool时生效 设置窗户贴图的重复度 array[0]代表x轴重复度，array[1]代表y轴重复度
         */
        repeat?: any[];
      }
    );

    /**
     * 是否混合
     * @example
     * ```
     * geoBuilding.renderer.blending = true;
     * ```
     */
    blending: boolean;

    /**
     * 设置楼宇填充色 在type为vector时生效
     * @example
     * ```
     * geoBuilding.renderer.type = 'vector';//设置楼的渲染类型为vector(纯色)
     * geoBuilding.renderer.color = 'rgb(255,0,0)'; //将颜色设置为红色
     */
    color: string | Array<any> | number;

    /**
     * 高度拉伸倍数
     * @deprecated 推荐使用geoBuilding.extrudeFactor
     */
    extrudeFactor: number;

    /**
     * 高度属性字段
     * @deprecated 推荐使用geoBuilding.extrudeField
     */
    extrudeField: string;

    /**
     * 贴图url 包括顶部的贴图和侧面的贴图 数组第一个代表顶部贴图，第二个代表侧面贴图 如果不区分顶部和侧面，数组中就只有一个元素
     * @example
     * ```
     * //设置楼顶部的贴图和侧面的贴图，第一个代表顶部贴图路径，第二个代表侧面的贴图路径
     * geoBuilding.renderer.type = 'image';//设置楼的渲染类型为image(贴图)
     * geoBuilding.renderer.imageUrl = ['./temp/image1.png','./temp/image1.png'];
     * ```
     */
    imageUrl: string[] | string;

    /**
     * @example
     * ```
     * building.renderer.lights = true;
     * ```
     */
    lights: boolean;

    /**
     * 填充色不透明度 仅在type为vector情况下生效
     * @example
     * ```
     * geoItem.renderer.opacity = 1; //将不透明度设置为1
     * ```
     */
    opacity: number;

    /**
     * 设置高光强度 [顶面,侧面]
     * @example
     * ```
     * geoBuilding.renderer.specularFactor = [1,1];
     * ```
     */
    specularFactor: number[];

    /**
     * 纹理尺寸单位米 如果是GeoBuilding，侧面贴图时会根据纹理尺寸去计算uv 在textureWrap为repeatY时 设置数组第二个参数生效 第一个参数无效 如果是GeoPolygon，顶面贴图时会根据纹理尺寸去计算uv
     * @example
     * ```
     * geoObject.renderer.textureSize = [3,3];  // 设置贴图纹理尺寸为3*3m
     * ```
     */
    textureSize: number[];

    /**
     * 设置贴图循环方式，仅对GeoBuilding生效 CMAP.TextureWrapMode.Stretch 拉伸，CMAP.TextureWrapMode.RepeatY 高度方向平铺 CMAP.TextureWrapMode.Repeat 水平和高度方向均平铺
     * @example
     * ```
     * geoBuilding.renderer.textureWrap = CMAP.TextureWrapMode.RepeatY;
     * ```
     */
    textureWrap: string;

    /**
     * 设置楼宇材质类型 vector或image
     * @example
     * ```
     * geoBuilding.renderer.type = 'image'; //设置楼的渲染类型为image(贴图) 设置该属性后需要设置imageUrl
     * geoBuilding.renderer.type = 'vector'; //设置楼的渲染类型为vector(纯色) 设置该属性后需要设置color
     * ```
     */
    type: string;

    /**
     * 是否使用窗体效果
     */
    useWindow: boolean;

    /**
     * type为image时生效 代表贴图在x和y方向的重复次数
     */
    uvRatio: number[];
  }

  /**
   *  GeoDiffusion样式类
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoDiffusionRenderer.html)
   */
  class GeoDiffusionRenderer {
      /**
     * @param geoBuilding 要渲染的GeoBuilding实例
     * @param param 参数列表
     */
      constructor(
      geoBuilding: CMAP.GeoBuilding,
      param: {
        /**
         * 扩散类型 GeoDiffusion.TYPE_CYLINDER,GeoDiffusion.TYPE_TEXTURE_ROTATE,GeoDiffusion.TYPE_TEXTURE_SCALE
         */
        type: string;
        /** 填充颜色 */
        color: string | Array<any> | number;
        /** 填充不透明度 默认1 */
        opacity: number;
        /** 贴图路径 */
        imageUrl: string;
        /**
         * 扩散速度
         */
        speed: number;
        /**
         * 扩散圆半径
         */
        radius: number;
        /** 扩散高度 type=GeoDiffusion.TYPE_CYLINDER时生效 */
        cylinderHeight: number;
        /**
         * 扩散开始的位置(0~1) type=GeoDiffusion.TYPE_TEXTURE_SCALE时生效
         */
        startPosition: number;
        /** 扩散结束的位置(0~1) type=GeoDiffusion.TYPE_TEXTURE_SCALE时生效 */
        endPosition: number;
        /**
         * 扩散的透明度曲线 例如{0:0.0,0.5:1,1:0.0} key代表扩散到的位置 value代表此时的透明度 type=GeoDiffusion.TYPE_TEXTURE_SCALE时生效
         */
        alphaMapping: object;
        /**
         * 扩散边框扫面线在扫描圆的位置(0~1) type=GeoDiffusion.TYPE_TEXTURE_SCALE时生效
         */
        linePositionRatio: number;
        /** 扩散边框扫面线的颜色 type=GeoDiffusion.TYPE_TEXTURE_SCALE时生效 */
        lineColor: number;
        /**
         * 扩散边框扫面线的透明度(0~1) type=GeoDiffusion.TYPE_TEXTURE_SCALE时生效
         */
        lineOpacity: number;
        /**
         * 扩散边框扫面线宽占扩散圆半径的比例 type=GeoDiffusion.TYPE_TEXTURE_SCALE时生效
         */
        lineWidthRatio: number;
        /**
         * 扫描速度变化曲线
         */
        lerpType: Function;
      }
    );

    /**
     * 扩散类型 GeoDiffusion.TYPE_CYLINDER,GeoDiffusion.TYPE_TEXTURE_ROTATE,GeoDiffusion.TYPE_TEXTURE_SCALE
     */
    readonly type: string;
  }

  /**
   * GeoFlyLine 地理飞线(3D抬高)
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoFlyLine.html)
   */
  class GeoFlyLine extends CMAP.GeoLine {
      /**
     * 构造函数
     * @param options 参数列表
     * @example
     * ```
     * var flyLine = app.create(
     * {
     *   type: 'GeoFlyLine',
     *   id: 'geoFlyLine',
     *   name: 'geoFlyLine',
     *   coordinates: [[116.4405, 39.9612],[116.4408, 39.9613]],//注 飞线的坐标只可以有     * 两个点
     *   heightArray:[100,200],//起点和终点的离地高度
     *   renderer:{
     *     type: 'image', //GeoFlyLine渲染类型 支持纯色(vector)和贴图(image)两种模式
     *     lineType: 'Line', //可以是Line Plane Pipe
     *     imageUrl:'./image/line.png',//线的贴图url
     *     color:[255,255,255], //线的颜色,如果设置此项，imageUrl会失效
     *     effect:true, //是否开启发光特效
     *     width: 10, //只在线类型为Plane,Pipe下生效,代表线的宽度
     *     numPass:1, // 通道数,在贴图时贴图叠加的次数,次数越多颜色越亮,尽在
     *     speed:0  //线贴图流动速度,默认是0,不流动 speed可以大于0也可以小于0，代表流动方向
     *   }
     * });
     * ```
     */
      constructor(options: {
      /** 类型'GeoFlyLine' */
      type?: 'GeoFlyLine';
      /** 线名称 */
      name?: string;
      /**
       * 起点终点坐标 例如[[116.395645, 39.929986],[121.487899, 31.249162]] 飞线的坐标只可以有两个点
       */
      coordinates?: Array<any[]>;
      /** 起点终点的离地高度 例如[1000,10] 默认[0,0] */
      heightArray?: any[];
      /** 创建的飞线的属性 */
      userData?: object;
      /** GeoFlyLine的渲染样式 */
      renderer?: CMAP.GeoLineRenderer;
    });
  }

  /**
   * GeoLine 地理线
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoLine.html)
   */
  class GeoLine extends CMAP.GeoObject {
      /**
     * 构造函数
     * @param options 参数列表
     * @example
     * ```
     * var geoLine = app.create({
     *     type: 'GeoLine',
     *     name: 'geoLine1',
     *     coordinates: [[116.4405, 39.9612], [116.4408, 39.9613], [116.4409, 39.9615]]     * ,
     *     heightArray:[100,200,300],
     *     userData: { 'name': '花家地南街' },
     *     renderer: {
     *         type: 'vector', //GeoLine渲染类型 支持纯色(vector)和贴图(image)两种模式
     *         lineType: 'Line', //可以是Line Plane Pipe Route
     *         imageUrl: './image/line.png',//线的贴图url, type是image时生效
     *         color: [255, 255, 255], //线的颜色, type是vector时生效
     *         effect: true, //是否开启发光特效
     *         width: 10, //只在线类型为Plane,Pipe下生效,代表线的宽度
     *         numPass: 1, // 通道数,在贴图时贴图叠加的次数,次数越多颜色越亮,type是image时     * 生效
     *         speed: 0,  //线贴图流动速度,默认是0,不流动 speed可以大于0也可以小于0，代表流     * 动方向
     *         growSpeed: 0,  //线生长速度,默认是0,不生长，lineType是Line,Plane时生效
     *         growLoop: true  //线生长是否循环，默认是true，lineType是Line,Plane时生效
     *     }
     * });
     * ```
     */
      constructor(options: {
      /** 类型'GeoLine' */
      type?: 'GeoLine';
      /** 线名称 */
      name?: string;
      /** 弹出信息框中的字段内容 对象属性可参考InfoWindow类 */
      infoWindow: object;
      /**
       * 道路数据例如：[[116.4405, 39.9612],[116.4408, 39.9613],[116.4409, 39.9615]]
       */
      coordinates?: Array<any[]>;
      /** 如果需要话高低起伏的线 可以设置每个点对应的高度 例如：[200,100,200] */
      heightArray?: any[];
      /** 创建的道路属性 */
      userData?: object;
      /** 设置标注 */
      label?: CMAP.Label;
      /** GeoLine的渲染样式 对象属性可参考GeoLineRenderer类 */
      renderer?: CMAP.GeoLineRenderer;
    });

    /** GeoLine每个坐标点对应的高度值 */
    readonly heightArray: Array<any>;

    /**
     * GeoLine的弹窗
     * @override `CMAP.GeoObject#infoWindow`
     */
    readonly infoWindow: CMAP.InfoWindow;

    /**
     * 获取/设置物体的离地高度 单位:米
     * @override `CMAP.GeoObject#offsetHeight`
     * @example
     * ```
     * geoObject.offsetHeight = 200; //设置物体离地高度200米
     * ```
     */
    offsetHeight: number;
  }

  /**
   * GeoLine样式类
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoLineRenderer.html)
   */
  class GeoLineRenderer {
      /**
     * @param object 使用样式的主体 可以是GeoLine也可以是geometryType为GeoLine的FeatureLayer
     * @param param 参数列表
     */
      constructor(
      object: object,
      param: {
        /** 线的类型 type有vector(纯色)和image(贴图)两种 */
        type: string;
        /**
         * GeoLine的线的类型 支持Line(宽度为1个像素),Pipe(管状线),Plane(片状线,可以设置宽度,宽度不随距离远近变化,像素级) Route(道路线,宽度代表实际距离)
         */
        lineType: string;
        /** type=image 贴图url */
        imageUrl: string;
        /** 线宽度 */
        width: number;
        /**
         * lineType为Plane时 线宽度是否代表实际像素大小 默认false
         */
        sizeAttenuation: boolean;
        /** 流动速度 默认0 */
        speed: number;
        /** 是否开启特效 默认false */
        effect: boolean;
        /** type=vector 线填充色(rgba数组) 默认白色 */
        color: string | any[] | number;
        /** 线不透明度 默认1 */
        opacity: any[];
        /** 贴图在x轴和y轴的重复次数 默认[1,1] */
        uvRatio: any[];
        /**
         * 设置线的混色,type为image 默认为true type为vector 默认false
         */
        blending: boolean;
        /**
         * 当type=image时生效 贴图循环方式 CMAP.TextureWrapMode.Stretch 拉伸，CMAP.TextureWrapMode.Repeat 平铺
         */
        textureWrap: number;
        /**
         * type=image 且textureWrap为CMAP.TextureWrapMode.Repeat时生效 含义为贴图代表的实际距离(单位:米) 默认1
         */
        textureSize: number;
        /**
         * 线生长速度,默认是0,不生长
         */
        growSpeed: number;
        /**
         * 线生长是否循环，默认是THING.LoopType.Repeat 循环生长
         */
        growLoop: boolean;
      }
    );

    /**
     * 设置线的混色,type为image 默认为true type为vector 默认false
     * @example
     * ```
     * geoItem.renderer.blending = true; //设置线的叠加混色
     * ```
     */
    blending: boolean;

    /**
     * type=vector时 线填充颜色(rgb) 默认是[255,0,0]
     * @example
     * ```
     * geoLine.renderer.type = 'vector';
     * geoLine.renderer.color = 'rgb(255,0,0)'; //线填充颜色设为红色 仅当type=vector时生效
     * ```
     */
    color: string | any[] | number;

    /**
     * 设置线渐变色填充
     * @example
     * ```
     * geoItem.renderer.colorMapping = {'0':'rgb(255,0,0)', '0.5':'rgb(0,255,0)', '1.0':'rgb(0,0,255)'};
     * ```
     */
    colorMapping: object;

    /**
     * 是否开启发光特效
     * @example
     * ```
     * geoLine.renderer.effect = true; //线开启发光特效
     * ```
     */
    effect: boolean;

    /**
     * 线的生长速度
     * @example
     * ```
     * geoLine.renderer.growSpeed = 1; //线生长速度1
     * ```
     */
    growSpeed: number;

    /**
     * type=image时 贴图url
     * @example
     * ```
     * geoLine.renderer.type = 'image';//线的类型设为image(贴图)
     * geoLine.renderer.imageUrl = 'example.com/1.png'; //线的贴图url设为'example.com/1.png' 仅当type=vector时生效
     * ```
     */
    imageUrl: string;

    /**
     * 线的形状 有Line(宽度为1个像素的像素线),Plane(可设置宽度的像素线),Pipe(管状线),Route(道路线)四种
     * @example
     * ```
     * geoLine.renderer.lineType = 'Plane'; //线的形状设为Plane(可设置宽度的像素线)
     * geoLine.renderer.lineType = 'Line'; //线的形状设为Line(一个像素的线)
     * geoLine.renderer.lineType = 'Pipe'; //线的形状设为Pipe(管状线,宽度单位是实际大小)
     * geoLine.renderer.lineType = 'Route'; //线的形状设为Route(道路线,宽度单位是实际大小)
     * ```
     */
    lineType: string;

    /**
     * 填充色不透明度
     * @example
     * ```
     * geoItem.renderer.opacity = 1; //将不透明度设置为1
     * ```
     */
    opacity: number;

    /**
     * lineType为Plane时 线宽度是否代表实际像素大小 默认false
     * @example
     * ```
     * geoItem.renderer.sizeAttenuation = true; //设置线宽度代表实际像素大小
     * ```
     */
    sizeAttenuation: boolean;

    /**
     * 流动速度
     * @example
     * ```
     * geoLine.renderer.speed = 2; //线的流动速度设为2
     * ```
     */
    speed: number;

    /**
     * 贴图模式
     * @example
     * ```
     * geoLine.renderer.textureWrap = 'stretch';
     * ```
     */
    textureWrap: string;

    /**
     * 线的类型 type有vector(纯色)和image(贴图)两种
     * @example
     * ```
     * geoLine.renderer.type = 'vector'; //线的类型设为vector(纯色)
     * geoLine.renderer.type = 'image'; //线的类型设为image(贴图)
     * ```
     */
    type: 'vector' | 'image';

    /**
     * 贴图在x轴和y轴的重复次数
     */
    uvRatio: any[];

    /**
     * 线宽度 如果lineType=Plane 代表像素宽度(pix) lineType=Pipe 代表实际宽度(米) lineType=Line 不生效
     * @example
     * ```
     * geoLine.renderer.lineType = 'Plane';
     * geoLine.renderer.width = 10; //线的宽度设为10
     * ```
     */
    width: number;
  }

  /**
   * GeoObject 地球上物体基类 GeoPoint GeoLine GeoPolygon GeoBuilding的父类
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoObject.html)
   */
  class GeoObject extends THING.BaseObject {
    /**
     * 物体几何中心点 格式[经度,纬度]
     */
    readonly centerCoordinates: number[];

    /**
     * 获取物体地理坐标 格式[经度,纬度]
     */
    readonly coordinates: number[];

    /**
     * 获取 物体的弹窗
     */
    readonly infoWindow: CMAP.InfoWindow;

    /**
     * 获取/设置 物体的Label
     * @example
     * ```
     * geoPoint.label = new Label({text:'myLabel'});
     * ```
     */
    label: CMAP.Label;

    /**
     * 物体重心 格式[经度,纬度]
     */
    readonly massOfCenterCoordinates: number[];

    /**
     * 获取/设置物体的离地高度 单位:米
     * @example
     * ```
     * geoObject.offsetHeight = 200; //设置物体离地高度200米
     * ```
     */
    offsetHeight: number;

    /**
     * 获取/设置物体的离地高度 单位:米
     * @example
     * ```
     * geoObject.offsetHeight = 200; //设置物体离地高度200米
     * ```
     */
    offsetHeightField: number;

    /**
     * 获取 物体的渲染配置（`CMAP.GeoXxxRenderer`）
     */
    readonly renderer:
      | CMAP.GeoBuildingRenderer
      | CMAP.GeoLineRenderer
      | CMAP.GeoDiffusionRenderer
      | any;

    /**
     * 获取/设置 物体是否显示,包括infoWindow是否显示
     * @example
     * ```
     * geoObject.visible = false; //设置物体不显示
     * ```
     */
    visible: boolean;
  }

  /**
   * GeoODLine 简单OD线 贴地曲线
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoODLine.html)
   */
  class GeoODLine extends CMAP.GeoFlyLine {
      /**
     * 构造函数
     * @param options 参数列表
     * @example
     * ```
     * var geoODLine = app.create(
     * {
     *     type: 'GeoODLine',
     *     id: 'geoODLine',
     *     name: 'geoODLine',
     *     coordinates: [[116.4405, 39.9612],[116.4408, 39.9613]],//注 起止线的坐标只可     * 以有两个点
     *     renderer:{
     *       type: 'image', //GeoODLine渲染类型 支持纯色(vector)和贴图(image)两种模式
     *       lineType: 'Line', //可以是Line Plane Pipe
     *       imageUrl:'./image/line.png',//线的贴图url
     *       color:[255,255,255], //线的颜色,如果设置此项，imageUrl会失效
     *       effect:true, //是否开启发光特效
     *       width: 10, //只在线类型为Plane,Pipe下生效,代表线的宽度
     *       numPass:1, // 通道数,在贴图时贴图叠加的次数,次数越多颜色越亮,尽在
     *       speed:0  //线贴图流动速度,默认是0,不流动 speed可以大于0也可以小于0，代表流动方     * 向
     *     }
     * });
     * ```
     */
      constructor(options: {
      /** 类型'GeoODLine' */
      type?: 'GeoODLine';
      /** 线名称 */
      name?: string;
      /**
       * 起点终点坐标 例如[[116.395645, 39.929986],[121.487899, 31.249162]] 起止线的坐标只可以有两个点
       */
      coordinates?: Array<any[]>;
      /** 创建的起止线属性 */
      userData?: object;
      /** 设置标注 */
      label?: CMAP.Label;
      /** GeoODLine的渲染样式 */
      renderer?: CMAP.GeoLineRenderer;
    });
  }

  /**
   * GeoPoint 地理点
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoPoint.html)
   */
  class GeoPoint extends CMAP.GeoObject {
      /**
     * 构造函数
     * @param options 参数列表
     * @example
     * ```
     * let geoPoint = app.create({
     *   type: 'GeoPoint',
     *   name: 'point1',
     *   coordinates: [116.39, 39.96],
     *   offsetHeight: 1,    //离地高度 单位:米
     *   userData: { 'cityName': 'Beijing' },
     *   pivot:[0.5,1], //指定轴心点位置为图片x方向中点y方向最下
     *   label: {
     *       text: '{{cityName}}', //使用cityName字段的值进行标注
     *       offset: [0, 30],
     *       fontColor: [255, 0, 0],
     *       fontSize: 20
     *   },
     *   infoWindow:
     *   {
     *       'title': '标题',
     *       'displayMode': 'clickShow', //点击弹出
     *       'type': 'standard',         //标准模式
     *       'style': 'default',         //默认样式
     *       'fieldData': [
     *           {
     *               'field': 'cityName',
     *               'alias': '名称'
     *           }]
     *   },
     *   renderer: {
     *       type: "image", //type有'image','model','vector'三种
     *       url: 'image/uGeo/pop.png',//针对image和model 代表资源的路径
     *       size: 5,// 对于image,vector 是一个数字 代表缩放倍数 对于model 是一个数组 代表     * xyz轴向的缩放比例
     *   }
     * });
     * ```
     */
      constructor(options: {
      /** 类型'GeoPoint' */
      type?: 'GeoPoint';
      /** 线名称 */
      name?: string;
      /**
       * 弹出信息框中的字段内容 对象属性可参考InfoWindow类
       */
      infoWindow?: object;
      /**
       * 点坐标 示例:[116.39, 39.96]
       */
      coordinates?: number[];
      /** 点离地高度 默认0米 */
      offsetHeight?: number;
      /**
       * 点的轴心 仅针对type为image和vector的情况 以百分比表示界面轴心位置 [0,0] 代表界面左上；[1,1] 代表界面右下 默认[0.5,1]
       */
      pivot?: [number, number];
      /**
       * 点的轴心像素值 仅针对type为image和vector的情况 以像素值表示距离左上角的偏移量
       */
      pivotPixel?: [number, number];
      /** 点属性 */
      userData?: object;
      /** 设置标注 */
      label?: CMAP.Label;
      /** 点的渲染样式 对象属性可参考GeoPointRenderer类 */
      renderer?: CMAP.GeoPointRenderer;
      /** 创建完成的回调函数 */
      complete: Function;
    });

    /**
     * 方位角(正北为0,单位度)
     * @example
     * ```
     * geoPoint.azimuth = 20;//设置GeoPoint的方位角为20度 即北偏东20度
     * ```
     */
    azimuth: number;

    /**
     * 地理坐标 经度,纬度
     * @example
     * ```
     * geoPoint.coordinates = [116.44778,39.9565];//设置GeoPoint的地理坐标
     * ```
     */
    coordinates: number[];

    /**
     * 轴心
     * @example
     * ```
     * //以百分比表示界面轴心位置 [0,0] 代表界面左上；[1,1] 代表界面右下 默认[0.5,1]
     * //设置GeoPoint下方中点作为轴心点，这样设置可以让轴心点钉在所设置的position上
     * //仅针对type为image和vector的GeoPoint生效
     * geoPoint.pivot = [0.5,1];
     * ```
     */
    pivot: [number, number];

    /**
     * 轴心点像素值 相对于左上角的偏移像素值
     * @example
     * ```
     * //仅针对type为image和vector的GeoPoint生效
     * geoPoint.pivotPixel = [20,20];
     * ```
     */
    pivotPixel: [number, number];

    /**
     * 沿路径移动(数据需要传经纬度)
     * @param param 移动的参数
     */
    moveGeoPath(param: {
      /** 物体方向是否沿路径方向 */
      orientToPath?: boolean;
      /** 相对于路径方向的角度旋转值 */
      orientToPathDegree?: boolean;
      /**
       * 路径经纬度数组 [[116.44778,39.9565],[116.4543,39.9623],[ 116.4624,39.96981]]
       */
      path?: Array<number[]>;
      /** 路径总时间(单位毫秒) 默认5000ms */
      time?: number;
      /** 循环方式 */
      loopType?: string;
      /** 插值方式（`THING.LerpType`） */
      lerpType?: any;
    }): void;
  }

  /**
   * GeoPoint样式类
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoPointRenderer.html)
   */
  class GeoPointRenderer {
      /**
     * @param geoPoint 要渲染的GeoPoint实例FeatureLayer
     * @param param 参数列表
     */
      constructor(
      geoPoint: CMAP.GeoPoint,
      param: {
        /** GeoPoint的渲染类型 支持图片(image),模型(model),矢量(vector) */
        type?: string;
        /**
         * type为image代表图片资源路径,type为model代表模型资源的路径
         */
        url?: string;
        /**
         * 图片或矢量尺寸是一个number,模型尺寸是一个数组,代表xyz轴的缩放倍数
         */
        size?: string;
        /**
         * type=vector时 矢量图标的形状，目前有circle(圆形),triangle(三角形),rectangle(正方形),cross(十字)
         */
        vectorType?: string;
        /**
         * type=vector时 填充色
         */
        color?: string | any[] | number;
        /** type=vector时 填充不透明度 */
        opacity?: number;
        /**
         * type=vector时 边框颜色 如果vectorType为cross 设置该参数代表十字的颜色
         */
        lineColor?: string | any[] | number;
        /**
         * 是否使用精灵材质 默认true 只有初始化时可以设置，true代表图片会随摄影机转动 false则不会
         */
        useSpriteMaterial?: boolean;
        /**
         * type!=model时 设置物体是否始终在最前端渲染显示
         */
        alwaysOnTop?: boolean;
        /**
         * type=vector时 边框不透明度
         */
        lineOpacity?: number;
        /**
         * type=vector时 边框宽度 如果vectorType为cross 设置该参数代表十字的宽度
         */
        lineWidth?: number;
        /**
         * type!=model时 保持像素大小
         */
        keepSize?: boolean;
        /**
         * type!=model时 旋转速度
         */
        rotateSpeed?: number;
        /**
         * ype=model时 是否播动画
         */
        playAnimation?: boolean;
        /**
         * type=model时 动画名称
         */
        animationName?: string;
        /**
         * type=model时 动画循环方式 THING.LoopType.Repeat、THING.LoopType.PingPong、THING.LoopType.No
         */
        animationLoopType?: string;
      }
    );

    /**
     * 设置物体是否始终在最前端渲染显示 仅针对image和vector
     * @example
     * ```
     * geoPoint.renderer.type = 'vector';//设置geoPoint渲染类型为矢量
     * geoPoint.renderer.alwaysOnTop = true;//设置物体始终在最前端渲染显示 即不会被其他物体遮挡
     * ```
     */
    alwaysOnTop: boolean;

    /**
     * 模型 动画循环方式
     */
    animationLoopType: string;

    /**
     * 模型 动画名
     */
    animationName: string;

    /**
     * GeoPoint的type为vector时，代表填充色
     */
    color: string | any[] | number;

    /**
     * 是否保持像素大小不变 type为vector和image时生效
     * @example
     * ```
     * geoPoint.renderer.type = 'image';//设置geoPoint渲染类型为图片
     * geoPoint.renderer.keepSize = true;//设置图片保持像素大小不变，图片大小不随地图放大缩小而改变其他物体遮挡
     * ```
     */
    keepSize: boolean;

    /**
     * GeoPoint的type为vector时，代表边框颜色
     * @example
     * ```
     * geoPoint.renderer.type = 'vector';//设置geoPoint渲染类型为矢量
     * geoPoint.renderer.lineColor = 'rgb(255,0,0)';//设置geoPoint填充色为红色图放大缩小而改变其他物体遮挡
     * ```
     */
    lineColor: string | any[] | number;

    /**
     * 边框填充色不透明度 仅在type为vector情况下生效
     * @example
     * ```
     * geoItem.renderer.lineOpacity = 1; //将不透明度设置为1
     * ```
     */
    lineOpacity: number;

    /**
     * GeoPoint的type为vector时，代表边框宽度
     * @example
     * ```
     * geoPoint.renderer.type = 'vector';//设置geoPoint渲染类型为矢量
     * geoPoint.renderer.lineWidth = 2;//设置geoPoint边框宽度为2
     * ```
     */
    lineWidth: number;

    /**
     * 填充色不透明度 仅在type为vector情况下生效
     * @example
     * ```
     * geoItem.renderer.opacity = 1; //将不透明度设置为1
     * ```
     */
    opacity: number;

    /**
     * 模型 是否播放动画
     */
    playAnimation: boolean;

    /**
     * 旋转速度 type为vector和image时生效
     * @example
     * ```
     * geoPoint.renderer.type = 'image';//设置geoPoint渲染类型为图片
     * geoPoint.renderer.rotateSpeed = 2;//设置图片自身的旋转速度
     * ```
     */
    rotateSpeed: number;

    /**
     * 缩放比例
     * @example
     * ```
     * geoPoint.renderer.size = 2;//设置缩放比例为2 对于type为image和vector 长宽等比缩放 对于model 长宽高等比缩放
     * ```
     */
    size: number;

    /**
     * 目前有vector,image,model三种
     * @example
     * ```
     * geoPoint.renderer.type = 'vector';//设置GeoPoint渲染类型为矢量
     * geoPoint.renderer.type = 'image';//设置GeoPoint渲染类型为图片
     * geoPoint.renderer.type = 'model';//设置GeoPoint渲染类型为模型
     * ```
     */
    type: 'vector' | 'image' | 'model';

    /**
     * type为image或model时，图片或者模型的url
     * @example
     * ```
     * geoPoint.renderer.type = 'image';//设置geoPoint渲染类型为图片
     * geoPoint.renderer.url = '/uGeo/image/pop.png';//设置图片url
     * ```
     */
    url: string;

    /**
     * 是否使用精灵材质 默认true 只有初始化时可以设置，设置之后图片不会随摄影机转动
     */
    readonly useSpriteMaterial: boolean;

    /**
     * GeoPoint的type为vector时，矢量图标的类型 支持circle,rectangle,triangle,cross
     * @example
     * ```
     * geoPoint.renderer.type = 'vector';//设置geoPoint渲染类型为矢量
     * geoPoint.renderer.vectorType = 'circle';//设置geoPoint使用圆形填充
     * ```
     */
    vectorType: string;
  }

  /**
   * GeoPolygon 地理多边形
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoPolygon.html)
   */
  class GeoPolygon extends CMAP.GeoObject {
      /**
     * 构造函数
     * @param options 参数列表
     * @example
     * ```
     * let geoPolygon = app.create({
     *     type: 'GeoPolygon',
     *     name: '多边形_纯色',
     *     coordinates: [[
     *         [116.38774394989012, 39.926703608137295],
     *         [116.38801217079163, 39.921997270172746],
     *         [116.39319419860838, 39.92214537664713],
     *         [116.3927972316742, 39.92680233903546],
     *         [116.38774394989012, 39.926703608137295]
     *     ]], // 支持Polygon和MultiPolygon,格式可参考geoJson规范
     *     extrudeHeight:100, //拉伸高度100m
     *     renderer: {
     *         type: 'vector', // 纯色填充
     *         color: [0, 255, 0], // 面填充颜色
     *         opacity: 0.8, // 填充不透明度
     *         outlineColor: [255, 255, 0], // 边框色
     *         outlineWidth: 2, // 边框宽度
     *         lights:true,//默认为true，受光照影响，为false不受光照影响
     *     }
     * });
     * ```
     */
      constructor(options: {
      /** 类型'GeoPolygon' */
      type?: 'GeoPolygon';
      /** 面的名字 */
      name?: string;
      /** 拉伸高度单位:米 */
      extrudeHeight?: number;
      /**
       * GeoPolygon的弹窗 对象属性可参考InfoWindow类
       */
      infoWindow?: object;
      /**
       * 坐标数组 [[[116, 39], [117, 39], [116, 40]]]
       */
      coordinates?: Array<Array<number[]>>;
      /**
       * 高度放大倍数,与extrudeField配合使用，默认是1,优先级低于extrudeHeight
       */
      extrudeFactor?: number;
      /**
       * 高度属性字段 在userData中找该字段作为高度,优先级低于extrudeHeight
       */
      extrudeField?: string;
      /** 用户定义属性 */
      userData?: object;
      /** 设置标注 */
      label?: CMAP.Label;
      /** GeoPolygon渲染样式 对象属性可参考GeoPolygonRenderer类 */
      renderer?: CMAP.GeoPolygonRenderer;
    });

    /**
     * 高度拉伸倍数
     * @example
     * ```
     * geoPolygon.extrudeFactor = 1.5;//高度系数，最终的高度为原来的高度乘以系数
     * ```
     */
    extrudeFactor: number;

    /**
     * 高度属性字段
     * @example
     * ```
     * geoPolygon.extrudeField = 'height';//高度数据的字段名称 需确保geoPolygon.userData中包含该字段
     * ```
     */
    extrudeField: string;

    /**
     * 多边形拉伸的高度 (单位:米)geo
     * @example
     * ```
     * geoPolygon.extrudeHeight = 100;//设置多边形的拉伸高度为100米
     * ```
     */
    extrudeHeight: number;

    /**
     * 多边形拉伸的高度 (单位:米)
     */
    height: number;

    /**
     * 获取/设置物体的离地高度 单位:米
     * @example
     * ```
     * geoObject.offsetHeight = 200; //设置物体离地高度200米
     * ```
     */
    offsetHeight: number;

    /**
     * 重新计算多边形的贴图坐标
     * @param oldTextureSize 旧的纹理尺寸 单位米
     * @param newTextureSize 新的纹理尺寸 单位米
     * @param effectSide 影响侧面
     */
    _updateMeshUV(
      oldTextureSize: any[],
      newTextureSize: any[],
      effectSide: boolean
    ): void;
  }

  /**
   * GeoPolygon样式类
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoPolygonRenderer.html)
   */
  class GeoPolygonRenderer {
      /**
     * @param geoPoloygon 需要设置样式的GeoPolygon
     * @param param 参数列表
     */
      constructor(
      geoPoloygon: CMAP.GeoPolygon,
      param: {
        /** GeoBuilding的渲染类型 支持vector,image 默认为vector */
        type?: string;
        /**
         * 当type=vector时生效 填充颜色 默认白色
         */
        color?: string | any[] | number;
        /** 填充不透明度 默认1 */
        opacity?: number;
        /**
         * 当type=image时生效 贴图路径
         */
        imageUrl?: string | string[];
        /**
         * 当type=image且textureWrap为RepeatY或Repeat时生效 代表纹理尺寸 数组的每一个值必须大于0 单位:米 GeoBuilding的默认值是[3,3] GeoPolygon的默认值是多边形区域外包矩形的长和宽(基于WebMercator投影计算)
         */
        textureSize?: any[];
        /**
         * 是否混合 默认不开启
         */
        blending?: boolean;
        /**
         * 是否接受光照 type为vector默认是true type为image默认是false type为cool为true切不可修改
         */
        lights?: boolean;
        /**
         * 是否开启窗户效果 type为cool默认true 其他默认false
         */
        useWindow?: boolean;
        /**
         * 窗户颜色 默认白色
         */
        windowColor?: string;
        /**
         * 纹理环绕方式 around--环绕 normal--随贴图
         */
        windowTextureWrap?: string;
        /**
         * 窗户纹理尺寸 仅windowTextureWrap为around时生效 数组的每一个值必须大于0 默认值[300,300]
         */
        windowTextureSize?: [number, number];
        /**
         * 当type=cool时生效 设置窗户贴图的偏移值 array[0]代表x轴偏移，array[1]代表y轴偏移
         */
        offset?: [number, number];
        /**
         * 当type=cool时生效 设置窗户贴图的重复度 array[0]代表x轴重复度，array[1]代表y轴重复度
         */
        repeat?: [number, number];
        /**
         * 线的类型 type有vector(纯色)和image(贴图)两种
         */
        outlineType?: string;
        /**
         * GeoLine的线的类型 支持Line(宽度为1个像素),Pipe(管状线),Plane(片状线,可以设置宽度,宽度不随距离远近变化,像素级) Route(道路线,宽度代表实际距离)
         */
        outlineLineType?: string;
        /**
         * ype=image 贴图url
         */
        outlineImageUrl?: string;
        /** 线宽度 */
        outlineWidth?: number;
        /** lineType为Plane时 线宽度是否代表实际像素大小 默认false */
        outlineSizeAttenuation?: boolean;
        /** 流动速度 默认0 */
        outlineSpeed?: number;
        /** 是否开启特效 默认false */
        outlineEffect?: boolean;
        /** type=vector 线填充色(rgba数组) 默认白色 */
        outlineColor?: string | any[] | number;
        /** 线不透明度 默认1 */
        outlineOpacity?: any[];
        /** 贴图在x轴和y轴的重复次数 默认[1,1] */
        outlineUvRatio?: [number, number];
        /** 设置线的混色,type为image 默认为true type为vector 默认false */
        outlineBlending?: boolean;
        /**
         * 当type=image时生效 贴图循环方式 CMAP.TextureWrapMode.Stretch 拉伸，CMAP.TextureWrapMode.Repeat 平铺
         */
        outlineTextureWrap?: number;
        /**
         * type=image 且textureWrap为CMAP.TextureWrapMode.Repeat时生效 含义为贴图代表的实际距离(单位:米) 默认1
         */
        outlineTextureSize?: number;
        /** 线生长速度,默认是0,不生长 */
        outlineGrowSpeed?: number;
        /**
         * 线生长是否循环，默认是THING.LoopType.Repeat 循环生长
         */
        outlineGrowLoop?: boolean;
      }
    );

    /**
     * 是否混合
     * @example
     * ```
     * geoObject.renderer.blending = true;
     * ```
     */
    blending: boolean;

    /**
     * 高度拉伸倍数
     * @example
     * @deprecated 推荐使用geoObject.extrudeFactor
     * ```
     * geoObject.renderer.extrudeFactor = 2; //设置楼高度放大倍数
     * ```
     */
    extrudeFactor: number;

    /**
     * 高度属性字段
     * @deprecated 推荐使用geoObject.extrudeField
     * @example
     * ```
     * geoObject.renderer.extrudeField = 'height'; //设置楼的高度属性字段，该字段可在geoObject.userData中找到
     * ```
     */
    extrudeField: string;

    /**
     * 设置楼宇填充色 在type为vector时生效
     * @example
     * ```
     * geoObject.renderer.type = 'vector';//设置楼的渲染类型为vector(纯色)
     * geoObject.renderer.color = 'rgb(255,0,0)'; //将颜色设置为红色
     * ```
     */
    color: string | any[] | number;

    /**
     * 贴图url 包括顶部的贴图和侧面的贴图 数组第一个代表顶部贴图，第二个代表侧面贴图 如果不区分顶部和侧面，数组中就只有一个元素
     * @example
     * ```
     * //设置顶部的贴图和侧面的贴图，第一个代表顶部贴图路径，第二个代表侧面的贴图路径
     * geoObject.renderer.type = 'image';//设置渲染类型为image(贴图)
     * geoObject.renderer.imageUrl = ['./temp/image1.png','./temp/image1.png'];
     * ```
     */
    imageUrl: string | string[];

    /**
     * @example
     * ```
     * geoObject.renderer.lights = true;
     * ```
     */
    lights: boolean;

    /**
     * 填充色不透明度 仅在type为vector情况下生效
     * @example
     * ```
     * geoItem.renderer.opacity = 1; //将不透明度设置为1
     * ```
     */
    opacity: number;

    /**
     * 设置边线的混色,type为image 默认为true type为vector 默认false
     * @example
     * ```
     * geoObject.renderer.outlineBlending = true; //设置边线的叠加混色
     * ```
     */
    outlineBlending: boolean;

    /**
     * outlineType=vector时 边线填充颜色(rgb) 默认是[255,0,0]
     * @example
     * ```
     * geoLine.renderer.outlineType = 'vector';
     * geoLine.renderer.outlineColor = 'rgb(255,0,0)'; //线填充颜色设为红色 仅当type=vector时生效
     * ```
     */
    outlineColor: string | any[] | number;

    /**
     * 设置边线渐变色填充
     * @example
     * ```
     * geoItem.renderer.outlineColorMapping = {'0':'rgb(255,0,0)', '0.5':'rgb(0,255,0)', '1.0':'rgb(0,0,255)'};
     * ```
     */
    outlineColorMapping: object;

    /**
     * 边线是否开启发光特效
     * @example
     * ```
     * geoObject.renderer.outlineEffect = true; //线开启发光特效
     * ```
     */
    outlineEffect: boolean;

    /**
     * 设置边线发光强度，前提是开启了effect
     * @example
     * ```
     * geoObject.renderer.outlineGlowStrength = 1.0;
     * ```
     */
    outlineGlowStrength: number;

    /**
     * 边线生长是否循环
     * @example
     * ```
     * geoLine.renderer.outlineGrowLoop = THING.LoopType.Repeat; //设置线循环生长
     * ```
     */
    outlineGrowLoop: boolean;

    /**
     * 边线的生长速度
     * @example
     * ```
     * geoObject.renderer.outlineGrowSpeed = 1; //线生长速度1
     * ```
     */
    outlineGrowSpeed: number;

    /**
     * outlineType=image时 边线贴图url
     * @example
     * ```
     * geoObject.renderer.outlineType = 'image';//线的类型设为image(贴图)
     * geoObject.renderer.outlineImageUrl = 'example.com/1.png'; //线的贴图url设为'example.com/1.png' 仅当type=vector时生效
     * ```
     */
    outlineImageUrl: string;

    /**
     * 边线的形状 有Line(宽度为1个像素的像素线),Plane(可设置宽度的像素线),Pipe(管状线),Route(道路线)四种
     * @example
     * ```
     * geoObject.renderer.outlineLineType = 'Plane'; //线的形状设为Plane(可设置宽度的像素线)
     * geoObject.renderer.outlineLineType = 'Line'; //线的形状设为Line(一个像素的线)
     * geoObject.renderer.outlineLineType = 'Pipe'; //线的形状设为Pipe(管状线,宽度单位是实际大小)
     * geoObject.renderer.outlineLineType = 'Route'; //线的形状设为Route(道路线,宽度单位是实际大小)
     * ```
     */
    outlineLineType: string;

    /**
     * 边线填充色不透明度
     * @example
     * ```
     * geoObject.renderer.outlineOpacity = 1; //将不透明度设置为1
     * ```
     */
    outlineOpacity: number;

    /**
     * outlineLineType为Plane时 边线宽度是否代表实际像素大小 默认false
     * @example
     * ```
     * geoObject.renderer.outlineSizeAttenuation = true; //设置线宽度代表实际像素大小
     * ```
     */
    outlineSizeAttenuation: boolean;

    /**
     * 边线流动速度
     * @example
     * ```
     * geoObject.renderer.outlineSpeed = 2; //线的流动速度设为2
     * ```
     */
    outlineSpeed: number;

    /**
     * 边线贴图模式
     * @example
     * ```
     * geoObject.renderer.outlineTextureWrap = 'stretch';
     * ```
     */
    outlineTextureWrap: string;

    /**
     * 边线的渲染类型 type有vector(纯色)和image(贴图)两种
     * @example
     * ```
     * geoObject.renderer.outlineType = 'vector'; //线的类型设为vector(纯色)
     * geoObject.renderer.outlineType = 'image'; //线的类型设为image(贴图)
     * ```
     */
    outlineType: string;

    /**
     * 边线贴图在x轴和y轴的重复次数
     */
    outlineUvRatio: [number, number];

    /**
     * 边线宽度 参考GeoLineRenderer中的width
     * @example
     * ```
     * geoObject.renderer.outlineWidth = 10; //线的宽度设为10
     * ```
     */
    outlineWidth: number;

    /**
     * 设置高光强度
     * @example
     * ```
     * geoObject.renderer.specularFactor = 1;
     * ```
     */
    specularFactor: number;

    /**
     * 纹理尺寸单位米 如果是GeoBuilding，侧面贴图时会根据纹理尺寸去计算uv 在textureWrap为repeatY时 设置数组第二个参数生效 第一个参数无效 如果是GeoPolygon，顶面贴图时会根据纹理尺寸去计算uv
     * @example
     * ```
     * geoObject.renderer.textureSize = [3,3];  // 设置贴图纹理尺寸为3*3m
     * ```
     */
    textureSize: [number, number];

    /**
     * 设置贴图循环方式，CMAP.TextureWrapMode.Stretch 拉伸，CMAP.TextureWrapMode.RepeatY 高度方向平铺 CMAP.TextureWrapMode.Repeat 水平和高度方向均平铺
     * @example
     * ```
     * geoObject.renderer.textureWrap = CMAP.TextureWrapMode.RepeatY;
     * ```
     */
    textureWrap: string;

    /**
     * 设置楼宇材质类型 vector或image
     * @example
     * ```
     * geoObject.renderer.type = 'image'; //设置楼的渲染类型为image(贴图) 设置该属性后需要设置imageUrl
     * geoObject.renderer.type = 'vector'; //设置楼的渲染类型为vector(纯色) 设置该属性后需要设置color
     * ```
     */
    type: string;

    /**
     * 是否使用窗体效果
     */
    useWindow: boolean;

    /**
     * type为image时生效 代表贴图在x和y方向的重复次数
     * @example
     * ```
     * geoObject.renderer.uvRatio = [10,10];
     * ```
     */
    uvRatio: [number, number];
  }

  /**
   * GeoWater 水面
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoWater.html)
   */
  class GeoWater extends CMAP.GeoPolygon {
      /**
     * @param options 参数列表
     * @example
     * ```
     * var geoWater = app.create({
     *     type: 'GeoWater',
     *     name: 'water',
     *     coordinates: [
     *     [
     *       116.29510045051576,
     *       40.009579162169736
     *     ],
     *     [
     *       116.29541158676146,
     *       40.00562637628762
     *     ],
     *     [
     *       116.29592657089233,
     *       40.005445578112436
     *     ],
     *     [
     *       116.29912376403807,
     *       40.00551954106016
     *     ],
     *     [
     *       116.30106568336487,
     *       40.00595509901582
     *     ],
     *     [
     *       116.30150556564332,
     *       40.007598688913966
     *     ],
     *     [
     *       116.30104422569275,
     *       40.00968599104397
     *     ],
     *     [
     *       116.30050778388977,
     *       40.010154392595815
     *     ],
     *     [
     *       116.29913449287415,
     *       40.01077892299832
     *     ],
     *     [
     *       116.29843711853026,
     *       40.01081179286122
     *     ],
     *     [
     *       116.29664540290833,
     *       40.01054883351485
     *     ],
     *     [
     *       116.29559397697449,
     *       40.0101626101382
     *     ],
     *     [
     *       116.29510045051576,
     *       40.009579162169736
     *     ]
     *   ],//支持Polygon和MultiPolygon,格式可参考geoJson规范
     *     userData: {name:'圆明园' },
     *     renderer: {
     *         reflectionNormal: 'https://www.thingjs.com/citybuilder_console/static/     * texture/waternormals.jpg',//反射法线贴图
     *         refractionNormal: 'https://www.thingjs.com/citybuilder_console/static/     * texture/Water_2_M_Normal.jpg',//折射法线贴图
     *         reflectionImage: 'https://www.thingjs.com/citybuilder_console/static/     * texture/refraction.jpg',//反射图
     *         refractionImage: 'https://www.thingjs.com/citybuilder_console/static/     * texture/refraction.jpg',//折射图
     *         color: [150,150,150],//水的颜色
     *         flowSpeed: 1.0//水体流速，默认1.0
     *     }
     * });
     * ```
     */
      constructor(options: {
      /** 类型'GeoWater' */
      type: 'GeoWater';
      /**
       * 面的名字
       */
      name?: string;
      /** 坐标数组 [[[116, 39],[116, 40], [117, 40],[117, 39],[116, 39]]] */
      coordinates?: Array<Array<[number, number]>>;
      /**
       * GeoWater渲染样式
       */
      renderer?: CMAP.GeoWaterRenderer;
      /**
       * 用户定义属性
       */
      userData?: object;
    });
  }

  /**
   * GeoWater样式类
   * @see [文档](http://192.168.1.238:8080/CMAP.GeoWaterRenderer.html)
   */
  class GeoWaterRenderer {
      /**
     * @param object 使用样式的主体 可以是GeoLine也可以是geometryType为GeoLine的FeatureLayer
     * @param param 参数列表
     */
      constructor(
      object: object,
      param: {
        /** 水面默认混合颜色 */
        color?: string | any[] | number;
        /**
         * 反射法线图
         */
        reflectionNormal?: string;
        /** 折射法线图 */
        refractionNormal?: string;
        /**
         * 反射图
         */
        reflectionImage?: string;
        /**
         * 折射图
         */
        refractionImage?: string;
        /**
         * 流动速度 默认1.0
         */
        flowSpeed?: number;
        /**
         * 波纹长度 默认0.25
         */
        waveLength?: number;
      }
    );

    /**
     * @example
     * ```
     * geoWater.renderer.flowSpeed = 2; // 设置流动速度为2,这个值无实际意义,数值越大流动越快
     * ```
     */
    flowSpeed: number;

    reflectionImage: string;

    reflectionNormal: string;

    refractionImage: string;

    refractionNormal: string;

    /**
     * @example
     * ```
     * geoWater.renderer.waveLength = 0.25; //设置水面波纹长度
     * ```
     */
    waveLength: number;
  }

  /**
   * 地球热力图图层类
   * @see [文档](http://192.168.1.238:8080/CMAP.HeatMapLayer.html)
   */
  class HeatMapLayer {
      /**
     * @param options 参数列表
     * @example
     * ```
     * $.ajax({
     *     type: 'GET',
     *     url: 'https://www.thingjs.com/uearth/res/beijing-POIs-3211.geojson',
     *     dataType: 'json',
     *     success: function (data) {
     *         var heatmapLayer = app.create({
     *             type: 'HeatMapLayer',
     *             dataSource: data, //数据源 geojson格式
     *             valueField: 'code', //权重字段
     *             needsUpdate: true, //是否随相机的变化重新绘制热力图
     *             renderer: {
     *                 radius: 10, // 影响半径
     *                 minOpacity: 0.2,//最小值的透明度
     *                 maxOpacity: 0.8,//最大值的透明度
     *                 mosaic: true,//是否使用马赛克效果
     *                 mosaicSize: 5,//马赛克效果的像素值
     *                 gradient: { 0: 'rgb(0,0,255)', 0.33: 'rgb(0,255,0)', 0.66: 'rgb     * (255,255,0)', 1.0: 'rgb(255,0,0)' } //色带
     *             },
     *         });
     *         map.addLayer(heatmapLayer);
     *     }
     * });
     * ```
     */
      constructor(options: {
      /** 类型'HeatmapLayer' */
      type: 'HeatmapLayer';
      /**
       * 数据源 仅支持geojson的点数据
       */
      dataSource?: any[];
      /** 热力图的渲染样式（CMAP.GeoHeatMapRenderer） */
      renderer?: object;
      /**
       * 热力图的权重字段 可以在geojson每一个feature的properties中找到
       */
      valueField?: string;
      /**
       * 是否随相机变化更新
       */
      needsUpdate?: boolean;
    });

    /**
     * 生成热力图使用的数据源 支持geojson的点数据源
     * @example
     * ```
     * heatMapLayer.dataSource =  {
     * "type": "FeatureCollection",
     * "features": [{
     *     "type": "Feature",
     *     "properties": {
     *       "type": "rain",
     *       "value": 5
     *     },
     *     "geometry": {
     *       "type": "Point",
     *       "coordinates": [-73.99995803833008, 40.71805432623303]
     *     }
     *   }, {
     *     "type": "Feature",
     *     "properties": {
     *       "type": "water",
     *       "value": 7
     *     },
     *     "geometry": {
     *       "type": "Point",
     *       "coordinates": [-73.98167610168457, 40.726087955120704]
     *     }
     *   }]
     * }
     * ```
     */
    dataSource: object;

    /** 是否随相机变化刷新 */
    needsUpdate: boolean;

    /** 热力图权重字段 */
    valueField: string;
  }

  /**
   * 弹窗(InfoWindow)类
   * @see [文档](http://192.168.1.238:8080/CMAP.InfoWindow.html)
   */
  class InfoWindow {
      /**
     * @param object 需要标注的地理对象
     * @param param 参数列表
     */
      constructor(
      object: object,
      param: {
        /**
         * 信息框的类型，支持CMAP.InfoWindowType.Standard(标准)和CMAP.InfoWindowType.Custom(自定义)两种类型， type为CMAP.InfoWindowType.Standard 会读取fieldData中的信息设置弹窗内容 type为CMAP.InfoWindowType.Custom 会根据customHtml设置弹窗内容
         */
        type?: string;
        /**
         * 自定义信息框的html文本,仅在type为custom时生效
         */
        customHtml?: string;
        /**
         * 信息框显示方式，包括CMAP.DisplayMode.MouseEnter(悬浮显示)、CMAP.DisplayMode.Click(点击显示)、CMAP.DisplayMode.Always(一直显示)CMAP.DisplayMode.None(不显示)四种类型
         */
        displayMode?: string;
        /**
         * 信息框的标题
         */
        title?: string;
        /**
         * 信息框的样式，包括CMAP.InfoWindowStyle.Default、CMAP.InfoWindowStyle.Blue和CMAP.InfoWindowStyle.White三种类型
         */
        style?: string;
        /**
         * 信息框的偏移量 [x,y,z]分别代表三个轴偏移量 上下为y轴 左右为x轴 前后为z轴
         */
        offset?: [number, number, number];
        /**
         * 信息框的轴心，以百分比表示界面轴心位置 [0,0] 代表界面左上；[1,1] 代表界面右下 默认[0.5,1] 数组每个值可以大于1用于控制像素级别的offset
         */
        pivot?: [number, number];
        /**
         * 信息框中显示的字段、字段别名、超链接和弹出框方式四种数据
         */
        fieldData?: any[];
      }
    );

    /**
     * 信息框的类型，有 standard(标准) 和 custom(自定义) 两种类型，type为standard会读取fieldData中的信息设置弹窗内容 type为custom 会根据customHtml设置弹窗内容
     * @example
     * ```
     * infoWindow.type = 'custom'; //设置信息框的类型为“自定义类型”
     * ```
     */
    type: string;

    /**
     * 信息框的显示和隐藏状态，true时是显示，false时是隐藏
     * @example
     * ```
     * infoWindow.visible = false; //隐藏信息框
     * ```
     */
    visible: boolean;

    /**
     * 信息框的标题
     * @example
     * ```
     * infoWindow.title = '基本信息'; //设置信息框的标题是'基本信息'
     * ```
     */
    title: string;

    /**
     * 信息框的样式，有default(默认)、blue(蓝色) 和 white(白色) 三种选项
     * @example
     * ```
     * infoWindow.style = 'blue'; //设置信息框的样式是“蓝色”
     * ```
     */
    style: string;

    /**
     * 界面的轴心，以百分比表示界面轴心位置。[0,0] 代表界面左上；[1,1] 代表界面右下 默认[0.5,1]
     */
    readonly pivot: [number, number];

    /**
     * 信息框的UI偏移量[xOffset,yOffset,zOffset] xOffset代表左右偏移 左负右正 yOffset代表上下偏移 上正下负 zOffset代表前后偏移 前负后正
     * @example
     * ```
     * infoWindow.offset = [10,0,0]; // 设置信息框的向X正半轴方向偏移10米
     * ```
     */
    offset: [number, number, number];

    /**
     * 自定义信息框的html文本,仅在type为custom时生效
     * @example
     * ```
     * //设置自定义信息框的html文本为 注{{}}包住的是需要标注对象的userData中的属性名称
     * //比如被标注物体的userData.name='花家地南街' 该例子信息框的html文本为'<div>站名:花家地南街</div>'
     * infoWindow.customHtml = '<div>站名:{{name}}</div>';
     * ```
     */
    customHtml: string;

    /**
     * 信息框显示方式，包括CMAP.DisplayMode.MouseEnter(悬浮显示)、CMAP.DisplayMode.Click(点击显示)、CMAP.DisplayMode.Always(一直显示)CMAP.DisplayMode.None(不显示)四种类型
     * @example
     * ```
     * infoWindow.displayMode = 'clickShow'; //设置信息框的显示方式为'clickShow'，即'点击显示'
     * ```
     */
    displayMode: string;

    /**
     * 信息框中显示的信息
     * @example
     * ```
     *      * //设置信息框的显示'OBJECTID'、'NAME'两个字段的信息，字段别名分别为'编号'、'姓     * 名'，点击姓名字段，在当前页面弹出400*300大小的页面
     * infoWindow.fieldData = [
     *    {field:'OBJECTID',alias:'编号' },
     *    {field:'NAME',alias:'姓名',url:'https://www.baidu.com', target:'current' ,     * width:400,height:300}
     * ];
     * //fieldData中每一项都是一个对象
     * //例如 {field:'OBJECTID',alias:'编号',url:'https://www.baidu.com',      * target:'current' ,width:400,height:300 },
     * //field代表需要标注的字段名 可以在被标注物体的userData中找到
     * //alias代表在标注中显示该字段名的别名，该例子中，显示'编号'
     * //url 如果设置url,则点击标注中这一条记录会跳转到该url地址
     * //target 在设置url的情况下，代表跳转到新页面还是在当前页打开 target取值有两种 一种是current代表当前页 一种是new代表新页面
     * //width 在设置url并且target为current时，代表在当前页弹出口的宽度 默认800
     * //height 在设置url并且target为current时，代表在当前页弹出口的高度 默认600
     * ```
     */
    fieldData: any[];

    /**
     * 销毁信息框
     * @example
     * ```
     * infoWindow.destroy(); //销毁已创建的信息框
     * ```
     */
    destroy(): void;
  }

  /**
   * Label 标签类
   * @see [文档](http://192.168.1.238:8080/CMAP.Label.html)
   */
  class Label {
      /**
     *
     * @param parentObj 父物体
     * @param options 参数列表
     * @param dropShadowColor options.dropShadowColor 文字阴影颜色 默认黑色
     */
      constructor(
      parentObj: object,
      options: {
        /** 字体大小 默认18 */
        fontSize?: number;
        /** 文字内容 如果使用userData中的某个字段的值，使用{{字段名}} */
        text?: string;
        /**
         * 文字偏移 [xOffset,yOffset] 单位:像素 xOffset左负右正 yOffset上正下负
         */
        offset?: [number, number];
        /** 文字颜色 默认黑色 */
        fontColor?: number[] | string;
        /** 字体，默认 Arial,Microsoft YaHei */
        fontFamily?: string;
        /** 背景图片的url */
        imageUrl?: string;
        /**
         * 图片内边距[paddingX,paddingY] paddingX为左右间距 paddingY为上下间距
         */
        imagePadding?: [number, number];
        /** 是否显示文字阴影 */
        dropShadow?: boolean;
      },
      dropShadowColor: number[] | String
    );

    /**
     * Label的偏移 [xOffset,yOffset] 单位:像素 xOffset左负右正 yOffset上正下负
     * @example
     * ```
     * label.offset = [0,20]; //点的标注向上偏移20像素
     * ```
     */
    offset: [number, number];

    /**
     * Label的文字内容
     * @example
     * ```
     * //设置文字内容 注{{}}包住的是需要标注对象的userData中的属性名称
     * //比如被标注物体的userData.name='花家地南街' 该例子中的标注会显示 '名称:花家地南街'
     * label.text = '名称:{{name}}';
     * ```
     */
    text: string;

    /**
     * Label是否可见
     * @example
     * ```
     * label.visible = false; //设置label不可见
     * ```
     */
    visible: boolean;

    /**
     * Label的字体大小 默认18
     * @example
     * ```
     * label.fontSize = 12; //设置字体大小为12
     * ```
     */
    fontSize: number;

    /**
     * Label的偏移 [xOffset,yOffset] 单位:像素 xOffset左负右正 yOffset上正下负
     * @example
     * ```
     * label.offset = [0,20]; //点的标注向上偏移20像素
     * ```
     */
    imagePadding: [number, number];

    /**
     * 设置/获取标注背景图url
     * @example
     * ```
     * label.imageUrl = '/uGeo/image/pop.png';//设置标注背景图url
     * ```
     */
    imageUrl: string;

    /**
     * 字体名称
     * @example
     * ```
     * label.fontFamily = '黑体'; //设置标注字体为黑体
     * ```
     */
    fontFamily: string;

    /**
     * 文字颜色
     * @example
     * ```
     * label.fontColor = 'rgb(255,0,0)'; //设置标注颜色为红色
     * ```
     */
    fontColor: any[] | string;

    /** 是否设置字体阴影 */
    dropShadow: boolean;

    /**
     * 设置/获取 字体阴影颜色
     * @example
     * ```
     * label.dropShadowColor = [255,0,0]; //设置字体阴影颜色为[255,0,0]
     * ```
     */
    dropShadowColor: number[] | string;
  }

  /**
   * 图层的基类 FeatureLayer ThingLayer BigDataLayer的父类
   * @see [文档](http://192.168.1.238:8080/CMAP.Layer.html)
   */
  class Layer extends THING.BaseObject {
    /** 图层中所有的对象 */
    readonly objects: any[];

    /**
     * 离地高度 单位:米
     * @example
     * ```
     * featureLayer.offsetHeight = 200; //设置离地高度200米
     * ```
     */
    offsetHeight: number;

    /**
     * 离地高度的字段
     * @example
     * ```
     * featureLayer.offsetHeightField = 'height'; //根据height字段设置离地高度
     * ```
     */
    offsetHeightField: string | number;

    /**
     * 设置显示级别,[最小级别,最大级别]或者是[最小级别],该图层在这个级别范围内才显示
     * @example
     * ```
     * layer.visibleLevel = [10,15];//限制图层在10-15层级范围内显示
     * ```
     */
    visibleLevel: [number, number];

    /**
     * 设置图层可见 对于图层来说,如果仅仅设置图层本身节点的visible,第二个参数传false,如果需要影响图层内各要素的visible,第二个参数传true 注:如果图层内要素visible为true 而图层本身的visible是false 这个要素是不会被显示的
     * @param value 是否可见
     * @param effectChildren 是否影响图层内要素
     */
    setVisible(value: boolean, effectChildren: boolean): void;
  }

  /**
   * @see [文档](http://192.168.1.238:8080/CMAP.BigDataLayer.html)
   */
  class BigDataLayer extends CMAP.Layer {}

  /**
   * 瓦片图层类
   * @see [文档](http://192.168.1.238:8080/CMAP.TileLayer.html)
   */
  class TileLayer extends THING.BaseObject {
      /**
     * @example
     * ```
     * var app = new THING.App({
     *     container: 't3d', // 3D 的容器
     * });
     * var map = app.create({
     *     type: 'Map'
     * });
     * var tileLayer = app.create({
     *     type: 'TileLayer',
     *     name: 'tileLayer1',
     *     url: 'http://mt{0,1,2,3}.google.cn/vt/lyrs=s&x={x}&y={y}&z={z}',
     *     maximumLevel:18 // 超过该级别的瓦片将不被刷新 这里的级别是指瓦片服务的级别 不传该参数则不限制瓦片级别
     * });
     * map.baseLayers.add(tileLayer);
     * ```
     */
      constructor(param: {
      /** 瓦片图层name */
      name?: string;
      /** 瓦片图地图服务最大级别 如不设置默认是无限制 */
      maximumLevel?: number;
      /** 瓦片图地图服务url */
      url?: string;
      /** 瓦片图层样式 */
      style?: {
        /**
         * 预置的模板、主要有以下几种CMAP.TileLayerStyle.DARKBLUE,CMAP.TileLayerStyle.DARKGREEN,CMAP.TileLayerStyle.NORMAL,CMAP.TileLayerStyle.CUSTOMCOLOR
         */
        template?: string;
        /**
         * 当tileStyle==CMAP.TileLayerStyle.CUSTOMCOLOR时生效，代表瓦片图上的一层颜色滤镜，格式为[r,g,b]
         */
        customColor?: number[];
        /** 地球亮度设置默认1.0 */
        brightness?: number;
        /** 瓦片对比度默认1.0 */
        contrast?: number;
        /** 瓦片饱和度默认1.0 */
        saturation?: number;
        /** 瓦片伽马值默认1.0 */
        gamma?: number;
        /** 瓦片色调默认0.0 */
        hue?: number;
      };
    });

    /** 瓦片图地图服务最大级别 */
    readonly maximumLevel: number;

    /**
     * 瓦片图层样式,一般我们通过设置TileLayer.style.template,TileLayer.style.customColor,TileLayer.style.brightness等属性设置瓦片图层的样式,而不是直接设置TileLayer.style
     */
    style: CMAP.TileLayerStyle;

    /**
     * 瓦片图地图服务url
     */
    url: string;
  }

  /**
   * 图层的集合
   * @see [文档](http://192.168.1.238:8080/CMAP.LayerCollection.html)
   */
  class LayerCollection extends THING.Selector {
      /**
     * 移除全部图层
     * @example
     * ```
     * map.userLayers.removeAll();//userLayers移除全部图层
     * ```
     */
      removeAll(): void;
  }

  /**
   * 地图类
   * @see [文档](http://192.168.1.238:8080/CMAP.Map.html)
   */
  class Map extends THING.BaseObject {
      /**
     * @example
     * ```
     * var app = new THING.App({
     *    container: 't3d', // 3D 的容器
     * });
     *
     * //直接创建Map对象
     * var map = app.create({
     *     type: 'Map'
     *     atmosphere :false,//不开大气效果 默认开启
     *     terrainUrl: 'http://data.marsgis.cn/terrain',//地形服务url
     *     restrictedLevel:[0,22],//定义地图层级
     *     maxPitch:82,//地球最大俯仰角度，不能大于90
     *     style:{
     *       night:false, //不开启白天黑夜 默认开启
     *       fog :false  //开启雾效果 默认关闭 目前该参数只能在初始化时设置
     *     },
     *     attribution:'Google' //地图右下角的信息
     * });
     * //通过CityBuilder导出的url创建地图
     * var map = app.create({
     *     type: 'Map'
     *     url:'https://www.thingjs.com/citybuilder_console/mapProject/config/     * TVRFNE9UZz1DaXR5QnVpbGRlckAyMDE5',
     *     complete:function(e){
     *       //地图上要素创建完毕的回调函数
     *       THING.Utils.log(e.object.userLayers.length);
     *     }
     * });
     * map.on('click',function (event){
     *   //对于Map 事件返回的属性中添加了coordinates 代表点击的经纬度信息
     *   THING.Utils.log(event.coordinates);
     * });
     * ```
     */
      constructor(options: {
      /**
       * 类型'Map'
       */
      type?: 'Map';
      /**
       * 地形服务url,如果不传就不加地形,目前地形必须在map初始化时设置，设置后，会创建一个TerrainLayer并且赋值给Map.terrainLayer这里的地形服务是遵循TMS切片规范的terrain格式的地形服务
       *
       * 一个高程数据集的瓦片url类似于：https://assets.cesium.com/1/{z}/{x}/{y}.terrain(需要token才可以访问)
       */
      terrainUrl?: string;
      /**
       * 是否开启大气效果，默认为 true
       */
      atmosphere?: boolean;
      /**
       * 地图渲染效果
       */
      style?: CMAP.MapStyle;
      /**
       * 地图最大最小缩放级别 之前的属性名为level 也支持但推荐使用restrictedLevel 默认[0,22]
       */
      restrictedLevel?: [number, number];
      /**
       * 右下角地图的版权信息
       */
      attribution?: string;
    });

    /** 所有图层的集合,包含baseLayers,terrainLayer,useLayers */
    readonly allLayers: CMAP.LayerCollection;

    /** 获取当前地图层级 */
    readonly currentLevel: number;

    /**
     * 设置地图的attribution，在地图右下角有一个小方盒子中呈现,如果不填写，会默认展示ThingJs的超链接， 如果填写，会在ThingJS后添加相应的内容
     *
     * 系统内置了几种常用的地图的attribution的写法，如Google OSM Carto GeoQ Gaode，系统会自动生成对应的attribution.
     *
     * 如果传none 则不会生成attribution
     *
     * 也可以自定义attribution
     * @example
     * ```
     * map.attribution = 'Google';//设置谷歌地图的版权信息
     * map.attribution = 'My Attribution'; //自定义版权信息 右下角会展示ThingJS|My Attribuition
     * map.attribution = 'none'; //不显示版权信息
     * ```
     */
    attribution: string;

    /**
     * 基础底图集合
     */
    readonly baseLayers: CMAP.BaseLayerCollection;

    /**
     * 设置地图可以缩放层级,默认是[0,22] 推荐使用restrictedLevel
     * @example
     * ```
     * map.style.level = [0,18]; //设置地图默认缩放层级为最小0最大18
     * ```
     */
    level: [number, number];

    /**
     * 地图最大俯仰角 最大90
     * @example
     * ```
     * map.maxPitch = 60; //设置地图最大俯仰角为60度
     * ```
     */
    maxPitch: number;

    /**
     * 设置地图可以缩放层级,默认是[0,22]
     * @example
     * ```
     * map.restrictedLevel = [0,18]; //设置地图默认缩放层级为最小0最大18
     * ```
     */
    restrictedLevel: [number, number];

    /**
     * 地形图层
     */
    terrainLayer: CMAP.TerrainLayer;

    /**
     * 业务图层的集合
     */
    readonly userLayers: CMAP.UserLayerCollection;

    /**
     * 地球相关工具,包括坐标转换,角度计算等 也可通过CMAP.Util获取
     */
    readonly util: CMAP.Util;

    /**
     * 地球是否显示 true:显示；false:不显示
     */
    visible: boolean;

    /**
     * map中添加layer,可以添加FeatureLayer、ThingLayer、TileLayer等
     * @param layer 需要添加的图层
     */
    addLayer(layer: CMAP.TileLayer | CMAP.ThingLayer | CMAP.FeatureLayer): void;

    /**
     * 根据图层名称获取图层
     * @param name 图层实例的name
     * @example
     * ```
     * var layer = map.getLayerByName('name1');//获取name为name1的图层
     * ```
     */
    getLayerByName(name: string): THING.Selector;

    /**
     * map中移除layer,可以移除FeatureLayer、ThingLayer、TileLayer等
     * @param layer 需要移除的图层
     */
    removeLayer(
      layer: CMAP.TileLayer | CMAP.ThingLayer | CMAP.FeatureLayer
    ): void;

    /**
     * 地球旋转
     * @param param 参数列表
     */
    rotate(param: {
      /** 旋转角度 */
      angle?: number;
      /** 旋转速度 单位:(度/秒) */
      speed?: number;
      /** 旋转完毕后的回调函数 */
      complete?: Function;
    }): void;
  }

  /**
   * 基础Layer能够添加各种对象
   * @see [文档](http://192.168.1.238:8080/CMAP.ThingLayer.html)
   */
  class ThingLayer extends CMAP.Layer {
      /**
     * @example
     * ```
     * var thingLayer = app.create({
     *   type: 'ThingLayer',
     *   name: 'thingLayer1'
     * });
     * var geoPoint = app.create({
     *   type: 'GeoPoint',
     *   name: 'geoPoint',
     *   coordinates: [116.39, 39.96],
     *   userData:{'cityName':'Beijing'},
     *   renderer:{
     *     type: 'image',//image代表创建图片类型的点
     *     url:'image/uGeo/pop.png',//图片的url
     *     size:10  //尺寸
     *   }
     * });
     * thingLayer.add(geoPoint);//将一个点加到ThingLayer中
     * map.userLayers.add(thingLayer);//ThingLayer加到Map中
     * ```
     */
      constructor(param: {
      /** 类型'ThingLayer' */
      type?: 'ThingLayer';
      /** 图层名称 */
      name?: string;
    });

      /**
     * 添加对象到Layer
     * @param obj 要添加到图层中的对象GeoPoint,GeoLine,GeoBuilding,GeoPolygon,Marker,Thing,Campus等等
     * @example
     * ```
     * var geoPoint = app.create({
     *   type: 'GeoPoint',
     *   name: 'geoPoint',
     *   coordinates: [116.39, 39.96],
     *   userData:{'cityName':'Beijing'},
     *   renderer:{
     *     type: 'image',//image代表创建图片类型的点
     *     url:'image/uGeo/pop.png',//图片的url
     *     size:10  //尺寸
     *   }
     * });
     * thingLayer.add(geoPoint);
     * ```
     */
      add(obj: object): void;

      /**
     * 删除Layer中指定的对象
     * @example
     * ```
     * thingLayer.remove(geoPoint);//geoPoint是thingLayer中的一个对象
     * ```
     */
      remove(obj: object): void;

      /**
     * 删除layer下的所有对象
     */
      removeAll(): void;
  }

  /**
   * 倾斜摄影图层类
   * @see [文档](http://192.168.1.238:8080/CMAP.Tile3dLayer.html)
   */
  class Tile3dLayer extends THING.BaseObject {
      /**
     * @example
     * ```
     * var thingLayer = app.create({
     *   type: 'ThingLayer',
     *   name: 'thingLayer1'
     * });
     * var geoPoint = app.create({
     *   type: 'GeoPoint',
     *   name: 'geoPoint',
     *   coordinates: [116.39, 39.96],
     *   userData:{'cityName':'Beijing'},
     *   renderer:{
     *     type: 'image',//image代表创建图片类型的点
     *     url:'image/uGeo/pop.png',//图片的url
     *     size:10  //尺寸
     *   }
     * });
     * thingLayer.add(geoPoint);//将一个点加到ThingLayer中
     * map.userLayers.add(thingLayer);//ThingLayer加到Map中
     * ```
     */
      constructor(param: {
      /** 倾斜摄影图层名称 */
      name?: string;
      /** 倾斜摄影服务url' */
      url?: string;
      /** 倾斜摄影数据抬起的高度 支持负数 */
      offsetHeight?: number;
      /**
       * 倾斜摄影数据原点对应的经纬度(用于倾斜摄影与底图位置有偏差时，指定中心点坐标)
       */
      centerCoordinates?: any[];
    });

    /** 倾斜摄影的偏移高度 */
    offsetHeight: number;

    /** 倾斜摄影图层是否显示 */
    visible: boolean;
  }

  /**
   * 瓦片样式类
   * @see [文档](http://192.168.1.238:8080/CMAP.TileLayerStyle.html)
   */
  class TileLayerStyle {
      constructor(param: {
      /**
       * 样式名称 支持CMAP.TileLayerStyle.DARKBLUE,CMAP.TileLayerStyle.DARKGREEN,CMAP.TileLayerStyle.NORMAL,CMAP.TileLayerStyle.CUSTOMCOLOR
       */
      template: string;
      /**
       * 当tileStyle==CMAP.TileLayerStyle.CUSTOMCOLOR时生效，代表瓦片图上的一层颜色滤镜，格式为[r,g,b]
       */
      customColor: string | number[];
      /** 瓦片图亮度设置默认1.0 */
      brightness: number;
      /** 瓦片对比度默认1.0 */
      contrast: number;
      /** 瓦片色调默认0.0 */
      hue: number;
      /** 瓦片饱和度默认1.0 */
      saturation: number;
      /**
       * 瓦片图层灰度滤镜色带颜色,仅当tileStyle==CMAP.TileLayerStyle.CUSTOMCOLOR时生效,格式为 [[r,g,b], [r,g,b]]
       */
      grayFilterColorBar: Array<number[]>;
      /** 是否允许灰度滤镜,仅当tileStyle==CMAP.TileLayerStyle.CUSTOMCOLOR时生效 */
      grayFilterEnable: boolean;
      /**
       * 瓦片图层灰度滤镜 开关,仅当tileStyle==CMAP.TileLayerStyle.CUSTOMCOLOR时生效,格式为 [0.0, 1.0]
       */
      grayFilterPerBar: number[];
      /** 瓦片伽马值默认1.0 */
      gamma: number;
    });

    /**
     * 瓦片亮度,默认值是1.0
     * @example
     * ```
     * tileLayer.style.brightness = 0.5;//瓦片亮度调为0.5
     * ```
     */
    brightness: number;

    /**
     * tileLayer.style.contrast = 0.5;//瓦片对比度调为0.5
     * @example
     * ```
     * contrast 对比度，默认为1
     * ```
     */
    contrast: number;

    /**
     * 瓦片图层滤镜颜色,仅当tileStyle==CMAP.TileLayerStyle.CUSTOMCOLOR时生效,格式为[r,g,b]
     * @example
     * ```
     * tileLayer.style.template = CMAP.TileLayerStyle.CUSTOMCOLOR;//瓦片样式调为深蓝
     * tileLayer.style.customColor = 'rgb(255,0,0)';//瓦片添加红色滤镜
     * ```
     */
    customColor: string | number[];

    /**
     * 瓦片gamma值，默认为1
     * @example
     * ```
     * tileLayer.style.gamma = 0.5;//瓦片伽马值设置为0.5
     * ```
     */
    gamma: number;

    /**
     * 瓦片图层灰度滤镜色带颜色,仅当tileStyle==CMAP.TileLayerStyle.CUSTOMCOLOR时生效,格式为 [[r,g,b], [r,g,b]]
     * @example
     * ```
     * tileLayer.style.grayFilterColorBar = [[255.0, 0.0, 0.0], [0.0, 255.0, 0.0], [0.0, 0.0, 255.0]];// 颜色渐变值
     * ```
     */
    grayFilterColorBar: Array<number[]>;

    /**
     * 瓦片图层灰度滤镜 开关,仅当tileStyle==CMAP.TileLayerStyle.CUSTOMCOLOR时生效
     */
    grayFilterEnable: boolean;

    /**
     * 瓦片图层灰度滤镜 灰度极值,仅当tileStyle==CMAP.TileLayerStyle.CUSTOMCOLOR时生效,格式为 [0.0, 1.0]
     * @example
     * ```
     * tileLayer.style.grayFilterPerBar = [0,0.5,1];
     * ```
     */
    grayFilterPerBar: number[];

    /**
     * 瓦片色调，默认为1
     * @example
     * ```
     * tileLayer.style.hue = 0.5;//瓦片色调设置为0.5
     * ```
     */
    hue: number;

    /**
     * 瓦片饱和度，默认为1
     * @example
     * ```
     * tileLayer.style.saturation = 0.5;//瓦片饱和度设置为0.5
     * ```
     */
    saturation: number;

    /**
     * 瓦片样式模板,目前支持CMAP.TileLayerStyle.DARKBLUE,CMAP.TileLayerStyle.DARKGREEN,CMAP.TileLayerStyle.NORMAL,CMAP.TileLayerStyle.CUSTOMCOLOR
     * @example
     * ```
     * tileLayer.style.template = CMAP.TileLayerStyle.DARKBLUE;//瓦片样式调为深蓝
     * ```
     */
    template: string;
  }

  /**
   * 地图相关的工具类
   * @see [文档](http://192.168.1.238:8080/CMAP.Util.html)
   */
  class Util {
      /**
     * 经纬度坐标转Web墨卡托投影坐标
     * @param lonLat [经度，纬度]
     * @returns Web墨卡托投影坐标 [x,y]
     * @example
     * ```
     * CMAP.Util.convertWebMercatorToLonlat([119.5,36.5]); //返回web墨卡托坐标 [12968720.675611112, 4793547.458437541]
     * ```
     */
      static convertLonlatToWebMercator(lonLat: [number, number]): number[];

      /**
     * 经纬度转世界坐标
     * @param lonLat [经度，纬度]
     * @param h 离地高度 默认0
     * @returns 世界坐标 [x,y,z]
     */
      static convertLonlatToWorld(
      lonLat: [number, number],
      h: number
    ): [number, number, number];

      /**
     * 墨卡托投影转经纬度坐标
     * @param mercator Web墨卡托坐标 [x,y]
     * @returns 经纬度坐标 [经度，纬度]
     * @example
     * ```
     * var coords = CMAP.Util.convertWebMercatorToLonlat([12968720.675611112, 4793547.458437541]); //返回经纬度坐标 [119.5,36.5]
     * ```
     */
      static convertWebMercatorToLonlat(
      mercator: [number, number]
    ): [number, number];

      /**
     * wgs84坐标转为gcj02坐标
     * @param lonLat [经度，纬度]
     * @returns gcj02经纬度坐标 [经度，纬度]
     * @example
     * ```
     * var gcj02Coords = CMAP.Util.convertWgs84ToGcj02([116.5,39.5]); //返回gcj02坐标 [116.5059564261526, 39.501157091519175]
     * ```
     */
      static convertWgs84ToGcj02(lonLat: [number, number]): [number, number];

      /**
     * 屏幕坐标转世界坐标
     * @param windowPosition 屏幕坐标
     * @returns 世界坐标 [x,y,z]
     */
      static convertWindowToWorld(
      windowPosition: number[]
    ): [number, number, number];

      /**
     * 世界坐标转经纬度
     * @param pos 世界坐标[x,y,z]
     * @returns 经纬度坐标(带高度) [经度，纬度，高度]
     */
      static convertWorldToLonlat(
      pos: [number, number, number]
    ): [number, number, number];

      /**
     * 根据经纬度和方位角得到可以使物体贴地的欧拉角
     * @param lonlat 经纬度坐标
     * @param angle 方位角 默认0
     * @returns 旋转角度 [angleX, angleY, angleZ]
     */
      static getAnglesFromLonlat(
      lonlat: [number, number],
      angle: number
    ): [number, number, number];

      /**
     * 根据世界坐标和方位角得到可以使物体贴地的旋转信息
     * @param pos 世界坐标
     * @param azimuth 方位角 默认0
     * @returns 旋转信息 [angleX, angleY, angleZ]
     */
      static getAnglesFromPosition(
      pos: [number, number, number],
      azimuth: number
    ): [number, number, number];

      /**
     * 计算两点间的方位角
     * @param lonlat1 起点经纬度
     * @param lonlat2 终点经纬度
     * @returns 方位角
     */
      static getAzimuth(
      lonlat1: [number, number],
      lonlat2: [number, number]
    ): number;

      /**
     * 获取多边形中心点
     * @param coordinates 多边形经纬度坐标数组 [[x,y],[x,y],[x,y]......] (注:仅支持二维的经纬度数组)
     * @returns [x,y] 中心点坐标
     * @example
     * ```
     * // 返回多边形的重心的经纬度坐标 [116.47585956650495, 39.98538569844471]
     * var center = CMAP.Util.getCenterCoordinates([[116.4757, 39.9851],
     * [116.4755, 39.9852],
     * [116.4761, 39.9857],
     * [116.4762, 39.9856],
     * [116.4757, 39.9851]]);
     * ```
     */
      static getCenterCoordinates(
      coordinates: Array<[number, number]>
    ): [number, number];

      /**
     * 获取多边形重心
     * @param coordinates 多边形经纬度坐标数组 [[x,y],[x,y],[x,y]......] (注:仅支持二维的经纬度数组)
     * @returns [x,y] 重心点坐标
     * @example
     * ```
     * // 返回多边形的重心的经纬度坐标 [116.47585956650495, 39.98538569844471]
     * var center = CMAP.Util.getCenterOfGravityPoint([[116.4757, 39.9851],
     * [116.4755, 39.9852],
     * [116.4761, 39.9857],
     * [116.4762, 39.9856],
     * [116.4757, 39.9851]]);
     * ```
     */
      static getCenterOfGravityPoint(
      coordinates: Array<[number, number]>
    ): [number, number];

      /**
     * 计算两点间的欧式距离 单位:米
     * @param lonlat1 起点经纬度
     * @param lonlat2 终点经纬度
     * @returns 欧式距离
     */
      static getEuclideanDistance(
      lonlat1: [number, number],
      lonlat2: [number, number]
    ): number;

      /**
     * 获取geojson的范围
     * @param featureCollection geojson对象
     * @returns geojson数据的范围
     * @example
     * ```
     *      * //返回geojson数据的范围 {minX: -73.99995803833008, minY: 40.71805432623303, maxX: -73.98167610168457, maxY: 40.726087955120704}
     * CMAP.Util.getFeatureCollectionExtent({
     *     "type": "FeatureCollection",
     *     "crs": {
     *         "properties": {
     *             "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
     *         },
     *         "type": "name"
     *     },
     *     "features": [
     *         {
     *             "type": "Feature",
     *             "properties": {
     *                 "type": "rain",
     *                 "value": 5
     *             },
     *             "geometry": {
     *                 "type": "Point",
     *                 "coordinates": [
     *                     -73.99995803833008,
     *                     40.71805432623303
     *                 ]
     *             }
     *         },
     *         {
     *             "type": "Feature",
     *             "properties": {
     *                 "type": "water",
     *                 "value": 7
     *             },
     *             "geometry": {
     *                 "type": "Point",
     *                 "coordinates": [
     *                     -73.98167610168457,
     *                     40.726087955120704
     *                 ]
     *             }
     *         }
     *     ]
     * });
     * ```
     */
      static getFeatureCollectionExtent(featureCollection: object): any;
      static applyTemplate(url:string, opts:{resourcePrefix:string, baseLayerUrls:string|string[]}): any;

      /**
     * 计算线的长度单位:米
     * @param coords 经纬度
     * @param isSpherical 是否计算球面距离 默认true 如果传入false 则计算欧氏距离
     * @returns 欧式距离
     * @example
     * ```
     * //根据经纬度计算折线长度 返回结果 29.952
     * var length = CMAP.Util.getLineLength([[116.482141, 40.068031], [116.482137, 40.06816],[116.482133, 40.06802]]);
     * ```
     */
      static getLineLength(
      coords: Array<[number, number]>,
      isSpherical: boolean
    ): number;

      /**
     * 获取多边形的范围
     * @param coordinates 多边形经纬度坐标数组 [[x,y],[x,y],[x,y]......] (注:仅支持二维的经纬度数组)
     * @returns 多边形的范围
     * @example
     * ```
     * // 返回多边形范围  {minX: 116.4755, minY: 39.9851, maxX: 116.4762, maxY: 39.9857}
     * var center = CMAP.Util.getPolygonExtent([[116.4757, 39.9851],
     * [116.4755, 39.9852],
     * [116.4761, 39.9857],
     * [116.4762, 39.9856],
     * [116.4757, 39.9851]]);
     * ```
     */
      static getPolygonExtent(coordinates: Array<[number, number]>): any;

      /**
     * 计算多边形的球面面积
     * @param coords 多边形的坐标
     * @returns 球面面积 单位平方米
     */
      static getSphericalArea(coords: any[]): number;

      /**
     * 计算两点间的球面距离 单位:米
     * @param lonlat1 起点经纬度
     * @param lonlat2 终点经纬度
     * @returns 球面距离
     */
      static getSphericalDistance(
      lonlat1: [number, number],
      lonlat2: [number, number]
    ): number;

      /**
     * 根据位置和旋转角度计算贴地的四元数
     * @param pos
     * @param angle
     * @returns THREE.Quaternion
     */
      static positionToQuaternion(pos: any, angle: any): any;
  }

  /**
   * 业务相关的Layer的集合
   * @see [文档](http://192.168.1.238:8080/CMAP.UserLayerCollection.html)
   */
  class UserLayerCollection {
      /**
     * 重写add方法,添加一个ThingLayer或FeatureLayer对象实例到Selector中
     * @param obj ThingLayer、FeatureLayer、Tile3dLayer、BigDataLayer等对象实例
     * @example
     * ```
     * map.userLayers.add(thingLayer);//thingLayer是一个ThingLayer实例 要在地图上添加该图层
     * map.userLayers.add(featureLayer);//featureLayer是一个FeatureLayer实例 要在地图上添加该图层
     * ```
     */
      add(obj: CMAP.Layer): void;

      /**
     * 删除单个Layer
     * @param obj 需要删除的图层。可以是对象(obj传ThingLayer或FeatureLayer对象实例),可以是图层的id(obj传String),也可以是图层在userLayerCollection中的index(obj传Number)
     * @example
     * ```
     * map.userLayers.remove(thingLayer);//thingLayer是一个ThingLayer实例 要在地图上移除该图层
     * map.userLayers.remove(featureLayer);//featureLayer是一个FeatureLayer实例 要在地图上移除该图层
     * ```
     */
      remove(obj: CMAP.ThingLayer | CMAP.FeatureLayer): void;
  }

  /**
   * 地形图层类
   * @see [文档](http://192.168.1.238:8080/CMAP.TerrainLayer.html)
   */
  class TerrainLayer extends THING.BaseObject {
      constructor(param: {
      /** 地形图层name */
      name?: string;
      /**
       * 地形服务url 支持terrain格式的切片地形服务 例如'http://data.marsgis.cn/terrain'
       */
      url?: string;
    });

    /**
     * 地形夸张倍数
     * @example
     * ```
     * map.terrainLayer.terrainExaggeration = 2;//设置地形夸张2倍
     * ```
     */
    terrainExaggeration: number;

    /**
     * 地形服务的url 支持terrain格式的切片地形服务
     * @example
     * ```
     * map.terrainLayer.url = 'http://data.marsgis.cn/terrain';//设置地形服务地址
     * map.terrainLayer.url = '';//设置url为空字符串可以取消地形
     * ```
     */
    url: string;
  }

  /**
   *
   * @see [文档](http://192.168.1.238:8080/CMAP.MapStyle.html)
   */
  class MapStyle {
      constructor(options: {
      /** 是否开启白天黑夜 默认关闭 */
      night?: boolean;
      /** 是否开启雾效 */
      fog?: boolean;
      /** 雾的浓度 默认0 */
      fogDensity?: number;
      /** 浓雾的浓度 默认0 */
      fogExpDensity?: number;
      /** 浓雾的颜色 默认[255,255,255] */
      fogExpColor?: number[];
    });

    /**
     * 是否开启雾效
     * @example
     * ```
     * map.style.fog = true;//开启雾效果
     * ```
     */
    fog: boolean;

    /**
     * 雾的浓度
     * @example
     * ```
     * map.style.fogDensity = 0.5;//设置雾的浓度为0.5
     * ```
     */
    fogDensity: number;

    /**
     * 浓雾的浓度
     * @example
     * ```
     * map.style.fogExpDensity = 2;//设置浓雾的浓度为2
     * ```
     */
    fogExpDensity: number;

    /**
     * 颜色渐变值，与gradientColorPerBar结合使用
     * @example
     * ```
     * tileLayer.style.gradientColorBar = [[255.0, 0.0, 0.0], [0.0, 255.0, 0.0], [0.0, 0.0, 255.0]];// 颜色渐变值
     * ```
     */
    gradientColorBar: Array<number[]>;

    /**
     * 颜色渐变区间，与gradientColorBar结合使用
     * @example
     * ```
     * tileLayer.style.gradientColorPerBar = [0.0,0.5,1.0];// 颜色渐变区间
     * ```
     */
    gradientColorPerBar: number[];

    /**
     * map.style.night = true;//开启白天黑夜效果
     * @example
     * ```
     * 是否开启白天黑夜
     * ```
     */
    night: boolean;
  }
}
