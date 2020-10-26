//判断是否是数组
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

// 是否是json对象
function isJson(obj) {
    return typeof (obj) == "object" && (isArray(obj) || Object.prototype.toString.call(obj).toLowerCase() == "[object object]");
}

//  number  function  string object undefined  boolean
//  处理字符串json 或者 字符串数组
function parseJson(data) {
    if (typeof data == 'undefined' || data == null) {
        return null;
    } else if (isJson(data)) {
        return data;
    } else {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.log('bridge parseJson function is fail.', e);
            return data;
        }
    }
}

function toStringify(obj) {
    var result = '';
    try {
        result = typeof obj == 'string' ? obj : JSON.stringify(obj);
    } catch (e) {
        console.log('bridge stringify发生异常，stringify的数据为：', obj);
    }
    return result;
}

export default {
    isArray: isArray,
    isJson: isJson,
    parseJson: parseJson,
    toStringify:toStringify
}