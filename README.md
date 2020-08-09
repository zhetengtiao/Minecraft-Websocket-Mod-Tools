# Minecraft-Websocket-Mod-Tools

## 基本使用

参考[Minecraft-Mod-Configer](https://github.com/liumingedwin/Minecraft-Mod-Configer)所制作

首先参考[Minecraft-Websocket](https://github.com/liumingedwin/mcws)进行安装。（npm install mcws）

然后直接在该项目目录里运行ServerTools.js文件（node ServerTools.js）

在《我的世界基岩版》内输入/connect 127.0.0.1:8900

即可使用

## Mod开发

你可在项目目录/mods文件夹来编写自己的mod。

任意取名，但后缀必须为.js

你可以在该js内编写mod，像这样：

```javascript
module.exports.onmessage=function(choise,message,conn){
/*
choise:create/text
create:启用mod
text:事件或发送命令产生的消息
message:消息本体(JSON/Object对象)
conn:通信对象
conn.sendcommand("命令"); //发送命令
message.body.properties.Message:在聊天框发送的消息
*/
//书写您的代码

}
```

这是一个mod样例，用于显示时间：

```javascript
var inter;
module.exports.onmessage=function(choise,message,conn){
	if(choise=="create")
	{
		inter=setInterval(function(){
			var time1 = new Date().format("yyyy-MM-dd HH:mm:ss");
			conn.sendcommand(`/title @a actionbar 时间：${time1}`);
		},2000);
		return true;
	}
	else{
	if(message.body&&message.body.eventName&&message.body.eventName=="PlayerMessage"){
		var lmessage=message.body.properties.Message;
		if(lmessage=="clearinterval")
			clearInterval(inter);
	}
	}
}
```

然后保存，运行并在游戏端连接该服务器。

在游戏内输入```./addmod mod名```（需要先输入```./giveop```来设置你为操作员）

然后你就可以输入```./runmod```，查看效果啦~

## 高级使用

本程序内内置ruyi.ai~~智障~~聊天机器人和tpa mod。详细用法请在游戏内输入```./help```

你可以使用来在游戏执行命令，例如`./runc /agent create`

已知.```/runc```运行指令的级别要比玩家更高，不信你试试(●ˇ∀ˇ●)

你还可以帮助作者修改这个项目，将其改的更好！

关于我的世界Websocket的详细内容请点击[这里](https://minecraft-zh.gamepedia.com/教程/WebSocket)