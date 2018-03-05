window.ljTsEventAction = {};
window.onTsEvent = function () {
    var opts;
    switch(arguments.length){
        case 1:
            opts = JSON.parse(arguments[0]);
            if (typeof ljTsEventAction[opts.fn] == 'function')
                ljTsEventAction[opts.fn](opts.data);
            break;
        case 2:
            if (typeof ljTsEventAction[arguments[0]] == 'function')
                ljTsEventAction[arguments[0]](arguments[1]);
            break;
        default:
            break;
    }
};


window.driver = (function () {
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
                console.log(getInvokeOpts(fnName, options), 'tianshan return data is not json format', e);
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
        test:function(){
            return 'driver is ok';
        },
        // 获取应用号
        getAppID: function () {
            return  invokeApp('getAppId', true);
        },
        // 获取当前webview窗口类型
        // 返回 main 主窗口  inner 子窗口
        getPageType: function(){
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
        open:function(options){
            invokeApp('open', options);
        },
        // 退出当前的webview
        quit:function(){
            invokeApp('quit');
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
        // 添加或者修改指定应用的本地配置
        // {content:'json字符串格式的config配置'}
        writeConfig: function (options) {
            invokeApp('writeFile', options);
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
                if(opts.callback)opts.callback(opts);
                if(opts.callbackFn)opts.callbackFn(opts);
                if(opts.fn)opts.fn(opts);
            } else {
                return null;
            }
        }
    }
})();


var ljClient = {
    getDeviceNumber: function () { // 获取设备号
        return this.get().clientNumber || null;
    },
    getSellerId: function () { // 获取商户号
        return this.get().sellerId || null;
    },
    getPointNo:function(){ // 获取网点号
        return this.get().pointNo|| null;
    },
    get: function () {
        var res = driver('readFile', {path: 'sys/client.json'}) || {};
        var result = {};
        try {
            result = JSON.parse(res.content);
        } catch (e) {
            result = res.content || {}
        }
        return result;
    }
};

var appID = driver('getAppID');

window.longjing = {
    test:function(){
        return 'hello world'
    },
    config:function(){ // todo 同步还是异步
        var set = function(){
            var config = get();
            var arg0 = arguments[0];
            if(typeof  arg0 == 'object'){
                for(var name in arg0){
                    config[name] = arg0[name];
                }
            }else{
                config[arg0] = arguments[1];
            }
            driver('writeConfig', {content: JSON.stringify(config)});
        };
        var get = function(attrName){
            var config = driver('readConfig') || {};
            var jsonConfig = {};
            try {
                jsonConfig = JSON.parse(config).content;
            } catch (e) {
                jsonConfig = config.content || {}
            }
            if (attrName) {
                switch(attrName){
                    case 'deviceNumber': //  终端号  设备号
                        return ljClient.getDeviceNumber();
                    case 'sellerId': // 商户号
                        return ljClient.getSellerId();
                    case 'pointNo': //  网点号
                        return ljClient.getPointNo();
                    case 'appid':// 应用号
                        return appID;
                    default:
                        return jsonConfig[attrName] || null;
                }

            }
            return jsonConfig;
        };
        switch(arguments.length){
            case 2:
                set(arguments[0],arguments[1]);
                break;
            case 1:
                if(typeof arguments[0] == 'object'){
                    set(arguments[0]);
                }
                if(typeof arguments[0] == 'string'){
                    return get(arguments[0]);
                }
                break;
            case 0:
                return get();
            default:break;
        }
    },
    open: function (options) {
        driver('open', {url: options.path});
    },
    quit: function () {
        driver('quit');
    },
    refresh:function(path){
        driver('refresh',{path:path});
    },
    upgrade: function (options) {
        driver('upgrade', {url: options.url});
        this.ts('upgradeResult',function(){
            driver('restart');
        });
    },
    ts:function(name,fn,options){
        ljTsEventAction[name] = function (res) {
            if(fn)fn(res,options);
        };
    },
    ready:function(fn){ // todo config是否异步通知，设置完成后执行
        fn();
    }
};
