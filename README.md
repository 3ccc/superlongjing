## 使用
#### npm安装
```
npm install superlongjing
npm run build
文件夹在 dist/jlongjing.min.js
```
#### 直接引用js文件
```
下载git后，使用dist文件夹下的jlongjing.min.js
<script src="./dist/jlongjing.min.js"></script>
```
## 介绍
### 概要
小应用调用
包括OS和外置设备(远期支持)，如读卡器
### 窗口
主窗口：软件的主窗口
子窗口：通过主窗口新开的子窗口，新窗口是全屏显示的
屏保窗口：无操作时出来的子窗口
### 方法
窗口发起的函数
#### 升级(upgrade)
升级小应用(离线小应用可以，在线小应用无需升级)，升级后重启小应用后生效。

```
var updateZipUrl = 'http://www.testUpdate.com/update.zip'; // 升级包路径
longjing.upgrade({url: updateZipUrl});
```

#### 打开新的子窗口(openChildWindow)
主窗口执行。打开新的子窗口全屏显示，一般启动在在小应用里的链接 
离线地址是相对地址 
在线地址是绝对地址 
注：该方法仅限于在主窗口内使用。
```
type == offline; // 离线包
path = 'index.html#mall'; // 单页路由
path = 'index.html#/mall'; // 单页路由
path = 'mall/index.html'; // 多页
type == online; // 在线网址
path = 'http://www.xxx.com/xx.html';
longjing.openChildWindow({
type: 'online', // online 在线，offline 离线
path: path
});
```

#### 关闭当前子窗口(closeChildWindow)
子窗口执行。关闭后回到主窗口 
注：该方法仅限于在子窗口内使用。
```
url = 'http://www.xxx.com/xxxx.html'; // 绝对路径的链接
longjing.closeChildWindow(); // 仅关闭子窗口
longjing.closeChildWindow(url); // 关闭子窗口，同时将主窗口的链接变更为url
```
#### 刷新主窗口(refreshMainWindow)
子窗口执行。部分主窗口的数据需要更新
```
longjing.refreshMainWindow();
```
#### 设置子窗口无操作的自动退出秒数(setChildWindowAutoCloseSecond)
子窗口超过秒数没有任何操作，自动退出回主窗口
入参：

|名称|字段|类型|说明|
|--|--|--|--|
|无操作时长|	time|	init||

```
longjing.setQuitTime({time: 60}); // 60秒
```
#### 将文字播放成语音(voice)
入参：

|名称|字段|类型|说明|
|--|--|--|--|
|唯一标识|	id|	string|当前要播放的唯一标识|
|播放文字|	text|	string|播放成语音的文字|

```
longjing.voice({id:'当前要播放的唯一标识',text:'播放成语音的文字'});
```
#### 创建定时器(createTimerTask)

入参：

|名称|	字段|	类型|	说明|
|--|--|--|--|
|定时器类型|	isOnce|	boolean|默认true，false为循环定时器，true为一次性定时器|
|唯一标识|	id|	string|定时器的唯一编号，运行时回调使用|
|时长|	time|	int|单位传递的是秒，默认1分钟|

```
longjing.createTimerTask({
isOnce: true,  // 默认true，false为循环定时器，true为一次性定时器
id: 1001,// 定时器的唯一编号，运行时回调使用
time: 1  // 单位传递的是秒，默认1分钟
});
```
#### 关闭定时器(stopTimerTask)

入参：

|名称|	字段|	类型|	说明|
|--|--|--|--|
|唯一标识|	taskId|	string|创建定时器时入参的id|

```
longjing.stopTimerTask({
taskId: 1001,  // 定时器的唯一编号，创建定时器时发起的。
});
```
#### 主窗口页面加载完成通知app(loadSuccess)
```
longjing.loadSuccess();
```
#### 光带控制(changeLed)
入参：

|名称|	字段|	类型|	说明|
|--|--|--|--|
|颜色状态|	color|	int|0 关闭，1 红色，2 绿色，3 黄色|
|类型|	type|	int|1 德睿 2 仟视|

```
longjing.changeLed({
color:1,
type:1
});
```
#### 打印(printV1)
入参：

|名称|	字段|	类型|	说明|
|--|--|--|--|
|参数|	params|	object||
|次数|	count|	string||

```
longjing.printV1({
params:{},
count:'1'
});
```

#### 获取驱动版本号(getDriverVersion)
入参：无

```
var driverVersion = longjing.getDriverVersion();
```

#### 人脸对比身份证(compareFace1V1)
入参：

|名称|	字段|	类型|	说明|
|--|--|--|--|
|人脸图片|	face|	string|base64格式|
|身份证图片|	idCard|	string|base64格式|

出参：

|名称|	字段|	类型|	说明|
|--|--|--|--|
|截图人脸的图片|	face|	string|base64格式|
|编码|	code|	int|0  成功,  -1 人脸SDK初始化失败  -2 人脸采集图片未检测到人脸,  1 人证对比失败|

```
var faceRes = longjing.compareFace1V1({
face:'base64格式',
idCard:'base64格式'
});

```

#### 配置读写(config)
允许自定义配置

* 只读配置

|名称|	字段|	类型|	说明|
|--|--|--|--|
|终端号|	deviceNumber|	string|	N|
|商户号|	sellerId|	string|	N|
|网点号|	pointNo|	string|	N|
|小应用号|	appId	|string|	N|

* 获取配置

```
var config = longjing.config(); // 获取所有配置,返回json对象
var version = longjing.config('version'); // 获取指定配置
```

* 设置配置

```
longjing.config('version', 1.0); // 设置单项配置
longjing.config({'version': 1.0}); // 设置多项配置
```
### 通知
窗口接收到的事件通知，窗口进行相关业务处理
#### 格式

```
var options = {}; // 备用参数
longjing.notify('事件编码', function() {
// 处理 ...
}, options);
```

|事件编码|	事件|	说明|
|--|--|--|
|ENTER_SCREENSAVERS|	开始屏保|	主窗口在指定时间内没有操作，会进入屏保窗口|
|TTS_SPEAK|	播放语音结束|	文字转语音播放结束，返回播放时传入的唯一标识|
|APP_SHOW|	页面开始载入|	webview加载页面时，提示加载窗口，用于页面特效执行|
|TIMER_NOTIFY|	定时器运行通知|	所有的定时器运行时通过该方法通知|
|DRIVER_GET_SCAN_CODE|	扫码结果|	|
|DRIVER_GET_PRINT_RESULT|	打印结果|	|

