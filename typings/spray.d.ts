/**
 * Spray是一个构建自适应布局可视化场景的组件包，自适应布局场景可以通过Spray定义文件（或模板）、Spray内置API等方式构建，通过Spray构建的自适应布局可视化场景中包含画布、图层、容器等元素。
 * - 画布：画布可以放缩、拖拽、全屏播放可视化场景
 * - 图层：图层可以逐层叠加2/3D可视化组件形成复杂的交互场景
 * - 容器：容器中可以放置2/3D可视化组件，自由拖拽摆放
 * @see [API 文档](https://www.yuque.com/khth0u/ngd5zk/bcugiw)
 */

declare namespace spray {
  /**
   * 事件总线，负责 spray 架构里各组件之间的通信，以及 spray 和外部的通信，系统默认自带了部分监听，[详细信息点击这里](https://www.yuque.com/khth0u/ngd5zk/rsqroa)
   * @see https://www.yuque.com/khth0u/ngd5zk/hzqfhc#SMVjV
   */
  const eventbus: EventBus;

  /**
   * @see https://www.yuque.com/khth0u/ngd5zk/hzqfhc#rv4g3
   */
  const register: Register;

  /**
   * @see https://www.yuque.com/khth0u/ngd5zk/hzqfhc#4st6h
   */
  const adapter: {
    /**
     * 将组件适配器类注册到 spray 的组件适配器集合中，组件适配器必须继承于 spray.BaseAdapter，需要实现 BaseAdapter 的如下几个方法：
     * - init：组件初始化
     * - update：组件更新
     * - setOption：组件适配器设置组件的属性参数
     * - resize：组件大小发生变化
     * - destroy：注销组件
     * @param type 注册组件适配器名称/类型，将来会只用此标识符来创建新的组件
     * @param adapterClazz 组件适配器类
     * @example
     * ```
     * // 先定义个组件适配器类
     * // 组件适配器类，需要继承BaseAdapter
     * class CustomAdapter extend spray.BaseAdapter {
     *   constructor(parent, name) {
     *     super(parent, name)
     *   }
     *
     *   static factory(parent, name) {
     *     const instance = new CustomAdapter(parent, name)
     *
     *     return instance
     *   }
     *
     *   init(opts) {
     *     // 初始化的业务代码
     *   }
     *
     *   update() {
     *     // 组件更新业务代码
     *   }
     *
     *   setOption() {
     *     // 设置组件属性参数业务代码
     *   }
     *
     *   resize() {
     *     // 组件大小更新
     *   }
     *
     *   destroy() {
     *     // 组件注销
     *   }
     * }
     *
     * spray.adapter.registAdapter('CustomAdapter', CustomAdapter)
     * ```
     */
    registAdapter(
      type: string,
      adapterClazz: new (...args: any[]) => any
    ): void;

    /**
     * 使用组件适配器功能在宿主元素中创建一个组件
     * @param type 已注册的组件适配器名称/类型
     * @param parent 组件适配器的宿主对象元素实例
     * @param opts 组组件适配器中所创建组件的名称，例如Echarts里可以是pie，conch里可以是一个组件id
     * @returns 组件适配器实例
     * @example
     * ```
     * // 获取画布中的一个容器对象实例作为组件适配器初始化的宿主父对象
     * const el = spray.getElementById('freecontainer-xxxxxx')
     *
     * spray.adapter.newComponent('CustomAdapter', el, xxx组件名称或id)
     * ```
     */
    newComponent(
      type: string,
      parent: Canvas | Layer | FreeContainer,
      opts: string
    ): Adapter;
  };

  /**
   * @see https://www.yuque.com/khth0u/ngd5zk/hzqfhc#KebNf
   */
  const config: Config;

  /**
   * @see https://www.yuque.com/khth0u/ngd5zk/hzqfhc#L4m2S
   */
  const tool: Tool;

  /**
   * 初始化Spray实例，并默认创建一个空画布
   * @param dom 渲染 Spray 实例中画布使用的 dom 节点或 dom 节点的 id
   * @param opts 初始化Spray实例中画布的参数，[关于opts详细信息请点击这里](https://www.yuque.com/khth0u/ngd5zk/ya7s6g)
   * @returns 创建的Spray实例
   * @example
   * ```
   * // 创建一个Spray实例，并且将画布大小设置成宽1920px，高1080px
   * const spr = spray.init('app', {width: 1920, height:1080})
   * ```
   */
  function init(dom: HTMLElement | string, opts?: SprayOrCanvasOption): Spray;

  /**
   * 使用定义文件初始化Spray实例，实例中包含定义文件中定义的图层和容器，甚至包含[Spray | conch](https://www.yuque.com/khth0u/dsz7nf/ayilv9)组件或动画等。
   * @param dom 渲染 Spray 实例中画布使用的 dom 节点或 dom 节点的 id
   * @param definition spray 场景的定义文件，可以是 json 或者 json 字符串，[场景定义文件模板点击这里](https://www.yuque.com/khth0u/ngd5zk/lart6u)
   * @returns 创建的 Spray 实例
   * @example
   * ```
   * // 从服务器端获取场景定义文件并初始化Spray实例
   * let spr = null
   * fetch('asset/template/template.json').then(res => {
   *   res.json().then(data => {
   *     spr = spray.initFromJSON('app', data)
   *   })
   * })
   * ```
   */
  function initFromJSON(
    dom: HTMLElement | string,
    definition: Definition | string
  ): Spray;

  /**
   * spray 中现在是单实例数据解构，返回当前 spray 中所持有的 Spray 实例
   * @returns Spray实例
   * @example
   * ```
   * let spr = spray.getInstance()
   * ```
   */
  function getInstance(): Spray;

  /**
   * 注销 spray 中持有的 Spray 实例，注销后的 Spray 实例本身存在，但已无画布实例，此时可以通过空 Spray 实例加载新的场景进来，达到场景切换的效果
   * @returns 注销Spray实例
   * @example
   * ```
   * let spr = spray.destroy()
   * ```
   */
  function destroy(): Spray;

  /**
   * 初始化Spray实例，并默认创建一个空画布
   * @param index 使用的布局模板索引顺序，目前为 0-11
   * @param spr  使用模板的 Spray 实例 spr
   * @returns 成功使用模板创建实例后返回 true
   * @see https://www.yuque.com/khth0u/ngd5zk/hzqfhc#Q1iig
   * @example
   * ```
   * const spr = spray.init('app', {})
   * spray.useTemplate(0, spr)
   * ```
   */
  function useTemplate(
    index: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11,
    spr: spray.Spray
  ): boolean;

  /**
   * @see https://www.yuque.com/khth0u/ngd5zk/rsqroa
   */
  interface SprayEventType {
    [propName: string]: any;
    configChange: {
      /** key是变化的配置项名称 */
      key: string;
      /** value是该配置项设置的新值 */
      value: any;
    };
    nextTick: null;
    canvasResizeOnPlayMode: {
      /** width是当前画布的宽 */
      width: number;
      /** height是当前画布的高 */
      height: number;
    };
    zoomCanvas: HTMLCanvasElement;
    dataChange: {
      /** id是发生数据变化元素的id */
      id: string;
      /** bizData是变化后的新值 */
      bizData: any;
    };
    selectChange: Displayable;
    mouseOverChange: Displayable;
    containerMove: Displayable;
    containerMoveEnd: Displayable;
    resizeHandlerMove: Displayable;
    resizeHandlerMoveEnd: Displayable;
    enterAnimationComplete: Displayable;
    componentComplete: string;
    layerReload: string;
    elementPropChange: {
      /** key是对象元素属性名称 */
      key: string;
      /** value修改后的新值 */
      value: any;
    };
    addFromTemplate: string;
    rebuildContainer: string;
  }

  interface EventBus {
    /**
     * 使用 spray 的时候，可以将外部的函数加入到 spray 事件总线里进行监听，并且使用 spray 某个实例对象的事件去触发事件总线的执行
     * @param eventName 事件名称
     * @param handle 被监听的函数
     * @param ctx handle的执行上下文，可以不传
     * @example
     * ```
     * function customHandle() {
     *   console.log('这里被监听触发了')
     * }
     *
     * // 挂载监听到eventbus
     * spray.eventbus.on('customEvent', customHandle)
     *
     * // 执行监听
     * spray.eventbus.emit('customEvent')
     * ```
     */
    on<K extends keyof SprayEventType>(
      eventName: K,
      handle: (ev: SprayEventType[K]) => any,
      ctx?: object
    ): void;

    /**
     * 注销监听，将被监听的函数在监听队列中移除，移除后该监听队列的其他监听handle不受影响
     * @param eventName 事件名称
     * @param handle 被监听的函数
     * @example
     * ```
     * function customHandle() {
     *   console.log('这里被监听触发了')
     * }
     *
     * // 从eventbus监听队列中找到customEvent队列，并将customHandle监听移除
     * spray.eventbus.off('customEvent', customHandle)
     * ```
     */
    off(eventName: string, handle: Function): void;

    /**
     * 执行监听队列，执行时该队列中的所有监听函数都会被触发执行
     * @param eventName 事件名称
     * @param args 执行监听函数时传入的参数，可以是字符串，对象，数组等任何值
     * @example
     * ```
     * // 执行customEvent监听，并传入参数{key: 'abc', value: '123'}
     * spray.eventbus.emit('customEvent', {key: 'abc', value: '123'})
     * ```
     */
    emit(eventName: string, ...args: any): void;

    /**
     * 挂载一次性监听，该监听队列执行完成后系统自动将该监听函数从队列移除，同一个队列可以有永久监听函数和一次性监听函数混合存在
     * @param eventName 事件名称
     * @param handle 被监听的函数
     * @example
     * ```
     * function customHandle() {
     *   console.log('这里被监听触发了')
     * }
     *
     * // 将customHandle挂载到一次性队列customEvent中
     * spray.eventbus.once('customEvent', customHandle)
     *
     * // 触发一次性监听队列的方式和on的监听队列无区别
     * spray.eventbus.emit('customEvent')
     * ```
     */
    once<K extends keyof SprayEventType>(
      eventName: K,
      handle: (ev: SprayEventType[K]) => any
    ): void;
  }

  /** 场景定义文件模板类型 - FreeContainer */
  interface DefinitionFreeContainer {
    option: FreeContainerOption;
    type: 'FreeContainer';
    children?: DefinitionLayer[];
  }

  /** 场景定义文件模板类型 - Free */
  interface DefinitionFree {
    option: BaseOption & SceneAnimator;
    type: 'Free';
    children?: DefinitionFreeContainer[];
  }

  /** 场景定义文件模板类型 - Layer */
  interface DefinitionLayer {
    option: LayerOption;
    type: 'Layer';
    children?: DefinitionFree[];
  }

  /**
   * 场景定义文件模板类型
   * @see https://www.yuque.com/khth0u/ngd5zk/lart6u
   */
  interface Definition {
    option?: SprayOrCanvasOption & SceneAnimator;
    type: 'Canvas';
    children?: DefinitionLayer[];
  }

  interface FreeContainerOptionAdapter {
    type: 'ConchAdapter';
    name: string;
    option: {
      prefix: string;
    };
  }

  /**
   * 入场出场动画选项
   * @see https://www.yuque.com/khth0u/ngd5zk/qzs45z
   */
  interface SceneAnimator {
    /** 入场动画 */
    enter: {
      /** 动画名称 */
      name: 'fromLeft' | 'fromRight' | 'fromTop' | 'fromBottom';
      /** 动画执行时长 */
      duration: number;
    } | null;
    /** 出场动画 */
    leave: {
      name: 'toLeft' | 'toRight' | 'toTop' | 'toBottom';
      duration: number;
    } | null;
  }

  /**
   * Style对象中可配置的属性的值和css3一致，不在下面可配置属性范围内的，通过opts设置到对象元素实例都无效，请通过相关对象的API进行设置。
   * @see https://www.yuque.com/khth0u/ngd5zk/ya7s6g#brz9Q
   */
  interface Style extends Partial<CSSStyleDeclaration> {
    /**
     * 对象元素距上距离，此配置项只能FreeContainer有效
     */
    top?: string;
    /**
     * 对象元素距左距离，此配置项只能FreeContainer有效
     */
    left?: string;
    /**
     * 对象元素滤镜，对所有类型元素有效
     */
    filter?: string;
    /**
     * 对象元素外边框，对所有类型元素有效
     */
    outline?: string;
    /** 对象元素背景图，对所有类型元素有效 */
    backgroundImage?: string;
    /** 对象元素背景色，对所有类型元素有效 */
    backgroundColor?: string;
    /** 对象元素背景样式，对所有类型元素有效 */
    background?: string;
    /** 对象元素背景样式位置，对所有类型元素有效 */
    backgroundPosition?: string;
    /** 对象元素内边距，对所有类型元素有效 */
    padding?: string;
    /** 对象元素外边距，对所有类型元素有效 */
    margin?: string;
    /** 对象元素边框样式，对所有类型元素有效 */
    border?: string;
    /** 对象元素的透明度，对所有类型元素有效 */
    opacity?: string;
    /** 鼠标在对象元素上的样式，对所有类型元素有效 */
    cursor?: string;
    /** 对象元素背景重复方式，对所有类型元素有效 */
    backgroundRepeat?: string;
    /** 对象元素背景尺寸，对所有类型元素有效 */
    backgroundSize?: string;
    /** 对象元素阴影滤镜，对所有类型元素有效 */
    backdropFilter?: string;
  }

  interface FilterOption {
    /** 色调 0-1 */
    hueRotate: number;
    /** 对比度 0-1 */
    contrast: number;
    /** 透明度 0-1 */
    opacity: number;
    /** 饱和度 0-1 */
    saturate: number;
    /** 亮度 0-1 */
    brightness: number;
  }
  /**
   * spray 中 init 使用的 opts 就是用来初始化画布，因此 Spray 的 opts 也是 Canvas 对象 opts
   * @see [Spray&Canvas opts](https://www.yuque.com/khth0u/ngd5zk/ya7s6g#W05J4)
   */
  interface SprayOrCanvasOption extends BaseOption {
    /** 画布滤镜配置参数 */
    filter?: Partial<FilterOption>;
  }

  /**
   * 创建图层的选项
   * @see [Layer opts](https://www.yuque.com/khth0u/ngd5zk/ya7s6g#IJX5K)
   */
  interface LayerOption extends BaseOption {
    /**
     * 图层上下层顺序，0-100，数值越大越上层
     */
    order?: number;
    /**
     * 是否忽略渲染，被忽略的对象元素在内存中存在，但没有渲染实体dom
     */
    ignoreRendering?: boolean;
  }

  type ValueOf<T> = T[keyof T];

  /**
   * 创建自由容器的选项
   * @see [FreeContainer opts](https://www.yuque.com/khth0u/ngd5zk/ya7s6g#HtzQm)
   */
  interface FreeContainerOption extends BaseOption {
    /**
     * 画布在投放模式下容器的自适应参照点，1-9
     */
    constraints?: ValueOf<ContainerConstraints>;
    /**
     * 画布在投屏模式下放缩比例的参照方向，0横向1纵向2双向3不缩放
     */
    scaleConstraints?: ValueOf<ScaleConstraints>;
    top?: number;
    left?: number;
    adapter?: FreeContainerOptionAdapter;
  }

  /**
   * 对于Spray，Canvas，Layer，FreeContainer的初始化都可以设置参数，去控制元素的位置，背景，大小等行为及样式，opts分为基础部分（所有元素对象都具备的属性），和个性化部分
   * @see [基础 opts](https://www.yuque.com/khth0u/ngd5zk/ya7s6g#Xmbb9)
   */
  interface BaseOption {
    /** 对象元素唯一id,不可重复可由系统自动生成 */
    id?: string;
    /** 对象元素名称，可以重复 */
    name?: string;
    /** 初始画布（设计稿）宽度 */
    width?: number | 'inherit' | string;
    /** 初始画布（设计稿）高度 */
    height?: number | 'inherit' | string;
    /**
     * Style对象中可配置的属性的值和css3一致，不在下面可配置属性范围内的，通过opts设置到对象元素实例都无效，请通过相关对象的API进行设置。
     */
    style?: spray.Style;
    lock?: {
      /** x坐标锁定 */
      left?: boolean;
      /** y坐标锁定 */
      top?: boolean;
      /** 宽锁定 */
      width?: boolean;
      /** 高锁定 */
      height?: boolean;
    };
    sceneAnimator?: SceneAnimator;
  }

  interface Register {
    /**
     * 将对象注册到 Spray 中，后续可以直接使用对象注册名称 new 对象实例，并且新的对象实例可以挂载到 spray 的图层等对象上
     * @param key 对象被注册后的注册名称
     * @param clazz 被注册的对象
     * @example
     * ```
     * class CustomElement {
     *   constructor(opts) {}
     *
     *   // 其他成员方法
     *   fnXXX() {
     *     // 成员方法计算过程
     *   }
     * }
     * spray.register.registeClazz('CustomElement', CustomElement)
     * ```
     */
    registClazz(key: string, clazz: new (...args: any[]) => any): void;

    /**
     * 将对象注册到 Spray 中，后续可以直接使用对象注册名称 new 对象实例，并且新的对象实例可以挂载到 spray 的图层等对象上
     * @param key 已注册对象的注册名称
     * @param parent 新对象实例挂载到的父级对象
     * @param opts 初始化新元素对象实例时使用的配置参数
     * @returns 创建的对象元素实例
     * @example
     * ```
     * // 获取创建对象的父级对象元素实例
     * const parentEl = spray.getElementById('layer-xxxxxx')
     *
     * // 创建注册进来新对象的对象实例并挂载到parentEl上
     * spray.register.newFromRegistedClazz('CustomElement', parentEl, {})
     * ```
     */
    newFromRegistedClazz<T>(
      key: string,
      parent: Canvas | Layer | FreeContainer,
      opts?: any
    ): T;

    /**
     * 查看布局对象已经注册的布局，仅限内部使用
     */
    getRegisteClazzList(): Map<string, new (...args: any[]) => any>;
  }

  /**
   * @see https://www.yuque.com/khth0u/ngd5zk/zscx49
   */
  interface Adapter {
    /**
     * 更新业务数据的方式有三种:
     * - 第一种是通过 spray 实例进行批量更新
     * - 第二种是通过 UI 实例（Canvas、Layer、FreeContainer 等所有继承于 Displayable 的类的实例）进行更新
     * - 第三种是单独获取适配器进行更新，如下
     *
     * 说明：三种更新方式为递进关系：spray 实例 -> UI 实例 -> 适配器
     * @param data 业务数据
     * @example
     * ```
     * // 获取spr实例
     * const spr =  spray.getIntance()
     *
     * // 获取接数适配器所在的容器
     * const container = spr.getElementById('container-xxx')
     *
     * // 更新业务数据
     * container.adapter.setData({xxx:xxx, yyy:yyy})
     * ```
     */
    setData(data: object): void;
  }

  interface ConfigOption {
    /**
     * 开启或关闭 spray 扩展插件功能，扩展插件里包含zoomBar等子插件
     */
    extendManage: boolean;

    /**
     * 开启或关闭 spray 画布最下方的放大缩小功能栏
     */
    zoomBar: boolean;

    /**
     * 设置画布的显示模式
     *
     * matrix 模式是浏览器居中的编辑式画布，可以放大缩小，容器可以选中，3D场景不可旋转
     *
     * play模式是全屏投放模式，此时3D场景可以使用鼠标拖拽，编辑器相关插件自动隐藏
     */
    canvasMode: 'matrix' | 'play';

    /**
     * 设置画布的显示模式
     * - true：按照提供给 spray 实例 dom 节点的可视区域进行渲染画布
     * - false：按照当前 chrome 窗口可视区域大小进行渲染画布
     */
    appMode: boolean;

    /**
     * 是否启用 Esc 键，一般在和 3D 场景有 Esc 键冲突的时候，在 play 模式下禁用 spray 的 Esc 功能
     * - true：启用 Esc 键，在 play 播放模式下可以通过 Esc 推出到画布模式
     * - false：禁用 Esc 键
     */
    enableEsc: boolean;

    /**
     * 是否启对齐线
     */
    enableAlignmentLine: boolean;
  }

  interface Config {
    /**
     * 获取 spray 全局配置对象，获取后的对象不可直接修改，直接修改不会触发 spray eventbus 的系统级监听
     * @returns 返回所有全局配置对象
     * @example
     * ```
     * spray.config.getConfig()
     * ```
     */
    getConfig(): any;
    /**
     * spray.config.setConfig 是一个对全局进行参数化配置的方法，其接受 key, value 两个参数。
     *
     * [见spray全局配置章节](https://www.yuque.com/khth0u/ngd5zk/cnbsv0)
     * @example
     * ```
     * spray.config.setConfig('extendManage', false)
     * ```
     */
    setConfig<K extends keyof ConfigOption>(
      key: K,
      value: ConfigOption[K]
    ): void;
  }

  interface ContainerConstraints {
    readonly TOPLEFT: 1;
    readonly TOPCENTER: 2;
    readonly TOPRIGHT: 3;
    readonly CENTERLEFT: 4;
    readonly CENTERCENTER: 5;
    readonly CENTERRIGHT: 6;
    readonly BOTTOMLEFT: 7;
    readonly BOTTOMCENTER: 8;
    readonly BOTTOMRIGHT: 9;
  }

  interface ScaleConstraints {
    /** 横向缩放约束 */
    readonly HORIZ: 0;
    /** 纵向缩放约束 */
    readonly VERTI: 1;
    /** 双向放缩约束 */
    readonly ALL: 2;
    /** 不缩放 */
    readonly NONE: 3;
  }

  interface Tool {
    /**
     * 画布上的 9 个参照点，在投屏模式下 FreeContainer 类型的容器会根据参照点进行计算动态位置
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 设置ctn容器的参照点位置
     * ctn.constraints = spray.tool.containerConstraints.TOPLEFT
     * ```
     */
    containerConstraints: ContainerConstraints;
    /**
     * 画布上的容器响应放缩变化的参照方向
     * @example
     * ```
     * // 例子：通过设置画布整体的放缩参照方向，默认为0
     * // 获取画布
     * const canvas = spr.canvas
     *
     * // 设置画布放缩参照方向
     * canvas.scaleConstraints = spray.tool.scaleConstraints.HORIZ
     *
     *
     * // 例子：通过枚举类型设置容器ctn的放缩参照方向（如果容器未设置放缩参照值，则继承画布的放缩参照值）
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 设置ctn容器响应纵向高度的变化
     * ctn.scaleConstraints = spray.tool.scaleConstraints.HORIZ
     * ```
     */
    scaleConstraints: ScaleConstraints;

    /**
     * 创建 dom 对象，在 spray 里基本 用不到，供外部程序创建 dom 节点方便一些
     * @param type 创建 dom 的类型，默认 div
     * @returns 返回创建的dom对象
     * @example
     * ```
     * // 创建dom对象，在spray里基本 用不到，供外部程序创建dom节点方便一些
     * const dom = spray.tool.createDom('div')
     * ```
     */
    createDom<K extends keyof HTMLElementTagNameMap>(
      type: K
    ): HTMLElementTagNameMap[K];

    /**
     * 检测目标对象是否字符串对象
     * @param obj 被检测对象
     * @param type 检测对象是否为该type字符串对应的类型
     * @returns 如果是传入Type对应的数据类型返回true，否则返回false
     * @example
     * ```
     * spray.tool.isType('123', 'String') // 返回true
     * spray.tool.isType(123, 'Number') // 返回true
     * spray.tool.isType(123, 'String') // 返回false
     * ```
     */
    isType(obj: any, type: string): boolean;
  }

  type SprayMode = 'dev' | 'prd';

  /**
   * @see https://www.yuque.com/khth0u/ngd5zk/lbr7kh
   */
  class Spray extends Displayable {
    /**
     * 设置 Spray 实例运行的模式
     * @param mode 开发模式：dev/生产模式：prd，默认为dev
     * @example
     * ```
     * // spr是一个Spray实例
     *
     * // 将当前运行模式设置为生产模式
     * spr.setMode('prd')
     * ```
     */
    setMode(mode: SprayMode): void;

    /**
     * 设置画布的滤镜，设置完后对画布中所有元素起作用
     * @param key 滤镜的属性名
     * @param value 滤镜的属性值
     * @example
     * ```
     * // 滤镜的所有可设置key和默认值，及其含义解释
     * {
     *   hueRotate: 0, // 色调 0-1
     *   contrast: 1, // 对比度 0-1
     *   opacity: 1, // 透明度 0-1
     *   saturate: 1, // 饱和度 0-1
     *   brightness: 1 // 亮度 0-1
     * }
     *
     * // 设置当前画布的色彩饱和度
     * spr.setFilter('saturate', 0.5)
     * ```
     */
    setFilter(
      key: 'hurRotate' | 'contrast' | 'opacity' | 'saturate' | 'brightness',
      value: number
    ): void;

    /**
     * 调用spray实例的setData更新数据后，会逐层按照 spray实例->UI实例->适配器 传递过程对数据进行更新。
     *
     * 注意：批量更新数据成功的前提是，更新对象有订阅行为发生，即存在被订阅的宿主对象。单个适配器更新业务数据请[查看这里](https://www.yuque.com/khth0u/ngd5zk/zscx49#2f6Ah)
     * @param data 将 data 作为业务数据更新到 spray，更新后 spray 中的组件会随之更新
     * @example
     * ```
     * // data格式如下
     * {
     *   对象元素id: {业务数据},
     *   对象元素iid2: {业务数据}
     * }
     * // Spray实例会先根据对象元素id找到对应的对象元素（可能是Canvas，Layer，FreeContainer等对象实例），然后由对象元素通过setData将数据赋值给对象元素
     *
     * // 给id为container-xxxx的布局容器对象设置业务数据，设置后布局容器会将数据设置给内部的具体组件
     * spr.setData({'container-xxxx': {name: 'hello world!'}})
     * ```
     */
    setData(data: Record<string, unknown>): void;

    /**
     * 设置画布背景图
     * @param url 背景图 url 地址或者 base64 字符串
     * @example
     * ```
     * spr.setBackgroundImage('https://xxx.xxx.com/img.png')
     * ```
     */
    setBackgroundImage(url: string): void;

    /**
     * 场景切换时可以使用此API将新的场景定义文件加载到当前的 Spray 实例中，在加载之前系统默认先卸载老场景的所有对象，执行出场动画
     * @param definition 场景定义文件
     * @example
     * ```
     * // 定义文件可以来自于网络请求的远程服务
     * fetch('https://xxx.xxx.com/def.json',).then(res => {
     *     res.json().then(def => {
     *     spr.setOption(def)
     *   })
     * })
     * ```
     */
    setOption(definition: Definition | string): void;

    /**
     * 获取当前Spray实例环境的运行模式
     * @returns  dev 或者 prd
     * @example
     * ```
     * spr.getMode()
     * ```
     */
    getMode<K extends SprayMode>(): K;

    /**
     * 获取当前 Spray 实例中画布的大小，投屏模式下画布的大小会随着投屏环境的大小而变化，即：画布投屏运行中的大小和实际设计大小不一定一致，但退出投屏模式后，画布大小会恢复到设计尺寸大小
     * @returns {width: number, height: number} 画布的宽高
     * @example
     * ```
     * spr.getSize() // 返回值格式{width: 1920, height:1080}
     * ```
     */
    getSize(): {
      width: number;
      height: number;
    };

    /**
     * 获取当前 Spray 实例中画布渲染父级 dom 对象
     * @returns dom 渲染 Spray 实例画布所提供的父级 dom 对象
     * @example
     * ```
     * spr.getRoot() // 返回值常规是 id 为 app 的 dom 对象
     * ```
     */
    getRoot<T = HTMLElement>(): T;

    /**
     * 获取当前场景定义文件JSON对象，[场景定义文件模板详细信息点击这里](https://www.yuque.com/khth0u/ngd5zk/lart6u)
     * @returns definition 返回当前场景的定义文件 JSON 对象
     * @example
     * ```
     * spr.getJSONObject() // 返回值为JSON对象
     * ```
     */
    getJSONObject(): Definition;

    /**
     * 获取当前场景定义文件JSON字符串，[场景定义文件模板详细信息点击这里](https://www.yuque.com/khth0u/ngd5zk/lart6u)
     * @returns 返回值：definition 返回当前场景的定义文件 JSON 字符串
     * @example
     * ```
     * spr.getJSONString() // 返回值为JSON字符串
     * ```
     */
    getJSONString(): string;

    /**
     * 将场景从隐藏状态设置为显示状态
     */
    show(): void;

    /**
     * 将场景从显示状态设置为隐藏状态
     */
    hidden(): void;

    /**
     * 投全屏，此时屏幕程序状态为全屏播放模式
     */
    play(): void;

    /**
     * 在 Spray 实例中创建新画布，新画布创建前会注销画布及其内部所有对象元素及组件
     * @param opts 创建画布使用的配置参数
     * @returns 创建的画布对象实例
     * @example
     * ```
     * spr.createCanvas({id: 'xxx', name: 'xxx', width: 1920, height: 1080})
     * ```
     */
    createCanvas(opts: SprayOrCanvasOption): Canvas;

    /**
     * 在 Spray 实例中的画布中创建空图层，创建图层默认宽高继承画布大小
     * @param opts 创建图层使用的配置参数
     * @returns 创建的图层对象实例
     * @example
     * ```
     * spr.createLayer({id: 'xxx', name: 'xxx'})
     * ```
     */
    createLayer(opts: LayerOption): Layer;

    /**
     * 在选中的图层中创建一个布局容器
     * @param opts 创建容器使用的配置参数
     * @returns 创建的容器对象实例
     * @example
     * ```
     * const layer = spr.getElementById('layer-xxxx')
     * layer.createContainer({id: 'xxx', name: 'xxx', width: 300, height: 300})
     * ```
     */
    createContainer(opts: FreeContainerOption): FreeContainer;

    /**
     * 通过 id 查找 Spray 实例中的元素对象
     * @param id 元素对象的 id
     * @returns 元素对象实例
     * @example
     * ```
     * spr.getElementById('layer-xxxxxx') // 返回值为Canvas/Layer/FreeContainer对象实例
     * ```
     */
    getElementById<T extends Canvas | Layer | FreeContainer>(id: string): T;

    /**
     * 通过 name 查找 Spray 实例中的元素对象，返回值是一个数组，因为 name 可以重名
     * @param 元素对象的 name
     * @returns 元素对象实例数组
     * @example
     * ```
     * spr.getElementByName('layer-xxxxxx') // 返回值为Canvas/Layer/FreeContainer对象实例的数组
     * ```
     */
    getElementByName<T extends Array<Canvas | Layer | FreeContainer>>(
      name: string
    ): T;

    /**
     * 查找画布中所有对象实例，返回值是一个数组
     * @returns 元素对象实例数组
     * @example
     * ```
     * spr.getAllElementList() // 返回值为Canvas&Layer&FreeContainer对象实例的数组
     * ```
     */
    getAllElementList(): Array<Canvas | Layer | FreeContainer>;

    /**
     * 查找画布对象实例
     * @returns 画布对象实例
     * @example
     * ```
     * spr.getCanvas() // 返回值为Canvas对象实例
     * ```
     */
    getCanvas(): Canvas;

    /**
     * 查找画布中所有图层
     * @returns 画布中所有图层数组
     * @example
     * ```
     * spr.getLayers() // 返回值为Layer对象实例数组
     * ```
     */
    getLayers(): Layer[];

    /**
     * 查找画布中所有容器
     * @returns 画布中所有容器数组
     * @example
     * ```
     * spr.getContainers() // 返回值为FreeContainer对象实例数组
     * ```
     */
    getContainers(): FreeContainer[];

    /**
     * 查找画布中被鼠标悬浮的对象实例
     * @returns 画布中被鼠标悬浮的对象实例，可能是 Layer，也可能是容器，也可能为 null
     */
    getMouseOverElement<T extends Layer | FreeContainer | null>(): T;

    /**
     * 查找画布中被选中的对象实例
     * @returns 画布中被选中的对象实例，可能是 Layer，也可能是容器，也可能为 null
     */
    getSelectedElement<T extends Layer | FreeContainer | null>(): T;
  }

  type DisplayableEventType =
    | 'click'
    | 'dblclick'
    | 'mousewheel'
    | 'mouseout'
    | 'mouseup'
    | 'mousedown'
    | 'mousemove'
    | 'contextmenu'
    | 'mouseover';

  interface AdapterType {
    ThingJSAdapter: {
      /** 3D 场景地址 */
      url: string;
      /**
       * id 就是 3D 地图所需的 DOM 节点 id，自己任意写一个合法具备辨识性的字符串即可
       */
      id?: string;
      skyBox?: string;
    };
    ConchAdapter: Record<string, unknown>;
    EchartsAdapter: {
      width?: number;
      height?: number;
    };
  }

  class Displayable {
    /**
     * 设置或获取元素的高
     *
     * 特殊情况：画布的高度获取的是实际运行时的高，因为画布在投屏的时候会伴随目标屏尺寸的变化。
     *
     * 图层的高度如果获取的值为inherit，则和图层所在父级容器的大小相同，直接通过图层.parent.height获取即
     * @example
     * ```
     * // 获取画布对象
     * const canvas = spr.getElementById('canvas-xxxxxx')
     *
     * // 获取画布的高度
     * const height = canvas.height // 返回画布的高度，例如：1080
     *
     * // 设置画布的高度
     * canvas.height = 1080
     * ```
     */
    height: number;

    /**
     * 设置或获取元素的宽
     *
     * 特殊情况：画布的宽度获取的是实际运行时的宽，因为画布在投屏的时候会伴随目标屏尺寸的变化。
     *
     * 图层的高宽如果获取的值为 inherit，则和图层所在父级容器的大小相同，直接通过图层.parent.width 获取即可
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取画布的高度
     * const width = ctn.width // 返回画布的高度，例如：300
     *
     * // 设置容器的高度为400px
     * ctn.width = 400
     * ```
     */
    width: number;

    /**
     * 设置或获取元素上下层顺序，数字越大越靠上层
     *
     * 注意：目前上下层顺序值对 Layer 有效，并且有效数值为 1-100，100 以后的数据系统另有它用
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 获取图层顺序
     * const lorder = layer.order // 返回图层在当前画布中的视觉顺序
     *
     * // 设置图层顺序
     * layer.order = 99
     * ```
     */
    order: number;

    /**
     * 设置或获取元素名称，元素名称最好是字母/数字/下划线组成，元素名称可以重复
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 获取图层名称
     * const lname = layer.name // 返回图层名称
     *
     * // 设置图层名称
     * layer.name = 'tuceng'
     * ```
     */
    name: string;

    /**
     * 设置或获取元素 id，元素 id 必须是字母/数字/下划线组成，元素 id 不可重复
     *
     * 注意：元素 id 一般由系统自动生成，或者在 new 元素实例的时候将 id 通过 opts 传入，[opts详细信息点击这里](https://www.yuque.com/khth0u/ngd5zk/ya7s6g)
     * @example
     * ```
     * // 获取图层对象
     * const layers = spr.getElementByName('layer-xxxxxx')
     *
     * // 获取图层名称
     * const lid = layers[0].id // 返回图层名称
     *
     * // 设置图层名称
     * layers[0].id = 'tuceng001'
     * ```
     */
    id: string;

    /**
     * 设置或获取元素中文显示名称
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 获取图层中文显示名称
     * const lTypeName = layer.typeName // 返回图层名称
     *
     * // 设置图层名称
     * layer.typeName = '指标图层'
     * ```
     */
    typeName: string;

    /**
     * 设置或获取元素是否选中状态
     * @example
     * ```
     * // 获取图层对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取容器是否选中
     * const select = ctn.isSelected // 返回元素是否选中状态，false为不选中，true为选中
     *
     * // 设置容器设置为不选中状态
     * ctn.isSelected = false
     * ```
     */
    isSelected: boolean;

    /**
     * 设置或获取元素是否正在被鼠标悬浮状态
     * @example
     * ```
     * // 获取图层对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取容器是否选中
     * const select = ctn.isMouseOver // 返回元素是否被鼠标悬浮，false为未悬浮，true为悬浮
     *
     * // 设置容器设置为不悬浮状态
     * ctn.isMouseOver = false
     * ```
     */
    isMouseOver: boolean;

    /**
     * 置或获取元素是否需要下一帧重新渲染，如果需要渲染将 dirty 设置为 true，渲染完成后系统自动改为 false
     * @example
     * ```
     * // 获取图层对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 设置容器设置下一帧需要重新渲染
     * ctn.dirty = true
     * ```
     */
    dirty: boolean;

    /**
     * 获取元素内向内所包含的组件对象实例
     * @returns 获取的是组件对象实例，而不是组件适配器实例，如果当前容器中没有组件返回null
     * @example
     * ```
     * // 获取图层对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器中的组件对象实例
     * const app = ctn.app // 返回的可能是conch/echarts组件实例
     * ```
     */
    readonly app: any;

    /**
     * 获取当前元素是否被忽略状态
     *
     * 注意：
     * - 元素受父级元素的忽略状态影响，如果父元素被忽略了，所有子元素一同被忽略。
     * - 被忽略后的元素及其子元素对象在内存中存在，但 dom 节点不被渲染
     * - 忽略只能设置在图层上，其他对象元素无法设置
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器的忽略状态
     * const app = ctn.ignoreStatus
     * ```
     */
    readonly ignoreStatus: boolean;

    /**
     * 获取属于当前元素本身的 dom 对象
     *
     * 注意：当前元素本身的 dom 对象被渲染在该元素的 root 对象中
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器dom对象
     * const dom = ctn.dom
     * ```
     */
    readonly dom: HTMLElement;

    /**
     * 获取属于当前元素的父级元素对象实例
     *
     * 注意：Canvas 的父级实例为 Spray 实例
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器dom对象
     * const parent = ctn.parent
     * ```
     */
    readonly parent: Spray | Displayable;

    /**
     * 获取该对象元素渲染的根 dom，根 dom 通常是父级元素的 dom 属性
     * @returns 提供给该对象元素渲染的根 dom 对象
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器dom对象
     * const root = ctn.getRoot()
     * ```
     */
    getRoot(): HTMLElement;

    /**
     * 获取容器对象的包围盒对象
     * @returns 返回该元素对象的包围盒对象
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器dom对象
     * const root = ctn.getBoundingRect()
     * // 返回值实例如下
     * {
     *   x: 100,
     *   y: 100,
     *   width: 380,
     *   height: 300,
     *   bottom: 100,
     *   top: 100,
     *   left: 200,
     *   right: 300
     * }
     * ```
     */
    getBoundingRect(): DOMRect;

    /**
     * 判断鼠标当前坐标是否包含在该元素对象的渲染范围内
     * @param x x坐标
     * @param y y坐标
     * @returns x, y 坐标位置是否包含在当前元素中
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * ctn.contain(100, 100)
     * ```
     */
    contain(x: number, y: number): boolean;

    /**
     * 获取该对象元素所在的 Spray 实例，程序外部还可以通过 spray.getInstance() 获取
     * @returns 当前元素所在的 Spray 实例
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器所在的Spray实例
     * const spr = ctn.getSpray()
     * ```
     */
    getSpray(): Spray;

    /**
     * 获取该对象元素所在的最外层图层对象
     * @returns 当前元素的最外层图层对象，如果当前元素是 Canvas 则返回 null
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器最外层图层对象，当前容器外可能会嵌套很多个图层
     * const rtl = ctn.getRootLayer()
     * ```
     */
    getRootLayer(): Layer | null;

    /**
     * 获取该对象元素的忽略状态，和 ignoreStatus 属性功能相同
     * @returns 当前元素的忽略状态
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * const rtl = ctn.getIgnoreStatus()
     * ```
     */
    getIgnoreStatus(): boolean;

    /**
     * 隐藏当前图层
     * @param checkSceneTransition 是否执行出场动画，默认为 true 执行
     * @example
     * ```
     *
     * ```
     */
    hidden(checkSceneTransition?: boolean): void;

    /**
     * 将该对象元素从隐藏状态修改为显示状态
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器设置为显示状态
     * ctn.show()
     * ```
     */
    show(): void;

    /**
     * 将该对象元素修改为反状态，例如：如果 ctn 容器为显示则修改为隐藏
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器修改为相反状态
     * ctn.toggle()
     * ```
     */
    toggle(): void;

    /**
     * 将该对象元素设置为选中状态
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器设置为选中状态
     * ctn.select()
     * ```
     */
    select(): void;

    /**
     * 将该对象元素设置为不选中状态
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取ctn容器设置为不选中状态
     * ctn.deselect()
     * ```
     */
    deselect(): void;

    /**
     * 使用定义文件方式向该元素对象里添加子对象，例如想向图层中添加容器
     * @param json 定义文件 JSON 对象或者 JSON 字符串
     * @example
     * ```
     * // 获取容器对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 向图层中添加容器，定义文件格式见定义文件相关章节
     * layer.addChildrenFromJSON({xxx:xxx, yyy:yyy})
     * ```
     */
    addChildrenFromJSON<
      T extends
        | DefinitionLayer
        | DefinitionFree
        | DefinitionFreeContainer
        | string
    >(json: T): void;

    addEnterTransition(): void;

    removeEnterTransition(): void;

    addLeaveTransition(): void;

    removeLeaveTransition(): void;

    /**
     * 注销该对象元素，注销后会直接在内存中清除，如果需要再次入场建议使用 hidden 方式进行隐藏或者使用 ddChildrenFromJSON 再次载入
     * @param checkSceneTransition 是否执行出场动画
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 注销图层layer
     * layer.destroy()
     * ```
     */
    destroy(checkSceneTransition: boolean): void;

    /**
     * 修改该对象元素的宽度和高度，修改后系统会触发下一帧重新渲染
     * @param width 元素宽
     * @param height 元素高
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 修改图层宽高
     * layer.setSize(300, 300)
     * ```
     */
    setSize(width: number, height: number): void;

    /**
     * 获取对象元素的宽高
     *
     * 图层元素获取的值如果是 inherit 则表示已经继承父级的宽高，可以使用.parent.getSize()
     * @returns 该对象元素的宽高作为一个 JS 对象返回
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 修改图层宽高
     * layer.getSize()
     *
     * // 获取父级元素的宽高
     * layer.parent.getSize()
     * ```
     */
    getSize(): { width: number; height: number } | 'inherit';

    /**
     * 设置对象元素背景图
     * @param 背景图 url 地址或者 base64 字符串
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 设置图层的背景图
     * layer.setBackgroundImage('https://xxx.xxx.com/img.png')
     * ```
     */
    setBackgroundImage(url: string): void;

    /**
     * 获取对象元素属性的锁定状态
     * @param name 对象元素的属性名称，[[详情见 opts 章节](https://www.yuque.com/khth0u/ngd5zk/ya7s6g)
     * @returns 属性是否被锁定
     * @example
     * ```
     * // 获取容器对象
     * const container = spr.getElementById('container-xxxxxx')
     *
     * // 检查容器的宽度是否被锁定
     * container.getLockStatusByPropName('width')
     * ```
     */
    getLockStatusByPropName(name: string): void;

    /**
     * 设置对象元素属性的锁定状态
     * @param name 对象元素的属性名称，[详情见 opts 章节](https://www.yuque.com/khth0u/ngd5zk/ya7s6g)
     * @param value 是否锁定
     * @example
     * ```
     * // 获取容器对象
     * const container = spr.getElementById('container-xxxxxx')
     *
     * // 将容器的宽度锁定
     * container.setLockStatusByPropName('width', true)
     *
     * // 将容器的宽锁定解锁
     * container.setLockStatusByPropName('width', false)
     * ```
     */
    setLockStatusByPropName(name: string, value: boolean): void;

    /**
     * @param type 适配器类型，是适配器在注册时的名称
     * @param name 组件对象名称，conch 组件对应到 conch 组件的id，ThingJS 和 echarts 组件随便写
     * 在对象元素中创建组件适配器，在组件适配器创建时会同步创建一个组件实例，因此需要填写组件的 name
     *
     * 注意：
     *
     * 常用组件适配器对应的注册名称：
     * - ThingJS:ThingJSAdapter
     * - conch: ConchAdapter
     * - echarts: EchartsAdapter
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 在图层中创建一个Echarts图表适配器
     * layer.createAdapter('EchartsAdapter', 'pie')
     *
     * // 在图层中创建一个ThingJS 3D场景适配器
     * layer.createAdapter('ThingJSAdapter', 'garden')
     *
     * // 创建并初始化完组件适配器后，可以通过元素的app属性获取容器中具体组件的实例
     * const echartsInstance = layer.app
     * ```
     */
    createAdapter(type: keyof AdapterType, name: string): void;

    /**
     * 初始化该对象元素中组件适配器实例，初始化适配器就是初始化组件适配器中的组件实例，在这一步组件才会进行正式的渲染操作
     * @param opts 组件初始化时需要的配置参数对象
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 在容器中创建一个Echarts图表适配器
     * ctn.createAdapter('EchartsAdapter', 'pie')
     *
     * // 初始化组件适配器及其组件实例，并进行渲染操作
     * ctn.initAdapter({width: 100, height: 100})
     *
     * // 创建并初始化完组件适配器后，可以通过元素的app属性获取容器中具体组件的实例
     * const echartsInstance = layer.app
     * ```
     */
    initAdapter<K extends keyof AdapterType = 'ThingJSAdapter'>(
      opts: AdapterType[K]
    ): void;

    /**
     * 将该组件适配器中的组件适配器迁移到目标容器 el 中，如果目标容器中有组件适配器，则放弃操作
     * @param el 需要将该容器中的组件适配器迁移到的目标容器
     * @example
     * ```
     * // 获取容器对象
     * const ctnSource = spr.getElementById('container-xxxxxx')
     * const ctnTarget = spr.getElementById('container-xxxxxx')
     *
     * // 将ctnSource中的组件适配器迁移到ctnTarget
     * ctnSource.transferAdapterTo(ctnTarget)
     * ```
     */
    transferAdapterTo<T extends Displayable>(el: T): void;

    /**
     * 将该组件适配器中的组件适配器迁移到目标容器 el 中，如果目标容器中有组件适配器，则执行强制替换，此操作会清空目标容器 el 中的老组件适配器
     * @param el 需要将该容器中的组件适配器迁移到的目标容器
     * @example
     * ```
     * // 获取容器对象
     * const ctnSource = spr.getElementById('container-xxxxxx')
     * const ctnTarget = spr.getElementById('container-xxxxxx')
     *
     * // 将ctnSource中的组件适配器强制迁移到ctnTarget
     * ctnSource.transferAdapterToImmediately(ctnTarget)
     * ```
     */
    transferAdapterToImmediately<T extends Displayable>(el: T): void;

    /**
     * 将该组件适配器中的组件适配器和目标容器中 el 中的组件适配器进行交换位置，如果目标容器为空则执行迁移操作。
     * @param el 交换的目标容器
     * @example
     * ```
     * // 获取容器对象
     * const ctnSource = spr.getElementById('container-xxxxxx')
     * const ctnTarget = spr.getElementById('container-xxxxxx')
     *
     * // 将ctnSource容器中的组件适配器和ctnTarget中的组件适配器进行位置调换
     * ctnSource.exchangeAdapterTo(ctnTarget)
     * ```
     */
    exchangeAdapterTo<T extends Displayable>(el: T): void;

    /**
     * 将业务数据更新到该对象元素中的组件实例中，数据格式不正确的情况下需要组件本身具备校验能力
     * @param data 组件业务数据
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 将数据更新到组件
     * ctn.setDataToAdapter({xxx:xxx})
     * ```
     */
    setDataToAdapter(data: Record<string, unknown>): void;

    /**
     * 为容器内组件适配器订阅目标元素对象上挂在的数据，目标元素包括画布，图层，容器等对象，当目标元素上的业务数据发生变化时，该容器内的组件会自动更新数据
     * @param el 被订阅元素对象的 id 或者元素对象实例
     * @example
     * ```
     * // 获取容器对象
     * const ctnSource = spr.getElementById('container-xxxxxx')
     * const ctnTarget = spr.getElementById('container-xxxxxx')
     *
     * // ctnSource为其内部的组件适配器订阅ctnTarget容器的业务数据
     * ctnSource.subsDataToAdapter(ctnTarget)
     * ```
     */
    subsDataToAdapter<T extends Displayable>(el: T | string): void;

    /**
     * 取消订阅容器内组件所订阅的目标元素对象数据
     *
     * Tips：el 为 null 时取消所有订阅（清空订阅）
     * @param  el 被订阅元素对象的 id 或者元素对象实例
     * @example
     * ```
     * // 获取容器对象
     * const ctnSource = spr.getElementById('container-xxxxxx')
     * const ctnTarget = spr.getElementById('container-xxxxxx')
     *
     * // ctnSource取消为其内部的组件适配器订阅ctnTarget容器的业务数据
     * ctnSource.unSubsDataToAdapter(ctnTarget)
     * ```
     */
    unSubsDataToAdapter<T extends Displayable>(el: T | string | null): void;

    /**
     * 将属性参数更新到该对象元素中的组件实例中，并触发下一帧渲染
     * @param opts 组件的属性参数
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 将属性参数更新到组件
     * ctn.setOptionToAdapter({xxx:xxx})
     * ```
     */
    setOptionToAdapter(opts: Record<string, unknown>): void;

    /**
     * 注销该对象元素中的组件适配器，在该对象元素被 destroy 是也会自动调用 destroyAdapter
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 手动触发注销组件适配器
     * ctn.destroyAdapter()
     * ```
     */
    destroyAdapter(): void;

    /**
     * 获取该对象元素所订阅的业务数据，该业务数据来自外部接口
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 获取业务数据
     * ctn.getData()
     * ```
     */
    getData<T>(): T;

    /**
     * 调用 UI 实例的 setData 更新数据后，会按照 UI 实例->适配器 传递过程对数据进行更新。
     *
     * 注意：UI 实例更新数据成功的前提是，更新对象有订阅行为发生，即存在被订阅的宿主对象。单个适配器更新业务数据请[查看这里](https://www.yuque.com/khth0u/ngd5zk/zscx49#2f6Ah)
     * @example
     * ```
     * // 获取容器对象（这里也可能是layer对象等，所有继承于Dispalyable的类的实例对象都包含setData方法）
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 手动触发注销组件适配器
     * ctn.setData({xxx:xxx, yyy:yyy})
     * ```
     */
    setData(data: Record<string, unknown>): void;

    /**
     * 打开接数窗口，在接数窗口中可以填写对接数据接口的相关信息
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 打开接数面板
     * ctn.openDataWindow()
     * ```
     */
    openDataWindow(): void;

    /**
     * 为改对象元素添加事件监听，例如: click, dbclick 等
     *
     *  注意：
     *
     * 系统已经收录的监听事件：'click', 'dblclick', 'mousewheel', 'mouseout', 'mouseup', 'mousedown', 'mousemove', 'contextmenu', 'mouseover'
     * @param eventName 监听事件名称
     * @param handle 监听触发时执行的 handle
     * @param ctx 监听触发时 handle 内部的执行上下文，即 handle 内部的 this 指向
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * function handleDemo() {
     *   const name = this.name
     *   console.log(name)
     * }
     *
     * // 给ctn对象元素挂载鼠标点击事件监听
     * ctn.on('click', handleDemo, this)
     * ```
     */
    on(eventName: DisplayableEventType, handler: Function, ctx: object): void;

    /**
     * 和 on 一致，区别在于 once 挂载的监听在执行一次后系统会自动卸载
     * @param eventName 监听事件名称
     * @param handle 监听触发时执行的 handle
     * @param ctx 监听触发时 handle 内部的执行上下文，即 handle 内部的 this 指向
     */
    once(eventName: DisplayableEventType, handler: Function, ctx: object): void;

    /**
     * 注销元素对象的监听事件，如果 handle 传 null 或不传则将该事件监听队列中的 handle 全部清空
     * @param eventName 需要注销的 handle 所在的监听事件名称
     * @param handle 需要注销的具体监听事件 handle
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * function handleDemo() {
     *   const name = this.name
     *   console.log(name)
     * }
     *
     * // 给ctn对象元素卸载鼠标点击事件监听中的handleDemo
     * ctn.off('click', handleDemo)
     *
     * // 给ctn对象元素卸载鼠标点击事件监听中所有handle
     * ctn.off('click')
     * ```
     */
    off(eventName: DisplayableEventType, handler?: Function | null): void;

    /**
     * 通过 Spray 之外触发的浏览器事件去出发元素监听
     * @param  event 浏览器事件对象
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * function handleDemo() {
     *   const name = this.name
     *   console.log(name)
     * }
     *
     * // 给ctn对象元素卸载鼠标点击事件监听中的handleDemo
     * ctn.on('click', handleDemo)
     *
     * // 获取页面中的一个普通dom对象，并将dom对象触发click事件时调用Spray中ctn容器的click事件
     * const dom = document.getElementById('btn')
     * btn.addEventListener('click', function(event) {
     *
     *   // 触发ctn的click监听
     *   ctn.trigger(event)
     * })
     * ```
     */
    trigger(event: Event): void;

    /**
     * 直接通过监听事件名称去触发对象元素的事件监听
     * @param eventName 监听事件名称
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * function handleDemo() {
     *   const name = this.name
     *   console.log(name)
     * }
     *
     * // 给ctn对象元素卸载鼠标点击事件监听中的handleDemo
     * ctn.on('click', handleDemo)
     *
     * // 手动触发ctn容器的点击事件
     * ctn.triggerByName('click')
     * ```
     */
    triggerByName(eventName: DisplayableEventType): void;
  }

  class Canvas extends Displayable {
    /**
     * 设置或获取画布的放缩比例，设置放缩比例后会调用 zoomCanvas，并以上一次放缩的中心点作为 origin 值
     */
    ratio: number;

    /**
     * 设置或获取画布的二位矩阵，如果对矩阵了解可以直接通过 matrix 的设置来变换画布的大小，平移，斜切等
     * @example
     * ```
     * // 获取画布对象
     * const canvas = spr.getElementById('canvas-xxxxxx')
     *
     * // 获取画布的二位矩阵
     * const matrix = canvas.matrix // 返回值样例[0.2, 0, 0, 0.2, 200, 300]
     *
     * // 例如设置平移
     * canvas.matrix = [0.2, 0, 0, 0.2, 500, 300]
     * ```
     */
    matrix: number[];

    /**
     * [关于滤镜属性详细信息点击这里](https://www.yuque.com/khth0u/ngd5zk/ya7s6g#W05J4)
     * @param key 滤镜属性名称
     * @param value 滤镜属性值 0-1
     * @example
     * ```
     * // 获取画布对象
     * const canvas = spr.getElementById('canvas-xxxxxx')
     *
     * canvas.setFilter('opacity', 0.5) //画布透明度设置为0.5
     * ```
     */
    setFilter<K extends keyof FilterOption>(
      key: K,
      value: FilterOption[K]
    ): void;

    /**
     * 删除画布滤镜（1.4.0 版本新特性）
     * @example
     * ```
     * // 获取画布对象
     * const canvas = spr.getElementById('canvas-xxxxxx')
     *
     * canvas.deleteFilter()
     * ```
     */
    deleteFilter(): void;

    /**
     * 重置画布滤镜（1.4.0 版本新特性）
     * @example
     * ```
     * // 获取画布对象
     * const canvas = spr.getElementById('canvas-xxxxxx')
     *
     * canvas.resetFilter()
     * ```
     */
    resetFilter(): void;

    /**
     * 对画布进行放缩
     * @param origin 放缩中心点位置
     * @param  scale 放缩比例
     * @example
     * ```
     * // 获取画布对象
     * const canvas = spr.getElementById('canvas-xxxxxx')
     *
     * // 按上一次放缩的中心点位基准对画布放大1.1倍
     * canvas.zoomCanvas(null, 1.1)
     *
     * // 以鼠标位置作为中心点将画布缩小0.9倍
     * canvas.zoomCanvas([event.clientX, event.clientY], 0.9)
     * ```
     */
    zoomCanvas(origin: null | [number, number], scale: number): void;

    /**
     * 将画布放缩到当前视窗中心点位置，并放缩到一个合适的比例
     * @example
     * ```
     * // 获取画布对象
     * const canvas = spr.getElementById('canvas-xxxxxx')
     *
     * // 将画布放置到视窗中心点并放缩到合适比例
     * canvas.zoomCanvasToCenter()
     * ```
     */
    zoomCanvasToCenter(): void;

    /**
     * 在画布中创建图层，opts 为空对象的情况下，图层的大小继承画布大小，[图层详细配置参数点击这里](https://www.yuque.com/khth0u/ngd5zk/ya7s6g#Xmbb9)
     * @param opts 创建图层使用的配置参数
     * @example
     * ```
     * // 获取画布对象
     * const canvas = spr.getElementById('canvas-xxxxxx')
     *
     * // 创建一个和画布一样大小的空图层
     * canvas.createLayer({})
     * ```
     */
    createLayer(opts: LayerOption): void;
  }

  class Layer extends Displayable {
    /**
     * 获取或设置图层是否被忽略的状态，被忽略的图层，对象在内存中存在，但 dom 节点没有实际挂载
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 获取图层的当前是否忽略状态
     * const ignore = layer.ignoreRendering
     * ```
     */
    ignoreRendering: boolean;

    /**
     * 设置图层是否忽略状态，和 ignoreRendering 属性一致，但该 API 只能设置不能获取。被忽略的图层只会在系统中创建对象，不会进行实际的渲染，因此不会占用渲染资源
     * @param value 是否忽略图层的布尔值
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 设置图层被忽略渲染
     * layer.setIgnore(true)
     * ```
     */
    setIgnore(value: boolean): void;

    /**
     * 将图层设置为和画布一样大小，这样设置与宽高继承画布的区别是：调用该函数设置后只能保持和当前画布大小一致，当画布再次变化大小后，需要手动再调用该函数；而宽高继承的含义是当前图层宽高值为 inherit，当画布大小变化，图层大小会跟着变化。
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 设置图层被忽略渲染
     * layer.reSizeToCanvas()
     * ```
     */
    reSizeToCanvas(): void;

    /**
     * 复制一个图层，并在画布中重建（粘贴）一个一样的图层
     * @param withChildren 是否复制此图层内部的元素，默认值 true
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 复制layer图层及其内部的容器，并在画布中重建
     * layer.duplicate()
     *
     * // 复制layer，不包含其内部的容器，并在画布中重建空一个一样的空图层
     * layer.duplicate(false)
     * ```
     */
    duplicate(withChildren?: boolean): void;

    /**
     * 导出图层的定义文件
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 导出图层的定义文件
     * layer.toJSON()
     * ```
     */
    toJSON(): Definition;

    /**
     * 销毁图层及图层下的所有资源
     * @example
     * ```
     * // 获取图层对象
     * const layer = spr.getElementById('layer-xxxxxx')
     *
     * // 导出图层的定义文件
     * layer.destroy()
     * ```
     */
    destroy(): Definition;

    createLayout(type: 'Free', opt?: BaseOption): Free;
  }

  class FreeContainer extends Displayable {
    /**
     * 设置或获取容器的距画布上侧距离，单位 px
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 设置ctn容器距画布顶部100px
     * ctn.top = 100
     * ```
     */
    top: number;

    /**
     * 设置或获取容器的距画布左侧距离，单位 px
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 设置ctn容器距画布左侧100px
     * ctn.left = 100
     * ```
     */
    left: number;

    /**
     * 设置或获取容器的在画布中的参照点位置，[使用 spray.tool 的枚举对象进行设置](https://www.yuque.com/khth0u/ngd5zk/hzqfhc#d3nnD)
     *
     * 1-9的 数字分别映到画布的上左，上中，上右，中左，中中，中右，下左，下中，下右 9 个点作为画布参照物
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 设置ctn容器的参照点位置
     * ctn.constraints = spray.tool.containerConstraints.TOPLEFT
     * ```
     */
    constraints: ValueOf<ContainerConstraints>;

    /**
     * 在已知的容器中放入文本组件，文本组件属于 Spray 自带的唯一组件，为了方便制作标题等场景使用。
     *
     * 扩展：对于一般的标题，使用 createText 效率会更高，对于样式过于炫酷，css 无法达到的文本效果，推荐将设计图标题文本切成图片，然后作为容器的背景图置入。
     * @param opts 创建文本所需的样式参数
     * @param data 可以直接是文本字符串也可以是{text: 'xxxx'}
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 常规文本控制的css样式写成对象形式即可。textStyle写的样式最终体现到包裹文本的外层div上
     * const textStyle = {
     *   color: '#ffffff',
     *   fontSize: '50px',
     *   fontFamily:'"Times New Roman",Georgia,Serif'
     *   paddingLeft: '20px'
     * }
     *
     * // 创建一个和画布一样大小的空图层
     * ctn.createText(textStyle, '这个是单行文本，不会换行的文本')
     * ```
     */
    createText(
      opts: Partial<CSSStyleDeclaration>,
      data: string | { text: string }
    ): Adapter;

    /**
     * 复制一个容器，并在当前容器所在的图层中重建（粘贴）
     * @param withChildren 是否复制此容器内部的元素，默认值 true
     * @example
     * ```
     * // 获取容器对象
     * const ctn = spr.getElementById('container-xxxxxx')
     *
     * // 复制ctn容器，并在容器所在图层中重建
     * ctn.duplicate()
     * ```
     */
    duplicate(withChildren: boolean): void;
  }

  /**
   * 自由布局
   */
  interface Free extends Displayable {
    createContainer(opts: FreeContainerOption): FreeContainer;
  }
}
