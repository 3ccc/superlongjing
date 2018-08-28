window.tianshan = (function () {
    var _space = '_lj_app_test_env_';
    var _cookie = {
        config: 'config'
    };

    var _utils = {
        setCookie: function (cookieName, data, minutes) {
            var cookieData = {
                data: data
            };
            this.removeCookie(cookieName);
            if (!!minutes) {
                cookieData.beginTime = (new Date()).getTime();
                cookieData.effectiveMin = minutes;
            }
            window.localStorage.setItem(cookieName, JSON.stringify(cookieData));
        },
        getCookie: function (cookieName, keyName) {
            // 传入的cookieName必须存在
            var self = this;
            if (!(typeof cookieName == 'string' || typeof cookieName == 'number')) return null;
            var _ls = window.localStorage.getItem(cookieName);
            var res = null;
            if (_ls != null) { // 存在指定的本地存储
                var _ls_data = JSON.parse(_ls).data; //  存储的实际内容
                var endTime = (new Date()).getTime();
                if (!!_ls.beginTime && !!_ls.effectiveMin) {  // 存储内容存在开始时间和有效时长
                    if (self.getDateInterval(_ls.beginTime, endTime, 'minutes') > parseInt(_ls.effectiveMin)) {
                        self.removeCookie(cookieName); // 存储超期，直接删除
                        res = null;
                    } else {
                        res = _ls_data;
                    }
                } else {
                    res = _ls_data;
                }
            }
            return keyName ? (res ? res[keyName] : null) : res;
        },
        removeCookie: function (cookieName) {
            window.localStorage.removeItem(cookieName);
        },
        getDateInterval: function (beginTime, endTime, type) {
            if (typeof type == 'undefined') {
                return;
            }
            beginTime = parseInt(beginTime);
            endTime = parseInt(endTime);
            switch (type) {
                case 'day':
                    return Math.abs(endTime - beginTime) / 1000 / 60 / 60 / 24;
                case 'hour':
                    return Math.abs(endTime - beginTime) / 1000 / 60 / 60;
                case 'minutes':
                    return Math.abs(endTime - beginTime) / 1000 / 60;
                case 'seconds':
                    return Math.abs(endTime - beginTime) / 1000;
                default:
                    break;
            }

        }
    };

    function getReturn(data) {
        return JSON.stringify({"code": 0, "data": data})
    }

    function readConfig() {
        return {content: _utils.getCookie(_space + _cookie.config)}
    }

    function writeConfig(data) {
        _utils.setCookie(_space + _cookie.config, data);
    }

    function readFile(data){
        switch(data.path){
            case 'sys/client.json':
                return {content:{
                    clientNumber:'TEST_clientNumber_001',
                    sellerId:'TEST_sellerId_001',
                    pointNo:'TEST_pointNo_001'
                }};
                break;
            default:
                return {content:null};
                break;
        }
    }

    function _alert(msg){
        alert(msg);
    }

    function executeFn(opts) {
        var data = opts.data;
        switch (opts.fn) {
            case 'readFile':
                return getReturn(readFile(data));
            case 'readConfig':
                return getReturn(readConfig());
            case 'writeConfig':
                writeConfig(data.content);
                break;
            case 'getAppId':
                return getReturn('TEST_APP_ID_001');
            case 'open':
                if(data.url){
                    _alert('打开页面'+data.url+'成功');
                    window.open(data.url);
                }else{
                    _alert('打开页面传递参数有误');
                }
                break;
            case 'quit':
                _alert('调用退出当前页面方法成功');
                if(data && data.url){
                    _alert('更改主页的地址为：'+data.url+'成功。');
                }
                window.close();
                break;
            case 'refresh':
                if(data.path){
                    _alert('刷新指定页面'+data.path+'成功');
                }else{
                    _alert('刷新指定页面传递参数错误');
                }
                break;
            case 'upgrade':
                if(data.url){
                    _alert('调用升级方法，升级'+data.url+'成功');
                }else{
                    _alert('升级传递参数有误');
                }
                break;
            case 'setQuitTime':
                if(data.time){
                    _alert(data.time+'s,无操作退出子容器执行成功');
                }else{
                    _alert('指定时长无操作退出子容器参数有误');
                }
                break;
            case 'notifyMainPage':
                _alert('刷新主容器页面成功');
                break;
            case 'ttsSpeak':
                _alert('id:'+data.id+'，语音：'+data.text);
                break;
            default:
                break;
        }
    }

    return {
        invokeApp: function (opts) {
            try {
                opts = JSON.parse(opts);
                var res = executeFn(opts);
                if(res){
                    console.log('invokeapp res =>',res,typeof res,JSON.parse(res));
                    return res;
                }
            } catch (e) {
                alert('传递的参数不合法,参数为：' + opts)
            }
        }
    }
})();