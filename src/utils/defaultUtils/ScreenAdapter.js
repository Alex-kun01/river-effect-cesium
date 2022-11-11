/*
 * @Description: 屏幕适配
 * @Version: 1.0
 * @Autor: hasaiki
 * @Date: 2021-08-19 11:34:31
 * @LastEditors: hasaiki
 * @LastEditTime: 2022-05-06 18:07:31
 */
export default class ScreenAdapter {
    constructor(width, height, bgColor) {
        this.width = width || 1920;
        this.height = height || 1080;
        this.bgColor = bgColor || '#fff';
        this.x = undefined;
        this.y = undefined;
        this.bodyScale = 1;
        this.altDown = false;
        this.spaceDown = false;
        this.dbSpaceTime = new Date().getTime();
    }

    init() {
        this.initScreenAdapter();
        this.initScreenScale();
        this.initScale();
        window.onresize = () => {
            this.init();
        };
    }

    initScreenScale() {
        const that = this;
        document.body.style.position = 'relative';
        document.body.style.left = '0px';
        this.bodyScale = window.scale ||
            document.body.getBoundingClientRect().width / document.body.clientWidth;

        document.onkeydown = (e) => {
            // 监听alt
            if (e.key === 'Alt') {
                e.preventDefault();
                // document.body.style.transformOrigin = `${e.x} ${e.y} 0`;
                document.body.style.overflow = 'hidden';
                document.body.style.pointerEvents = 'none';
                that.altDown = true;
            }
            // 监听空格
            if (e.key === ' ') {
                e.preventDefault();
                if (that.spaceDown) {
                    return;
                }
                document.body.style.pointerEvents = 'none';
                const now = new Date().getTime();
                if (now - that.dbSpaceTime < 500) {
                    document.body.style.transform = `scale(${window.scale},${window.scale})`;
                    document.body.style.left = '0';
                    document.body.style.top = '0';
                    if (window.innerHeight > document.body.getBoundingClientRect().height) {
                        document.body.style.top = `${(window.innerHeight -
                            document.body.getBoundingClientRect().height) /
                            2
                        }px`;
                    }
                    if (window.innerWidth > document.body.getBoundingClientRect().width) {
                        document.body.style.left = `${(window.innerWidth -
                       document.body.getBoundingClientRect().width) /
                       2
                        }px`;
                    }
                    that.bodyScale = window.scale;
                }
                that.dbSpaceTime = now;
                that.spaceDown = true;
            }
        };
        document.onkeyup = (e) => {
            if (e.key === 'Alt') {
                document.body.style.overflow = 'auto';
                document.body.style.pointerEvents = 'all';
                that.altDown = false;
            }
            // 监听空格
            if (e.key === ' ') {
                that.spaceDown = false;
                // 清除上次滚动
                that.x = undefined;
                that.y = undefined;
                document.body.style.pointerEvents = 'all';
                document.onmouseup = null;
                document.onmousemove = null;
            }
        };
        document.onmouseleave = () => {
            that.altDown = false;
        };
        document.onwheel = (e) => {
            if (that.altDown) {
                if (e.deltaY < 0 && that.bodyScale < 2.0) {
                    that.bodyScale += 0.04;
                    document.body.style.transform = `scale(${that.bodyScale},${that.bodyScale})`;
                } else if (e.deltaY > 0 && that.bodyScale > 0.01) {
                    that.bodyScale -= 0.04;
                    document.body.style.transform = `scale(${that.bodyScale},${that.bodyScale})`;
                }
            }
        };
        // 拖拽处理
        document.onmousedown = (e)=>{
            if (e.button === 0 && this.spaceDown) {
                this.x = e.screenX;
                this.y = e.screenY;
                document.onmousemove = (e)=>{
                    this.moveHanlder(e);
                };
            }
            document.onmouseup = ()=>{
                document.onmouseup = null;
                document.onmousemove = null;
            };
        };
        // document.onmousemove = ScreenAdapter.throttle.call(this, this.moveHanlder.bind(this), 50);
    }

    initScreenAdapter() {
        const scaleResult = ScreenAdapter.getResolution(this.width, this.height);
        const { scaleValue, scaleFor } = scaleResult;
        // 调整字体
        const html = document.getElementsByTagName('html')[0];
        // 设置body的尺寸
        const { body } = document;
        // 设置html的height:100%,以免过大body height撑大html出现滚动条
        html.style.height = '100%';
        // 计算页面需要缩放的级别
        window.scale = scaleValue; // window.screen.width / this.width;//window.outerWidth / this.width;
        body.style.backgroundColor = this.bgColor;
        body.style.top = '0px';
        body.style.left = '0px';
        body.style.width = `${this.width}px`;
        body.style.height = `${this.height}px`;
        body.style.transformOrigin = 'left top';
        if (this.autoTo) {
            body.style.transform = `scale(${window.scale},${window.scale})`;
            if (scaleFor === 'w') {
                body.style.top = `${(window.innerHeight - body.getBoundingClientRect().height) / 2}px`;
            } else if (scaleFor === 'h') {
                body.style.left = `${(window.screen.width - body.getBoundingClientRect().width) / 2}px`;
            }
        }
    }

    initScale() {
        // 初始化缩放
        document.body.style.transform = `scale(${window.scale},${window.scale})`;
        document.body.style.left = '0';
        document.body.style.top = '0';
        if (window.innerHeight > document.body.getBoundingClientRect().height) {
            document.body.style.top = `${(window.innerHeight -
             document.body.getBoundingClientRect().height) /
             2
            }px`;
        }
        if (window.innerWidth > document.body.getBoundingClientRect().width) {
            document.body.style.left = `${(window.innerWidth -
           document.body.getBoundingClientRect().width) /
           2
            }px`;
        }
        this.bodyScale = window.scale;
    }

    static getResolution(w, h) {
        const fw = w / window.screen.width;
        const fh = h / window.innerHeight;
        if (fh >= fw) {
            return { scaleValue: 1 / fh, scaleFor: 'h' };
        }
        return { scaleValue: 1 / fw, scaleFor: 'w' };
    }

    moveHanlder(e) {
        if (this.x === undefined || this.y === undefined) {
            this.x = e.screenX;
            this.y = e.screenY;
            return;
        }
        document.body.style.left = `${parseInt(document.body.style.left, 10) + (e.screenX - this.x)}px`;
        document.body.style.top = `${parseInt(document.body.style.top, 10) + (e.screenY - this.y)}px`;
        this.x = e.screenX;
        this.y = e.screenY;
    }

    // 节流
    static throttle(fn, delay) {
        let timer = null;
        // 标志是否可以执行函数
        let flag = true;
        return (...args) => {
            if (!flag) return;
            if (!this.spaceDown) return;
            if (timer) clearTimeout(timer);
            flag = false;
            timer = setTimeout(() => {
                fn(...args);
                flag = true;
            }, delay);
        };
    }

    // 防抖
    static debounce(fn, delay) {
        let timer;
        return (...args) => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    }
}
