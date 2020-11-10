## 使用
#### 直接引用js文件
```
	// 访问https://github.com/3ccc/superlongjing
	// 使用dist文件夹下的jlongjing.min.js
	<script src="./dist/jlongjing.min.js"></script>
```
## 规范
|名称|字段|说明|
|--|--|--|
|返回码|code|值为0时，正常|
|数据|data|出参|
|异常信息|msg|code!=0时，返回该字段|

### 入参格式及类型
```
	{
		keyName1:'字符串', // 字符串
		keyName2:['数组'], // 数组
		keyName3:{key:''}, // 对象
		keyName2:true 	   // boolean
	}
```

### 出参格式及类型
```
	//成功
	{
		"code":0,
		"data":{
			"key1":value1，
			"key2":value2
		}
	}
	//失败
	{
		"code":-1,
		"msg":"错误信息"
	}
```
### js调用Native(应用调用app)
* 使用格式
```
	// fnName = 'reboot'  方法名称   string
	// data = {}  入参   jsonObject
	// callback  = function(){} 回调函数  function
	longjing.call(fnName,data,callback);
```
* 示例一:
```
	// 主动调用方法，无返回值
	longjing.call('reboot');  // 重启
```
* 示例二:
```
	// 主动调用方法，有返回值
	// app返回的是{code:0,data:{ip:'127.0.0.1'}};
	// longjing过滤出返回值中的data
	var terminalNo = longjing.call('config').ip;
```
* 示例三:
```
	// 主动调用方法，回调中返回
	// 回调返回的是{code:0,data:{url:'...'}};
	// longjing过滤出回调返回值中的data
	longjing.call('tts.speak',{text:'...'},function(res){
	   // 语音播放完毕后的回调处理
	   // todo ...
	})
```
### Native调用JS(app通知到应用)
* 使用格式
```
	// fnName = 'reboot'  方法名称   string
	// data = {}  入参   jsonObject
	// callback  = function(){} 回调函数  function
	longjing.register(fnName,data,callback);
```
示例一：
```
	longjing.register('websocketMsg',function(){
 
	});
```

## 介绍
### 概要
1. 小应用调用
1. 包括OS和外置设备(远期支持)，如读卡器

## 方法名称
### 获取app号(getAppId)
* 输入:无
* 输出：
|名称|字段|类型|可选|说明|
|--|--|--|--|--|
|app的id|id|string|N|说明|
* 使用示例：
```
let appid = longjing.call('getAppId');
```
### 读取配置(readConfig)
* 输入:无
* 输出：
|名称|字段|类型|可选|说明|
|--|--|--|--|--|
|内容|content|JSON Object|N|说明|
* 使用示例：
```
let config = longjing.call('readConfig');
```

### 写入配置(writeConfig)

* 输入:

|名称|字段|类型|可选|说明|
|--|--|--|--|--|
|内容|content|JSON Object|N|说明|

* 输出：无

* 使用示例：
```
longjing.call('writeConfig',{content:'配置内容'});
```

### 加载成功(loadSuccess)

* 输入:无
* 输出：无

* 使用示例：
```
longjing.call('loadSuccess');
```

### 语音(tts)

#### 合成播放(speak)
* 输入:

|名称|字段|类型|可选|说明|
|--|--|--|--|--|
|文本|text|string|N|需要语音叫号的内容|

* 输出：异步输出

* 使用示例：
```
longjing.call('tts.speak',{text:'需要语音叫号的内容'},function(){
	// 语音叫号完毕后的处理
});
```

### 只读配置(config)

* 只读配置

|名称|	字段|	类型|	说明|
|--|--|--|--|
|设备号|	deviceNumber|	string|同时是：终端号、屏幕号|
|商户号|	sellerId|	string|	|
|网点号|	pointNo|	string|	|
|小应用号|	appId	|string|	|

* 使用示例：
```
let deviceNumber = longjing.config('deviceNumber');
```
