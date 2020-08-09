var inter;
var tpa=0;
var tpb=0;
var running=0;
module.exports.onmessage=function(choise,message,conn){
	if(choise=="create"){
		console.log("Mod was loaded");
		conn.sendcommand("/say §bTPA §eJSmod§f加载成功");
		conn.sendcommand("/say Powered by §aZhetengtiao");
	}
	else{
		if(message.body&&message.body.eventName&&message.body.eventName=="PlayerMessage"){
			var lmessage=message.body.properties.Message;
			if(lmessage.slice(0,5)=="./tpa"){            
				if(running==1){conn.sendcommand("/msg "+message.body.properties.Sender+" 已有tpa请求正在处理。")}
				else {
					running=1;
					tpa=message.body.properties.Sender;
					tpb=lmessage.slice(6,lmessage.length);
					conn.sendcommand("/msg "+message.body.properties.Sender+" 已发送tpa请求。撤回tpa请求请输入 §b./tpno§f 。");
					conn.sendcommand("/msg "+lmessage.slice(6,lmessage.length)+" 玩家 §a"+message.body.properties.Sender+"§f 想要传送到你，请在1分钟内在聊天框内输入 §b./tpyes§f 来允许请求。输入 §b./tpno§f 来拒绝请求。");}
			}
			else if(lmessage=="./tpyes"){
				if(tpb.includes(message.body.properties.Sender)){
					conn.sendcommand("/tp "+tpa+" "+tpb);
					conn.sendcommand("/msg "+tpa+" 对方允许了你的请求，传送成功。");
					conn.sendcommand("/msg "+tpb+" 你允许了对方的请求，传送成功。");
					tpa=0;
					tpb=0;
					running=0;
				}
				else{conn.sendcommand("/msg "+message.body.properties.Sender+" 没有找到你的tpa请求。")}
			}
			else if(lmessage=="./tpno"){
				if(tpb.includes(message.body.properties.Sender)){
					conn.sendcommand("/msg "+tpa+" 对方拒绝了你的请求，传送失败。");
					conn.sendcommand("/msg "+tpb+" 你拒绝了对方的请求，传送失败。");
					tpa=0;
					tpb=0;
					running=0;
				}				
				else if(tpa.includes(message.body.properties.Sender)){
					conn.sendcommand("/msg "+tpb+" 对方撤回了请求，传送失败。");
					conn.sendcommand("/msg "+tpa+" 你撤回了请求，传送失败。");
					tpa=0;
					tpb=0;
					running=0;
				}
				else{conn.sendcommand("/msg "+message.body.properties.Sender+" 没有找到你的tpa请求。")}
			}
		}
	}
};