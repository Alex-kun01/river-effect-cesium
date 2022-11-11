/**
 * [ThingJS 文档中心](https://docs.thingjs.com/cn/apidocs/THING.html)
 */
declare namespace THING {
  /**
   * 每帧回收的对象数量
   * 该值设置的越大，内存回收的越快，会有卡顿现象
   */
  const DisposeObjectNumberInFram: number;

  /**
   * 摄像机投影类型 <static, constant>
   */
  enum CameraProjectionType {
    /** 投影方式 */
    Perspective = 'perspective',
    /** 正交方式 */
    Orthographic = 'orthographic',
  }

  /**
   * 摄像机视角方式 <static, constant>
   */
  enum CameraView {
    /** 正常视角 */
    Normal = 'normal',
    /** 顶部视角 */
    TopView = 'topview',
  }

  /**
   * 内核事件 Tag 名称 <static, constant>
   */
  enum EventTag {
    /** 场景层级切换更换默认背景 */
    LevelSetBackground = '__level_set_background__',
    /** 场景层级切换的默认操作 */
    LevelSceneOperations = '__level_scene_operations__',
    /** 场景层级切换后设置默认拾取结果 */
    LevelPickedResultFunc = '__level_picked_result_func__',
    /** 场景层级切换时的默认飞行行为 */
    LevelFly = '__level_fly__',
    /** 场景层级切换时的用户自定义飞行行为 */
    LevelCustomFly = '__level_custom_fly__',
    /** 进入下一层级的默认操作 */
    LevelEnterOperation = '__level_enter_operation__',
    /** 退出当前层级的默认操作 */
    LevelBackOperation = '__level_back_operation__',
  }

  /**
   * 内核事件 <static, constant>
   */
  enum EventType {
    /** 通知系统初始化完成 或 物体完成加载 */
    Complete = 'complete',
    /** 通知窗口大小变化（width, height） */
    Resize = 'resize',
    /** 通知每帧更新 */
    Update = 'update',
    /** 通知场景资源加载进度 */
    Progress = 'progress',
    /** 通知 App 初始化完成 或 场景、物体加载完成 */
    Load = 'load',
    /** 通知物体卸载 */
    Unload = 'unload',
    /** 通知鼠标点击，鼠标单击、双击均会触发 Click 事件（双击时候会触发两次） */
    Click = 'click',
    /** 通知鼠标双击 */
    DBLClick = 'dblclick',
    /** 通知鼠标单击（会有些许的延时，鼠标双击不会触发 SingleClick 单击事件） */
    SingleClick = 'singleclick',
    /** 通知鼠标键抬起 */
    MouseUp = 'mouseup',
    /** 通知鼠标键按下 */
    MouseDown = 'mousedown',
    /** 通知鼠标移动 */
    MouseMove = 'mousemove',
    /** 通知鼠标滚轮滚动 */
    MouseWheel = 'mousewheel',
    /** 通知鼠标首次移入物体 */
    MouseEnter = 'mouseenter',
    /** 通知鼠标首次移入物体, 会一直传递到父物体 */
    MouseOver = 'mouseover',
    /** 通知鼠标首次移出物体 */
    MouseLeave = 'mouseleave',
    /** 通知物体拖拽开始 */
    DragStart = 'dragstart',
    /** 通知物体拖拽进行中 */
    Drag = 'drag',
    /** 通知物体拖拽结束 */
    DragEnd = 'dragend',
    /** 通知键盘按键按下 */
    KeyDown = 'keydown',
    /** 通知键盘按键一直被按下 */
    KeyPress = 'keypress',
    /** 通知键盘按键抬起 */
    KeyUp = 'keyup',
    /** 通知摄像机位置变动开始 */
    CameraChangeStart = 'camerachangestart',
    /** 通知摄像机位置变动结束 */
    CameraChangeEnd = 'camerachangeend',
    /** 通知摄像机位置变动中 */
    CameraChange = 'camerachange',
    /** 摄像机向前/后滚动 */
    CameraZoom = 'camerazoom',
    /** 通知摄像机观察模式改动 */
    CameraViewChange = 'cameraviewchange',
    /** 通知物体创建完成 */
    Create = 'create',
    /** 通知物体删除完成 */
    Destroy = 'destroy',
    /** 通知建筑楼层被展开 */
    Expand = 'expand',
    /** 通知建筑楼层被合并 */
    Unexpand = 'unexpand',
    /** 通知物体被选择 */
    Select = 'select',
    /** 通知物体被取消选择 */
    Deselect = 'deselect',
    /** 通知物体选择集合更新 */
    SelectionChange = 'selectionchange',
    /** 通知场景层级发生改变 */
    LevelChange = 'levelchange',
    /** 通知进入下一层级 */
    EnterLevel = 'enterLevel',
    /** 通知退出当前层级 */
    LeaveLevel = 'leaveLevel',
    /** 通知摄像机飞入下一层级结束 */
    LevelFlyEnd = 'levelflyend',
  }

  interface Event<T extends string, O = undefined, D = undefined> {
    type: T;
    data: D;
    object: O;
  }
  interface ResizeEvent extends Event<'resize'> {
    /** 屏幕宽和高 */
    size: [number, number];
  }
  interface MapCreateProgressEvent extends Event<'mapcreateprogress'> {
    /** 值为 0 ~ 1 */
    progress: number;
  }
  interface ProgressEvent extends Event<'progress', BaseObject> {
    /** 值为 0 ~ 1 */
    progress: number;
    pickedObject: BaseObject;
    __lastObject__: BaseObject;
  }

  interface ThingMouseEvent<T extends string = 'click'>
    extends Event<T, BaseObject, null> {
    coordinates: [number, number];
    pickedPosition: [number, number, number];
    getPickedPos: Function;
    getPickedPosition: Function;
    id: number;
    ignoreFilter: boolean;
    ignoreFrameCheck: boolean;
    picked: boolean;
    intersect: any;
    tag: string | undefined;
    pickedObject: BaseObject;
    __lastObject__: BaseObject;
  }
  type DblclickEvent = ThingMouseEvent<'dblclick'> & MouseEvent;
  type MouseupEvent = ThingMouseEvent<'mouseup'> & MouseEvent;
  type MousedownEvent = ThingMouseEvent<'mousedown'> & MouseEvent;
  type MousemoveEvent = ThingMouseEvent<'mousemove'> & MouseEvent;
  type MousewheelEvent = ThingMouseEvent<'mousewheel'> & MouseEvent;
  type MouseenterEvent = ThingMouseEvent<'mouseenter'> & MouseEvent;
  type MouseoverEvent = ThingMouseEvent<'mouseover'> & MouseEvent;
  type MouseleaveEvent = ThingMouseEvent<'mouseleave'> & MouseEvent;

  interface ThingDragEvent<T extends string = 'drag'>
    extends Event<T, BaseObject> {
    coordinates: [number, number];
    dragObject: BaseObject;
    getPickedPos: Function;
    getPickedPosition: Function;
    id: number;
    ignoreFilter: boolean;
    intersect: any;
    picked: boolean;
    pickedObject: BaseObject;
    pickedPosition: [number, number, number];
    tag: string | undefined;
    __lastObject__: BaseObject;
  }
  type DragstartEvent = ThingDragEvent<'dragstart'> & DragEvent;
  type DragendEvent = ThingDragEvent<'dragend'> & DragEvent;

  interface ThingKeyEvent<T extends string> extends Event<T, BaseObject> {
    coordinates: [number, number];
    dragObject: BaseObject;
    getPickedPos: Function;
    getPickedPosition: Function;
    id: number;
    ignoreFilter: boolean;
    intersect: any;
    picked: boolean;
    pickedObject: BaseObject;
    pickedPosition: [number, number, number];
    tag: string | undefined;
    __lastObject__: BaseObject;
  }

  type KeydownEvent = Event<'keydown'> & KeyboardEvent;
  type KeypressEvent = Event<'keypress'> & KeyboardEvent;
  type KeyupEvent = Event<'keyup'> & KeyboardEvent;

  interface CameraEvent<T extends string> extends Event<T> {
    position: [number, number, number];
    target: [number, number, number];
  }
  interface CameraZoomEvent extends Event<'camerazoom'> {
    delta: undefined;
  }

  interface CreateEvent extends Event<'create', BaseObject> {
    __lastObject__: BaseObject;
  }
  interface DestroyEvent extends Event<'create', BaseObject> {
    __lastObject__: BaseObject;
  }
  interface LevelEvent<T extends string> extends Event<T, BaseObject> {
    autoChangeObject: boolean;
    current: BaseObject;
    lastObject: BaseObject;
    level: string;
    levelPath: BaseObject[];
    previous: BaseObject;
    stopPropagation: Function;
    tag: string | undefined;
    userComplete: undefined;
    userFlyComplete: undefined;
    __lastObject__: BaseObject;
  }
  interface LevelFlyEndEvent extends Event<'levelflyend', BaseObject> {
    current: BaseObject;
    level: string;
    previous: BaseObject;
  }
  interface LoadEvent extends Event<'load'> {
    app: THING.App;
    buildings: any;
    campus: Campus;
  }

  /**
   * 事件类型与回调参数类型映射
   * @todo 只定义了部分常用事件的类型映射
   */
  interface EventTypeMapping {
    complete: any;
    resize: ResizeEvent;
    update: { data: undefined; object: undefined; type: 'update' };
    MapCreateProgress: MapCreateProgressEvent;
    progress: ProgressEvent;
    load: LoadEvent;
    unload: unknown;
    click: ThingMouseEvent;
    dblclick: DblclickEvent;
    singleclick: ThingMouseEvent<'singleclick'>;
    mouseup: MouseupEvent;
    mousedown: MousedownEvent;
    mousemove: MousemoveEvent;
    mousewheel: MousewheelEvent;
    mouseenter: MouseenterEvent;
    mouseover: MouseoverEvent;
    mouseleave: MouseleaveEvent;
    dragstart: DragstartEvent;
    drag: ThingDragEvent;
    dragend: DragendEvent;
    keydown: KeydownEvent;
    keypress: KeypressEvent;
    keyup: KeyupEvent;
    camerachangestart: CameraEvent<'camerachangestart'>;
    camerachangeend: CameraEvent<'camerachangeend'>;
    camerachange: CameraEvent<'camerachange'>;
    camerazoom: CameraZoomEvent;
    cameraviewchange: unknown;
    create: CreateEvent;
    destroy: DestroyEvent;
    expand: unknown;
    unexpand: unknown;
    select: unknown;
    deselect: unknown;
    selectionchange: unknown;
    levelchange: LevelEvent<'levelchange'>;
    enterLevel: LevelEvent<'enterLevel'>;
    leaveLevel: LevelEvent<'leaveLevel'>;
    levelflyend: LevelFlyEndEvent;
  }

  /**
   * 按键键值 <static, constant>
   */
  enum KeyType {
    /** Backspace */
    Backspace = 8,
    /** Tab */
    Tab = 9,
    /** Enter */
    Enter = 13,
    /** Shift */
    Shift = 16,
    /** Ctrl */
    Ctrl = 17,
    /** Alt */
    Alt = 18,
    /** Pause */
    Pause = 19,
    /** Capslock */
    Capslock = 20,
    /** Escape */
    Escape = 27,
    /** Space */
    Space = 32,
    /** PageUp */
    PageUp = 33,
    /** PageDown */
    PageDown = 34,
    /** End */
    End = 35,
    /** Home */
    Home = 36,
    /** Left */
    Left = 37,
    /** Up */
    Up = 38,
    /** Right */
    Right = 39,
    /** Down */
    Down = 40,
    /** Insert */
    Insert = 45,
    /** Delete */
    Delete = 46,
    /** Key0 */
    Key0 = 48,
    /** Key1 */
    Key1 = 49,
    /** Key2 */
    Key2 = 50,
    /** Key3 */
    Key3 = 51,
    /** Key4 */
    Key4 = 52,
    /** Key5 */
    Key5 = 53,
    /** Key6 */
    Key6 = 54,
    /** Key7 */
    Key7 = 55,
    /** Key8 */
    Key8 = 56,
    /** Key9 */
    Key9 = 57,
    /** A */
    A = 65,
    /** B */
    B = 66,
    /** C */
    C = 67,
    /** D */
    D = 68,
    /** E */
    E = 69,
    /** F */
    F = 70,
    /** G */
    G = 71,
    /** H */
    H = 72,
    /** I */
    I = 73,
    /** J */
    J = 74,
    /** K */
    K = 75,
    /** L */
    L = 76,
    /** M */
    M = 77,
    /** N */
    N = 78,
    /** O */
    O = 79,
    /** P */
    P = 80,
    /** Q */
    Q = 81,
    /** R */
    R = 82,
    /** S */
    S = 83,
    /** T */
    T = 84,
    /** U */
    U = 85,
    /** V */
    V = 86,
    /** W */
    W = 87,
    /** X */
    X = 88,
    /** Y */
    Y = 89,
    /** Z */
    Z = 90,
    /** Select */
    Select = 93,
    /** Numpad0 */
    Numpad0 = 96,
    /** Numpad1 */
    Numpad1 = 97,
    /** Numpad2 */
    Numpad2 = 98,
    /** Numpad3 */
    Numpad3 = 99,
    /** Numpad4 */
    Numpad4 = 100,
    /** Numpad5 */
    Numpad5 = 101,
    /** Numpad6 */
    Numpad6 = 102,
    /** Numpad7 */
    Numpad7 = 103,
    /** Numpad8 */
    Numpad8 = 104,
    /** Numpad9 */
    Numpad9 = 105,
    /** Multiply */
    Multiply = 106,
    /** Add */
    Add = 107,
    /** Subtract */
    Subtract = 109,
    /** Decimal */
    Decimal = 110,
    /** Divide */
    Divide = 111,
    /** F1 */
    F1 = 112,
    /** F2 */
    F2 = 113,
    /** F3 */
    F3 = 114,
    /** F4 */
    F4 = 115,
    /** F5 */
    F5 = 116,
    /** F6 */
    F6 = 117,
    /** F7 */
    F7 = 118,
    /** F8 */
    F8 = 119,
    /** F9 */
    F9 = 120,
    /** F10 */
    F10 = 121,
    /** F11 */
    F11 = 122,
    /** F12 */
    F12 = 123,
    /** Numlock */
    Numlock = 144,
    /** Scrolllock */
    Scrolllock = 145,
    /** Semicolon */
    Semicolon = 186,
    /** EqualSign */
    EqualSign = 187,
    /** Comma */
    Comma = 188,
    /** Dash */
    Dash = 189,
    /** Period */
    Period = 190,
    /** ForwardSlash */
    ForwardSlash = 191,
    /** GraveAccent */
    GraveAccent = 192,
    /** OpenBracket */
    OpenBracket = 219,
    /** BackSlash */
    BackSlash = 220,
    /** CloseBraket */
    CloseBraket = 221,
    /** SingleQuote */
    SingleQuote = 222,
  }

  /**
   * 循环类型 <static, constant>
   */
  enum LoopType {
    /** 不循环，只执行一次 */
    No = 'no',
    /** 不断循环 */
    Repeat = 'repeat',
    /** 来回不断循环 */
    PingPong = 'pingPong',
  }

  /** 数学库 */
  const Math: THING.Mathics;

  /**
   * 鼠标按键键值 <static, constant>
   */
  const MouseButtonType: {
    LEFT: 'left';
    MIDDLE: 'middle';
    RIGHT: 'right';
  };

  /**
   * 全景图事件 <static, readonly>
   */
  const PanoEvent: {
    /** 全景图播放器准备就绪事件 */
    PanoPlayerReady: 'panoplayerready';
    /** 全景图播放器中全景图切换事件 param：panoID, x, y, pano */
    PanoChange: 'panochange';
    /** 全景图播放器关闭事件 */
    PanoPlayerClose: 'panoplayerclose';
    /** 全景图热点点击事件 */
    PanoHotspotClick: 'panohotspotclick';
  };

  /**
   * 选择器标记 <static, constant>
   */
  const SelectionMark: {
    /** 不做操作 */
    None: 0;
    /** 停止 */
    Stop: 1;
    /** 跳过 */
    Jump: 2;
  };

  /**
   * 天空盒资源 <static, constant>
   */
  enum SkyBox {
    /** BlueSky */
    BlueSky = 'BlueSky',
    /** MilkyWay */
    MilkyWay = 'MilkyWay',
    /** Night */
    Night = 'Night',
    /** SunCloud */
    SunCloud = 'SunCloud',
  }

  /**
   * 插值类型
   * See:
   * http://sole.github.io/tween.js/examples/03_graphs.html
   */
  const LerpType: {
    /** 线性插值 */
    Linear: {
      /** 线性插值 */
      None(): any;
    };
    /** 二次插值 */
    Quadratic: {
      /** 二次插值(In) */
      In(): any;
      /** 二次插值(In) */
      Out(): any;
      /** 二次插值(InOut) */
      InOut(): any;
    };
    /** 三次曲线插值 */
    Cubic: {
      /** 三次插值(In) */
      In(): any;
      /** 三次插值(In) */
      Out(): any;
      /** 三次插值(InOut) */
      InOut(): any;
    };
    /** 四次插值 */
    Quartic: {
      /** 四次插值(In) */
      In(): any;
      /** 四次插值(In) */
      Out(): any;
      /** 四次插值(InOut) */
      InOut(): any;
    };
    /** 五次插值 */
    Quintic: {
      /** 五次插值(In) */
      In(): any;
      /** 五次插值(In) */
      Out(): any;
      /** 五次插值(InOut) */
      InOut(): any;
    };
    /** 正弦曲线插值 */
    Sinusoidal: {
      /** 正弦曲线插值(In) */
      In(): any;
      /** 正弦曲线插值(In) */
      Out(): any;
      /** 正弦曲线插值(InOut) */
      InOut(): any;
    };
    /** 指数插值 */
    Exponential: {
      /** 指数插值(In) */
      In(): any;
      /** 指数插值(In) */
      Out(): any;
      /** 指数插值(InOut) */
      InOut(): any;
    };
    /** 迂回插值 */
    Circular: {
      /** 迂回插值(In) */
      In(): any;
      /** 迂回插值(In) */
      Out(): any;
      /** 迂回插值(InOut) */
      InOut(): any;
    };
    /** 弹性插值 */
    Elastic: {
      /** 弹性插值(In) */
      In(): any;
      /** 弹性插值(In) */
      Out(): any;
      /** 弹性插值(InOut) */
      InOut(): any;
    };
    /** Back 插值 */
    Back: {
      /** Back 插值(In) */
      In(): any;
      /** Back 插值(In) */
      Out(): any;
      /** Back 插值(InOut) */
      InOut(): any;
    };
    /** 弹跳插值 */
    Bounce: {
      /** 弹跳插值(In) */
      In(): any;
      /** 弹跳插值(In) */
      Out(): any;
      /** 弹跳插值(InOut) */
      InOut(): any;
    };
  };

  /**
   * ActionComposer The action composer.
   */
  class ActionComposer {
      /**
     *
     * @param param The initial parameters.
     */
      constructor(param?: object);

      /**
     *
     * @param name The action name.
     * @param options The action options.
     * @param tag The action tag name.
     * @param priority The action priority.
     */
      add(name: string, options: object, tag: string, priority: number): any;

      /**
     * Remove action.
     * @param name The action name.
     * @param tag The action tag name.
     */
      remove(name: string, tag: string): any;
  }

  /** 绑定事件中的条件，对应物体类型 */
  type EventCondition =
    | '.Thing'
    | '.Box'
    | '.Sphere'
    | '.Plane'
    | '.Cylinder'
    | '.Tetrahedron'
    | '.Campus'
    | '.Building'
    | '.Floor'
    | '.Room'
    | '.UIAnchor'
    | '.Marker'
    | '.WebView'
    | '.ParticleSystem'
    | '.Line'
    | '.RouteLine'
    | '.PolygonLine'
    | '.Heatmap'
    | '*';
  type EventTypeName = keyof THING.EventTypeMapping | THING.EventType;
  type EventCallBackType<K extends keyof EventTypeMapping> = (
    e: EventTypeMapping[K]
  ) => any;
  /** 事件标签 */
  type EventTagType = string | THING.EventTag;
  /**
   * App 与 BaseObject 的公共属性
   */
  interface AppProp {
    /**
     * 移除事件绑定
     * @param eventType 事件类型名称
     */
    off(eventType: EventTypeName): void;

    /**
     * 移除事件绑定
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件
     */
    off(eventType: EventTypeName, condition: EventCondition): void;

    /**
     * 移除事件绑定
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件
     * @param callback 事件触发的回调函数 或 事件标签（tag）
     * @example
     * ```
     * // 移除所有 Click 事件的绑定
     * obj.off('click');
     * // 移除对物体下 Marker 子物体的 Click 事件绑定
     * obj.off('click','.Marker');
     * // 移除标记为某个事件标签的事件绑定,如果绑定（on）时没写条件，则第二个参数需填写 null
     * obj.off('click','.Marker','我的点击事件01')
     * obj.off('click',null,'我的点击事件02')
     * ```
     */
    off(
      eventType: EventTypeName,
      condition: EventCondition | null | undefined,
      callback: Function | string
    ): void;

    /**
     * 绑定事件
     * @param eventType 事件类型名称
     * @param callback 事件触发的回调函数
     * @override
     */
    on<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      callback: EventCallBackType<K>
    ): void;

    /**
     * 绑定事件
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param callback 事件触发的回调函数
     * @override
     */
    on<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      condition: EventCondition,
      callback: EventCallBackType<K>
    ): void;

    /**
     * 绑定事件
     * @param eventType 事件类型名称
     * @param userData 事件传递自定义数据
     * @param callback 事件触发的回调函数
     * @override
     */
    on<K extends keyof EventTypeMapping, T = any>(
      eventType: K | EventType,
      userData: T,
      callback: EventCallBackType<K>
    ): void;

    /**
     * 绑定事件
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param callback 事件触发的回调函数
     * @param tag 事件标签
     * @override
     */
    on<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      condition: EventCondition,
      callback: EventCallBackType<K>,
      tag: EventTagType
    ): void;

    /**
     * 绑定事件
     * @param eventType 事件类型名称
     * @param callback 事件触发的回调函数
     * @param tag 事件标签
     * @param priority 优先级（默认值 50 ），数值越大优先级越高，越先响应
     * @override
     */
    on<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      callback: EventCallBackType<K>,
      tag: EventTagType,
      priority: number
    ): void;

    /**
     * 绑定事件
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param userData 事件传递自定义数据
     * @param callback 事件触发的回调函数
     * @param tag 事件标签
     * @param priority 优先级（默认值 50 ），数值越大优先级越高，越先响应
     * @example
     * ```
     * // 绑定 Click 事件
     * obj.on('click',function(ev){
     *   THING.Utils.log(ev.object.name);
     * })
     * // 给物体下的所有 Marker 类型孩子，绑定 Click 事件
     * obj.on('click','.Marker',function(ev){
     *    THING.Utils.log(ev.object.name);
     * })
     * // 设置事件标签 tag
     * obj.on('click','.Marker',function(ev){
     *   THING.Utils.log(ev.object.name);
     * },'我的点击事件01');
     * // 设置事件优先级
     * obj.on('click',function(ev){
     *   THING.Utils.log(ev.object.name);
     * },'我的点击事件02',51)
     * // 填写 userData 传递参数
     * obj.on('click', { color: '#ff0000' }, function (ev) {
     *   var color = ev.data.color;
     *   THING.Utils.log(color)
     * });
     * ```
     */
    on<K extends keyof EventTypeMapping, T = any>(
      eventType: K | EventType,
      condition?: EventCondition,
      userData?: T,
      callback?: EventCallBackType<K>,
      tag?: EventTagType,
      priority?: number
    ): void;

    /**
     * 绑定事件(只触发一次)
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     */
    one<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      callback: EventCallBackType<K>
    ): void;
    /**
     * 绑定事件(只触发一次)
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param callback 事件触发的回调函数
     */
    one<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      condition: string,
      callback: EventCallBackType<K>
    ): void;
    /**
     * 绑定事件(只触发一次)
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param userData 事件传递自定义数据
     * @param callback 事件触发的回调函数
     */
    one<K extends keyof EventTypeMapping, T = any>(
      eventType: K | EventType,
      condition: string,
      userData: T,
      callback: EventCallBackType<K>
    ): void;
    /**
     * 绑定事件(只触发一次)
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param userData 事件传递自定义数据
     * @param callback 事件触发的回调函数
     * @param tag 事件标签
     * @param priority 优先级（默认值 50 ），数值越大优先级越高，越先响应
     * @example
     * ```
     * app.one('click', '.Building', function(ev) {...});
     * app.one('click', '.Thing', {color:'#ff0000'}, function(ev) {...});
     * app.one('update', function(ev) {...});
     * ```
     */
    one<K extends keyof EventTypeMapping, T = any>(
      eventType: K | EventType,
      condition?: EventCondition,
      userData?: T,
      callback?: EventCallBackType<K>,
      tag?: EventTagType,
      priority?: number
    ): void;

    /**
     * 暂停事件响应
     * @param eventType 事件类型名称，通过`THING.EventType`可以获取
     * @param condition 物体类型选择条件
     * @param tag 事件标签
     * @example
     * ```
     * // 暂停系统内置的左键双击进入下一层级操作
     * app.pauseEvent(THING.EventType.DBLClick, '*', THING.EventTag.LevelEnterOperation);
     * // 暂停系统内置的右键单击返回上一层级操作
     * app.pauseEvent(THING.EventType.Click, null, THING.EventTag.LevelBackOperation);
     * // 暂停进入物体层级默认操作行为
     * app.pauseEvent(THING.EventType.EnterLevel, '.Thing', THING.EventTag.LevelSceneOperations);
     * // 暂停退出物体层级默认操作行为
     * app.pauseEvent(THING.EventType.LeaveLevel, '.Thing', THING.EventTag.LevelSceneOperations);
     * // 暂停进入物体层级的默认飞行行为
     * app.pauseEvent(THING.EventType.EnterLevel, '.Thing', THING.EventTag.LevelFly);
     * // 暂停进入物体层级的默认背景设置操作
     * app.pauseEvent(THING.EventType.EnterLevel, '.Thing', THING.EventTag.LevelSetBackground);
     * // 暂停给物体绑定的 Click 事件操作
     * app.pauseEvent('click','.Thing','我的点击事件01')
     * ```
     */
    pauseEvent<K extends keyof EventTypeMapping>(
      eventType: K | EventTypeName,
      condition?: EventCondition,
      tag?: EventTagType
    ): void;
  }

  const App: THING.AppConstructor;
  interface AppConstructor {
    new (): THING.App;
    /**
     * 构建方法
     * @param options 参数列表
     * @returns 程序集对象
     * @example
     * ```
     * // 仅初始化 3D 应用
     * var app=new THING.App();
     * // 初始化 3D 应用，并加载场景
     * var app = new THING.App({
     *   url: 'https://www.thingjs.com/static/models/storehouse'// 场景地址
     * });
     * // 设置天空盒
     * var app = new THING.App({
     *   url: 'https://www.thingjs.com/static/models/storehouse',// 场景地址
     *   skyBox:'BlueSky'
     * });
     * // 设置背景图片
     * var app = new THING.App({
     *   url: 'https://www.thingjs.com/static/models/storehouse',// 场景地址
     *   background: 'http://www.thingjs.com/static/images/background_img_03png'
     * });
     * ```
     */
    new (options?: {
      /** 容器 id，默认值为 div3d */
      container?: string;
      /** 初始场景资源路径 */
      url?: string;
      /** 背景颜色或图片 */
      background?: number | string;
      /** 天空盒资源名称 */
      skyBox?: string | THING.SkyBox | object | Array<string>;
      /** 初始化完成的函数回调 */
      complete?: (e: LoadEvent) => any;
      domElement?: HTMLElement;
      [propName: string]: any;
    }): THING.App;
    /** App 实例 */
    current: App;
    readonly prototype: App;
  }
  /**
   * App ThingJS 库入口，提供加载场景、搜索、事件绑定、摄像机控制等功能。
   * [文档链接](http://192.168.1.238:8080/THING.App.html)
   */
  interface App extends THING.AppProp {
    renderStates: {
      /**
       * 每帧 drawCall 的次数
       * @see https://wiki.uino.com/d/61d6855138c8f35f761ea1a2.html
       */
      calls: number;
      fps: number;
      frame: number;
      geometries: number;
      lines: number;
      points: number;
      textures: number;
      triangles: number;
    };

    /**
     * 背景颜色或者图片, 参数为RGB颜色值 或 十六进制颜色值 或 图片资源路径
     * @example
     * ```
     * app.background = 0xFF00FF;
     * app.background = '#FF00FF';
     * app.background = 'rgb(255,0,255)';
     * app.background = 'http://www.thingjs.com/static/images/background_img_03png'
     * ```
     */
    background: string | number;

    /**
     * 获取摄像机
     */
    camera: THING.CameraController;

    /**
     * 获取从 3D 启动以来一共渲染了多少帧
     */
    currentFrameCount: number;

    /**
     * 获取距上一帧流逝的时间（毫秒）
     */
    deltaTime: number;

    /**
     * 获取从 3D 启动到现在流逝的时间（毫秒）
     */
    elapsedTime: number;

    /**
     * 设置雾参数
     *
     * ---
     * Name | Type | Description
     * ---|---|---|
     * options.color | String | 雾颜色数值
     * options.far | Number | 设置远距离的雾效浓度
     * options.near | Number | 设置近距离的雾效浓度
     * ---
     * Example
     * ```
     * // 具体参数调节以及效果调整可使用「工具」——>「场景效果」——>「雾」生成代码块
     * // 线性雾
     * app.fog = {color: '0x888888', near: 1, far: 100};
     * // 清除雾
     * app.fog = null;
     * ```
     */
    fog: object;

    /**
     * 判断是否为移动端设备
     */
    isMobileDevice: boolean;

    /**
     * 是否保持背景图片的长宽比
     */
    keepBackgroundAspect: boolean;

    /**
     * 获取场景层次管理器
     */
    level: THING.SceneLevel;

    /**
     * 设置灯光参数
     *
     * ---
     * 参数
     * ```
     * const object = {
     *   // 是否显示辅助线
     *   showHelper: boolean,
     *   // 环境光
     *   ambientLight: {
     *     // 环境光强度
     *     intensity: number,
     *     // 环境光强度
     *     color: number,
     *   },
     *   // 主灯光
     *   mainLight: {
     *     // 主灯光强度
     *     intensity: number,
     *     // 主灯光颜色
     *     color: number,
     *     // 主灯光角度
     *     alpha: number,
     *     // 主灯光角度
     *     beta: number,
     *   },
     *   // 第二光源
     *   secondaryLight: {
     *     // 第二光源强度
     *     intensity: number,
     *     // 第二光源颜色
     *     color: number,
     *     // 第二光源角度
     *     alpha: number,
     *     // 第二光源角度
     *     beta: number,
     *   },
     *   // 第三光源
     *   tertiaryLight: {
     *     // 第三光源强度
     *     intensity: number,
     *     // 第三光源颜色
     *     color: number,
     *     // 第三光源角度
     *     alpha: number,
     *     // 第三光源角度
     *     beta: number,
     *   },
     * }
     * ```
     * ---
     * Example
     * ```
     * // 具体参数调节以及效果调整可使用「工具」——>「场景效果」——> 「灯光配置」生成代码块
     * app.lighting = {
     *   showHelper: false, // 灯光标示
     *   ambientLight: {
     *     intensity: 0.5,
     *     color: 0xffffff
     *   },
     *   hemisphereLight: {
     *     intensity: 0.0,
     *     color: 0xffffff,
     *     groundColor: 0x222222
     *   },
     *   mainLight: {
     *     // If enable shadow of main light.
     *     shadow: false,
     *     // Quality of main light shadow. 'low'|'medium'|'high'|'ultra'
     *     shadowQuality: 'high',
     *     // Intensity of main light
     *     intensity: 0.5,
     *     // Color of main light
     *     color: 0xffffff,
     *     // Alpha is rotation from bottom to up.
     *     alpha: 30,
     *     // Beta is rotation from left to right.
     *     beta: 30
     *   },
     *   secondaryLight: {
     *     shadow: false,
     *     shadowQuality: 'high',
     *     intensity: 0,
     *     color: 0xffffff,
     *     alpha: 138,
     *     beta: 0
     *   },
     *   tertiaryLight: {
     *     shadow: false,
     *     shadowQuality: 'high',
     *     intensity: 0,
     *     color: 0xffffff,
     *     alpha: 0,
     *     beta: 0
     *   }
     * };
     * ```
     */
    lighting: object;

    /**
     * 设置/获取像素比 默认为1，可设置为0-1之间的数值 数值越大，渲染效果越清晰（帧率降低）， 数值越小，渲染效果越模糊（帧率提高） 在移动设备上，为了渲染帧率，可将 app.pixelRatio 设置成小于1的值
     */
    pixelRatio: number;

    /**
     * 设置后期处理参数
     *
     * ---
     * 参数
     * ```
     * const object = {
     *   // 超采样(场景静止时起作用)
     *   temporalSuperSampling: {
     *     enable: boolean,
     *     // 采样的帧数，帧数越多，收敛速度越慢
     *     size: number,
     *   },
     *   // 后期处理
     *   postEffect: {
     *     // 主灯光强度
     *     enable: boolean,
     *   },
     *   // 泛光（会影响天空盒）
     *   bloom: {
     *     enable: boolean,
     *     // 泛光强度
     *     strength: number,
     *     // 泛光半径
     *     radius: number,
     *     // 泛光阈值
     *     threshold: number,
     *   },
     *   // 屏幕空间环境光遮蔽（相对昂贵的性能开销）
     *   screenSpaceAmbientOcclusion: {
     *     enable: boolean,
     *     // 采样半径
     *     radius: number,
     *     // 采样等级
     *     quality: number,
     *     // 环境光遮蔽强度
     *     intensity: number,
     *     // 使用temporal超采样时起作用，柔化采样效果
     *     temporalFilter: number,
     *     // 忽略透明物体
     *     ignoreTransparent: number,
     *   },
     *   // 颜色调整
     *   colorCorrection: {
     *     enable: boolean,
     *     // 曝光
     *     exposure: number,
     *     // 亮度
     *     brightness: number,
     *     // 对比度
     *     contrast: number,
     *     // 饱和度
     *     saturation: number,
     *   },
     *   // 光晕效果
     *   vignette: {
     *     enable: boolean,
     *     // 光晕类型：目前支持 'color', 'blur' 两种模式，默认为 'blur'
     *     type: string,
     *     // 光晕颜色：只在 color 模式下生效，默认 0x000000
     *     color: number,
     *     // 光晕从边缘到中心的渐变偏移值，范围推荐 0-8，默认为 1.5
     *     offset: number,
     *   },
     *   // 快速近似抗锯齿，性能优于MASS
     *   FXAA: {
     *     enable: boolean,
     *   },
     *   // 多重采样抗锯齿（只在支持WebGL2.0的浏览器中可用）
     *   MSAA: {
     *     enable: boolean,
     *   },
     *   // 是否重置其它未设置的后期处理配置，默认为false，会保持当前的设置状态
     *   resetOther?: boolean,
     * }
     * ```
     * ---
     * Example
     * ```
     * // 具体参数调节以及效果调整可使用「工具」——>「场景效果」——>「后期设置」生成代码块
     * // 后期处理
     * app.postEffect = {
     *   // If enable post effects.
     *   enable: false,
     *   // Configuration about bloom post effect
     *   // 泛光（会影响天空盒）
     *   bloom: {
     *     // If enable bloom
     *     enable: false,
     *     // Intensity of bloom
     *     // 泛光强度
     *     strength: 0.14,
     *     // radius of bloom
     *     // 泛光半径
     *     radius: 0.4,
     *     // threshold of bloom
     *     // 泛光阈值
     *     threshold: 0.7
     *   },
     *   // Configuration about screen space ambient occulusion
     *   // 屏幕空间环境光遮蔽（相对昂贵的性能开销）
     *   screenSpaceAmbientOcclusion: {
     *     // If enable SSAO
     *     enable: false,
     *     // Sampling radius in work space.
     *     // Larger will produce more soft concat shadow.
     *     // But also needs higher quality or it will have more obvious artifacts
     *     // 采样半径
     *     radius: 0.2,
     *     // Quality of SSAO. 'low'|'medium'|'high'|'ultra'
     *     // 采样等级
     *     quality: 'medium',
     *     // Intensity of SSAO
     *     // 环境光遮蔽强度
     *     intensity: 0.8,
     *
     *     // temporal filter in temporal super sampling mode
     *     // 使用temporal超采样时起作用，柔化采样效果
     *     temporalFilter: true,
     *
     *     // if ignore transparent objects
     *     // 忽略透明物体
     *     ignoreTransparent: false
     *   },
     *   // Configuration about color correction
     *   // 颜色调整
     *   colorCorrection: {
     *     // If enable color correction
     *     enable: false,
     *     // 曝光
     *     exposure: 0,
     *     // 亮度
     *     brightness: 0,
     *     // 对比度
     *     contrast: 1,
     *     // 饱和度
     *     saturation: 1,
     *     // 伽马矫正
     *     gamma: 1
     *   },
     *   // Configuration about FXAA
     *   // fxaa 抗锯齿
     *   FXAA: {
     *     // If enable FXAA
     *     enable: false
     *   },
     *   // Configuration about MSAA
     *      // msaa 抗锯齿
     *      MSAA: {
     *        // If enable MSAA
     *        // only support by WebGL2.0
     *        enable: true
     *      }
     * };
     * ```
     */
    postEffect: object;

    /** 获取场景根节点 */
    root: THING.SceneRoot;

    /**
     * 设置天空盒 目前提供了几个内置的天空盒, 分别是'BlueSky'、'MilkyWay'、'Night'和'SunCloud' 还可以使用自定义的天空盒贴图来，详见下面的例子 注意: 图片的宽高比必须1:1, 并且每张图片大小必须一致
     *
     * ---
     * Example
     * ```
     * // 使用内置天空盒
     * app.skyBox = 'SunCloud';
     * // 设置自定义天空盒
     * app.skyBox = {
     *   negx: './images/Night/negx.jpg', // 左
     *   negy: './images/Night/negy.jpg', // 下
     *   negz: './images/Night/negz.jpg', // 前
     *   posx: './images/Night/posx.jpg', // 右
     *   posy: './images/Night/posy.jpg', // 上
     *   posz: './images/Night/posz.jpg'  // 后
     * };
     * // 设置自定义天空盒(顺序要求[posx, negx, posy, negy, posz, negz])
     * app.skyBox = [
     *   './images/Night/posx.jpg',
     *   './images/Night/negx.jpg',
     *   './images/Night/posy.jpg',
     *   './images/Night/negy.jpg',
     *   './images/Night/posz.jpg',
     *   './images/Night/negz.jpg'
     * ];
     * ```
     */
    skyBox: string | THING.SkyBox | object | Array<string>;

    /**
     * 设置动态天空效果，自带两个光源：一个用于模拟太阳的直射光源与模拟散射的半球光源。
     *
     * ---
     * 参数
     * ```
     * const object = {
     *   // 时间
     *   time: number,
     *   // 角度
     *   beta: number,
     *   // 混浊度
     *   turbidity: number,
     *   // 瑞利散射
     *   rayleigh: number,
     *   // 时间
     *   time: number,
     *   // 散射系数
     *   mieCoefficient: number,
     *   mieDirectionalG: number,
     * }
     * ```
     * ---
     * Example
     * ```
     * // 具体参数调节以及效果调整可使用「工具」——>「场景效果」——>「动态天空」生成代码块
     * app.skyEffect = {
     *   time: 9,
     *   beta: 45,
     *   turbidity: 10,
     *   rayleigh: 1.5,
     *   luminance: 1,
     *   mieCoefficient: 0.005,
     *   mieDirectionalG: 0.98
     * };
     * ```
     */
    skyEffect: object;

    /**
     * 添加控件
     * @param ctrl 控件对象
     * @param name 控件自定义名称（用于查找、获取）
     * @param afterRender void
     * @example
     * ```
     * var ctrl = app.addControl(new THING.WalkControl(),'第一人称行走控件');
     * ```
     */
    addControl(ctrl: object, name?: string, afterRender?: boolean): void;

    /**
     * 添加控件
     * @param fileName 文件名称
     * @example
     * ```
     * // 将3D渲染的画面保存成 myScreenshot.jpg 下载至浏览器默认文件下载目录
     * app.captureScreenshot('myScreenshot');
     * ```
     */
    captureScreenshot(fileName: string): void;

    /**
     * 将当前 3D 渲染内容截屏保存到缓冲区中
     * @param width 图片宽度
     * @param height 图片高度
     * @param extension 文件类型, 默认 jpeg 类型
     * @param quality 质量(0~1]之间
     * @returns base64 编码图片数据
     * @example
     * ```
     * var base64 = app.captureScreenshotToImage(1024, 768, 'png', 0.5);
     * var img = new Image()
     * img.src = base64;
     * ```
     */
    captureScreenshotToImage(
      width?: number,
      height?: number,
      extension?: string,
      quality?: number
    ): string;

    /**
     * 创建物体
     * @example
     * ```
     * // type:'Thing'
     * var truck = app.create({
     *   type: 'Thing',
     *   id: 'myCar01',
     *   name: 'truck',
     *   url: 'https://speech.uinnova.com/static/models/truck/',
     *   position: [-5, 0, 0],
     *   complete: function() {
     *     THING.Utils.log('truck created!');
     *   }
     * });
     * // type:'UIAnchor';
     * var ui = app.create({
     *   type: 'UIAnchor',
     *   element: domElement, // 界面的dom元素
     *   parent: parent, // 界面的父物体（位置跟随父物体更新）
     *   localPosition: [0,0,0], // 相对父物体的偏移
     *   pivot: [0,0.5], // 界面轴心
     * });
     * // type:'Marker';
     * var marker = app.create({
     *   type: "Marker",
     *   id: "myMarker01",
     *   url: "https://speech.uinnova.com/static/images/warning1.png",
     *   position: [0, 5, 0],
     *   size: 4
     * });
     * // type:'WebView';
     * var webView = app.create({
     *   type: 'WebView',
     *   id: 'myWebView01',
     *   url: 'https://www.thingjs.com',
     *   position: [0, 0, 0],
     *   width: 1920 * 0.01, // 3D 中实际宽度 单位 米
     *   height: 1080 * 0.01, // 3D 中实际高度 单位 米
     *   domWidth: 1920, // 页面宽度 单位 px
     *   domHeight: 1080 // 页面高度 单位 px
     * });
     * // type:'Box';
     * var box = app.create({
     *   type: 'Box',
     *   width: 1.0, // 宽度
     *   height: 1.0, // 高度
     *   depth: 1.0, // 深度
     *   widthSegments: 1.0, //宽度上的节数
     *   heightSegments: 1.0, // 高度上的节数
     *   depthSegments: 1.0, // 深度上的节数
     *   center: 'Bottom', // 中心点
     *   style: {
     *     color: '#ffffff',
     *     opacity: 0.8,
     *     image: 'images/uv.jpg'
     *   }
     * });
     * // type:'Sphere';
     * var sphere = app.create({
     *   type: 'Sphere',
     *   radius: 1,
     *   widthSegments: 12,
     *   heightSegments: 12,
     *   position: [2, 0, 0],
     *   style: {
     *     image: 'images/uv.jpg'
     *   }
     * });
     * // type:'Plane';
     * var plane = app.create({
     *   type: 'Plane',
     *   width: 2,
     *   height: 1,
     *   position: [0, 1, 0],
     *   style: {
     *     doubleSide: true,
     *     image: 'images/uv.jpg'
     *   }
     * });
     * // type:'Cylinder';
     * var plane = app.create({
     *   type: 'Cylinder',
     *   radius: 0.4,
     *   height: 1.6,
     *   position: [0, 0, 2]
     * });
     * // type:'Tetrahedron';
     * var t = app.create({
     *   type: 'Tetrahedron',
     *   radius: 1,
     *   position: [2, 0, 2]
     * });
     * // 另外，可通过 THING.factory.registerClass(类型名称, 类) 来扩展物体类型
     * // 注册自定义类
     * THING.factory.registerClass('Car', Car);
     * ```
     */
    create<R = BaseObject>(
      param: {
        /** 模型资源地址（Thing）/图片资源地址（Marker）/页面资源地址（WebView） */
        url?: string;
        /** 物体加载完成后的回调函数 */
        complete?: (e: { object: R }) => any;
        angle?: number;
        [propName: string]: any;
      } & Partial<BaseObject>
    ): R;

    /** 使 3D 窗口获得焦点 */
    focus(): void;

    /**
     * 请求场景数据，请求成功后以 JSON 结构返回 主要用途是查询未加载或者准备加载的场景数据。
     * @param url 场景路径
     * @param params 参数列表
     * @example
     * ```
     * app.getCampusJSON('https://www.thingjs.com/static/models/storehouse', {
     *   complete: function (ev) {
     *     var result = ev;
     *     var children = result.children;
     *     for (var i = 0; i < children.length; i++) {
     *       var child = children[i];
     *       THING.Utils.log(child.name)
     *     }
     *   }
     * });
     * ```
     */
    getCampusJSON(
      url: string,
      params: {
        /** 是否禁用缓冲数据，默认 false 。如果禁用，每次都请求最新的场景数据 */
        disableCache?: boolean;
        /** 请求数据失败时的回调函数 */
        error?: Function;
        /** 物体加载完成后的回调函数 */
        complete?: Function;
      }
    ): any;

    /**
     * 根据名字获取控件
     * @param name 控件自定义名称
     * @example
     * ```
     * var ctrl = app.getControl('第一人称行走控件');
     * ```
     */
    getControl(name: string): any;

    /**
     * 判断是否已添加了某控件
     * @param ctrl 控件对象 或 控件自定义名称
     * @example
     * ```
     * app.hasControl('第一人称行走');
     * ```
     */
    hasControl(ctrl: string | object): boolean;

    /**
     * 判断某按键是否按下
     * @param key 键值，使用`THING.KeyType`可以获取对应的键值
     */
    isKeyPressed(key: number | THING.KeyType): boolean;

    /**
     * 暂停事件响应(当前帧，下一帧恢复响应)
     * @param eventType 事件类型名称，通过`THING.EventType`可以获取
     * @param condition 物体类型选择条件
     * @param tag 事件标签
     */
    pauseEventInFrame<K extends keyof EventTypeMapping>(
      eventType: K | EventTypeName,
      condition: EventCondition,
      tag?: EventTagType
    ): void;

    /**
     * 物体查询
     * @param param 查询条件
     * @example
     * ```
     * // 查询 id 为 001 的对象集合
     * app.query('#001');
     * // 查询名称为 car01 的对象集合
     * app.query('car01');
     * // 查询类型为 Thing 的对象集合
     * app.query('.Thing');
     * // 查询自定义属性 [prop=value] 的对象集合
     * app.query('["userData/power"=60]');
     * // 根据正则表达式匹配 name 中包含 'car' 的子物体
     * app.query(/car/);
     * // 上行代码等同于
     * // var reg = new RegExp('car');
     * // var cars=app.query(reg);
     *
     * // 注意：
     * // 通过 query 查询的结果都是满足条件的对象集合（Selector）
     * // 如需访问单个对象，可通过下标获取，如
     * var obj=app.query('#001')[0];
     * // 也可通过循环遍历对象集合
     * var objs=app.query('.Thing');
     * objs.forEach(function(obj){
     *   THING.Utils.log(obj.name)
     * })
     * ```
     */
    query(param: string): THING.Selector;

    /**
     * 删除控件
     * @param ctrl 控件对象 或 控件自定义名称
     * @example
     * ```
     * // 删除控件
     * app.removeControl(ctrl);
     * // 根据控件自定义名称删除控件
     * app.removeControl('第一人称行走控件');
     * ```
     */
    removeControl(ctrl: string | object): void;

    /**
     * 恢复事件响应
     * @param eventType 事件名称，通过`THING.EventType`可以获取
     * @param condition 物体类型选择条件
     * @param tag 事件标签
     * @example
     * ```
     * // 恢复系统内置的左键双击进入下一层级操作
     * app.resumeEvent(THING.EventType.DBLClick, '*', THING.EventTag.LevelEnterOperation);
     * // 恢复系统内置的右键单击返回上一层级操作
     * app.resumeEvent(THING.EventType.Click, null, THING.EventTag.LevelBackOperation);
     * // 恢复进入物体层级默认操作行为
     * app.resumeEvent(THING.EventType.EnterLevel, '.Thing', THING.EventTag.LevelSceneOperations);
     * // 恢复退出物体层级默认操作行为
     * app.resumeEvent(THING.EventType.LeaveLevel, '.Thing', THING.EventTag.LevelSceneOperations);
     * // 恢复进入物体层级的默认飞行行为
     * app.resumeEvent(THING.EventType.EnterLevel, '.Thing', THING.EventTag.LevelFly);
     * // 恢复进入物体层级的默认背景设置操作
     * app.resumeEvent(THING.EventType.EnterLevel, '.Thing', THING.EventTag.LevelSetBackground);
     * // 恢复给物体绑定的 Click 事件操作
     * app.resumeEvent('click','.Thing','我的点击事件01')
     * ```
     */
    resumeEvent<K extends keyof EventTypeMapping>(
      eventType: K | EventTypeName,
      condition: EventCondition,
      tag?: EventTagType
    ): void;

    /**
     * 保存文件到浏览器下载目录(请确保具有写权限)
     * @param fileName 文件名称
     * @param data 文件数据
     * @example
     * ```
     * var json = { 'name': 'ThingJs', 'time': '2019' };
     * app.saveFile('test.json',JSON.stringify(json))
     * ```
     */
    saveFile(fileName: string, data: string): void;

    /**
     * 触发事件
     * @param eventType 事件名称，通过`THING.EventType`可以获取
     * @param condition 物体类型选择条件
     * @param ev 事件信息，传递回调参数
     * @function
     * @example
     * ```
     * // 触发自定义的告警事件
     * app.trigger('Alarm');
     * app.on('Alarm',function(){  })
     * // 传递参数
     * app.trigger('Alarm','.Thing',{level:2});
     * app.on('Alarm','.Thing',function(ev){
     *   THING.Utils.log(ev.level)
     * })
     * ```
     */
    trigger<K extends keyof EventTypeMapping>(
      eventType: K | EventTypeName,
      condition?: EventCondition,
      ev?: any
    ): void;
  }

  /** 物体控制轴 */
  class AxisTransformControl {
      constructor();
  }

  const BaseObject: BaseObjectConstructor;
  interface BaseObjectConstructor {
    new (): BaseObject;
    readonly prototype: BaseObject;
  }
  /**
   * 物体基类
   *
   * [文档链接](http://192.168.1.238:8080/THING.BaseObject.html)
   */
  interface BaseObject extends THING.AppProp {
    /** 三轴相对角度，相对于自身坐标 */
    angles: Array<number>;

    /** `THING.App` 实例 */
    app: THING.App;

    /** 获取物体的所有兄弟对象(排除自己)，返回物体对象集合 */
    brothers: THING.Selector;

    /** 获取子物体列表（数组） */
    children: Array<THING.BaseObject>;

    /** 获取控件列表（数组） */
    controls: Array<object>;

    /** 设置/获取 物体是否可被拖拽 */
    draggable: boolean;

    /**
     * 获取物体当前拖拽状态 THING.DragState.No —— 非拖拽模式、 THING.DragState.DragEnd —— 拖拽结束、 THING.DragState.Dragging —— 拖拽中、
     */
    dragState: number;

    /** 设置/获取 物体 id */
    id: string | number;

    /** 设置/获取 物体是否跟随父物体旋转, 默认true. */
    inheritAngles: boolean;

    /** 设置/获取 物体拾取是否受父物体影响, 默认 true. */
    inheritPickable: boolean;

    /** 设置/获取 物体位置是否跟随父物体移动, 默认true. */
    inheritPosition: boolean;

    /** 设置/获取 物体是否跟随父物体缩放, 默认true. */
    inheritScale: boolean;

    /** 设置/获取 物体样式是否受父物体影响, 默认 true. */
    inheritStyle: boolean;

    /** 设置/获取 物体模板是否受父物体影响, 默认 true. */
    inheritTheme: boolean;

    /** 设置/获取 物体可见性是否受父物体影响, 默认 true. */
    inheritVisible: boolean;

    /**
     * 设置/获取 图标是否保持像素大小不变。默认为 false，即图标在 3D 场景中呈现“近大远小”的表现形式。
     */
    keepSize: boolean;

    /** 设置/获取 物体在父物体坐标系下的相对位置 */
    localPosition: Array<number>;

    /** 设置/获取 物体 name */
    name: string;

    /** 获取直接父物体 */
    parent: THING.BaseObject;

    /**
     * 获取所有父物体(祖先)，返回物体对象集合，集合中的第一个对象为直接父物体，最后一个为世界根对象
     * @example
     * ```
     * // 获取某对象的所有父物体
     * var parents=obj.parents;
     * // parents[0] 等同于 obj.parent
     * // 遍历物体集合
     * parents.forEach(function (parent) {
     *   THING.Utils.log(parent.name)
     * })
     * ```
     */
    parents: THING.Selector;

    /** 设置/获取 物体是否能被拾取 */
    pickable: boolean;

    /** 设置/获取 物体在世界坐标系下的绝对位置 */
    position: Array<number>;

    /** 设置四元数 */
    quaternion: Array<number>;

    /**
     * 物体自身缩放比例
     * @example
     * ```
     * // 等比例缩放 2 倍
     * obj.scale = [2,2,2]
     * ```
     */
    scale: Array<number>;

    /**
     * 获取物体样式
     * @todo `CMAP.TileLayerStyle` 用于子类覆盖定义
     */
    style: THING.BaseStyle | CMAP.TileLayerStyle;

    /**
     * 获取子部件（模型的 Mesh 列表）
     * @example
     * ```
     * var subNodes = obj.subNodes;
     * subNodes.forEach(function(subnode){
     *   THING.Utils.log(subnode.name)
     * })
     * ```
     */
    subNodes: THING.Selector;

    /** 设置/获取 物体类型 */
    type: string;

    /** 获取/设置用户自定义属性 */
    userData: object;

    /** 设置/获取 物体显示隐藏状态 */
    visible: boolean;

    /**
     * 添加子物体
     * @param params 物体或者参数列表
     * @param index 插入下标，默认插入到最后位置
     * @example
     * ```
     * // 将物体 box 作为孩子直接添加到 car 上
     * car.add(box);
     * // 添加子物体 box ，并设置其与父物体的相对位置
     * car.add({
     *   object: box, // 作为孩子的对象
     *   localPosition: [0, 2, 0] // 相对于父物体的坐标
     * });
     * // 以某个“子节点”作为参考基准点，添加子物体
     * car.add({
     *   object: box,
     *   basePoint: "chazi", // 作为“基准”的“子节点”名称
     * });
     * ```
     */
    add(
      params:
        | THING.BaseObject
        | {
            /** 物体 */
            object?: THING.BaseObject;
            /** 相对于父物体的坐标位置 */
            localPosition?: Array<number>;
            /** 旋转角度 */
            angles?: Array<number>;
            /** 作为位置参考基准的子节点名字 */
            basePoint?: string;
            [propName: string]: any;
          },
      index?: number
    ): void;

    /**
     * 添加物体控件
     * @param type 系统内置控件类型 或 用户自定义控件类型
     * @param name 控件自定义名称（用于查找）
     * @returns 控件
     * @example
     * ```
     * obj.addControl(new THING.AxisTransformControl(obj), 'axisControl');
     * ```
     */
    addControl(type: object, name?: string): any;

    /** 销毁自身及其所有子物体(递归删除) */
    destroy(): void;

    /**
     * 获取物体到某坐标或者另一物体的绝对距离
     * @param position 世界坐标系下的位置 或 另一物体
     * @returns 距离
     * @example
     * ```
     * // 填写世界坐标系下的位置
     * obj.distanceTo([0,0,0]);
     * // 填写物体对象
     * obj.distanceTo(otherObj);
     * ```
     */
    distanceTo(position: Array<number> | THING.BaseObject): number;

    /**
     * 获取物体到某坐标或者另一物体的绝对距离
     * @param param 参数列表
     * @example
     * ```
     * obj.fadeIn();
     * // 设置时间和回调
     * obj.fadeIn({
     *   time:2000,
     *   complete:function(ev){
     *     THING.Utils.log('complete')
     *   }
     * })
     * ```
     */
    fadeIn(param: {
      /** 淡入时间（毫秒） 默认 1s */
      time?: number;
      /** 完成时的回调 */
      complete?: Function;
      [propName: string]: any;
    }): void;

    /**
     * 淡出
     * @param param 参数列表
     * @example
     * ```
     * obj.fadeOut();
     * // 设置时间和回调
     * obj.fadeOut({
     *   time:2000,
     *   complete:function(ev){
     *     THING.Utils.log('complete')
     *   }
     * })
     * ```
     */
    fadeOut(param: {
      /** 淡出时间（毫秒） 默认 1s */
      time?: number;
      /** 完成时的回调 */
      complete?: Function;
      [propName: string]: any;
    }): void;

    /**
     * 获取属性值
     * @param key 属性名，可以使用 a/b/c 的路径方式
     * @returns 属性值
     * @example
     * ```
     * obj.getAttribute("userData/power");
     * ```
     */
    getAttribute(key: string): any;

    /**
     * 获取控件
     * @param name 控件自定义名称
     * @returns 控件
     * @example
     * ```
     * var control = obj.getControl('axisControl');
     * ```
     */
    getControl(name: string): any;

    /**
     * 获取绑定的事件列表，返回数组
     * @param eventType 事件名称, 如果不传则返回所有已绑定的事件
     * @example
     * ```
     * var events=obj.getEvents();
     * // 返回数组，结构形如：
     * [{"type":"enterlevel","priority":50,"userData":null,'tag':'__level_scene_operations__'},
     * {"type":"leavelevel","priority":50,"userData":null,'tag':'__level_scene_operations__'},
     * {"type":"click","priority":50,"userData":null,'tag':'我的单击事件'}]
     * ```
     */
    getEvents(eventType: string | THING.EventType): Array<any>;

    /**
     * 判断属性是否存在
     * @param key 属性名，可以使用 a/b/c 的路径方式
     * @example
     * ```
     * // 物体属性 obj.userData.power 是否存在
     * obj.hasAttribute("userData/power");
     * ```
     */
    hasAttribute(key: string): boolean;

    /**
     * 检测是否拥有此子物体
     * @param object 物体
     */
    hasChild(object: THING.BaseObject): boolean;

    /**
     * 查询是否拥有控件
     * @param control 控件或者控件自定义名字
     * @example
     * ```
     * obj.hasControl('axisControl');
     * ```
     */
    hasControl(control: object | string): boolean;

    /**
     * 判断该物体是否为某物体的兄弟
     * @param object 物体
     */
    isBrotherOf(object: THING.BaseObject): boolean;

    /**
     * 判断该物体是否为某物体的孩子
     * @param parent 物体
     */
    isChildOf(parent: THING.BaseObject): boolean;

    /**
     * 设置物体观察朝向
     * @param targe 世界坐标下某坐标、某物体或者摄像机，设为 null 时表示取消观察
     * @param params 参数列表
     * @example
     * ```
     * //让物体面向[0,1,0]，该坐标是在世界坐标下位置
     * obj.lookAt([0,1,0])
     * //让物体一直面向摄影机
     * obj.lookAt(app.camera)
     * //让物体一直面向一个物体
     * obj.lookAt(obj2)
     * //让物体一直面向一个物体,同时物体沿自身Y轴向再旋转90度
     * obj.lookAt(obj2，[0,90,0])
     * //取消lookAt功能
     * obj.lookAt(null)
     * ```
     */
    lookAt(
      targe: Array<number> | THING.BaseObject | THING.CameraController,
      params:
        | Array<number>
        | {
            /** 叠加的修正值 */
            angles?: Array<number>;
            /** 是否锁定 Y 轴 */
            lockYAxis?: boolean;
            /** 是否一直朝向观察物体 */
            always?: boolean;
            [propName: string]: any;
          }
    ): void;

    /**
     * 沿指定路径移动
     * @param params 参数列表
     * @example
     * ```
     * // 世界坐标系下坐标点构成的数组 关于坐标的获取 可利用「工具」——>「拾取场景坐标」
     * var path = [[0, 0, 0], [20, 0, 0], [20, 0, 10], [0, 0, 10], [0, 0, 0]];
     * obj.movePath({
     *   orientToPath: true, // 物体移动时沿向路径方向
     *   path: path, // 路径坐标点数组
     *   time: 5 * 1000, // 路径总时间 毫秒
     *   delayTime: 1000, // 延时 1s 执行
     *   lerpType: null, // 插值类型（默认为线性插值）此处设置为不插值
     *   complete: function (ev) {
     *     THING.Utils.log(ev.object.name + "移动结束")
     *   }
     * });
     * ```
     */
    movePath(
      params:
        | Array<number>
        | {
            /** 路径，由世界坐标系下的坐标点组成 */
            path?: Array<number>;
            /** 物体方向是否沿路径方向 */
            orientToPath?: boolean;
            /** 相对于路径方向的角度旋转值 */
            orientToPathDegree?: number;
            /** 沿路径移动的时间（毫秒） */
            time?: number;
            /** 输入的坐标是否相对于父物体的位置(默认false), 否则路径为世界坐标 */
            local?: boolean;
            /** 延时执行时间（毫秒） */
            delayTime?: number;
            /** 插值类型，值为 THING.LerpType */
            lerpType?: object;
            /** 循环类型，默认为 no */
            loopType?: string | LoopType;
            /** 移动中的回调 */
            update?: Function;
            /** 移动完成时的回调 */
            complete?: Function;
            [propName: string]: any;
          }
    ): void;

    /**
     * 移动到某位置 或 某物体对象
     * @param params 参数列表
     * @example
     * ```
     * // 移动到世界坐标系下 [0,0,10] 处位置
     * obj.moveTo([0, 0, 10]);
     * // 3s 移动到世界坐标系下原点位置 [0,0,0]
     * obj.moveTo({
     *   position: [0,0,0],
     *   time: 3000,
     *   orientToPath: true,// 朝向目标方向
     *   complete:function(ev) {
     *     THING.Utils.log(ev.object.name + '移动完成');
     *   }
     * });
     * // 2s 向前移动 10m
     * obj.moveTo({
     *   offsetPosition: [0, 0, 10], // 相对自身 向前移动 10m
     *   time: 2 * 1000,
     *   orientToPath: true,
     *   complete: function (ev) {
     *     THING.Utils.log(ev.object.name + '移动完成');
     *   }
     * });
     * ```
     */
    moveTo(
      params:
        | Array<number>
        | {
            /** 目标位置（世界坐标系下绝对位置） 或 物体对象 */
            position?: Array<number> | THING.BaseObject;
            /** 是否朝向目标方向 */
            orientToPath?: boolean;
            /** 循环类型，默认为 no */
            loopType?: string | LoopType;
            /** 完成移动的时间（毫秒） */
            time?: number;
            /** 相对于当前位置的移动偏移量（与 position 选填其一） */
            offsetPosition?: Array<number>;
            /** 移动完成时的回调，仅当 loopType 为 no 时才有回调 */
            complete?: Function;
            [propName: string]: any;
          }
    ): void;

    /**
     * 暂停事件响应(当前帧，下一帧恢复响应)
     * @param eventType 事件类型名称，通过`THING.EventType`可以获取
     * @param condition 物体类型选择条件
     * @param tag 事件标签
     */
    pauseEventInFrame<K extends keyof EventTypeMapping>(
      eventType: K | EventTypeName,
      condition?: EventCondition,
      tag?: EventTagType
    ): void;

    /**
     * 在子物体中查询(不包括自己)
     * @param param 查询条件
     * @param recursive 是否递归查询所有子物体, 默认true
     * @example
     * ```
     * // 查询名称为 car01 的子物体
     * obj.query('car01');
     * // 查询类型为 Marker 的子物体
     * obj.query('.Marker');
     * // 查询id为 001 的子物体
     * obj.query('#001');
     * // 根据自定义属性值筛选子物体
     * obj.query('[userData/power=40]');
     * // 根据正则表达式匹配 name 中包含 'car' 的子物体
     * obj.query(/car/);
     * // 上行代码等同于
     * // var reg = new RegExp('car');
     * // var cars=app.query(reg);
     * ```
     */
    query(param: string | RegExp, recursive?: boolean): THING.Selector;

    /**
     * 移除子物体
     * @param object 物体
     */
    remove(object: THING.BaseObject): void;

    /**
     * 删除该物体的所有控件
     */
    removeAllControls(): void;

    /**
     * 删除控件
     * @param control 控件或控件自定义名称
     * @example
     * ```
     * var control = obj.removeControl('axisControl');
     * ```
     */
    removeControl(control: object | string): void;

    /**
     * 恢复事件响应
     * @param eventType 事件名称
     * @param condition 物体类型选择信息
     * @param tag 事件标签
     */
    resumeEvent<K extends keyof EventTypeMapping>(
      eventType: K | EventTypeName,
      condition?: EventCondition,
      tag?: EventTagType
    ): void;

    /**
     * 让物体以自身坐标系下指定坐标轴旋转（默认 Y 轴）
     * @todo `angle` 属性的 `object` 类型是给 `CMAP.Map` 覆盖定义用的
     * @param angle 旋转角度值
     * @param axis 方向轴，默认为物体 Y 轴方向
     * @example
     * ```
     * // 绕自身 Y 轴旋转45度，等同于 obj.rotateY(45)
     * obj.rotate(45);
     * // 绕自身 X 轴旋转30度，等同于 obj.rotateX(30)
     * obj.rotate( 30, [1,0,0])
     * // 绕自身 Z 轴向旋转-45度，等同于 obj.rotateZ(-45)
     * obj.rotate( -45, [0,0,1])
     * ```
     */
    rotate(angle: number | object, axis?: Array<number>): void;

    /**
     * 绕某点或某物体旋转
     * @param params 参数列表
     * @see https://en.wikipedia.org/wiki/Spherical_coordinate_system
     * @example
     * ```
     * // obj2 绕着 obj1 旋转360度，2s转完
     * obj2.rotateAround({
     *   object: obj1,
     *   angle:360,
     *   time:2000,
     *   loopType:THING.LoopType.No,
     *   complete:function(){
     *     THING.Utils.log('finish')
     *   }
     * })
     * // obj 绕着 世界坐标系下的原点旋转360度，2s转完
     * obj.rotateAround({
     *   target: [0,0,0],
     *   angle:360,
     *   time:2000,
     *   loopType:THING.LoopType.No,
     *   complete:function(){
     *     THING.Utils.log('finish')
     *   }
     * })
     * ```
     */
    rotateAround(params: {
      /** 围绕某物体 */
      object?: THING.BaseObject;
      /** 围绕世界坐标系下某位置点 */
      targe?: Array<number>;
      /** 水平旋转角度 */
      angle?: number;
      /** 旋转时间（毫秒） */
      time?: Array<number>;
      /** 速度 （与 time 选填其一） */
      speed?: number;
      /** 循环类型 */
      loopType?: string | THING.LoopType;
      /** 旋转结束时的回调函数，仅当 loopType 为 no 时才有回调 */
      complete?: Function;
      [propName: string]: any;
    }): void;

    /**
     * 在一段时间内物体旋转一定角度
     * @param params 参数列表
     * @example
     * ```
     * // 物体绕 Y 轴旋转 90 度，5s 转完
     * obj.rotateTo({
     *   angles: [0, 90, 0], // 旋转角度
     *   time: 5000, // 总时间
     *   complete: function () {
     *     THING.Utils.log('rotate complete');  // 旋转结束回调
     *   }
     * })
     *
     * // 物体绕 Y 轴旋转 90 度，5s 变加速转完
     * obj.rotateTo({
     *   angles: [0, 90, 0],
     *   time: 5000,
     *   lerpType: THING.LerpType.Quadratic.In, // 速度插值
     *   complete: function () {
     *     THING.Utils.log('finish')
     *   }
     * })
     * ```
     */
    rotateTo(params: {
      /** 旋转角度 */
      angles?: Array<number>;
      /** 旋转时间（毫秒） */
      time?: Array<number>;
      /** 速度 （与 time 选填其一） */
      speed?: number;
      /** 循环类型 */
      loopType?: string | THING.LoopType;
      /** 旋转速度插值类型 */
      lerpType?: string;
      /** 旋转完成时的回调函数，仅当 loopType 为 no 时有回调 */
      complete?: Function;
      [propName: string]: any;
    }): void;

    /**
     * 绕自身 X 轴旋转
     * @param value 旋转角度值
     */
    rotateX(value: number): void;

    /**
     * 绕自身 Y 轴旋转
     * @param value 旋转角度值
     */
    rotateY(value: number): void;

    /**
     * 绕自身 Z 轴旋转
     * @param value 旋转角度值
     */
    rotateZ(value: number): void;

    /**
     * 在一段时间内将物体缩放至某比例
     * @param params 参数列表
     * @example
     * ```
     * // 5s 物体缩放至两倍
     * obj.scaleTo({
     *   scale: [2,2,2], // 等比例缩放两倍
     *   time: 5000,
     *   complete: function () {
     *     THING.Utils.log('scale completed');  // 缩放结束回调
     *   }
     * });
     * // 缩放循环往复进行
     * obj.scaleTo({
     *   scale:[2,2,2],
     *   time: 2000,
     *   loopType: THING.LoopType.PingPong // 循环类型：来回往复
     * })
     * ```
     */
    scaleTo(params: {
      /** 缩放值 */
      scale?: Array<number>;
      /** 完成缩放的时间（毫秒） */
      time?: Array<number>;
      /** 缩放速度（与 time 选填其一） */
      speed?: number;
      /** 循环类型，默认为 no */
      loopType?: string | THING.LoopType;
      /** 缩放速度插值类型，值为 THING.LerpType */
      lerpType?: string;
      /** 缩放完成时的回调 */
      complete?: Function;
      [propName: string]: any;
    }): void;

    /**
     * 将物体自身坐标系下的相对位置转换成世界坐标系下的绝对位置
     * @param localPos 物体自身坐标系下的相对位置
     * @returns 世界坐标系下的绝对位置
     * @example
     * ```
     * // 例如某书柜在三楼的原点（相对位置）
     * // floor 为三楼楼层对象，返回结果为书柜在世界坐标系下的绝对位置，比如 [5,6,-15]
     * floor.selfToWorld([0,0,0]);
     * ```
     */
    selfToWorld(localPos: Array<number>): Array<number>;

    /**
     * 设置属性值
     * @param key 属性名，可以使用 a/b/c 的路径方式
     * @param value 属性值
     * @example
     * ```
     * obj.setAttribute("userData/price",50);
     * ```
     */
    setAttribute(key: string, value: any): void;

    /**
     * 批量设置属性值
     * @param attributes  属性列表
     * @param overwrite 是否覆盖原有属性（默认覆盖），如果为 false 表示如果原属性存在，则不会更新属性值
     * @example
     * ```
     * obj.setAttributes({
     *   "userData/power": 50,
     *   "userData/pirce": 60
     * })
     * ```
     */
    setAttributes(attributes: object, overwrite?: boolean): void;

    /**
     * 停止移动（针对 moveTo 、 movePath）
     */
    stopMoving(): void;

    /**
     * 停止旋转动画（停止 rotateTo 、rotateAround ）
     */
    stopRotating(): void;

    /**
     * 停止缩放动画（ scaleTo ）
     */
    stopScaling(): void;

    /**
     * 触发事件
     * @param eventType 事件名称（`THING.EventType`）
     * @param ev 事件信息，传递回调参数
     * @param tag 事件标签
     * @example
     * ```
     * // 触发自定义的告警事件
     * obj.trigger('Alarm');
     * obj.on('Alarm',function(ev){
     *   THING.Utils.log(ev.object.name);
     * })
     * // 传递参数
     * obj.trigger('Alarm',{level:2});
     * obj.on('Alarm',function(ev){
     *   THING.Utils.log(ev.level)
     * })
     * ```
     */
    trigger<K extends keyof EventTypeMapping>(
      eventType: K | EventTypeName,
      ev?: any,
      tag?: EventTagType
    ): void;

    /**
     * 将世界坐标系下的绝对位置转换成物体自身的坐标系下的相对位置
     * @param worldPos 世界坐标系下的绝对位置
     * @returns 相对坐标
     * @example
     * ```
     * // 例如三楼某书柜在世界坐标系下的绝对坐标是 [5,6,-15]
     * // floor 为三楼楼层对象，返回结果为书柜相对于该楼层的坐标，比如 [0,0,0]
     * floor.worldToSelf([5,6,-15]);
     * ```
     */
    worldToSelf(worldPos: Array<number>): Array<number>;
  }

  /**
   * 物体样式基类
   * @see [文档地址](http://192.168.1.238:8080/THING.BaseStyle.html)
   */
  class BaseStyle {
    /** 设置物体是否始终在最前端渲染显示 */
    alwaysOnTop: boolean;

    /** 显示/隐藏物体包围盒 */
    boundingBox: boolean;

    /** 设置包围盒颜色 */
    boundingBoxColor: number | string;

    /**
     * 设置/获取物体颜色 可填写 十六进制颜色值 或 rgb 字符串，取消颜色设置为 null
     * @example
     * ```
     * // 使用十六进制颜色
     * // obj.style.color = '#ff0000';
     * // // 使用 rgb 颜色
     * // obj.style.color = 'rgb(255,0,0)';
     * // // 取消颜色
     * // obj.style.color = null;
     * ```
     */
    color: number | string;

    /** 设置双面渲染 */
    doubleSide: boolean;

    /**
     * 设置/获取材质自发光颜色
     * @example
     * ```
     * obj.style.emissive = '#ffff00';
     * ```
     */
    emissive: number | string;

    /**
     * 设置/获取材质自发光滚动贴图。 最终的发光结果会乘以emissive的颜色。如果想让发光贴图生效，需要确认emissive不是黑色。
     * @example
     * ```
     * obj.style.emissiveScrollImage = 'https://www.thingjs.com/static/images/avatar.png';
     * ```
     */
    emissiveScrollImage: string;

    /**
     * 设置/获取反射贴图
     * @example
     * ```
     * obj.style.environmentImage = 'BlueSky';
     * ```
     */
    environmentImage: Array<any> | string;

    /**
     * 设置/获取高亮颜色，默认值为 null。
     * @example
     * ```
     * obj.style.highlight = '#ffff00';
     * ```
     */
    highlight: number | string;

    /**
     * 设置/获取高亮强度，默认为0.5。设置为null，则等效于恢复到0.5。 如果高亮颜色为null，则该属性没有实际效果。
     * @example
     * ```
     * obj.style.highlightIntensity = 0.8;
     * ```
     */
    highlightIntensity: number;

    /**
     * 设置贴图 填写图片资源路径 或 image 对象
     * @example
     * ```
     * // 使用图片路径
     * obj.style.image = 'https://www.thingjs.com/static/images/avatar.png';
     * ```
     */
    image: object | string;

    /**
     * 材质金属度系数
     */
    metalness: number;

    /**
     * 设置/获取物体不透明度，0 为全透明，1为不透明
     * @example
     * ```
     * obj.style.opacity = 0.8;
     * ```
     */
    opacity: number;

    /**
     * 设置/获取物体勾边颜色 颜色可填写 十六进制颜色值 或 rgb 字符串，取消勾边颜色设置为 null
     * @example
     * ```
     * // 使用十六进制颜色
     * obj.style.outlineColor = '#ff0000';
     * // 使用 rgb 颜色
     * obj.style.outlineColor = 'rgb(255,0,0)';
     * // 取消勾边颜色
     * obj.style.outlineColor = null;
     * ```
     */
    outlineColor: number | string;

    /**
     * 设置/获取渲染排序值, 数值越小越先渲染，默认值为 0
     */
    renderOrder: number;

    /**
     * 设置材质粗糙度系数
     */
    roughness: number;

    /**
     * 开启/禁用勾边
     */
    skipOutline: number;

    /**
     * 开启/关闭线框模式
     */
    wireframe: number;
  }

  /**
   * BooleanController 布尔类型组件
   * @see [文档地址](http://192.168.1.238:8080/THING.BooleanController.html)
   */
  class BooleanController extends Controller {
      /**
     * @param object 要操作的对象
     * @param property 要操作的属性名称
     */
      constructor(object?: any, property?: string);
  }

  /**
   * Box 正方体
   *
   * [文档链接](http://192.168.1.238:8080/THING.Box.html)
   * @example
   * ```
   * // 默认创建一个长宽高为 1m ,轴心点在中心的正方体
   * var box= app.create({
   *   type:'Box',
   *   position: [0, 0, 0] //世界坐标系下的位置
   * });
   * // 创建正方体参数设置
   * var box = app.create({
   *   type: 'Box',
   *   width: 1,// 宽度
   *   height: 1,// 高度
   *   depth: 1,// 深度
   *   center: 'Bottom',// 轴心
   *   //widthSegments: 1,// 宽度上的节数
   *   //heightSegments: 1,// 高度上的节数
   *   //depthSegments: 1,// 深度上的节数
   *   position:[0,0,0]// 世界坐标系下的位置
   * });
   * ```
   */
  class Box extends ThingGeometry {
    /**
     * 判断是否 Box 类型
     */
    isBox: boolean;
  }

  /**
   * Building 建筑类
   *
   * [文档链接](http://192.168.1.238:8080/THING.Building.html)
   */
  class Building extends THING.BaseObject {
    /**
     * 获取楼层是否已经展开
     * @example
     * ```
     * var boolean = building.expanded;
     * ```
     */
    expanded: boolean;

    /**
     * 获取建筑外立面对象
     * @example
     * ```
     * var facade = building.facade
     * ```
     */
    facade: THING.BaseObject;

    /**
     * 获取建筑楼层对象集合
     * @example
     * ```
     * var floors = building.floors;
     * ```
     */
    floors: THING.Selector;

    /**
     * 获取建筑下的 Thing 类型物体对象集合
     * @example
     * ```
     * var things = building.things;
     * ```
     */
    things: THING.Selector;

    /**
     * 展开楼层
     * @param param 参数列表
     * @example
     * ```
     * // 展开建筑楼层
     * building.expandFloors();
     * // 展开建筑楼层 相关参数设置
     * building.expandFloors({
     *   time: 1000,
     *   distance: 10,
     *   horzMode: false, // 填 true 时为横向展开楼层
     *   complete: function () {
     *     THING.Utils.log('展开完成')
     *   }
     * })
     * ```
     */
    expandFloors(param: {
      /** 展开过程的时间（毫秒） */
      time?: number;
      /** 楼层间展开后的间距，单位米 */
      distance?: number;
      /** 是否水平方向展开，默认 `false` 即竖直方向展开 */
      horzMode?: boolean;
      /** 展开结束后的回调函数 */
      complete?: Function;
      [propName: string]: any;
    }): void;

    /**
     * 显示/隐藏所有屋顶（房顶）
     * @param show true 显示（默认） / false 隐藏
     */
    showAllRoofs(show: boolean): void;

    /**
     * 合并楼层
     * @param params 参数列表
     * @example
     * ```
     * // 合并楼层
     * building.unexpandFloors();
     * // 合并楼层 参数设置
     * building.unexpandFloors({
     *   time:2000,
     *   complete:function(){
     *     THING.Utils.log('合并结束')
     *   }
     * })
     * ```
     */
    unexpandFloors(params: {
      /** 合并过程的时间（毫秒） */
      time?: number;
      /** 合并结束后的回调函数 */
      complete?: Function;
      [propName: string]: any;
    }): void;
  }

  /**
   * 摄像机类，通过 app.camera 获取摄像机对象
   *
   * [文档链接](http://192.168.1.238:8080/THING.CameraController.html)
   */
  class CameraController {
      constructor();

    /**
     * 设置/获取 摄像机惯性插值因子，数值越小插值效果越明显
     */
    dampingFactor: number;

    /**
     * 设置/获取 摄像机镜头和观察点的距离
     */
    distance: number;

    /**
     * 设置/获取 摄像机距离范围[最小值, 最大值]
     */
    distanceLimited: Array<number>;

    /**
     * 设置/获取 是否开启默认平移操作
     */
    enablePan: boolean;

    /**
     * 设置/获取 是否开启默认的旋转操作
     */
    enableRotate: boolean;

    /**
     * 设置/获取 是否开启默认缩放操作
     */
    enableZoom: boolean;

    /**
     * 设置/获取 摄像机远裁剪面的距离，超过这个距离的物体将不会被看到
     */
    far: number;

    /**
     * 获取摄像机是否在飞行
     */
    flying: boolean;

    /**
     * 设置/获取 摄像机FOV 值越大，视野越大 默认值为 60
     */
    fov: number;

    /**
     * 设置/获取 是否开启默认的摄像机交互操作
     */
    inputEnabled: boolean;

    /**
     * 设置/获取 摄像机键盘平移速度 默认值为 0.1
     */
    keyPanSpeed: number;

    /**
     * 设置/获取 摄像机鼠标平移速度 默认值为 0.1
     */
    mousePanSpeed: number;

    /**
     * 设置/获取 摄像机近裁剪面的距离，比这个距离近的物体将不会被看到
     */
    near: number;

    /**
     * 设置/获取摄像机 镜头位置（眼睛位置）
     * @example
     * ```
     * app.camera.position = [10,10,10]
     * ```
     */
    position: Array<number>;

    /**
     * 设置/获取 摄像机投影类型 默认为透视投影
     * @example
     * ```
     * // 透视投影
     * app.camera.projectionType = THING.CameraProjectionType.Perspective;
     * // 正射投影
     * app.camera.projectionType = THING.CameraProjectionType.Orthographic;
     * ```
     */
    projectionType: THING.CameraProjectionType;

    /**
     * 设置/获取 摄像机旋转速度
     */
    rotateSpeed: number;

    /**
     * 设置/获取摄像机 目标点位置
     * @example
     * ```
     * app.camera.target = [0,0,0]
     * ```
     */
    target: Array<number>;

    /**
     * 设置/获取 摄像机 UP 方向 默认值为 [0,1,0]
     */
    up: Array<number>;

    /**
     * 设置/获取 视图默认（2D/3D视图） 默认为 3D 视图
     * @example
     * ```
     * // 设置为 2D 顶视图
     * app.camera.viewMode = THING.CameraView.TopView;
     * // 设置为 3D 视图
     * app.camera.viewMode = THING.CameraView.Normal;
     * ```
     */
    viewMode: THING.CameraView;

    /**
     * 设置/获取 摄像机垂直角度范围[最小值, 最大值]，默认值[-90, 90]
     * @example
     * ```
     * // 限制摄像机不看到场景地面以下
     * app.camera.xAngleLimitRange = [0,90]
     * ```
     */
    xAngleLimitRange: Array<number>;

    /**
     * 设置/获取 摄像机水平角度范围[最小值, 最大值] [-180, 180] 之间(在地球上该参数暂不生效)
     */
    yAngleLimitRange: Array<number>;

    /**
     * 设置/获取 摄像机缩放系数范围[最小值, 最大值] (仅在 2D 视图下有效果)
     */
    zoomLimited: Array<number>;

    /**
     * 获取摄像机到某坐标或者另一物体的绝对距离
     * @param position 世界坐标系下的位置 或 另一物体
     * @returns 距离
     * @example
     * ```
     * // 填写世界坐标系下的位置
     * camera.distanceTo([0,0,0]);
     * // 填写物体对象
     * camera.distanceTo(otherObj);
     * ```
     */
    distanceTo(position: Array<number> | THING.BaseObject): number;

    /**
     * 观察某物体
     *
     * @example
     * ```
     * // 观察某物体
     * app.camera.fit(obj);
     * // 距离3倍物体自身包围盒半径处观察物体
     * app.camera.fit({
     *   object:obj,
     *   radiusFactor:3
     * })
     * // 距离物体 3m 处观察
     * app.camera.fit({
     *   object:obj,
     *   radius:3
     * })
     * // 从顶部观察物体，距离物体3倍自身包围盒半径
     * app.camera.fit({
     *   object: obj,
     *   xAngle: 90, // 绕物体自身X轴旋转角度
     *   yAngle: 0, // 绕物体自身Y轴旋转角度
     *   radiusFactor: 3, // 物体包围盒半径的倍数
     * });
     * // 从顶部观察物体，距离物体 3m 处
     * app.camera.fit({
     *   object: obj,
     *   xAngle: 90, // 绕物体自身X轴旋转角度
     *   yAngle: 0, // 绕物体自身Y轴旋转角度
     *   radius: 3, // 物体包围盒半径的倍数
     * });
     * ```
     */
    fit(param: {
      /** 观察的物体 */
      object?: THING.BaseObject;
      /** 绕物体自身 X 轴旋转角度 */
      xAngle?: number;
      /** 绕物体自身 Y 轴旋转角度 */
      yAngle?: number;
      /** 离目标物体距离（离物体 n 倍自身包围盒半径距离处） */
      radiusFactor?: number;
      /** 离目标物体距离（与 radiusFactor 选填其一） */
      radius?: number;
      [propName: string]: any;
    }): void;

    /**
     * 摄像机飞行到某位置或物体
     *
     * @example
     * ```
     * // 飞行到某位置
     * app.camera.flyTo({
     *   position: [3.6, 4.8, -6.5],
     *   target: [-4.2, -3.2, -20.6],
     *   time: 2000,
     *   complete: function() {
     *     THING.Utils.log('complete')
     *   }
     * });
     * // 飞行到某物体
     * app.camera.flyTo(obj)
     * // 飞行到某物体 设置飞行时间 和 飞行结束后的回调
     * app.camera.flyTo({
     *   object: obj,
     *   time: 1500,
     *   complete: function() {
     *     THING.Utils.log('finish')
     *   }
     * });
     * // 飞行到某物体正前方 2倍物体自身包围半径距离处
     * app.camera.flyTo({
     *   object: obj,
     *   xAngle: 0, // 绕物体自身X轴旋转角度
     *   yAngle: 0, // 绕物体自身Y轴旋转角度
     *   radiusFactor: 2, // 物体包围盒半径的倍数
     *   time: 2 * 1000,
     *   complete: function () {
     *     THING.Utils.log("飞行结束");
     *   }
     * });
     *
     * // 飞行到某物体正前方 5m 处
     * app.camera.flyTo({
     *   object: obj,
     *   xAngle: 0, // 绕物体自身X轴旋转角度
     *   yAngle: 0, // 绕物体自身Y轴旋转角度
     *   radius: 5,
     *   time: 2 * 1000,
     *   complete: function () {
     *     THING.Utils.log("飞行结束");
     *   }
     * });
     * // 飞到物体顶部 3倍物体自身包围盒半径距离处
     * app.camera.flyTo({
     *   object: obj,
     *   xAngle: 90, // 绕物体自身X轴旋转角度
     *   yAngle: 0, // 绕物体自身Y轴旋转角度
     *   radiusFactor: 3, // 物体包围盒半径的倍数
     *   time: 2 * 1000,
     *   complete: function () {
     *     THING.Utils.log("飞行结束");
     *   }
     * });
     * ```
     */
    flyTo(param: {
      /** 观察的物体 */
      object?: THING.BaseObject;
      /** 观察的目标点位置（与 object 参数选填其一） */
      target?: Array<number>;
      /** 摄像机镜头位置（与 target 组合使用） */
      position?: Array<number>;
      /** 摄像机up朝向 */
      up?: Array<number>;
      /** 飞行过程的时间（毫秒），默认值 2s */
      time?: number;
      /** 绕物体自身 X 轴旋转角度 */
      xAngle?: number;
      /** 绕物体自身 Y 轴旋转角度 */
      yAngle?: number;
      /** 离目标物体距离（离物体 n 倍自身包围盒半径距离处） */
      radiusFactor?: number;
      /** 离目标物体距离（与 radiusFactor 选填其一） */
      radius?: number;
      /**
       * 飞行速度插值方式
       * @todo 文档标注值为`THING.LerpType`，具体使用方式未知
       */
      lerpType?: object;
      /**
       * 摄像机镜头坐标插值方式
       * @todo 文档标注值为`THING.LerpType`，具体使用方式未知
       */
      positionLerp?: object;
      /**
       * 目标点插值方式
       * @todo 文档标注值为`THING.LerpType`，具体使用方式未知
       */
      targetLerp?: object;
      /**
       * up朝向插值方式
       * @todo 文档标注值为`THING.LerpType`，具体使用方式未知
       */
      upLerp?: object;
      /** 是否在地球上 默认false 在地球上使用需要传true */
      isEarth?: boolean;
      /** 飞行结束时的回调函数 */
      complete?: Function;
      [propName: string]: any;
    }): void;

    /**
     * 根据物体包围盒检测是某物体否在摄相机视锥范围内
     * @param object 物体
     */
    isInView(object: THING.BaseObject): boolean;

    /**
     * 看向某个物体或位置（设置后鼠标无法旋转和平移）
     * @param target 物体或者坐标，取消设置填 null
     * @example
     * ```
     * // 看向某物体
     * app.camera.lookAt(app.query('car01')[0]);
     * // 看向某点
     * app.camera.lookAt([20, 5.6, -6.6]);
     * // 取消设置
     * app.camera.lookAt(null);
     * ```
     */
    lookAt(target: THING.BaseObject | Array<number>): void;

    /**
     * 移动摄像机
     * @param deltaX 水平移动距离
     * @param deltaY 垂直移动距离
     * @example
     * ```
     * // 水平移动 10 m
     * app.camera.move(10,0);
     * // 垂直移动 10 m
     * app.camera.move(0,10);
     * ```
     */
    move(deltaX: number, deltaY: number): void;

    /**
     * 环绕旋转
     *
     * @example
     * ```
     * // 环绕某物体旋转 360 度，10s 转完
     * app.camera.rotateAround({
     *   object: obj,// 环绕的物体 (object 与 target 的设置互斥 详见教程)
     *   time: 10 * 1000, // 环绕飞行的时间
     *   yRotateAngle: 360, // 环绕y轴飞行的旋转角度
     *   complete:function(){
     *     THING.Utils.log('finish')
     *   }
     * });
     *
     * // 环绕 [0,0,0] 点一直旋转
     * app.camera.rotateAround({
     *   target: [0,0,0],
     *   time: 60 * 1000, // 环绕飞行的时间
     *   yRotateAngle: 360, // 环绕y轴飞行的旋转角度
     *   loopType: THING.LoopType.Repeat // 设置循环类型 重复循环
     * });
     * ```
     */
    rotateAround(params: {
      /** 环绕的物体 */
      object?: THING.BaseObject;
      /** 环绕的某点世界坐标系下的坐标（与 object 选填其一） */
      target?: Array<number>;
      /** 环绕 Y 轴旋转角度(俯仰面（竖直面）内的角度，范围0~180度) */
      yRotateAngle?: number;
      /** 环绕 X 轴旋转角度(方位面（水平面）内的角度，范围0~360度) */
      xRotateAngle?: number;
      /** 处理时间（毫秒） */
      time?: number;
      /** 循环类型，默认为 no */
      loopType?: string | THING.LoopType;
      /** 是否在地球上 默认false 在地球上使用需要传true */
      isEarth?: boolean;
      /** 环绕旋转完成后的回调函数 仅当 loopType 为 no 时有回调 */
      complete?: Function;
      [propName: string]: any;
    }): void;

    /**
     * 屏幕坐标转世界坐标
     * @param x 屏幕x坐标
     * @param y 屏幕y坐标
     * @returns 三维世界坐标
     */
    screenToWorld(x: number, y: number): Array<number>;

    /**
     * 停止飞行
     * @param params 参数列表
     */
    stopFlying(params?: {
      /** 是否在地球上 默认false 在地球上使用需要传true */
      isEarth?: boolean;
      [propName: string]: any;
    }): void;

    /**
     * 停止环绕旋转（针对 rotateAround）
     * @param params 参数列表
     */
    stopRotateAround(params?: {
      /** 是否在地球上 默认false 在地球上使用需要传true */
      isEarth?: boolean;
      [propName: string]: any;
    }): void;

    /**
     * 世界坐标转换成屏幕坐标
     * @param position 三维世界坐标
     * @returns 二维屏幕坐标
     */
    worldToScreen(position: Array<number>): Array<number>;

    /**
     * 向前/向后移动摄像机
     * @param distance 移动距离(+: 向前, -: 向后)
     * @param time 移动时间（毫秒）默认值为 0.5s
     */
    zoom(distance: number, time: number): void;
  }

  /**
   * Campus 园区类
   *
   * [文档链接](http://192.168.1.238:8080/THING.Campus.html)
   */
  class Campus extends THING.BaseObject {
    /**
     * 获取该园区建筑对象集合
     * @example
     * ```
     * var buildings = campus.buildings;
     * ```
     */
    buildings: THING.Selector;

    /**
     * 获取该园区地面
     * @example
     * ```
     * var ground = campus.ground;
     * ```
     */
    ground: THING.BaseObject;

    /**
     * 获取该园区下的 Thing 类型物体对象集合
     * @example
     * ```
     * var things = campus.things;
     * ```
     */
    things: THING.Selector;

    /**
     * 获取该园区场景资源路径
     */
    url: string;
  }

  /**
   * Circle 圆
   *
   * [文档链接](http://192.168.1.238:8080/THING.Circle.html)
   * @example
   * ```
   * // 创建一个圆
   * var circle = app.create({
   *   type: 'Circle',
   *   radius: 1,// 半径
   *   segments: 25,// 圆弧细分片段数，值越大，越平滑
   *   thetaStart: 0,// 起始角度
   *   thetaLength: Math.PI * 2 // 终止角度
   * });
   * // 创建一个半圆
   * var circle = app.create({
   *   type: 'Circle',
   *   radius: 1,// 半径
   *   segments: 25,// 圆弧细分片段数，值越大，越平滑
   *   thetaStart: 0,// 起始角度
   *   thetaLength: Math.PI // 终止角度
   * });
   * ```
   */
  class Circle extends THING.ThingGeometry {
    /**
     * 判断是否 Circle 类型
     */
    isCircle: boolean;
  }

  /**
   * Controller 组件对象
   *
   * [文档地址](http://192.168.1.238:8080/THING.Controller.html)
   */
  class Controller {
      /**
     *
     * @param object 数据对象
     * @param property 要绑定的某属性值的属性名称
     */
      constructor(object?: any, property?: string);

      /**
     * 设置标题名称
     * @param v 标题名称
     */
      caption(v: string): void;

      /**
     * 绑定事件
     * @param event 事件名称
     * @param callback 事件触发的回调函数
     * @returns 组件对象
     * @example
     * ```
     * obj.on('change',function(ev) {
     * });
     * // beforeChange 事件触发返回一个 Boolean 值，当返回 true 时，继续触发 change 事件；返回 false 则不会触发 change 事件
     * obj.on('beforeChange', function (ev) {
     *    //...;
     *    return true;
     * }
     * ```
     */
      on(event: string, callback?: Function): Controller;

      /**
     * 设置显示/隐藏
     * @param flag 显示/隐藏 状态
     */
      show(flag: boolean): void;
  }

  /**
   * Cylinder 圆柱体
   *
   * [文档链接](http://192.168.1.238:8080/THING.Cylinder.html)
   * @example
   * ```
   * var cylinder = app.create({
   *   type: 'Cylinder',
   *   radius: 0.5, // 半径
   *   height: 2, // 高度
   *   radiusSegments: 8, // 半径切面密度，数值越高圆柱体越圆滑
   *   position:[0,0,0], // 圆柱体中心在世界坐标系下的位置
   * });
   * ```
   */
  class Cylinder extends THING.ThingGeometry {
    /**
     * 判断是否 Cylinder 类型
     */
    isCylinder: boolean;
  }

  /**
   * DefaultStyle 默认物体样式
   *
   * [文档地址](http://192.168.1.238:8080/THING.DefaultStyle.html)
   */
  class DefaultStyle extends BaseStyle {}

  /**
   * EventTrigger The event trigger.
   *
   * [文档地址](http://192.168.1.238:8080/THING.DefaultStyle.html)
   */
  class EventTrigger extends BaseStyle {
      /**
     * @param param The initial parameters.
     */
      constructor(param?: any);

      /**
     * Add event listener.
     * @param type  The event type.
     * @param object  The object what to bind.
     * @param condition The condition to select children of object.
     * @param callback  The callback function.
     * @param tag The event tag.
     * @param priority  The priority value(default is 50, highger value will be processed first)
     * @param once  True indicates just trigger once time.
     * @param userData  The event user data what would trigger by event data with key as 'data'.
     */
      addEventListener(
      type: string,
      object?: THING.BaseObject,
      condition?: string,
      callback?: Function,
      tag?: string,
      priority?: number,
      once?: boolean,
      userData?: object
    ): void;

      /**
     * Trigger event.
     * @param type  The event type.
     * @param object  The object what to bind.
     * @param ev The event info.
     * @param tag The event tag.
     */
      dispatchEvent(
      type: string,
      object?: THING.BaseObject,
      ev?: object,
      tag?: string
    ): any;

      /** Dispose. */
      dispose(): void;

      /**
     * Get event listener.
     * @param type  The event type.
     * @param object  The object what to bind.
     * @param condition The condition to select children of object.
     * @param tag The event tag.
     */
      getEventListener(
      type: string,
      object?: THING.BaseObject,
      condition?: string,
      tag?: string
    ): any;

      /**
     * Get event listeners by object.
     * @param type  The event type.
     * @param object  The object what to bind.
     */
      getEventListeners(type: string, object?: THING.BaseObject): any;

      /**
     * Invoke listener.
     * @param listener  The listener.
     * @param ev  The event info.
     */
      invokeListener(listener: object, ev?: object): void;

      /**
     * Remove all event listeners.
     * @param object  The object what to bind.
     */
      removeAllEventListeners(object: THING.BaseObject): void;

      /**
     * Remove event listener.
     * @param type  The event type.
     * @param object  The object what to bind.
     * @param tag  The event tag.
     */
      removeEventListener(
      type: string,
      object?: THING.BaseObject,
      tag?: string
    ): void;

      /**
     * Traverse listener.
     * @param callback  The callback function.
     */
      traverseListener(callback: Function): void;

      /**
     * Traverse listener by type.
     * @param type  The event type.
     * @param callback  The callback function.
     */
      traverseListenerByType(type: string, callback: Function): void;
  }

  /**
   * FilteredArray The filtered array.
   * @see [文档](http://192.168.1.238:8080/THING.FilteredArray.html)
   */
  class FilteredArray {}

  /**
   * Flags The flags.
   * @see [文档](http://192.168.1.238:8080/THING.Flags.html)
   */
  class Flags {
    /** Get/Set change callback function */
    onChange: Function;

    /** Get the values. */
    values: number;

    /**
     * Check flag.
     * @param flags  The flags what to check.
     * @param enable  Check whether it's enable or disable.
     */
    check(flags: number, enable: boolean): boolean;

    /**
     * Clear flags.
     * @param flags  The flags what to clear, if we do not provide it then indicates clear all flags.
     */
    clear(flags: number): void;

    /**
     * Combine flags.
     * @param flags  The flags what to combine.
     */
    combine(flags: number): void;

    /**
     * Enable/Disable flags.
     * @param flags  The flags what to set or clear.
     * @param value  True indicates enable it, otherwise disable it.
     * @returns True indicates flags has changed.
     */
    enable(flags: number, value: boolean): boolean;

    /**
     * Get the enable state.
     * @param flags  The flags what to check.
     */
    get(flags: number): void;

    /**
     * Check whether has flags.
     * @param flags  The flags what to combine.
     * @param matchAll  True indicates try to match all flags, otherwise try to match any flags.
     */
    has(flags: number, matchAll: boolean): boolean;

    /**
     * Set flags.
     * @param flags  The flags what to set.
     */
    set(flags: number): void;

    /**
     * Watch flag by name when changed.
     * @param flag  The flag what to watch.
     * @param callback  The callback function.
     */
    watch(flag: number, callback: Function): void;
  }

  /**
   * Floor 楼层类
   * @see [文档](http://192.168.1.238:8080/THING.Floor.html)
   */
  class Floor extends THING.BaseObject {
    /**
     * 获取楼层所在的建筑对象
     * @example
     * ```
     * var building = floor.building;
     * ```
     */
    building: THING.Building;

    /**
     * 获取天花板（不包含该楼层下独立管理的房间的天花板）
     * @example
     * ```
     * var ceiling = floor.ceiling;
     * ```
     */
    ceiling: THING.BaseObject;

    /**
     * 获取该楼层下的门对象集合
     * @example
     * ```
     * var doors = floor.doors;
     * ```
     */
    doors: THING.Selector;

    /**
     * 获取该楼层相对于建筑的索引下标（从0开始）
     */
    indexOfBuilding: number;

    /**
     * 获取该楼层是第几层（从1开始）
     */
    levelNumber: number;

    /**
     * 获取该楼层下的杂物（未单独管理的物体会被合并成为杂物）
     * @example
     * ```
     * var misc = floor.misc;
     * ```
     */
    misc: THING.BaseObject;

    /**
     * 获取该楼层的地板（不包含该楼层下独立管理的房间的地板）
     * @example
     * ```
     * var plan = floor.plan;
     * ```
     */
    plan: THING.BaseObject;

    /**
     * 获取该楼层的屋顶（不包含该楼层下独立管理的房间的屋顶）
     * @example
     * ```
     * var roof = floor.roof;
     * ```
     */
    roof: THING.BaseObject;

    /**
     * 获取该楼层下的房间对象集合
     * @example
     * ```
     * var rooms = floor.rooms;
     * ```
     */
    rooms: THING.Selector;

    /**
     * 获取该楼层下的 `Thing` 类型物体对象集合
     * @example
     * ```
     * var things = floor.things;
     * ```
     */
    things: THING.Selector;

    /**
     * 获取该楼层下的墙
     * @example
     * ```
     * var wall = floor.wall;
     * ```
     */
    wall: THING.BaseObject;

    /**
     * 以相对楼层的坐标位置获取对应的房间对象
     * @param localPosition 楼层下的相对坐标
     * @returns 房间对象
     */
    getRoomFromLocalPosition(localPosition: Array<number>): THING.Room;

    /**
     * 以世界坐标位置获取对应的房间对象
     * @param position 世界坐标
     * @returns 房间对象
     */
    getRoomFromWorldPosition(position: Array<number>): THING.Room;

    /**
     * 显示/隐藏所有天花板（包括了楼层和该楼层下房间的天花板）
     * @param visible `true` 显示（默认值） / `false` 隐藏
     */
    showAllCeilings(visible: boolean): void;

    /**
     * 显示/隐藏所有屋顶（包括了楼层和该楼层下房间的屋顶）
     * @param visible `true` 显示（默认值） / `false` 隐藏
     */
    showAllRoofs(visible: boolean): void;
  }

  /**
   * Frustum 视锥
   * @see [文档](http://192.168.1.238:8080/THING.Frustum.html)
   * @example
   * ```
   * var frustum = app.create({
   *   type: 'Frustum',
   *   fov: 45,
   *   aspect: 2,
   *   length: 2,
   * });
   * ```
   */
  class Frustum extends THING.ThingGeometry {
    /** 判断是否 Frustum 类型 */
    isFrustum: boolean;
  }

  /**
   * Grid 正方网格
   * @see [文档](http://192.168.1.238:8080/THING.Grid.html)
   * @example
   * ```
   * var grid = app.create({
   *   type: 'Grid',
   *   size: 10,// 格网大小
   *   divisions: 10,// 细分的格网数
   *   position:[0,0,0] // 格网中心在世界坐标系下的位置
   * });
   * ```
   */
  class Grid extends THING.ThingGeometry {
    /** 判断是否 `Grid` 类型 */
    isGrid: boolean;
  }

  /**
   * GroupState The group to control enable/disable state.
   * @see [文档](http://192.168.1.238:8080/THING.GroupState.html)
   */
  class GroupState {
      /**
     * 判断是否 `Grid` 类型
     * @param param The initial parameters.
     */
      constructor(param?: object);

    /** Get the states. */
    states: any;

    /** Clear all states. */
    clear(): void;

    /**
     * Enable/Disable.
     * @param value Enable or disable.
     * @param name The group name.
     * @param priority The group priority, check enable state from high to low.
     */
    enable(value: boolean, name?: string, priority?: number): void;

    /**
     * Get value by name.
     * @param name The group name.
     */
    getValue(name: string): any;

    /** Check whether it's enable. */
    isAnyEnable(): boolean;

    /**
     * Check whether it's enable.
     * @param name The group name, if do not proivde then indicates get the final state.
     */
    isEnable(name: string): boolean;
  }

  /**
   * Heatmap 热力图
   * @see [文档](http://192.168.1.238:8080/THING.Heatmap.html)
   * @example
   * ```
   * // 创建热力图
   * var heatMap = app.create({
   *   type: "Heatmap",
   *   width: 12, // 宽度 单位米
   *   height: 10, // 长度 单位米
   *   minValue: 20, // 热力值下限
   *   maxValue: 27, // 热力值上限
   *   radius: 0.8, // （可选）单个点的热力影响半径，默认为0.8
   *   blur: 0.8, // (可选) 单个点的热力影响模糊半径，默认为0.8
   *   alpha: false, // （可选）未插值区域是否透明，默认为 false 不透明
   *   mapSize: 256, // （可选）实际分辨率大小，值越大分辨率越高，推荐为2次幂的值但不大于2048，默认为256
   *   mosaic: false, // (可选) 是否叠加马赛克效果，默认为false
   *   mosaicSize: 4, // (可选) 单个马赛克尺寸，此尺寸相对mapSize
   *   clipShape: { // (可选) 热力图的裁剪形状，坐标系以热力图平面中心为原点
   *         shape: [[0, 0], [-5, 0], [-5, -5], [5, -5], [5, 5], [0, 5]],
   *         holes: [
   *             [[2, -1], [4, -1], [4, -3], [2, -3]]
   *         ]
   *   },
   *   gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' } // （可选）颜色渐变，色值可设置为css可识别的色值
   * });
   * heatMap.rotateX(90);
   * // 设置热力图数据 数据格式为
   * // [x坐标,y坐标,热力值] 组成的数组
   * // 坐标系以热力图平面中心为原点
   * heatMap.setData([
   *   [-0.91, -1.07, 24],
   *   [-2.11, -1.07, 27],
   *   [0, 0, 25],
   *   [-2.71, -1.07, 25],
   *   [-0.86, 1.13, 20],
   *   [-0.31, -1.07, 23],
   *   [2, -2, 23],
   *   [3, 3, 25]
   * ]);
   * ```
   */
  class Heatmap extends THING.BaseObject {
      /**
     * 设置热力图数据 数据格式为 [x坐标, y坐标, 热力值] 组成的数组，其中坐标值为相对坐标
     * @example
     * ```
     * // 设置热力图数据
     * heatMap.setData([
     *   [0,0,10],
     *   [0,1,12],
     *   [0,2,11]
     * ])
     * ```
     */
      setData(data: Array<Array<number>>): void;

      /**
     * 设置颜色渐变，色值可设置为css可识别的色值
     * @param gradient 颜色渐变
     * @example
     * ```
     * // 设置热力图数据
     * // 设置颜色渐变，色值可设置为css可识别的色值
heatMap.setGradient({ 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' })
     * ```
     */
      setGradient(gradient: object): void;
  }

  /**
   * IDWMap 插值图
   * @see [文档](http://192.168.1.238:8080/THING.IDWMap.html)
   * @example
   * ```
   * // 创建插值图
   * var idwMap = app.create({
   *   type: "IDWMap",
   *   width: 12, // 宽度 单位米
   *   height: 10, // 长度 单位米
   *   minValue: 20, // 最小值
   *   maxValue: 27, // 最大值
   *   opacity: 1, // （可选）插值图透明度 默认1
   *   radius: 10, // （可选）单个样本点影响半径 单位米 采样点与样本点距离超过这个半径则不受该点影响 默认10
   *   cellSize: 10, // （可选）插值图单个格网代表的像素值 默认10
   *   exp: 1, // （可选）权重指数值
   *   alpha: false, // （可选）未插值区域是否透明，默认为 false 不透明
   *   mapSize: 256, // （可选）实际分辨率大小，值越大分辨率越高，推荐为2次幂的值但不大于2048，默认为256
   *   mosaic: false, // (可选) 是否叠加马赛克效果，默认为false
   *   mosaicSize: 4, // (可选) 单个马赛克尺寸，此尺寸相对mapSize
   *   clipShape: { // (可选) 裁剪形状，坐标系以插值图平面中心为原点
   *         shape: [[0, 0], [-5, 0], [-5, -5], [5, -5], [5, 5], [0, 5]],
   *         holes: [
   *             [[2, -1], [4, -1], [4, -3], [2, -3]]
   *         ]
   *   },
   *   gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' } // （可选）颜色渐变，色值可设置为css可识别的色值
   * });
   * // 设置插值图数据 数据格式为
   * // [x坐标,y坐标,样本值] 组成的数组
   * // 坐标系以插值图平面中心为原点
   * idwMap.setData([
   *   [-0.91, -1.07, 24],
   *   [-2.11, -1.07, 27],
   *   [0, 0, 25],
   *   [-2.71, -1.07, 25],
   *   [-0.86, 1.13, 20],
   *   [-0.31, -1.07, 23],
   *   [2, -2, 23],
   *   [3, 3, 25]
   * ]);
   * ```
   */
  class IDWMap extends THING.BaseObject {}

  /**
   * IframeController iframe 组件，可向 panel 中添加 iframe 组将，将其他页面以 iframe 的方式嵌入到 ThingJS 中
   * @see [文档](http://192.168.1.238:8080/THING.IframeController.html)
   * @example
   * ```
   * var panel = new THING.widget.Panel({
   *    titleText: '我是标题',
   *    hasTitle: true
   *  });
   *  // 数据对象
   *  var dataObj={
   *    url:"https://www.thingjs.com"
   *  }
   *  // 加载 iframe 组件
   *  var iframe = panel.addIframe(dataObj, 'url').caption('iframe01');
   *  // 设置 iframe 高度
   *  iframe.setHeight("250px");
   * ```
   */
  class IframeController extends THING.Controller {
      /**
     *
     * @param object 数据对象
     * @param property 要绑定的某属性值的属性名称
     */
      constructor(object?: object, property?: string);

      /**
     * 设置 iframe 高度
     * @param height 高度
     */
      setHeight(height: string): void;
  }

  /**
   * ImageController 图标按钮组件
   * @see [文档](http://192.168.1.238:8080/THING.ImageController.html)
   * @example
   * ```
   * var panel = new THING.widget.Panel({ width: '246px' });
   * // 数据对象
   * var dataObj = {
   *   '按钮1': true,
   *   '按钮2': true,
   *   '按钮3': false,
   * }
   * var button0 = panel.addImageBoolean(dataObj, '按钮1').caption('按钮1').url('https://thingjs.com/static/images/warning.png');
   * var button1 = panel.addImageBoolean(dataObj, '按钮2').caption('按钮2').url('#momoda_lc-icontubiao2');
   * var button2 = panel.addImageBoolean(dataObj, '按钮3').caption('按钮3').url('#momoda_lc-icontubiao5')
   * // 绑定回调
   * button0.on('change', function (ev) {
   *   // 返回按钮状态 boolean 值
   *   console.log(ev);
   * });
   * ```
   */
  class ImageController extends THING.Controller {
      /**
     *
     * @param object 数据对象
     * @param property 要绑定的某属性值的属性名称
     */
      constructor(object?: object, property?: string);

      /**
     * 设置图标路径
     * @param url 图标路径
     */
      url(url: any): void;
  }

  /**
   * ImageProxy The image proxy.
   * @see [文档](http://192.168.1.238:8080/THING.ImageProxy.html)
   */
  class ImageProxy {}

  /**
   * InheritNode The inherit node.
   * @see [文档](http://192.168.1.238:8080/THING.InheritNode.html)
   */
  class InheritNode {
      /**
     *
     * @param param The initial parameters.
     */
      constructor(param?: object);

    /** Get/Set inherit parent position. */
    inheritPosition: boolean;

    /** Get/Set inherit parent rotation. */
    inheritRotation: boolean;

    /** Get/Set inherit parent scale. */
    inheritScale: boolean;
  }

  /**
   * LightBase 光线基类
   * @see [文档](http://192.168.1.238:8080/THING.LightBase.html)
   */
  class LightBase extends THING.BaseObject {
    /** 获取/设置灯光是否能产生阴影 */
    castShadow: boolean;

    /** 获取/设置灯光强度 */
    intensity: number;

    /** 设置灯光颜色 颜色范围：[0~1, 0~1, 0~1] */
    lightColor: string | Array<number>;

    /** 设置阴影偏移量 */
    shadowBias: number;
  }

  /**
   * Line 轨迹线
   * @see [文档](http://192.168.1.238:8080/THING.Line.html)
   */
  class Line extends THING.LineBase {
      /**
     * 显示/隐藏线段
     * @param visible 显示/隐藏线段
     */
      showLines(visible: boolean): void;

      /**
     * 显示/隐藏轨迹点
     * @param visible 显示/隐藏轨迹点
     */
      showLines(visible: boolean): void;
  }

  /**
   * LineBase 线段基类
   * @see [文档](http://192.168.1.238:8080/THING.LineBase.html)
   */
  class LineBase extends THING.PointsBase {
    /** 设置/获取 线段拐角处圆角半径, 如果是 0 则表示直角 默认值为 0.3 */
    cornerRadius: number;

    /**
     * 设置/获取 线段拐角处细分片段数，数值越大线段的细分片段越多，越平滑 默认值为 10
     */
    cornerSegments: number;

    /** 设置贴图重复，默认为[1, 1] */
    imageRepeat: Array<number>;

    /** 启用/禁止 UV 动画 */
    imageScroll: boolean;

    /** 设置/获取 UV 动画播放速度, 数值设置成负数可以改变动画方向 默认值为 1 */
    imageScrollSpeed: number;

    /** 获取线段长度 */
    length: number;

    /** 启用/禁用纹理 */
    useTexture: boolean;

    /**
     * 开始播放路线动画
     * @param params 参数列表
     */
    play(params: {
      /** 播放时间(毫秒) */
      time: number;
      /** 起始进度(百分比, 默认从0开始播放) */
      startProgress: number;
      /** 结束进度(百分比, 默认从1开始播放) */
      endProgress: number;
      /** 插值类型，值为`THING.LerpType` */
      lerpType: object;
      /** 完成回调函数 */
      complete: Function;
      [propName: string]: any;
    }): void;

    /** 停止播放路线动画 */
    stop(): void;
  }

  /**
   * 添加该组件后，物体将始终看向（正面朝向）目标位置或者物体。 如果场景倾斜，需要先设置物体的up。
   * @see [文档](http://192.168.1.238:8080/THING.LookAtControl.html)
   */
  class LookAtControl {}

  /**
   * Marker 用于创建 3D 场景内的图标，可用于物体顶牌，可以传入图片地址 或 canvas 对象
   * @see [文档](http://192.168.1.238:8080/THING.Marker.html)
   * @example
   * ```
   * // 创建 Marker
   * var marker01 = app.create({
   *   type: 'Marker',
   *   id: 'myMarker01',
   *   url: 'https://speech.uinnova.com/static/images/warning1.png',// 图片地址
   *   position: [0,5,0], // 在世界坐标系下的位置
   *   size: 4 // 图标长宽比例大小
   * });
   * // 以某物体为父亲 创建
   * var marker02 = app.create({
   *   type: 'Marker',
   *   id: 'myMarker02',
   *   url: 'https://speech.uinnova.com/static/images/warning1.png',// 图片地址
   *   parent: obj, // 设置父物体
   *   localPosition: [0,5,0], // 父物体坐标系下的相对位置
   *   ignoreParentBoundingBox: false, // 是否忽略父物体包围盒，如果忽略的话则直接使用指定的相对位置进行设置
   *   size: 4 // 图标长宽比例大小
   * });
   * // 图标始终保持像素大小
   * var marker03 = app.create({
   *   type: 'Marker',
   *   id: 'myMarker03',
   *   url: 'https://speech.uinnova.com/static/images/warning1.png',// 图片地址
   *   parent: obj, // 设置父物体
   *   localPosition: [0,5,0], // 父物体坐标系下的相对位置
   *   ignoreParentBoundingBox: true, // 是否忽略父物体包围盒，如果忽略的话则直接使用指定的相对位置进行设置
   *   size: 4, // 图标长宽比例大小
   *   keepSize: true // 设置图标始终保持像素大小
   * });
   * ```
   */
  class Marker extends THING.BaseObject {
    /**
     * 设置/获取 canvas画布
     * @example
     * ```
     * // marker 以 canvas 绘制结果作为图片
     * marker.canvas=createCanvas(16)
     * // 创建 canvas 并写字
     * function createCanvas(text) {
     * // 创建 canvas
     * var canvas = document.createElement("canvas");
     *   canvas.width = 64;
     *   canvas.height = 64;
     *
     *   var ctx = canvas.getContext("2d");
     *   ctx.fillStyle = "rgb(32, 32, 256)";
     *   ctx.beginPath();
     *   ctx.arc(32, 32, 30, 0, Math.PI * 2);
     *   ctx.fill();
     *
     *   ctx.fillStyle = "rgb(255, 255, 255)";
     *   ctx.font = "32px sans-serif";
     *   ctx.textAlign = "center";
     *   ctx.textBaseline = "middle";
     *   ctx.fillText(text, 32, 32);
     *
     *   return canvas;
     * }
     * ```
     */
    canvas: HTMLCanvasElement;

    /** 设置/获取 锚点位置 */
    pivot: Array<number>;

    /** 设置/获取 锚点像素位置 */
    pivotPixel: Array<number>;

    /**
     * 设置/获取 图标长宽比例大小
     * @example
     * ```
     * // 图标长宽等比缩放 4 倍，等同于 marker.size = [4,4];
     * marker.size = 4;
     * // 图标长度缩放 2 倍，宽度缩放 4 倍数
     * marker.size = [2,4];
     * ```
     */
    size: Array<number> | number;

    /**
     * 设置/获取 图片资源地址
     * @example
     * ```
     * // 图片资源可上传至 ThingJS 在线开发网站
     * // 若使用其他服务器上的图片资源，需保证服务器图片资源允许跨域访问
     * marker.url = "https://thingjs.com/static/images/warning.png";
     * ```
     */
    url: string;
  }

  /**
   * 数学类 [Class: Mathics](http://192.168.1.238:8080/THING.Mathics.html)
   */
  class Mathics {
      /**
     * 坐标相加
     * @param v1 坐标
     * @param v2 坐标
     * @example
     * ```
     * THING.Math.addVector([1,2,3],[3,4,5]); // 返回值 [4,6,8]
     * ```
     */
      addVector(v1: Array<number>, v2: Array<number>): Array<number>;

      /**
     * 限制 value 的值在 min 和 max 之间 如果 value 小于 min，返回 min 。如果 value 大于 max，返回 max，否则返回 value
     * @param value 数值
     * @param min 最小值
     * @param max 最大值
     * @example
     * ```
     * THING.Utils.log(THING.Math.clamp(9,1,5)) // 5
     * THING.Utils.log(THING.Math.clamp(-1,1,5)) // 1
     * THING.Utils.log(THING.Math.clamp(3,1,5)) // 3
     * ```
     */
      clamp(value: number, min: number, max: number): number;

      /**
     * 向量叉乘 叉乘得到的向量垂直于原来的两个向量 在3D空间中，常用来求两个向量所在平面的法向量
     * @param v1 坐标
     * @param v2 坐标
     * @example
     * ```
     * THING.Math.crossVector([1,0,0],[0,1,0]); // 返回值 [0,0,1]
     * ```
     */
      crossVector(v1: Array<number>, v2: Array<number>): Array<number>;

      /**
     * 角度转弧度
     * @param degrees 角度
     * @example
     * ```
     * THING.Math.degToRad(180) // 3.141592653589793
     * ```
     */
      degToRad(degrees: number): number;

      /**
     * 向量数除
     * @param v 坐标
     * @param scale 缩放系数
     * @example
     * ```
     * THING.Math.divideVector([3,6,9],3); // 返回值 [1,2,3]
     * ```
     */
      divideVector(v: Array<number>, scale: number): Array<number>;

      /**
     * 向量点乘
     * @param v1 坐标
     * @param v2 坐标
     * @example
     * ```
     * THING.Math.dotVector([1,2,3],[4,5,6]); // 返回结果 32
     * ```
     */
      dotVector(v1: Array<number>, v2: Array<number>): number;

      /**
     * 坐标是否相同
     * @param v1 坐标
     * @param v2 坐标
     * @param epsilon 误差范围
     */
      equalsVector(
      v1: Array<number>,
      v2: Array<number>,
      epsilon: number
    ): boolean;

      /**
     * 坐标是否相同
     * @param v1 坐标
     * @param v2 坐标
     * @param epsilon 误差范围
     */
      equalsVectorX(
      v1: Array<number>,
      v2: Array<number>,
      epsilon: number
    ): boolean;

      /**
     * 返回小数部分
     * @param x 数值
     */
      fract(x: number): number;

      /**
     * 地球上根据经纬度和方位角得到可以使物体贴地的旋转信息
     * @param lonlat 经纬度坐标 [lon, lat]
     * @param angle 方位角 默认 0
     */
      getAnglesFromLonlat(lonlat: Array<number>, angle: number): Array<number>;

      /**
     * 获取面积（只使用 x 和 z 两个位置属性来结算）
     * @param positions 坐标点数组列表
     */
      getArea(positions: Array<number>): number;

      /**
     * 获取 v2 到 v1 的方向向量
     * @param v1 起点
     * @param v2 终点
     * @example
     * ```
     * // 第一个参数为起点 第二个参数为终点
     * THING.Math.getDirection([1,1,1],[2,2,2]);
     * // 返回值[0.5773502691896258,0.5773502691896258,0.5773502691896258]
     * ```
     */
      getDirection(v1: Array<number>, v2: Array<number>): Array<number>;

      /**
     * 获取两点间距离
     * @param v1 第一个坐标点
     * @param v2 第二个坐标点
     * @example
     * ```
     * THING.Math.getDistance([1,1,1],[2,2,2]); // 返回值 1.7320508075688772
     * ```
     */
      getDistance(v1: Array<number>, v2: Array<number>): number;

      /**
     * 获取区域的最佳标签显示位置(只能以平面的方式获取，坐标的 Y 轴位置会被忽略)
     * @param points 坐标位置列表
     * @param height 标签高度, (可选参数，默认取平均高度)
     */
      getLabelPosition(points: Array<number>, height?: number): Array<number>;

      /**
     * 获取向量长度（向量的模）
     * @param v 坐标
     * @example
     * ```
     * THING.Math.getVectorLength([1,1,1]);// 返回值 1.7320508075688772
     * ```
     */
      getVectorLength(v: Array<number>): number;

      /**
     * 获取向量长度的平方
     * @param v 坐标
     * @example
     * ```
     * THING.Math.getVectorLengthSquared([1,1,1]);// 返回值 3
     * ```
     */
      getVectorLengthSquared(v: Array<number>): number;

      /**
     * 判断数值是否2次幂
     * @param num 数值
     */
      isPowerOf2(num: number): boolean;

      /**
     * 线性插值
     * @param start 起始值
     * @param end 终止值
     * @param percent 百分比（0~1）
     * @example
     * ```
     * THING.Math.lerp(2,10,0.5) // 6
     * ```
     */
      lerp(start: number, end: number, percent: number): number;

      /**
     * 经纬度转世界坐标
     * @param lonLat [经度,纬度]
     * @param length 距离地面的高度, 默认为 0
     * @param r 距离球心的半径默认为 6378000
     */
      lonlat2World(
      lonLat: Array<number>,
      length?: number,
      r?: number
    ): Array<number>;

      /**
     * 获取坐标数组中各数组相同索引下的最大值
     * @param positions 坐标数组
     * @example
     * ```
     * var maxV=THING.Math.maxVector([[0,1,0],[1,2,3],[3,1,0],[1,1,1]])
     * THING.Utils.log(maxV) // [3,2,3]
     * ```
     */
      maxVector(positions: Array<number>): Array<number>;

      /**
     * 获取坐标数组中各数组相同索引下的最小值
     * @param positions 坐标数组
     * @example
     * ```
     * var mimV=THING.Math.minVector([[0,1,0],[1,2,3],[3,1,0],[1,1,1])
     * THING.Utils.log(mimV) // [0,1,0]
     * ```
     */
      minVector(positions: Array<number>): Array<number>;

      /**
     * 坐标取负
     * @param v 坐标
     * @example
     * ```
     * THING.Math.negVector([1,2,3]); // 返回值[-1,-2,-3]
     * ```
     */
      negVector(v: Array<number>): Array<number>;

      /**
     * 求单位向量
     * @param v 坐标
     * @example
     * ```
     * THING.Math.normalizeVector([1,1,1]);
     * // 返回值 [0.5773502691896258,0.5773502691896258,0.5773502691896258]
     * ```
     */
      normalizeVector(v: Array<number>): Array<number>;

      /**
     * 弧度转角度
     * @param radians 弧度
     * @example
     * ```
     * THING.Math.radToDeg(Math.PI) // 180
     * ```
     */
      radToDeg(radians: number): number;

      /**
     * 获取随机颜色
     */
      randomColor(): number;

      /**
     * 获取随机浮点数值[最小值, 最大值]
     * @param min 最小值
     * @param max 最大值
     */
      randomFloat(min: number, max: number): number;

      /**
     * 从数组随机挑选出任一元素
     * @param arr 数组
     */
      randomFromArray(arr: Array<any>): any;

      /**
     * 产生随机下标值 [0, number - 1]
     * @param number 数组
     */
      randomIndex(number: number): number;

      /**
     * 获取随机整数数值[最小值, 最大值]
     * @param min 最小值
     * @param max 最大值
     */
      randomInt(min: number, max: number): number;

      /**
     * 随机产生坐标信息
     * @param rx x 坐标会在[-rx, rx]之间进行随机
     * @param ry y 坐标会在[-ry, ry]之间进行随机
     * @example
     * ```
     * // xyz 会在 [-10, 10] 之间随机
     * THING.Math.randomVector2(10, 10);
     * // 也可用如下的方式调用(xyz 用同一个数值)
     * THING.Math.randomVector2(10);
     * ```
     */
      randomVector2(rx?: number, ry?: number): Array<number>;

      /**
     * 随机产生坐标信息
     * @param rx x 坐标会在[-rx, rx]之间进行随机
     * @param ry y 坐标会在[-ry, ry]之间进行随机
     * @param rz z 坐标会在[-rz, rz]之间进行随机
     * @example
     * ```
     * // xyz 会在 [-10, 10] 之间随机
     * THING.Math.randomVector3(10, 10, 10);
     * // 也可用如下的方式调用(xyz 用同一个数值)
     * THING.Math.randomVector3(10);
     * ```
     */
      randomVector3(rx?: number, ry?: number, rz?: number): Array<number>;

      /**
     * 向上取数值的2次幂
     * @param v 数值
     * @example
     * ```
     * THING.Math.roundUpPowerOf2(9) //16
     * ```
     */
      roundUpPowerOf2(v: number): number;

      /**
     * 向量数乘
     * @param v 坐标
     * @param scale 缩放系数
     * @example
     * ```
     * THING.Math.scaleVector([1,2,3],3); // 返回值 [3,6,9]
     * THING.Math.scaleVector([1,2,3],-2); // 返回值 [-2,-4,-6]
     * ```
     */
      scaleVector(v: Array<number>, scale: number): Array<number>;

      /**
     * 坐标相减
     * @param v1 坐标
     * @param v2 坐标
     * @example
     * ```
     * THING.Math.subVector([1,2,3],[3,4,5]); // 返回值 [-2,-2,-2]
     * ```
     */
      scaleVector(v1: Array<number>, v2: Array<number>): Array<number>;

      /**
     * 交换数组元素位置
     * @param arr 数组
     * @param index1 第一个元素索引下标
     * @param index2 第二个元素索引下标
     * @example
     * ```
     * THING.Utils.log(THING.Math.swapArray([0,1,2,3],1,2)) // [0,2,1,3]
     * ```
     */
      swapArray(arr: Array<any>, index1: number, index2: number): Array<any>;

      /**
     * 数值取整
     * @param n 数值
     */
      toInteger(n: number): number;

      /**
     * 创建新的点，删除重复的点
     * @param 点
     * @param epsilon epsilon 范围.
     */
      toUniquePoints(点: Array<Array<number>>, epsilon?: number): Array<number>;

      /**
     * 世界坐标转经纬度
     * @param pos 世界坐标 [x,y,z]
     * @param earthCenter 默认为[0,0,0]，地球的中心点
     * @returns [经度，纬度，高度]
     */
      world2Lonlat(pos: Array<number>, earthCenter: Array<number>): Array<number>;
  }

  /**
   * NumberController 数值对象
   * @see [文档](http://192.168.1.238:8080/THING.NumberController.html)
   */
  class NumberController extends THING.Controller {
      /**
     *
     * @param object 数据对象
     * @param property 要绑定的某属性值的属性名称
     * @param params 可选参数
     */
      constructor(
      object: object,
      property: string,
      params?: {
        /** 最小值 */
        min?: number;
        /** 最大值 */
        max?: number;
        /** 增量 */
        step?: number;
        [propName: string]: any;
      }
    );
      constructor();

      /**
     * 设置最大值
     * @param maxValue 最大值
     */
      max(maxValue: number): NumberController;

      /**
     * 设置最小值
     * @param minValue 最小值
     */
      min(minValue: number): NumberController;

      /**
     * 设置变化增量
     * @param stepValue 增量
     * @returns 组件对象
     */
      step(stepValue: number): NumberController;
  }

  /**
   * NumberControllerBox 数字组件
   * @see [文档](http://192.168.1.238:8080/THING.NumberControllerBox.html)
   */
  class NumberControllerBox extends THING.NumberController {
      /**
     *
     * @param object 数据对象
     * @param property 要绑定的某属性值的属性名称
     * @param params 可选参数
     */
      constructor(
      object: object,
      property: string,
      params?: {
        /** 最小值 */
        min?: number;
        /** 最大值 */
        max?: number;
        /** 增量 */
        step?: number;
        [propName: string]: any;
      }
    );
      constructor();

      /**
     * 设置值是否允许改变
     * @param flag 是否允许改变
     */
      isChangeValue(flag: boolean): Controller;
  }

  /**
   * NumberControllerSlider 数值型进度条 可显示在某区间值域内的指标数值变化，也可设置进度条滑块能否被拖动以改变数值
   * @see [文档](http://192.168.1.238:8080/THING.NumberControllerSlider.html)
   * ```
   * var panel = new THING.widget.Panel({
   *  titleText: "数值型进度条",
   *  width: '400px',
   *  hasTitle: true
   * });
   * // 数据对象
   * var dataObj = {
   *  '海拔': 100,
   *  '气温': 20
   * };
   * var slider01 = panel.addNumberSlider(dataObj, '海拔').step(1).min(0).max(500);
   * // isChangeValue 可与进度条交互滑动
   * var slider02 = panel.addNumberSlider(dataObj, '气温').step(1).min(-20).max(40).isChangeValue(true)
   * slider02.on('change', function (value) {
   *  console.log('气温 ' + value);
   * });
   * ```
   */
  class NumberControllerSlider extends THING.NumberController {
      /**
     *
     * @param object 数据对象
     * @param property 要绑定的某属性值的属性名称
     */
      constructor(object?: object, property?: string);

      /**
     * 将绝对数值转为百分比
     * @param flag 是否转化为百分比
     */
      isPercentage(flag: boolean): void;
  }

  /**
   * 全景图管理器，提供全景图创建，操作，事件
   * @see [文档](http://192.168.1.238:8080/THING.PanoManager.html)
   */
  class PanoManager {
      /**
     * changePano 切换全景图
     * @param panoID 全景图id
     * @param h 打开全景图的初始视角的水平偏移
     * @param v 打开全进图的初始视角的垂直偏移
     */
      static changePano(panoID?: string, h?: number, v?: number): void;

      /**
     * compute3DObjectProperties 根据全景图的位置和模型对象计算模型在全景图中的参数
     * @param panoPosition 景图所在的位置
     * @param modelPosition 模型所在的位置
     * @param modelAngles 模型的旋转
     */
      static compute3DObjectProperties(
      panoPosition?: any,
      modelPosition?: any,
      modelAngles?: any
    ): any;

      /**
     * create3DObject 在全景图中创建3D对象
     * @param name 3D对象的名称
     * @param url 物体模型资源url
     * @param anim 开启的动画名称，可为null
     * @param properties
     */
      static create3DObject(
      name?: string,
      url?: number,
      anim?: number,
      properties?: {
        /** 模型所在位置：水平坐标 */
        h?: number;
        /** 模型所在位置：垂直坐标 */
        v?: number;
        /** 模型所在位置：深度 */
        depth?: number;
        /** 缩放 */
        scale?: number;
        /** 模型沿x旋转 */
        rx?: number;
        /** 模型沿y旋转 */
        ry?: number;
        /** 模型沿z旋转 */
        rz?: number;
        [propName: string]: any;
      }
    ): void;

      /**
     * createPlayer 创建全景图播放器，暂时只允许创建一个全景图
     * @param panoData [全景图配置数据](http://www.thingjs.com/guide/cn/tutorial/15.panorama/section15.6.html#parameter)
     * @param panelOptions
     * @param panoOptions
     * @param app 用来接收事件触发的app对象，可为null。
     * @param callback 全景图播放器初始化完毕，并且加载了默认的全景图后回调
     */
      static createPlayer(
      panoData?: string,
      panelOptions?: {
        /** 是否全屏 */
        fullscreen?: boolean;
        /**
         * 悬浮框所在位置，默认为"right-top" 以下参数可选：'left-top', 'left-center', 'left-bottom', 'center-top', 'center', 'center-bottom', 'right-top', 'right-center', 'right-bottom'
         */
        vlocation?: string;
        /** 相对于location的X轴偏移 */
        offsetX?: number;
        /** 相对于location的Y轴偏移 */
        offsetY?: number;
        /** 是否显示标题栏 */
        header?: boolean;
        /** 悬浮框宽度，数字（如 100）或字符串（如"40%"、"100px"） */
        resizeit?: number;
        /** 悬浮框高度，数字（如 100）或字符串(如"40%"、"100px") */
        height?: number;
        [propName: string]: any;
      },
      panoOptions?: {
        /**
         * 初始打开的全景图
         */
        panoID?: string;
        /** 打开全景图的初始视角h */
        h?: number;
        /** 打开全景图的初始视角v */
        v?: number;
        /** 是否显示控制按钮，包括缩略图列表 */
        showControls?: boolean;
        [propName: string]: any;
      },
      /** 用来接收事件触发的app对象，可为null。 */
      app?: object | null,
      /** 全景图播放器初始化完毕，并且加载了默认的全景图后回调 */
      callback?: Function
    ): void;

      /**
     * destroyPlayer 销毁全景图播放器
     */
      static destroyPlayer(): void;

      /**
     * 获取campus节点下的全景图项目
     * @param root campus节点,可为空，场景中有多个campus时，需要指定具体campus。
     * @param callback 如果存在，callback参数会带有panoData格式的数据。
     */
      static getPanoJsonFromBuilder(root?: any, callback?: any): void;

      /**
     * 获取指定节点下的全景图对象
     * @param root 需要获取的根节点
     */
      static getPanoPoints(root: any): void;

      /**
     * 获取uBuilder创建的全景图项目的配置参数
     * @param projectID 全景图项目的ID
     * @param sCallback 成功的回调
     * @param eCallback 失败的回调
     */
      static getProjectPanoData(
      projectID?: any,
      sCallback?: Function,
      eCallback?: Function
    ): void;

      /**
     * 指定节点下，是否有全景图对象
     * @param root 需要查询的根节点
     */
      static hasPanoFromBuilder(root: any): boolean;

      /**
     * 加载全景图数据
     * @param panoData [全进图配置数据](http://www.thingjs.com/guide/cn/tutorial/15.panorama/section15.6.html#parameter)
     * @param panoOptions
     */
      static loadPanoData(
      panoData?: object,
      panoOptions?: {
        /** 初始打开的全景图 */
        panoID?: string;
        /** 打开全景图的初始视角h */
        h?: number;
        /** 打开全景图的初始视角v */
        v?: number;
        [propName: string]: any;
      }
    ): void;

      /**
     * set3DObjectProperties 设置全景图中，3D对象的属性
     * @param name 3D对象的名称
     * @param properties
     */
      static set3DObjectProperties(
      name: string,
      properties?: {
        /** 模型所在位置：水平坐标 */
        h?: number;
        /** 模型所在位置：垂直坐标 */
        v?: number;
        /** 模型所在位置：深度 */
        depth?: number;
        /** 缩放 */
        scale?: number;
        /** 模型沿x旋转 */
        rx?: number;
        /** 模型沿y旋转 */
        ry?: number;
        /** 模型沿z旋转 */
        rz?: number;
        [propName: string]: any;
      }
    ): void;

      /**
     * startTour 开始自动漫游
     * @param tours 格式和panoData类似，可以只包含panoData.config.tours，可以通过这个接口规划不同线路
     * @param panoID 起始全景图ID
     */
      static startTour(tours: object, panoID: string): void;

      /**
     * stopTour 停止自动漫游，暂时会出现 没有完全停止时，调用startTour，全景图切换混乱的问题。
     */
      static stopTour(): void;
  }

  /**
   * uBuilder导出全景图所对应的thingjs类，主要用来区分类型
   * @see [文档](http://192.168.1.238:8080/THING.PanoPoint.html)
   */
  class PanoPoint {
      /** 获取当前全景图所使用的全景图id（panoID） */
      getPanoID(): any;
  }

  /**
   * uBuilder导出全景图关系箭头对应的thingjs类，用来区分类型
   * @see [文档](http://192.168.1.238:8080/THING.PanoRelation.html)
   */
  class PanoRelation {}

  /**
   * ParticleSystem 粒子系统
   * @see [文档](http://192.168.1.238:8080/THING.ParticleSystem.html)
   * @example
   * ```
   * // 创建粒子
   * var particle01 = app.create({
   *   type: 'ParticleSystem',
   *   url: 'https://thingjs.com/static/particles/fire1',// 粒子资源地址
   *   id: 'fire01',
   *   position:[0,0,0] // 设置粒子在世界坐标系下的位置
   * });
   * // 基于某物体创建粒子
   * var particle02 = app.create({
   *   type: 'ParticleSystem',
   *   url: 'https://thingjs.com/static/particles/fire1',
   *   id: 'fire02',
   *   parent: obj, // 设置粒子的父物体
   *   localPosition: [0, 0, 0] // 设置粒子相对于父物体的位置
   * });
   * ```
   */
  class ParticleSystem extends THING.BaseObject {}

  /**
   * Picker 拾取相关功能，主要为支持 GPU picker，同时兼容支持 Threejs 的 raycast
   * @see [文档](http://192.168.1.238:8080/THING.Picker.html)
   */
  class Picker {
    /** 设置框选候选集合, 因为框选速度较慢，所以这里需要先提供一个框选的候选列表 */
    areaCandidates: THING.Selector;

    /** 查询是否开启了区域选择功能 */
    areaPicking: boolean;

    /** 开启/禁用拾取功能 */
    enable: boolean;

    /**
     * 获取当前帧系统默认拾取物体集合(执行物体过滤处理后)
     * @example
     * ```
     * var sel = app.picker.objects;
     * ```
     */
    objects: THING.Selector;

    /**
     * 设置拾取结果回调函数，返回的对象即为拾取对象
     * @example
     * ```
     * app.picker.pickedResultFunc = function (object) {
     *   return object;
     * }
     * ```
     */
    pickedResultFunc: Function;

    /**
     * 获取上一帧拾取物体集合(执行物体过滤处理后)
     * @example
     * ```
     * var sel = app.picker.previousObjects;
     * ```
     */
    previousObjects: THING.Selector;

    /**
     * 获取当前帧原生拾取物体集合(忽略物体过滤处理)
     * @example
     * ```
     * var sel = app.picker.results;
     * ```
     */
    results: THING.Selector;

    /**
     * 检测当前帧拾取的物体是否发生了变化
     * @example
     * ```
     * app.picker.isChanged()
     * ```
     */
    isChanged(): boolean;

    /**
     * 开启框选
     * @param params 参数列表
     * @example
     * ```
     * app.picker.isChanged()
     * ```
     */
    startAreaPicking(params?: {
      /** 屏幕 x 坐标 */
      x: number;
      /** 屏幕 y 坐标 */
      y: number;
      /** 是否实时框选(速度较慢) */
      realTimePicking: boolean;
      /** 是否绘制框选区域 */
      drawRegion: boolean;
      [propName: string]: any;
    }): boolean;
  }

  /**
   * PivotNode The pivot node.
   * @see [文档](http://192.168.1.238:8080/THING.PivotNode.html)
   */
  class PivotNode {
      /**
     * @param param The initial parameters.
     */
      constructor(param?: object);

    /** Get/Set inherit parent position. */
    inheritPosition: boolean;

    /** Get/Set inherit parent rotation. */
    inheritRotation: boolean;

    /** Get/Set inherit parent scale. */
    inheritScale: boolean;

    /** Check class type. */
    isPivotNode: boolean;

    /** Get link node. */
    linkNode: boolean;
  }

  /**
   * Plane 平面
   * @see [文档](http://192.168.1.238:8080/THING.Plane.html)
   */
  class Plane extends THING.ThingGeometry {
    /** 判断是否 Plane 类型 */
    isPlane: boolean;
  }

  /**
   * PointLight 点光源
   * @see [文档](http://192.168.1.238:8080/THING.PointLight.html)
   */
  class PointLight extends THING.LightBase {
    /** 设置/获取 衰减数据 */
    decay: number;

    /** 获取/设置灯光有效距离 */
    distance: boolean;

    /** 显示/隐藏 辅助线 */
    helper: boolean;
  }

  /**
   * PointsBase 此类可以用作各种带顶点编辑属性的模型，比如区域和水面的顶点编辑，主要封装了对顶点（编辑点）的操作行为，包括添加、删除，获取等。 如果想使用这个类的特性，直接从此类派生即可，详细的写法可以参看Water类或者Region类的写法。
   * @see [文档](http://192.168.1.238:8080/THING.PointsBase.html)
   */
  class PointsBase extends THING.BaseObject {
    /** 获取节点数据列表 */
    points: Array<any>;

    /**
     * 添加单个节点
     * @param pos 节点坐标 如 [0,0,0]
     * @returns 节点索引下标
     */
    addPoint(pos: Array<number>): number;

    /**
     * 添加多个节点
     * @param pos 节点坐标数组，如 [[0,0,0],[1,0,0],[2,0,0]]
     * @returns 节点索引下标
     */
    addPoints(pos: Array<Array<number>>): number;

    /**
     * 清除所有节点
     */
    clearPoints(pos: Array<number>): void;

    /**
     * 获取节点
     * @param index 节点索引下标
     * @returns 节点坐标
     */
    getPoint(index: number): Array<number>;

    /**
     * 插入单个节点
     * @param index 节点索引下标
     * @param pos 节点坐标 如 [0,0,0]
     */
    insertPoint(index: number, pos: Array<number>): void;

    /**
     * 更新某个节点坐标
     * @param index 要更新的节点索引下标
     * @param pos 新的坐标值
     * @returns 是否更新成功，如果填写的索引值越界则更新失败
     */
    setPoint(index: number, pos: Array<number>): boolean;
  }

  /**
   * PolygonLine 管线
   * @see [文档](http://192.168.1.238:8080/THING.PolygonLine.html)
   */
  class PolygonLine extends THING.PointsBase {
    /** 设置进度, 范围在[0, 1]之间 */
    progress: number;
  }

  /**
   * 区域样式
   * @see [文档](http://192.168.1.238:8080/THING.PolygonRegionStyle.html)
   */
  class PolygonRegionStyle extends THING.DefaultStyle {
    /** 设置/获取 区域勾边颜色 */
    lineColor: number | string;

    /** 设置/获取 区域边框不透明度 0 全透明，1 为不透明 */
    lineOpacity: number;

    /** 设置/获取 区域颜色 */
    regionColor: number | string;

    /** 设置/获取 区域不透明度 0 全透明，1 为不透明 */
    regionOpacity: number;
  }

  /**
   * ProgressController 进度条组件
   * @see [文档](http://192.168.1.238:8080/THING.ProgressController.html)
   */
  class ProgressController extends THING.Controller {
      /**
     *
     * @param object 要操作的对象
     * @param property 要操作的属性名称
     */
      constructor(object?: object, property?: string);
  }

  /**
   * RadioController 单选组件
   * @see [文档](http://192.168.1.238:8080/THING.RadioController.html)
   */
  class RadioController extends THING.Controller {
      /**
     *
     * @param object 要操作的对象
     * @param property 要操作的属性名称
     */
      constructor(object?: object, property?: string);
  }

  /**
   * RectangleSelectControl 框选控件
   * @see [文档](http://192.168.1.238:8080/THING.RectangleSelectControl.html)
   */
  class RectangleSelectControl {
      /**
     * 清空当前已选择的物体
     */
      clear(): void;

      /**
     * 结束框选
     */
      end(): void;

      /**
     * 开始框选
     */
      start(): void;
  }

  /**
   * Room 房间类
   * @see [文档](http://192.168.1.238:8080/THING.Room.html)
   */
  class Room extends THING.BaseObject {
    /**
     * 获取该房间的面积，单位平方米
     * @example
     * ```
     * var area = room.area;
     * ```
     */
    area: number;

    /**
     * 获取该房间的天花板
     * @example
     * ```
     * var ceiling = room.ceiling;
     * ```
     */
    ceiling: THING.BaseObject;

    /**
     * 获取该房间下的门对象集合
     * @example
     * ```
     * var doors = room.doors;
     * ```
     */
    doors: THING.Selector;

    /**
     * 获取该房间所在的楼层对象
     * @example
     * ```
     * var floor = room.floor;
     * ```
     */
    floor: THING.Floor;

    /**
     * 获取该房间最佳标注位置，返回世界坐标位置（该点位一定在房间内）
     * @example
     * ```
     * var labelPosition = room.labelPosition;
     * ```
     */
    labelPosition: Array<number>;

    /**
     * 获取该房间下的杂物（未单独管理的物体会被合并成为杂物）
     * @example
     * ```
     * var misc = floor.misc;
     * ```
     */
    misc: THING.BaseObject;

    /**
     * 获取该房间的周长，单位米
     * @example
     * ```
     * var perimeter = room.perimeter;
     * ```
     */
    perimeter: number;

    /**
     * 获取该房间的地板
     * @example
     * ```
     * var plan = room.plan;
     * ```
     */
    plan: THING.BaseObject;

    /**
     * 获取该房间顶点的世界坐标，例如 [[-3.5,0.0,-6.8],[-3.5,0.0,-14.5],[9.4,0.0,-14.5],[9.4,0.0,-6.8]]
     */
    points: Array<Array<Number>>;

    /**
     * 获取该房间的房顶
     * @example
     * ```
     * var roof = room.roof;
     * ```
     */
    roof: THING.BaseObject;

    /**
     * 获取该房间下的 Thing 类型物体对象集合
     * @example
     * ```
     * var things = room.things;
     * ```
     */
    things: THING.Selector;

    /**
     * 获取在该房间内摆放物体可使用的世界坐标位置
     * @param number 物体总数
     * @param sizes 申请的位置大小[[width, height]]
     * @param holePoints 洞的位置[[lt, rt, rb, lb]]
     * @returns 世界坐标点数据列表 如 [[0,0,0],[1,0,0],[2,0,0]]
     * @example
     * ```
     * var positions = room.getAvaliablePositions(2, [1, 1]);
     * var positions = room.getAvaliablePositions(2, [[1, 1], [2, 2]]);
     * var positions = room.getAvaliablePositions(2, [[1, 1], [2, 2]], [[0,0,0], [1,0,0], [2,0,0]]);
     * ```
     */
    getAvaliablePositions(
      number: number,
      sizes: Array<Array<Number>>,
      holePoints?: Array<Array<Number>>
    ): Array<Array<Number>>;
  }

  /**
   * RouteLine 线路
   * @see [文档](http://192.168.1.238:8080/THING.RouteLine.html)
   */
  class RouteLine extends THING.LineBase {
    /** 显示/隐藏 箭头 */
    arrowCap: boolean;

    /** 设置进度, 范围在[0, 1]之间 */
    progress: number;
  }

  /**
   * SceneLevel 场景层级管理
   * @see [文档](http://192.168.1.238:8080/THING.SceneLevel.html)
   */
  class SceneLevel {
    /**
     * 获取当前层级
     * @example
     * ```
     * var currentLevel = app.level.current;
     * ```
     */
    current: THING.BaseObject;

    /**
     * 获取之前的层级
     * @example
     * ```
     * var previousLevel = app.level.previous;
     * ```
     */
    previous: THING.BaseObject;

    /**
     * 返回至上一层级（父层级）
     * @example
     * ```
     * app.level.back()
     * ```
     */
    back(): void;

    /**
     * 切换场景层级
     * @param object 将要切换至的场景层级物体对象
     * @param params (BETA) 参数列表
     * @example
     * ```
     * // 开启场景层级控制
     * app.level.change();
     * // 将层级切换至某楼层
     * var floor=app.query('.Floor')[0];
     * app.level.change(floor);
     * ```
     */
    change(
      object: THING.BaseObject,
      params?: {
        /** (BETA) 完成回调函数 */
        complete: Function;
        [propName: string]: any;
      }
    ): void;

    /**
     * 检测当前帧层级是否发生改变
     * @example
     * ```
     * app.level.isChanged()
     * ```
     */
    isChanged: boolean;

    /**
     * 清除层级控制（文档没有该 `API`）
     *
     * 调用后，通过 `current()` 获取层级值为 `null`
     */
    quit(): void;
  }

  /**
   * SceneRoot 场景根节点
   * @see [文档](http://192.168.1.238:8080/THING.SceneRoot.html)
   */
  class SceneRoot extends THING.BaseObject {
    /**
     * 获取园区列表，返回对象集合（Selector）
     * @example
     * ```
     * var campuses = app.sceneRoot.campuses;
     * ```
     */
    campuses: THING.Selector;

    /**
     * 获取根节点下的 Thing 类型物体，返回对象集合（Selector）
     * @example
     * ```
     * var things = app.sceneRoot.things;
     * things.forEach(function (obj) {
     *   THING.Utils.log(obj.name)
     * })
     * ```
     */
    things: THING.Selector;

    /**
     * 显示/隐藏场景
     *
     * **Overrides:**
     *
     * THING.BaseObject#visible
     * @example
     * ```
     * app.sceneRoot.visible = false
     * ```
     */
    visible: boolean;
  }

  /**
   * Selection 物体选择集合
   * @see [文档](http://192.168.1.238:8080/THING.Selection.html)
   */
  class Selection {
    /**
     * 获取当前帧选择集中的物体集合
     * @example
     * ```
     * var sel = app.selection.objects;
     * ```
     */
    objects: THING.Selector;

    /**
     * 获取上一帧选择集中的物体集合
     * @example
     * ```
     * var sel = app.selection.previousObjects
     * ```
     */
    previousObjects: THING.Selector;

    /**
     * 清空选择集
     * @example
     * ```
     * app.selection.clear();
     * ```
     */
    clear(): void;

    /**
     * 将物体从选择集中取消
     * @param object 物体
     * @example
     * ```
     * app.selection.deselect(obj);
     * ```
     */
    deselect(object: THING.BaseObject): void;

    /**
     * 查询某物体是否在选择集中
     * @param object 物体
     * @example
     * ```
     * app.selection.has(obj);
     * ```
     */
    has(object: THING.BaseObject): boolean;

    /**
     * 检测当前帧选择集是否发生改变
     * @example
     * ```
     * app.selection.isChanged()
     * ```
     */
    isChanged(): boolean;

    /**
     * 将物体加入到选择集中
     * @param object 物体
     * @example
     * ```
     * app.selection.select(obj);
     * ```
     */
    select(object: THING.BaseObject): void;
  }

  /**
   * 选择器
   * @see [文档](http://192.168.1.238:8080/THING.Selector.html)
   * @see https://api.jquery.com/category/traversing/
   */
  class Selector {
    [propName: number]: BaseObject | undefined;

    /** 批量设置集合中的对象是否能被拖拽 */
    draggable: boolean;

    /** 批量设置集合中的对象角度继承控制 */
    inheritAngles: boolean;

    /** 批量设置集合中的对象位置继承控制 */
    inheritPosition: boolean;

    /** 批量设置集合中的对象缩放继承控制 */
    inheritScale: boolean;

    /** 批量设置集合中的对象风格继承控制 */
    inheritStyle: boolean;

    /** 批量设置集合中的对象可见性继承控制 */
    inheritVisible: boolean;

    /** 批量设置集合中的对象是否能被拾取 */
    pickable: boolean;

    /**
     * 获取效果集合，获取后用于批量设置集合中的物体效果
     * @example
     * ```
     * // 获取所有 Thing 类型物体的对象集合
     * var sel = app.query('.Thing');
     * // 获取效果结合，并设置物体颜色为红色
     * sel.style.color = '#ff0000';
     * ```
     */
    style: THING.SelectorStyle;

    /** 批量设置集合中的对象显示/隐藏 */
    visible: boolean;

    /**
     * 从当前对象集合中添加其他对象 参数可以是 查询条件 或 物体对象 或 物体对象数组 或 其他 Selector 对象集合
     * @todo `index` 参数与返回类型 `void` 用于子类覆盖类型定义
     * @param param 参数列表
     * @returns 处理之后的对象集合
     * @example
     * ```
     * sel.add('car01').add(obj).add([obj1, obj2]).add(sel1);
     * ```
     */
    add(param: any, index?: number): THING.Selector | void;

    /**
     * 清空集合（集合中的对象本身并没有删除）
     */
    clear(): void;

    /**
     * 销毁对象集合中的所有对象（物体会被删除掉）
     */
    destroyAll(): void;

    /**
     * 获取物体到某坐标或者另一物体的绝对距离
     * @param param 参数列表
     * @example
     * ```
     * var sel = app.query('.Thing');
     * sel.fadeIn();
     * // 设置 时间 和 回调
     * sel.fadeIn({
     *   time:2000,
     *   complete:function(){
     *     THING.Utils.log('complete')
     *   }
     * })
     * ```
     */
    fadeIn(param: {
      /** 淡入时间（毫秒） 默认 1s */
      time?: number;
      /** 完成时的回调 */
      complete?: Function;
      [propName: string]: any;
    }): void;

    /**
     * 淡出
     * @param param 参数列表
     * @example
     * ```
     * var sel = app.query('.Thing');
     * sel.fadeOut();
     * // 设置 时间 和 回调
     * sel.fadeOut({
     *   time:2000,
     *   complete:function(){
     *     THING.Utils.log('complete')
     *   }
     * })
     * ```
     */
    fadeOut(param: {
      /** 淡出时间（毫秒） 默认 1s */
      time?: number;
      /** 完成时的回调 */
      complete?: Function;
      [propName: string]: any;
    }): void;

    /**
     * 过滤元素
     * @param callback 回调函数
     */
    filter(callback: Function): THING.Selector;

    /**
     * 遍历对象
     * @param callback 回调函数
     * @example
     * ```
     * // 得到所有 Thing 类型物体的对象集合
     * var sel = app.query('.Thing');
     * // 遍历对象
     * sel.forEach(function(obj){
     *   THING.Utils.log(obj.name)
     * })
     * ```
     */
    forEach(callback: Function): void;

    /**
     * 判断集合中是否拥有某物体
     * @param object 物体
     */
    has(object: THING.BaseObject): boolean;

    /**
     * 获取对象集合中某物体的下标索引值 若对象集合中不包含此物体，则返回 -1
     * @param object 物体
     * @returns 下标值, -1 表示不存在
     * @example
     * ```
     * // 获取 Thing 类型物体对象集合
     * var sel = app.query('.Thing');
     * // 根据 name 查询获取物体
     * var obj = app.query('cabinetB1')[0];
     * var index = sel.indexOf(obj);
     * ```
     */
    indexOf(object: THING.BaseObject): number;

    /**
     * 从当前对象集合中排除部分对象 参数可以是 查询条件 或 物体对象 或 物体对象数组 或 其他 Selector 对象集合
     * @param param 参数列表
     * @returns 处理之后的对象集合
     * @example
     * ```
     * selector.not('car01').not(obj).not([obj1, obj2]).not(sel);
     * ```
     */
    not(param: any): THING.Selector;

    /**
     * 移除事件绑定
     * @param eventType 事件名称
     * @param condition 物体类型选择条件
     * @param callback 事件触发的回调函数 或 事件标签(tag)
     * @example
     * ```
     * sel.off('click',null,'tag1');
     * sel.off('click','.Marker','tag2')
     * ```
     */
    off<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      condition: EventCondition | null | undefined,
      callback: Function | string
    ): void;

    /**
     * 绑定事件
     * @param eventType 事件类型名称
     * @param callback 事件触发的回调函数
     * @override
     */
    on<K extends keyof EventTypeMapping, T = any>(
      eventType: K | EventType,
      callback: EventCallBackType<K>
    ): void;
    /**
     * 绑定事件
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param callback 事件触发的回调函数
     * @override
     */
    on<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      condition: EventCondition,
      callback: EventCallBackType<K>
    ): void;
    /**
     * 绑定事件
     * @param eventType 事件名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param userData 事件传递自定义数据
     * @param callback 事件触发的回调函数
     * @param tag 事件标签
     * @example
     * ```
     * // 获取所有 Thing 类型物体
     * var sel = app.query('.Thing');
     * // 绑定 Click 事件
     * sel.on('click',function(ev){
     *   THING.Utils.log(ev.object.name);
     * },'给所有Thing物体绑定点击事件')
     *
     * // 给所有 Thing 类型物体下的 Marker 对象绑定事件
     * sel.on('click','.Marker',function(ev){
     *   THING.Utils.log(ev.object.name);
     * },'给Thing下的Marker绑定事件')
     * ```
     */
    on<K extends keyof EventTypeMapping, T = any>(
      eventType: K | EventType,
      condition?: EventCondition,
      userData?: T,
      callback?: EventCallBackType<K>,
      tag?: EventTagType
    ): void;

    /**
     * 绑定事件(只触发一次)
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param userData 事件传递自定义数据
     * @param callback 事件触发的回调函数
     * @param tag 事件标签
     * @example
     */
    one<K extends keyof EventTypeMapping, T = any>(
      eventType: K | EventType,
      condition?: EventCondition,
      userData?: T,
      callback?: EventCallBackType<K>,
      tag?: EventTagType
    ): void;

    /**
     * 暂停事件响应
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param tag 事件标签
     */
    pauseEvent<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      condition: EventCondition,
      tag?: EventTagType
    ): void;

    /**
     * 暂停事件响应(当前帧，下一帧恢复响应)
     * @param eventType 事件类型名称
     * @param condition 物体类型选择条件，用于筛选子物体
     * @param tag 事件标签
     */
    pauseEventInFrame<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      condition: EventCondition,
      tag?: EventTagType
    ): void;

    /**
     * 在该对象集合中查询物体
     * @param param 查询条件
     * @returns 查询结果
     * @example
     * ```
     * // 在对象集合中查询 id 为 001 的物体
     * sel.query('#001');
     * // 在对象集合中查询名称为 car01 的物体
     * sel.query('car01');
     * // 在对象集合中查询类型为 Thing 的物体
     * sel.query('.Thing');
     * // 在对象集合中查询自定义属性 [prop=value] 的物体
     * sel.query('["userData/power" = 60]');
     * // 在对象集合中查询名字（name）中包含 car 的物体
     * sel.query(/car/);
     * // 在对象集合中查询 满足条件1 或条件2,...
     * sel.query('.Thing|.Building');
     * // 字符串部分参考：http://www.w3school.com.cn/jquery/jquery_ref_selectors.asp
     * ```
     */
    query(param: string | RegExp): THING.Selector;

    /**
     * 恢复事件响应
     * @param eventType 事件名称
     * @param condition 物体类型选择条件
     * @param tag 事件标签
     * @example
     * ```
     * sel.resumeEvent('click',null,'tag1');
     * sel.resumeEvent('click','.Marker','tag2')
     * ```
     */
    resumeEvent<K extends keyof EventTypeMapping>(
      eventType: K | EventType,
      condition?: EventCondition | null | undefined,
      tag?: EventTagType
    ): void;

    /**
     * 反转集合中的对象顺序
     */
    reverse(): THING.Selector;

    /**
     * 从集合中移除对象
     * @param index 起始下标值，从此位置开始移除
     * @param number 删除多少个对象
     */
    splice(index: number, number: number): void;

    /**
     * 把对象集合以数组形式返回
     * @returns 数组
     * @example
     * ```
     * var sel = app.query('.Thing');
     * var arr = sel.toArray();
     * ```
     */
    toArray(): Array<any>;

    /**
     * 转换成 JSON 字符串
     * @example
     * ```
     * var sel = app.query('.Thing');
     * var jsonStr = sel.toJSON();
     * ```
     */
    toJSON(): string;

    /**
     * 触发事件
     * @param eventType 事件名称，通过`THING.EventType`可以获取
     * @param ev 事件信息
     * @param tag 事件标签
     * @example
     * ```
     * // 获取所有的 Thing 类型物体集合 并触发自定义的 Alarm 事件
     * var sel = app.query('.Thing');
     * sel.trigger('Alarm', { level: 2 })
     * // 监听绑定自定义的 Alarm 事件
     * sel.on('Alarm', function (ev) {
     *   var level = ev.level;
     * })
     * ```
     */
    trigger(eventType: EventTypeName, ev: any, tag?: string): void;
  }

  /**
   * SelectorStyle 物体效果处理集合
   * @see [文档](http://192.168.1.238:8080/THING.SelectorStyle.html)
   */
  class SelectorStyle {
    /** 设置是否始终在最前端渲染显示 */
    alwaysOnTop: boolean;

    /** 显示/隐藏包围盒 */
    boundingBox: boolean;

    /** 设置包围盒颜色 */
    boundingBoxColor: number | string;

    /**
     * 设置颜色 可填写 十六进制颜色值 或 rgb 字符串，取消颜色设置为 null
     * @example
     * ```
     * var sel = app.query('.Thing');
     * // 使用十六进制颜色
     * sel.style.color = '#ff0000';
     * // 使用 rgb 颜色
     * sel.style.color = 'rgb(255,0,0)';
     * ```
     */
    color: number | string;

    /**
     * 设置不透明度 0 为全透明，1 为不透明
     * @example
     * ```
     * var sel = app.query('.Thing');
     * sel.style.opacity = 0.8;
     * ```
     */
    opacity: number;

    /**
     * 设置勾边颜色 颜色可填写 十六进制颜色值 或 rgb 字符串，取消勾边颜色设置为 null
     * @example
     * ```
     * var sel = app.query('.Thing');
     * // 使用十六进制颜色
     * sel.style.outlineColor = '#ff0000';
     * // 使用 rgb 颜色
     * sel.style.outlineColor = 'rgb(255,0,0)';
     * ```
     */
    outlineColor: number | string;

    /** 设置渲染排序值，数值越小越优先渲染 */
    renderOrder: number;

    /** 忽略包围盒计算 */
    skipBoundingBox: boolean;

    /** 忽略/禁用勾边 */
    skipOutline: boolean;

    /** 开启/关闭线框模式 */
    wireframe: boolean;
  }

  /**
   * Sphere 球体（几何物体）
   * @see [文档](http://192.168.1.238:8080/THING.Sphere.html)
   * @example
   * ```
   * // 创建一个球体
   * var sphere = app.create({
   *   type: 'Sphere',
   *   radius: 1,// 半径
   *   widthSegments: 16,
   *   heightSegments: 16，
   *   position：[0,0,0] // 球心所在的世界坐标
   * });
   * // 创建一个半球体
   * var sphere = app.create({
   *   type: 'Sphere',
   *   radius: 1,// 半径
   *   widthSegments: 16,
   *   heightSegments: 16,
   *   phiStart: 0,
   *   phiLength: Math.PI * 2,
   *   thetaStart: 0,
   *   thetaLength: Math.PI/2 ,
   *   position: [0, 2, 0]// 球心所在的世界坐标
   * });
   * ```
   */
  class Sphere extends THING.ThingGeometry {
    /** 判断是否 Sphere 类型 */
    isSphere: boolean;
  }

  /**
   * SpotLight 聚光灯（效果）
   * @see [文档](http://192.168.1.238:8080/THING.SpotLight.html)
   */
  class SpotLight extends THING.LightBase {
    /** 获取/设置灯光有效距离 */
    distance: boolean;

    /** 显示/隐藏 辅助线 */
    helper: boolean;

    /** 设置灯光角度 */
    lightAngle: number;

    /** 设置/获取 半影数据 [0~1] 范围 */
    penumbra: number;
  }

  /**
   * StringController 字符串组件
   * @see [文档](http://192.168.1.238:8080/THING.StringController.html)
   */
  class StringController extends THING.Controller {
      /**
     * @param object 要操作的对象
     * @param property 要操作的属性名称
     */
      constructor(object?: object, property?: string);

      /**
     * 设置值是否允许改变
     * @param flag 是否允许改变
     */
      isChangeValue(flag: boolean): Controller;
  }

  /**
   * tab切换组件
   * @see [文档](http://192.168.1.238:8080/THING.TabController.html)
   */
  class TabController extends THING.Controller {
      /**
     * @param object 要操作的对象
     * @param property 要操作的属性名称
     */
      constructor(object?: object, property?: string);
  }

  /**
   * TableController 表格类型组件
   * @see [文档](http://192.168.1.238:8080/THING.TableController.html)
   */
  class TableController extends THING.Controller {
      /**
     * @param object 要操作的对象
     * @param param 参数列表
     * @example
     * ```
     * var object = {
     *   props: [{
     *     name: '名称'
     *   }, {
     *     name: '参数'
     *   }, {
     *     name: '时间'
     *   }, {
     *     name: '状态'
     *    }],
     *   items: [{
     *       "名称": 'I1',
     *       "参数": '120MP',
     *       "时间": '2018.02.24',
     *       '状态': '启用'
     *     }
     *    ]
     * };
     * ```
     */
      constructor(
      object?: object,
      param?: {
        /** 列标题 */
        props: Array<any>;
        /** 列数据 */
        items: Array<any>;
        [propName: string]: any;
      }
    );
  }

  /**
   * Tetrahedron 四面体（几何物体）
   * @see [文档](http://192.168.1.238:8080/THING.Tetrahedron.html)
   * @example
   * ```
   * var tetrahedron = app.create({
   *   type: 'Tetrahedron',
   *   radius: 2,
   *   position:[0,1,0] // 四面体中心在世界坐标系下的位置
   * });
   * ```
   */
  class Tetrahedron extends THING.ThingGeometry {
    /** 判断是否 Tetrahedron 类型 */
    isTetrahedron: boolean;
  }

  /**
   * TextRegion 负责区域文本绘制
   * @see [文档](http://192.168.1.238:8080/THING.TextRegion.html)
   * @example
   * ```
   * // 创建文本
   * var textRegion01 = app.create({
   *   type: 'TextRegion',
   *   id: 'textRegion01',
   *   position: [0, 9, -5], // 世界坐标
   *   text: '生产厂房',
   *   style: {
   *     fontColor: '#000000', // 文本颜色 支持16进制颜色 和 rgb颜色
   *     fontSize: 32, // 文本字号大小
   *   }
   * });
   * // 以某物体为父亲创建文本
   * var textRegion02 = app.create({
   *   type: 'TextRegion',
   *   parent: obj,// 设置父物体
   *   localPosition: [0, 2.5, 0], // 父物体坐标系下相对位置
   *   text: 'Hello World',
   *   style: {
   *     fontColor: 'rgb(0,0,255)', // 文本颜色 支持16进制颜色 和 rgb颜色
   *     fontSize: 20, // 文本字号大小
   *   }
   * });
   * ```
   */
  class TextRegion extends THING.BaseObject {
    /**
     * 文本保持像素大小不变
     *
     * **Overrides:**
     *
     * THING.BaseObject#keepSize
     */
    keepSize: boolean;

    /**
     * 获取文本样式对象
     *
     * **Overrides:**
     *
     * THING.BaseObject#style
     */
    style: THING.TextRegionStyle;

    /**
     * 设置/获取 文本内容
     */
    text: string;
  }

  /**
   * 文本样式
   * @see [文档](http://192.168.1.238:8080/THING.TextRegionStyle.html)
   */
  class TextRegionStyle extends THING.DefaultStyle {
    /**
     * 是否设置字体阴影
     */
    dropShadow: boolean;

    /**
     * 设置/获取 字体阴影透明度
     */
    dropShadowAlpha: number;

    /**
     * 设置/获取 文本内容
     */
    dropShadowAngle: number;

    /**
     * 设置/获取 字体阴影模糊半径
     */
    dropShadowBlur: number;

    /**
     * 设置/获取 字体阴影颜色
     */
    dropShadowColor: string | number;

    /**
     * 设置/获取 字体阴影半径
     */
    dropShadowDistance: number;

    /**
     * 设置/获取 字体对齐方式 ('left'/'right'/'center')
     * @example
     * ```
     * textRegion.style.fontAlign = 'left';
     * ```
     */
    fontAlign: string;

    /**
     * 设置/获取 字体颜色
     */
    fontColor: string | number;

    /**
     * 设置/获取 字体大小
     */
    fontSize: number;

    /**
     * 设置/获取 字体类型
     */
    fontType: string;

    /**
     * 文本是否描边 默认 false
     */
    strokeMode: boolean;

    /**
     * 设置/获取 文本行间距
     */
    textLineHeight: number;

    /**
     * 设置/获取 文本行宽度，如果文本宽度大于行宽度会进行换行
     */
    textLineWidth: number;
  }

  /**
   * Thing 物体
   * @see [文档](http://192.168.1.238:8080/THING.Thing.html)
   * @example
   * ```
   * // 创建Thing
   * var obj1 = app.create({
   *   type: 'Thing',
   *   id: 'myCar01', // 物体 id
   *   name: 'policeCar', // 物体名称
   *   url: 'https://model.3dmomoda.com/models/66b7f5979ff043afa4e79f7299853a4b/0/gltf/', // 模型地址
   *   position: [0, 0, 0], // 在世界坐标系下的位置
   *   complete: function (ev) {
   *     //物体加载完成后的回调函数
   *     THING.Utils.log('thing created: ' + ev.object.id);
   *   }
   * });
   *
   * // 以某物体为父亲 创建Thing
   * var obj2 = app.create({
   *   type: 'Thing',
   *   id: 'myCar02', // 物体 id
   *   name: 'policeCar', // 物体名称
   *   url: 'https://model.3dmomoda.com/models/66b7f5979ff043afa4e79f7299853a4b/0/gltf/', // 模型地址
   *   parent: obj,// 父物体
   *   localPosition: [0, 0, 0], // 父物体坐标系下的相对坐标
   *   complete: function (ev) {
   *     //物体加载完成后的回调函数
   *     THING.Utils.log('thing created: ' + ev.object.id);
   *   }
   * });
   * ```
   */
  class Thing extends THING.BaseObject {
    /**
     * 获取模型动画名称，返回动画名称数组。 若模型无动画，则数组为 []
     * @example
     * ```
     * // 如果模型有动画，返回结果如 ["Auto_Open","Auto_Close"]
     * // 如果模型无动画，返回结果为 []
     * var animNames = obj.animationNames;
     * ```
     */
    animationNames: Array<string>;

    /**
     * 获取模型资源路径 目前不能获取 CampusBuilder 导入的场景中摆放的物体模型资源路径（返回 '' ）, 仅能获取通过 app.create 创建出来的物体模型资源路径
     * @example
     * ```
     * var url = obj.url;
     * ```
     */
    url: string;

    /**
     * 判断某个动画是否正在播放
     * @param name 动画名字，若不提供则判断是否有任一动画正在播放
     */
    isPlayingAnimation(name?: string): boolean;

    /**
     * 判断某个动画是否正在播放
     * @param name 动画名称, 不传递此参数表示暂停所有动画
     */
    pauseAnimation(name?: string): void;

    /**
     * 播放动画
     * @example
     * ```
     * // 播放模型中动画名称为 open1 的动画
     * obj.playAnimation('open1');
     * // 同时播放多个动画
     * obj.playAnimation({
     *   name: ['open1', 'open2']
     * });
     * // 设置单个动画播放完成后的回调
     * obj.playAnimation({
     *   name: 'open1',
     *   complete:function(ev){
     *     THING.Utils.log(ev + '动画播放结束')
     *   }
     * });
     * // 设置播放速度
     * obj.playAnimation({
     *   name: 'open1',
     *   speed: 0.5
     * });
     * // 动画播放一次完成后，从头再次播放动画，依此循环播放
     * obj.playAnimation({
     *   name: 'open1',
     *   loopType: THING.LoopType.Repeat,
     * });
     * // 往复循环播动画
     * obj.playAnimation({
     *   name: 'open1',
     *   loopType: THING.LoopType.PingPong,
     * });
     * // 倒播动画
     * obj.playAnimation({
     *   name: 'open1',
     *   reverse: true,
     * });
     * ```
     */
    playAnimation(
      params:
        | {
            /** 动画名，如果是数组，则同时播放多个动画 */
            name?: string | Array<string>;
            /** 播放速度（倍数） */
            speed?: number;
            /** 循环类型 默认为 no 不循环 */
            loopType?: string | THING.LoopType;
            /** 是否倒播 */
            reverse?: boolean;
            /** 动画播放完成函数回调，仅单个动画播放完成且不循环时 才有回调 */
            complete?: Function;
            [propName: string]: any;
          }
        | string
    ): void;

    /**
     * 恢复动画播放
     * @param name 动画名称, 不传递此参数表示恢复所有动画
     */
    resumeAnimation(name?: string): void;

    /**
     * 停止播放动画
     * @param name 动画名称, 不传递此参数表示停止所有动画
     */
    stopAnimation(name?: string): void;
  }

  /**
   * ThingGeometry 几何物体基类
   * @see [文档](http://192.168.1.238:8080/THING.ThingGeometry.html)
   */
  class ThingGeometry extends THING.Thing {}

  /**
   * UIAnchor 将界面元素的 dom 节点挂接在 3D 场景中某个位置或物体上
   * @see [文档](http://192.168.1.238:8080/THING.UIAnchor.html)
   * @example
   * ```
   * var uiAnchor = app.create({
   *   type: 'UIAnchor',
   *   element: domElement, // 界面元素的 dom 节点
   *   parent: obj, // 绑定的父物体
   *   localPosition: [0, 2, 0],// 在父物体坐标系下锚点放置的相对位置
   *   pivot: [0.5, 1] // 界面的轴心，以百分比表示界面轴心位置。[0,0] 代表界面左上；[1,1] 代表界面右下
   * });
   * ```
   */
  class UIAnchor {
    /** 设置/获取 锚点位置 */
    pivot: Array<number>;

    /** 设置/获取 锚点像素位置 */
    pivotPixel: Array<number>;

    /**
     * 设置/获取 是否显示/隐藏
     * @example
     * ```
     * uiAnchor.visible = false;
     * ```
     */
    visible: boolean;

    /** 锁定DOM的zIndex数值 */
    zIndex: number;

    /**
     * 销毁 UIAnchor
     * @example
     * ```
     * uiAnchor.destroy();
     * ```
     */
    destroy(): void;
  }

  /**
   * Utils 工具辅助类
   * @see [文档](http://192.168.1.238:8080/THING.Utils.html)
   */
  class Utils {
      /**
     * 转换物体对象类型
     * @param object 物体对象
     * @param className 目标类名称
     */
      static cloneObject(object: THING.BaseObject, className: string): void;

      /**
     * 克隆 js 对象
     * @param obj js 对象
     * @param shallow 是否进行浅拷贝处理，默认 true
     * @example
     * ```
     * var bus = THING.Utils.convertObjectClass(obj, 'Bus');
     * // 批量转换
     * var things = app.query('.Thing');
     * things.forEach(function(obj){
     *   THING.Utils.convertObjectClass(obj, 'Bus');
     * })
     * ```
     */
      static convertObjectClass<T>(obj: T, shallow?: boolean): T;

      /**
     * 输出 debug 日志
     */
      static debug(): void;

      /**
     * 异步加载 css 文件、js 文件、json 文件（需支持跨域访问）
     * @param urls 文件路径
     * @param callback 加载完成后回调方法
     * @param timestamp 选填参数，url 后面是否添加时间戳以便每次访问时清除缓存，默认 ture
     * @param inOrder 选填参数，文件是否按数组中的顺序加载，默认 true
     * @example
     * ```
     * THING.Utils.dynamicLoad([
     *   "https://thingjs.com/example.js",
     *   "https://thingjs.com/example.css",
     *   "https://thingjs.com/example.json"],
     *   function(result){
     *     THING.Utils.log('Loading complete!');
     *   },
     *   true, // 选填 是否带时间戳
     *   true // 选填 是否按顺序下载
     * )
     * ```
     */
      static dynamicLoad(
      urls: string | Array<string>,
      callback: Function,
      timestamp: boolean,
      inOrder: boolean
    ): any;

      /**
     * 生成唯一的 UUID
     * @example
     * ```
     * // 返回如 7E5D4533-C059-40D3-8D19-0566ACD03CE3
     * THING.Utils.log(THING.Utils.generateUUID())
     * ```
     */
      static generateUUID(): string;

      /**
     * 判断传入的值是否为空白字符串
     * @param o js 元素
     * @example
     * ```
     * THING.Utils.log(THING.Utils.isBlank('  ')) // true
     * ```
     */
      static isBlank(o: any): boolean;

      /**
     * 判断传入的值是为否布尔类型
     * @param value js 元素
     */
      static isBoolean(value: any): boolean;

      /**
     * 判断传入的值是否为 DOM 元素
     * @param value js 元素
     */
      static isDom(value: any): boolean;

      /**
     * 判断传入的值是为空数组
     * @param o js 元素
     * @example
     * ```
     * var arr=[];
     * THING.Utils.log(THING.Utils.isEmptyArray(arr)) // true
     * ```
     */
      static isEmptyArray(o: any): boolean;

      /**
     * 判断传入的值是否为空对象
     * @param o js 元素
     * @example
     * ```
     * var obj=[];
     * THING.Utils.log(THING.Utils.isEmptyObj(obj)) // true
     * ```
     */
      static isEmptyObj(o: any): boolean;

      /**
     * 判断对象是否完全相等
     * @param o1 第一个对象
     * @param o2 第二个对象
     * @example
     * ```
     * var obj1={'name':'Thingjs'};
     * var obj2={'name':'thingjs'};
     * THING.Utils.log(THING.Utils.isEqual(obj1,obj2)) // false
     * ```
     */
      static isEqual(o1: any, o2: any): boolean;

      /**
     * 判断传入的值是否为空（ null 或 undefined ）
     * @param o js 元素
     */
      static isNull(o: any): boolean;

      /**
     * 输出日志
     */
      static log(): void;

      /**
     * 合并简单对象 将源对象的 属性/属性值 合并至目标对象
     * @param target 目标对象
     * @param source 源对象
     * @param overwrite 是否更新已经存在的属性，默认 false
     * @example
     * ```
     * var obj1 = { 'name': 'ThingJS', 'year': '2018' };
     * var obj2 = { 'version': 'xxx', 'year': '2019' };
     * // {"name":"ThingJS","year":"2018","version":"xxx"}
     * THING.Utils.log(THING.Utils.mergeObject(obj1,obj2))
     *
     * // {"name":"ThingJS","year":"2019","version":"xxx"}
     * THING.Utils.log(THING.Utils.mergeObject(obj1,obj2,true))
     * ```
     */
      static mergeObject(target: any, source: any, overwrite?: boolean): any;

      /**
     * 将对象的成员键值全部转换成小写
     * @param input 要处理的 js 对象
     * @param deep 是否递归转换所有的键值，默认 false
     * @param filter 键值过滤函数
     * @example
     * ```
     * var obj = { 'Name': 'ThingJS', 'Info': { 'Year': 'Hello 2019','Verson':'xxxx' } };
     * // 默认不转换嵌套的 key 值
     * // 返回 {"name":"ThingJS","info":{"Year":"Hello 2019","Verson":"xxxx"}}
     * THING.Utils.log(THING.Utils.objectKeysToLowerCase(obj))
     *
     * // 递归转换所有键值
     * // {"name":"ThingJS","info":{"year":"Hello 2019","verson":"xxxx"}}
     * THING.Utils.log(THING.Utils.objectKeysToLowerCase(obj,true))
     *
     * // filter 函数过滤，返回 false 时不转换
     * // {"name":"ThingJS","info":{"Year":"Hello 2019","verson":"xxxx"}}
     * THING.Utils.log(THING.Utils.objectKeysToLowerCase(obj, true, function (key) {
     *     if (key == 'Year') { return false; } else { return true; }
     * }))
     * ```
     */
      static objectKeysToLowerCase(
      input: any,
      deep?: any,
      filter?: Function
    ): any;

      /**
     * 字符串转成小写
     * @param s 字符串
     * @example
     * ```
     * THING.Utils.log(THING.Utils.toLowerCase('ThingJS')) // thingjs
     * ```
     */
      static toLowerCase(s: string): string;

      /**
     * 输出警告日志
     */
      static warn(): void;
  }

  /**
   * Version 标记封装类
   * @see [文档](http://192.168.1.238:8080/THING.Version.html)
   */
  class Version {}

  /**
   * Water 水面
   * @see [文档](http://192.168.1.238:8080/THING.Water.html)
   * @example
   * ```
   * // 构成多边形的点（取世界坐标系下的坐标）
   * var points = [[-8, 0.1, 12], [-8, 0.1, 22], [10, 0.1, 22], [10, 0.1, 12]];
   * // 创建水面
   * var water = app.create({
   *   type: 'Water',
   *   id: 'water01',
   *   points: points, // 传入世界坐标系下点坐标
   *   // style 可参考 THING.WaterStyle
   *   style: {
   *     waterColor: '#60FFFF', // 颜色
   *     waterScale: 4, // 波纹系数
   *     flowXDirection: 1, // 水平流速
   *     flowYDirection: 2, // 垂直流速
   *   }
   * })
   * ```
   */
  class Water extends THING.PointsBase {}

  /**
   * 水面样式
   * @see [文档](http://192.168.1.238:8080/THING.WaterStyle.html)
   */
  class WaterStyle extends THING.DefaultStyle {
    /** 水平流速 */
    flowXDirection: number;

    /** 垂直流速 */
    flowYDirection: number;

    /** 水面颜色 */
    waterColor: number | string;

    /** 水面的波纹系数 */
    waterScale: number;
  }

  /**
   * WebView WebView 用于 3D 场景内嵌入页面
   * @see [文档](http://192.168.1.238:8080/THING.WebView.html)
   * @example
   * ```
   * // 创建 webView
   * var webView01 = app.create({
   *   type: 'WebView',
   *   id: 'webView01',
   *   url: 'https://www.thingjs.com',// 页面地址
   *   width: 16, // 3D 中实际宽度 单位 米
   *   height: 16, // 3D 中实际高度 单位 米
   *   domWidth: 1024, // 页面高度 单位 px
   *   domHeight: 1024, // 页面高度 单位 px
   *   position: [0, 5, 0],// 在世界坐标系下的位置
   * });
   * // 以某物体为父亲创建
   * var webView02 = app.create({
   *   type: 'WebView',
   *   id: 'webView02',
   *   url: 'https://www.thingjs.com',// 页面地址
   *   width: 16, // 3D 中实际宽度 单位 米
   *   height: 16, // 3D 中实际高度 单位 米
   *   domWidth: 1024, // 页面高度 单位 px
   *   domHeight: 1024, // 页面高度 单位 px
   *   parent: obj, // 设置父物体
   *   localPosition: [0, 5, 0],// 父物体坐标系下相对坐标
   * });
   * ```
   */
  class WebView extends THING.BaseObject {
    /**
     * 设置/获取 页面是否可被拾取（交互操作）
     *
     * **Overrides:**
     *
     * THING.BaseObject#pickable
     * @example
     * ```
     * webView.pickable = false;
     * ```
     */
    pickable: boolean;

    /**
     * 设置/获取 页面资源地址
     * @example
     * ```
     * webView.url = 'https://cn.bing.com/';
     * ```
     */
    url: string;
  }

  class CompassControl {
    [propName: string]: any;
  }
}
