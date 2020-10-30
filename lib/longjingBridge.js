var  utils = require('./utils');

var bridge = {
    default: this,// for typescript
    call: function (method, args, cb) {
        var ret = '';
        if (typeof args == 'function') {
            cb = args;
            args = {};
        }
        var arg = {data: (args === undefined ? null : args)};
        if (typeof cb == 'function') {
            var cbName = 'dscb' + window.dscb++;
            window[cbName] = cb;
            arg['_dscbstub'] = cbName;
        }
        arg = utils.toStringify(arg);

        //if in webview that dsBridge provided, call!
        if (window._dsbridge) {
            ret = _dsbridge.call(method, arg)
        } else if (window._dswk || navigator.userAgent.indexOf("_dsbridge") != -1) {
            ret = prompt("_dsbridge=" + method, arg);
        }

        return utils.parseJson(ret || '{}').data
    },
    register: function (name, fun, asyn) {
        var q = asyn ? window._dsaf : window._dsf;
        if (!window._dsInit) {
            window._dsInit = true;
            //notify native that js apis register successfully on next event loop
            setTimeout(function () {
                bridge.call("_dsb.dsinit");
            }, 0)
        }
        if (typeof fun == "object") {
            q._obs[name] = fun;
        } else {
            q[name] = fun;
        }
    },
    registerAsyn: function (name, fun) {
        this.register(name, fun, true);
    },
    hasNativeMethod: function (name, type) {
        return this.call("_dsb.hasNativeMethod", {name: name, type: type || "all"});
    },
    disableJavascriptDialogBlock: function (disable) {
        this.call("_dsb.disableJavascriptDialogBlock", {
            disable: disable !== false
        });
    }
};

!function () {
    if (window._dsf) return;
    var _close = window.close;
    var ob = {
        //保存JS同步方法
        _dsf: {
            _obs: {}
        },
        //保存JS异步方法
        _dsaf: {
            _obs: {}
        },
        dscb: 0,
        longjing: bridge,
        close: function () {
            if (bridge.hasNativeMethod('_dsb.closePage')) {
                bridge.call("_dsb.closePage");
            } else {
                _close.call(window);
            }
        },
        _handleMessageFromNative: function (info) {
            var arg = utils.parseJson(info.data);
            var ret = {
                id: info.callbackId,
                complete: true
            }
            var f = this._dsf[info.method];
            var af = this._dsaf[info.method];

            var callSyn = function (f, ob) {
                ret.data = f.call(ob, arg);
                bridge.call("_dsb.returnValue", ret);
            }
            var callAsyn = function (f, ob) {
                arg.push(function (data, complete) {
                    ret.data = data;
                    ret.complete = complete !== false;
                    bridge.call("_dsb.returnValue", ret);
                })
                f.call(ob, arg);
            }
            if (f && f != 'undefined' && f != 'null') {
                callSyn(f, this._dsf);
            } else if (af && af != 'undefined' && af != 'null') {
                callAsyn(af, this._dsaf);
            } else {
                //with namespace
                var name = info.method.split('.');
                if (name.length < 2) return;
                var method = name.pop();
                var namespace = name.join('.');
                var _obs = this._dsf._obs;
                var _ob = _obs[namespace] || {};
                var m = _ob[method];
                if (m && typeof m == "function") {
                    callSyn(m, _ob);
                    return;
                }
                _obs = this._dsaf._obs;
                _ob = _obs[namespace] || {};
                m = _ob[method];
                if (m && typeof m == "function") {
                    callAsyn(m, _ob);
                    return;
                }
            }
        }
    }
    for (var attr in ob) {
        window[attr] = ob[attr];
    }
    bridge.register("_hasJavascriptMethod", function (method, tag) {
        var name = method.split('.');
        if (name.length < 2) {
            return !!(_dsf[name] || _dsaf[name])
        } else {
            // with namespace
            var method = name.pop();
            var namespace = name.join('.')
            var ob = _dsf._obs[namespace] || _dsaf._obs[namespace];
            return ob && !!ob[method];
        }
    })
}();

module.exports =  bridge;