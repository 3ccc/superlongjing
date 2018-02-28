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
                console.log(getInvokeOpts(fnName, options), 'tianshan return data is not json format', e);
                return result;
            }
        } else { // 方法执行后 无返回值
            try {
                window.tianshan.invokeApp(getInvokeOpts(fnName, options));
            } catch (e) {
                console.log('app run function has error', getInvokeOpts(fnName, options), c, e)
            }
        }
    };
    var tsDriver = {
        test:function(){
            return 'driver is ok';
        },
        getAppID: function () {
            return  invokeApp('getAppId', true);
        },
        restart: function () {
            invokeApp('restart')
        },
        upgrade: function (options) {
            invokeApp('upgrade', options);
        },
        writeFile: function (options) {
            invokeApp('writeFile', options);
        },
        readFile: function (options) {
            return invokeApp('readFile', options, true);
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