/*
 * @Description:
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-02-26 10:18:55
 * @LastEditors: yls
 * @LastEditTime: 2022-03-04 18:20:26
 */
export {};
declare global {
    interface uino {
        effect: any;
        loadDevice: any;
        level: import('e:/projects/优锘/xxv-cli/src/views/commonJs/event/levelChange').default;
        thing: { select: null; };
        $campus: any;
        campus:any;
        currentSelect: string;
        customCamera: any;
        iSPlayAnim: any;
        sceneId: any;
        sceneInfo: any;
        partitionId: any;
        currentDevice: any;
        canSaveDeviceView: any;
        app: any
    }
    interface THING {
        factory: any;
        LoopType: any;
        Thing: any;
        Math: any;
        EventTag: any;
        EventType: any;
        EffectThemeControl:any;
        App:any;
        BaseObject:any
    }
    interface config {
        // [propName:string]:any
        appApi:string;
        wsApi:string;
        previewModelUrl:string;
        previewSceneURL:string;
        downloadUrl:string;
        mockUrl:string;
        previewUrl:string;
    }

    const uino: uino;
    const THING: THING;
    const config: config;

}
