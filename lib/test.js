window.local = {};
window.tianshan= {
    invokeApp:function(opts){
        opts = JSON.parse(opts);
        switch(opts.fn){
            case 'readConfig':
                return  JSON.stringify({code:0,data:{content:(window.local['writeConfig']||null)}});
            case 'writeConfig':
                window.local['writeConfig'] = opts.data.content;
                break;
            case 'getAppId':
                return JSON.stringify({code:0,data:'TESTID001'});
            default:
                break;
        }
    }
};