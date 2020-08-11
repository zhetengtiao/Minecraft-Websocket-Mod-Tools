var posa=[];
var posx=[];
var posy=[];
var posz=[];
module.exports.onmessage=function(choise,message,conn){
	if(choise=="create"){
		console.log("Mod was loaded");
		conn.sendcommand("/say §bcrafthelper §eJSmod§f加载成功");
		conn.sendcommand("/say Powered by §aZhetengtiao");
		conn.sendcommand("/say 请输入 §6crafthelp§f 来获取帮助。");
	}
	else{
		if(message.header.messagePurpose=="commandResponse")
        {
			//console.log(message)
			if("destination" in message.body)
			{
				posx[posx.length]=message.body.destination.x;
				posy[posy.length]=message.body.destination.y;
				posz[posz.length]=message.body.destination.z;
				conn.sendcommand("/say 坐标“"+posa[posa.length-1]+"”获取成功。");
				conn.sendcommand("/say x:"+posx[posx.length-1]+" y:"+posy[posy.length-1]+" z:"+posz[posz.length-1]);
			}
        }
		else if(message.body&&message.body.eventName&&message.body.eventName=="PlayerMessage"){
			var lmessage=message.body.properties.Message;
			if(lmessage.slice(0,6)=="setpos"){            
				if(lmessage.slice(7,16384) in posa)
				{
					conn.sendcommand("/say 当前坐标名已被指定。")
				}
				else{
					posa[posa.length]=lmessage.slice(7,16384)
					conn.sendcommand("/tp "+message.body.properties.Sender+" ~ ~ ~")
				}
			}
			else if(lmessage.slice(0,4)=="fill"){            //fill ~a~b~block
				lmessage=lmessage.slice(6,16384);
				var vmessage=lmessage.split("~");
				var ap=posa.indexOf(vmessage[0]);
				var bp=posa.indexOf(vmessage[1]);
				conn.sendcommand("/fill "+posx[ap]+" "+posy[ap]+" "+posz[ap]+" "+posx[bp]+" "+posy[bp]+" "+posz[bp]+" "+vmessage[2])
				conn.sendcommand("/say 命令已执行。")
			}
			else if(lmessage.slice(0,5)=="clone"){            //clone ~a~aa~b
				lmessage=lmessage.slice(6,16384);
				var vmessage=lmessage.split("~");
				var ap=posa.indexOf(vmessage[0]);
				var bp=posa.indexOf(vmessage[1]);
				var cp=posa.indexOf(vmessage[2]);
				conn.sendcommand("/clone "+posx[ap]+" "+posy[ap]+" "+posz[ap]+" "+posx[bp]+" "+posy[bp]+" "+posz[bp]+" "+posx[cp]+" "+posy[cp]+" "+posz[cp])
				conn.sendcommand("/say 命令已执行。")
			}
			else if(lmessage=="crafthelp"){
				conn.sendcommand("/say §6clone %开始坐标名%~%结束坐标名%~%放置坐标名%§f:复制方块");
                conn.sendcommand("/say §6fill ~%开始坐标名%~%结束坐标名%~%填充方块名%§f:填充方块");
                conn.sendcommand("/say §6setpos %坐标名%§f:设置玩家当前坐标为坐标名");
                conn.sendcommand("/say §6crafthelp§f:显示此页面。");
			}
		}
	}
};