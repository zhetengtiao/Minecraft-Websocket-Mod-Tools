/**
 * ServerTools
 * @1.0.0
 * Powered by Zhetengtiao
 * 功能列表：
 * 1.与机器人对话
 * 2.操作员权限
 * 3.mod加载/停止/列出
 * 4.超级权限命令执行
 * 5.更多功能正在开发中...
 */
var mcws=require("mcws");
var http = require('http')
var running=0;
var admin=[];
var arr=[];
var modlist=[];
//var backup=[];
var server=new mcws(function(choise,message,conn){
	if(choise=="create"){
		console.log("Mod was loaded");
		conn.sendcommand("/say §bServerTools §eJSmod§f加载成功");
        conn.sendcommand("/say Powered by §aZhetengtiao");
        conn.sendcommand("/say 请先运行 §6./giveop§f 来获取操作员权限。");
        conn.sendcommand("/say 运行 §6./help§f 来获取帮助。");
	}
	else{
        if(message.header.messagePurpose=="commandResponse")
        {
            if(!("message" in message.body))
            {
                conn.sendcommand("/say 命令返回：" + message.body.statusMessage);
            }
        }
		else if(message.body&&message.body.eventName&&message.body.eventName=="PlayerMessage"){
        var lmessage=message.body.properties.Message;
        var sender=message.body.properties.Sender;
		if(lmessage.slice(0,1)=="~"){
            lmessage = lmessage.slice(2,lmessage.length);
            http.get('http://api.ruyi.ai/v1/message?q='+encodeURI(lmessage)+"&app_key=9ae102fc-7952-488d-92a0-40dbbf8f984d&user_id=ruyi-test-8bf612ed-f764-4eaa-b4cd-30c77f4a4d89", function (res) {
                var json = '';
                res.on('data', function (d) {
                    json += d;
                });
                res.on('end',function(){
                    json = JSON.parse(json);            
                    //conn.sendcommand("/say " + json.response.intents.outputs.property.text);
                    conn.sendcommand("/say " + json.result.intents[0].result.text);
                });
            }).on('error', function (e) {
                console.error(e);
            });
		}
		else if(lmessage=="./help"){
            conn.sendcommand("/say §6./help§f:显示帮助页面");
            conn.sendcommand("/say §6~ %想说的话%§f : 和机器人聊天");
            conn.sendcommand("/say §6./giveop %玩家id%§f:给予操作员权限（仅限第一次运行）");
            conn.sendcommand("/say §6./listmod§f:列出已加载的mod");
            if(admin.includes(message.body.properties.Sender)){
                conn.sendcommand("/say §6./giveop %玩家id%§f:给予他人操作员权限（需要操作员）");
                conn.sendcommand("/say §6./bye§f:关闭WebSocket连接（需要操作员）");
                conn.sendcommand("/say §6./runc %指令%§f:以超级权限的方式运行指令（需要操作员）");
                conn.sendcommand("/say §6./addmod %mod名%§f:加载mod（需要操作员）");
                conn.sendcommand("/say §6./runmod§f:运行mod（需要操作员）");
                conn.sendcommand("/say §6./stopmod§f:暂停mod（需要操作员）");
            }
            else{conn.sendcommand("/say 更多指令需要操作员权限，已自动折叠");}
            conn.sendcommand("/say 操作员：");
            for (var stcc=0;stcc<admin.length;stcc++)
            {
                conn.sendcommand("/say §a" + admin[stcc] + "§f");
            }
		}
		else if(lmessage=="./bye"){
            if(admin.includes(message.body.properties.Sender)){	          
                console.log("WebSocket was stoped");
			    conn.sendcommand("/say 欢迎再次使用§bServerTools§f插件！");
			    conn.sendcommand("/closewebsocket");
            }
            else {conn.sendcommand("/say §c你不是操作员。");}
        }
        else if(lmessage.slice(0,2+6)=="./addmod"){
            if(admin.includes(message.body.properties.Sender)){	
                arr[arr.length]=require(".\\mods\\"+lmessage.slice(9,16384));
                modlist[modlist.length]=lmessage.slice(9,16384);
			    conn.sendcommand("/say mod加载中:"+lmessage.slice(9,16384));
            }
            else {conn.sendcommand("/say §c你不是操作员。");}
		}
		else if(lmessage=="./runmod"){
            if(admin.includes(message.body.properties.Sender)){		
                running=1;
			    conn.sendcommand("/say 已经加载mod");
			    for (var stc=0;stc<arr.length;stc++)
				    if(arr[stc].onmessage("create",message,conn))return;
            }
            else {conn.sendcommand("/say §c你不是操作员。");}
		}
		else if(lmessage=="./stopmod"){
            if(admin.includes(message.body.properties.Sender)){				
                running=0;
			    conn.sendcommand("/say 已经停止mod");
            }
            else {conn.sendcommand("/say §c你不是操作员。");}
        }
        else if(lmessage=="./listmod"){
            conn.sendcommand("/say 已加载的mod：");
            for (var stcc=0;stcc<modlist.length;stcc++)
            {
                conn.sendcommand("/say §a" + modlist[stcc] + "§f");
            }
        }
        /** 
        else if(lmessage.slice(0,11)=="./removemod"){
            lmessage=lmessage.slice(12,lmessage.length)
            if(admin.includes(message.body.properties.Sender)){
                if(!(running))
                {
                    if(lmessage in modlist)
                    {
                        for (var stcc=0;stcc<modlist.length;stcc++)
                        {
                            if(modlist[stcc]==lmessage)
                            {

                            }
                            backup[stcc]=modlist[stcc];
                        }
                    }
                    else{
                        conn.sendcommand("/say 未找到有关mod。")
                    }
                }
                else{
                    conn.sendcommand("/say mod正在运行，请输入./stopmod来停止mod。")
                }
            }
            else {conn.sendcommand("/say §c你不是操作员。");}
        }
        */
        else if(lmessage.slice(0,6)=="./runc")
        {
            if(admin.includes(message.body.properties.Sender)){
                lmessage = lmessage.slice(7,lmessage.length);
                conn.sendcommand(lmessage);
            }
            else {conn.sendcommand("/say §c你不是操作员。");}
        }
        else if(lmessage.slice(0,8)=="./giveop"){            
            if(admin.length==0)
            {
                admin[admin.length]=message.body.properties.Sender;
                conn.sendcommand("/say 操作员权限给予成功。");
            }
            else if(admin.includes(message.body.properties.Sender)){
                lmessage = lmessage.slice(9,lmessage.length);
                conn.sendcommand("/op "+lmessage);
                admin[admin.length]=lmessage;
                conn.sendcommand("/say 操作员权限给予成功。");
            }

            else {conn.sendcommand("/say §c你不是操作员。");}
        }
        else{
            if(running==0){
            if(lmessage.slice(0,2)=="./"){
                conn.sendcommand("/say 未知命令："+lmessage.slice(0,2+3));
                conn.sendcommand("/say §6./help§f:显示帮助页面");
                conn.sendcommand("/say §6~ %想说的话%§f : 和机器人聊天");
                conn.sendcommand("/say §6./giveop %玩家id%§f:给予操作员权限（仅限第一次运行）");
                conn.sendcommand("/say §6./listmod§f:列出已加载的mod");
                if(admin.includes(message.body.properties.Sender)){
                    conn.sendcommand("/say §6./giveop %玩家id%§f:给予他人操作员权限（需要操作员）");
                    conn.sendcommand("/say §6./bye§f:关闭WebSocket连接（需要操作员）");
                    conn.sendcommand("/say §6./runc %指令%§f:以超级权限的方式运行指令（需要操作员）");
                    conn.sendcommand("/say §6./addmod %mod名%§f:加载mod（需要操作员）");
                    conn.sendcommand("/say §6./runmod§f:运行mod（需要操作员）");
                    conn.sendcommand("/say §6./stopmod§f:暂停mod（需要操作员）");
                }
                else{conn.sendcommand("/say 更多指令需要操作员权限，已自动折叠");}
                conn.sendcommand("/say 操作员：");
                for (var stcc=0;stcc<admin.length;stcc++)
                {
                    conn.sendcommand("/say §a" + admin[stcc] + "§f");
                }
                }
            }
        }
        }
    if(running){
        for (var stc=0;stc<arr.length;stc++)
            if(arr[stc].onmessage(choise,message,conn))return;
    }
}
},8900);