/*
 * @Description:接口类型定义
 * @Version: 1.0
 * @Autor: lxy
 * @Date: 2022-04-16 21:13:59
 * @LastEditors: lxy
 * @LastEditTime: 2022-06-01 18:35:08
 */
interface MapBaseOpts{
  // 最小缩放层级 选
  minZoomLevel?:number,
  // 最小缩放层级 选
  maxZoomLevel?:number,
  // 地图是否可以平拖 选
  enablePan?:boolean,
  // 地图是否可以俯仰拖动 选
  enableRotate?:boolean,
  // 地图是否可以缩放操作 选
  enableZoom?:boolean,
   // 俯仰角度限制
   xAngleLimitRange?:number[],
   // 左右旋转角度限制
   yAngleLimitRange?:number[],
   // 鼠标左右键操作地图事件互换
   leftInteractive?:boolean,
  // earthjs动态加载完成回调
  scriptLoaded?:()=>void,
}
interface MapAddOpts{
  // 地图包完整路径
  url?:string,
  // 地图包资源路径前缀
  resourcePrefix?:string,
  // 瓦片资源服务地址
  tileLayerUrl?:string,
  isProxima?:boolean
  ajaxAsync?:boolean
  // 地图加载完成回调
  mapLoaded?:(object:any)=>void,
}
interface MapConfigOpts extends MapBaseOpts, MapAddOpts{
  // 场景容器ID
  container:string,
  // 是否加载uearthjs
  openEarth?:boolean,
  // 背景顔色
  background?:string,
}

type Aobject={
  [props:string]:any
}

// 创建园区基础参数
type CampusBaseOpts = {
  // 场景容器ID
  container:string,
  // 是否应用效果模板
  openEffact?:boolean,
  // 是否加载uearthjs
  openEarth?:boolean,
  // 背景顔色
  background?:string,
  // 建筑移入勾边颜色
  buildinghoverColor?:string
  // 楼层移入勾边颜色
  floorHoverColor?:string
  // 楼层展开距离 0表示不展开
  expandfloorDistance?:number
  // 楼层展开回调
  expandfloorComplete?:()=>void
  // 楼层关闭回调
  unexpandfloorComplete?:()=>void
  // 子场景加载成功回调
  childSceneLoaded?:(object:Aobject)=>void
  // js加载成功回调
  scriptLoaded?:()=>void
  // 移入楼层回调,返回当前楼层名字 当前楼层物体对象
  floorHoverCallback?:(param:Aobject, object:Aobject)=>void
  // 移出楼层回调
  floorLeaveCallback?:(param:Aobject, object:Aobject)=>void
}

// 创建园区参数
type CampusAddOpts={
  // 场景名称
  sceneName?:string,
  // 场景位置坐标 经度
  lon?:number
  // 场景位置坐标 纬度
  lat?:number
  // 场景旋转角度 0
  angle?:number
  // 初始化app的配置项
  thingOpt?:any
  // 初始化是否一次加载所有子场景
  initChildScene?:boolean
  // 场景加载成功回调
  sceneLoaded?:(object:Aobject)=>void
}

// 初始化容器类参数
type BaseOpts={
  // 场景容器ID
  container:string,
  // 背景顔色
  background?:string,
  // 是否应用效果模板
  openEffact?:boolean,
  // 是否加载uearthjs
  openEarth?:boolean,
  // earthjs加载成功回调
  scriptLoaded?:()=>void
}

type CombineOpts = BaseOpts & CampusAddOpts & CampusBaseOpts & MapConfigOpts

export {
    CombineOpts, MapAddOpts, MapBaseOpts, MapConfigOpts, CampusAddOpts, CampusBaseOpts, Aobject, BaseOpts
};
