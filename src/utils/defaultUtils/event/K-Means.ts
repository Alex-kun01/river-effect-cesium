class kMeans {
    markerItem: any;
    markerElement: any;
    constructor() {
        this.markerItem = {};
        this.markerElement = {};
        this.init();
        this.addMarkerEvent();
    }
    // 寻找是否超过平均距离的点
    findTag(item: any, tagArr: any) {
        let index = -1;
        for (let i = 0; i < tagArr.length; i++) {
            const dis = this.getDis(item.position, tagArr[i].item.position);
            if (dis * tagArr[i].fm <= tagArr[i].fz) {
                index = i;
                break;
            }
        }
        return index;
    }
    getDis(item1: any, item2: any) {
        return Math.abs(THING.Math.getDistance(item1, item2));
    }
    getTag(arr: any) {
        const tagArr = [];
        const farArr = [];
        while (arr.length > 1) {
            const fm = arr.length;
            let fz = -1;
            let fzi = -1;
            for (let i = 0; i < fm; i++) {
                let dis = 0;
                for (let j = 0; j < fm; j++) {
                    if (i !== j) {
                        dis = dis + this.getDis(arr[i].position, arr[j].position);
                    }
                }
                if (i === 0) {
                    fz = window.kmeans.markerDistance;
                    fzi = 0;
                } else if (fz > dis) {
                    fz = window.kmeans.markerDistance;
                    fzi = i;
                }
            }
            const tag = {
                item: arr.splice(fzi, 1)[0],
                fz: fz,
                fm: fm,
                child: <any[]>[]
            };
            const index = this.findTag(tag.item, tagArr);
            if (index === -1) {
                tagArr.push(tag);
            } else {
                tagArr[index].child.push(tag.item);
            }
        }
        for (let i = 0; i < arr.length; i++) {
            const index = this.findTag(arr[i], tagArr);
            if (index === -1) {
                farArr.push(arr[i]);
            } else {
                tagArr[index].child.push(arr[i]);
            }
        }
        return { tagArr, farArr };
    }
    forMartArr(markers: any) {
        markers.forEach((element: any) => {
            if (element.length > 0) {
                const arr: any = [];
                element.forEach((ele: any) => {
                    arr.push(ele);
                });
                this.markerItem = element[0];
                if (element[0].element) {
                    const div = document.createElement('div');
                    div.innerHTML = element[0].element.innerHTML;
                    this.markerElement.element = div;
                } else {
                    this.markerElement.url = element[0].url;
                }
                const forMartPoint = this.getTag(arr);
                const far = forMartPoint.farArr;
                const tag = forMartPoint.tagArr;
                // TODU: 需要将点聚合的坐标多个坐标点求中心点
                if (far.length > 0) {
                    this.creatMarker(far, 'far');
                }
                if (tag.length > 0) {
                    this.creatMarker(tag, 'tag');
                }
            }
        });
    }
    creatMarker(point: any, type: any) {
        point.forEach((element: any) => {
            const marker = window.uino.app.create({
                type: 'Marker',
                name: `Marker-copy-${this.markerItem.name}`,
                element: this.markerElement.element,
                url: this.markerElement.url,
                position: type == 'far' ? element.position.copyPosition : element.item.position.copyPosition,
                parent: this.markerItem.parent,
                keepSize: this.markerItem.keepSize,
                style: {
                    alwaysOnTop: this.markerItem.style.alwaysOnTop
                },
                size: this.markerItem.size,
                inheritStyle: this.markerItem.inheritStyle,
                inheritScale: this.markerItem.inheritScale,
                inheritVisible: this.markerItem.inheritVisible,
                visible: false,
                userData: this.markerItem.userData,
                complete: (e: any) => {
                    setTimeout(() => {
                        e.object.visible = true;
                    }, 0);
                }
            }).on('click', (e: any) => {
                if (e.button === 0) {
                    const flyMarker = type == 'far' ? element : element.item;
                    if (e.object.parent.type === window.uino.app.level.current.type || window.uino.app.level.current.type === 'Floor') {
                        window.uino.customCamera.cameraFlyToObj({
                            object: flyMarker.parent,
                            offset: [1500, 1500, 1500]
                        });
                    } else {
                        const floor = this.checkFloor(e.object);
                        window.uino.level.changeLevel(floor, () => {
                            window.uino.customCamera.cameraFlyToObj({
                                object: flyMarker.parent,
                                offset: [1500, 1000, 1000]
                            });
                        });
                    }
                }
            }, 'copyMarkerClick');
            // url创建或Element创建
            if (element.fz) {
                let size = 1;
                element.child.forEach(() => {
                    size += 1;
                });
                marker.element.children[0].children[0].innerText = size > 0 ? size : '';
                // TODU: 根据需要进行修改element头部聚合样式
            } else {
                marker.element.children[0].children[0].innerText = '';
                // TODU: 根据需要进行修改element头部聚合样式
            }
        });
    }
    checkFloor(obj: any) {
        if (obj.parent.type != window.uino.app.level.current.type) {
            obj = this.checkFloor(obj.parent);
        }
        return obj;
    }
    init() {
        if (window.uino.app.query(/Marker-copy-/).length > 0) {
            window.uino.app.query(/Marker-copy-/).destroy();
        }
        if (window.uino.app.camera.distance < window.kmeans.startDistance) return;
        const markerNames: any = [];
        window.uino.app.query('.Marker').forEach((element: any) => {
            if (markerNames.indexOf(element.name) == -1 && window.kmeans.kmeansFilter.indexOf(element.name) == -1) {
                markerNames.push(element.name);
            }
        });
        for (let index = 0; index < markerNames.length; index++) {
            const markers = [];
            markers.push(window.uino.app.query(new RegExp(markerNames[index])));

            if (markers.length > 0) {
                markers.forEach(element => {
                    element.forEach((item: any) => {
                        item.visible = false;
                    });
                });
                this.forMartArr(markers);
            } else {
                return;
            }
        }
    }
    addMarkerEvent() {
        // 写在聚合事件
        window.uino.app.off(THING.EventType.CameraChange, null, 'markerPolymerize');
        // 加入聚合事件
        window.uino.app.on(THING.EventType.CameraChange, () => {
            if (window.uino.app.camera.distance > window.kmeans.startDistance) {
                if (window.uino.app.query(/Marker-copy-/).length > 0) {
                    return;
                } else {
                    this.init();
                }
            } else {
                if (window.uino.app.query(/Marker-copy-/).length > 0) {
                    window.uino.app.query(/Marker-copy-/).destroy();
                }
                window.uino.app.query('.Marker').forEach((element: any) => {
                    if (element.name.includes('deviceMarker_') || element.name.includes('areaMarker_')) {
                        let selfVisible = true;
                        if (element.userData) {
                            selfVisible = element.userData.selfVisible || typeof element.userData.selfVisible !== 'boolean';
                        }
                        element.visible = selfVisible;
                    }
                });
                window.uino.app.markerCurrentLevel = undefined;
            }
        }, 'markerPolymerize');
    }
}

export default kMeans;
