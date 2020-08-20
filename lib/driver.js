window.ljTsEventAction = {};
window.onTsEvent = function () {
    var opts;
    switch (arguments.length) {
        case 1:
            opts = typeof arguments[0] == 'string' ? JSON.parse(arguments[0]) : arguments[0];
            if (typeof ljTsEventAction[opts.fn] == 'function'){
                if(opts.code == 0){
                    ljTsEventAction[opts.fn](opts.data);
                }else{
                    ljTsEventAction[opts.fn](opts);
                }
            }
            break;
        case 2:
            if (typeof ljTsEventAction[arguments[0]] == 'function')
                ljTsEventAction[arguments[0]](arguments[1]);
            break;
        default:
            break;
    }
};

module.exports = (function () {
    var getInvokeOpts = function (fnName, options) {
        if (options) {
            return JSON.stringify({"fn": fnName, "data": options});
        }
        return JSON.stringify({"fn": fnName});
    };
    var invokeApp = function () {
        var fnName = arguments[0],
            options = typeof arguments[1] == 'object' ? arguments[1] : null,
            isRes = typeof arguments[1] == 'object' ? arguments[2] === true : arguments[1] === true;
        var result = null;
        if (isRes) { // 方法执行后有返回值
            try {
                result = JSON.parse(window.tianshan.invokeApp(getInvokeOpts(fnName, options)));
                return (typeof result.code != 'undefined') ? (result.code == 0 ? (result.data || {}) : result) : result;
            } catch (e) {
                console.log(getInvokeOpts(fnName, options), window.tianshan.invokeApp(getInvokeOpts(fnName, options)), 'tianshan return data is not json format', e);
                return result;
            }
        } else { // 方法执行后 无返回值
            try {
                window.tianshan.invokeApp(getInvokeOpts(fnName, options));
            } catch (e) {
                console.log('app run function has error', getInvokeOpts(fnName, options), e)
            }
        }
    };
    var tsDriver = {
        test: function () {
            return 'driver is ok';
        },
        // 获取应用号
        getAppID: function () {
            return invokeApp('getAppId', true);
        },
        // 获取当前webview窗口类型
        // 返回 main 主窗口  inner 子窗口
        getPageType: function () {
            return invokeApp('getPageType', true);
        },
        // 重启当前webview
        restart: function () {
            invokeApp('restart')
        },
        // 应用升级
        // {url:'升级url'}
        upgrade: function (options) {
            invokeApp('upgrade', options);
        },
        // 打开一个新的webview
        // {url:'要打开的应用路径'}
        open: function (options) {
            invokeApp('open', options);
        },
        // 退出当前的webview
        quit: function (options) {
            invokeApp('quit', options);
        },
        // 读取指定路径的文件
        // ｛path:'所读文件的路径'｝
        readFile: function (options) {
            return invokeApp('readFile', options, true);
        },
        // 读取指定应用的本地配置
        readConfig: function () {
            return invokeApp('readConfig', true);
        },
        getAppVersion:function(){
            return invokeApp('getAppVersion',true)
        },
        // 添加或者修改指定应用的本地配置
        // {content:'json字符串格式的config配置'}
        writeConfig: function (options) {
            invokeApp('writeConfig', options);
        },
        // 设置无操作时间，并达到该时间退出
        // {time:'最长无操作时间'}
        setQuitTime: function (options) {
            invokeApp('setQuitTime', options);
        },
        // 通知主webview刷新
        notifyMainPage: function () {
            invokeApp('notifyMainPage');
        },
        // 通知主webview刷新
        ttsSpeak: function (options) {
            invokeApp('ttsSpeak', options);
        },
        loadSuccess: function (options) {
            invokeApp('loadSuccess', options);
        },
        loaded: function () {
            invokeApp('loaded');
        },
        // 创建定时器，以秒为单位
        createTimerTask: function (options) {
            invokeApp('createTimerTask',options);
        },
        // 停止定时器
        stopTimerTask: function (options) {
            invokeApp('stopTimerTask',options);
        },
        changeLed:function(options){
            invokeApp('changeLed',options);
        },
        getDriverVersion:function(){
            return invokeApp('getDriverVersion',true);
        },
        printV1:function(options){
             invokeApp('printV1',options);
        },
        printV2:function(options){
            invokeApp('printV2',options);
        },
        compareFace1V1:function(options){
            return invokeApp('compareFace1V1',options,true);
        },
        // 以下添加新api
        openCameraPreview:function(options){
            invokeApp('openCameraPreview',options);
        },
        closeCameraPreview:function(){
            invokeApp('closeCameraPreview');
        },
        takePicture:function(options){
            return invokeApp('takePicture',options,true);
        },
        startFaceComparison:function(options){
            invokeApp('startFaceComparison',options);
        },
        stopFaceComparison:function(){
            invokeApp('stopFaceComparison');
        },
        connectPrinter:function(options){
            return invokeApp('connectPrinter',options,true);
        },
        printTec:function(options){
            invokeApp('printTec',options);
        }
    };
    return function (name, opts) {
        if (!!tsDriver[name]) {
            if (typeof tsDriver[name] == 'function') {
                return tsDriver[name](opts);
            } else {
                return tsDriver[name];
            }
        } else {
            if (!!opts) {
                if (opts.callback)opts.callback(opts);
                if (opts.callbackFn)opts.callbackFn(opts);
                if (opts.fn)opts.fn(opts);
            } else {
                return null;
            }
        }
    }
})();