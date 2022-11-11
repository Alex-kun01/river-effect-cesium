// host配置
const HOST = 'basex.uino.com'; // 接口服务
// const HOST = window.location.host; // 接口服务
const config = {
    appApi: `http://${HOST}/gateway`,
    wsApi: `ws://${HOST}/gateway/basex/webSocket`,
    tenantCode: 'ZJK', // 租户信息
    previewModelUrl: `http://${HOST}/resource/`,
    previewSceneURL: `http://${HOST}/resource/scene/`,
    downloadUrl: `http://${HOST}/temp/`,
    mockUrl:'',
    previewUrl: `http://${HOST}/`,
};

window.config = config;