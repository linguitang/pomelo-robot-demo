const Pomelo = require('pomelo-node-client');
const pomelo = new Pomelo();
var START = 'start';
var END = 'end';
var ActFlagType = {
  ENTRY: 0,
  ENTER_SCENE: 1,
  ATTACK: 2,
  MOVE: 3,
  PICK_ITEM: 4
};
var monitor = function (type, name, reqId) {
  if (typeof actor !== 'undefined') {
    actor.emit(type, name, reqId);
  } else {
    console.error(Array.prototype.slice.call(arguments, 0));
  }
}
async function connect (host, port){
	return new Promise((resolve,reject)=>{
		pomelo.init({
			host: host,
			port: port,
		}, () => {
			resolve();
		});
	});
}

async function request (route, para){
	return new Promise((resolve,reject)=>{
		pomelo.request(route, para, (data) => {
			resolve(data);
		});
	});
}

(async function(){
    await connect('127.0.0.1',3105);
    let data = await request('gate.gateHandler.queryEntry',{});
    console.log(data)
    pomelo.disconnect();
    if(data.code === 500) {
        console.error('gate 连接失败');
        return;
    }
    console.log(data)
    monitor(START, 'entry', ActFlagType.ENTRY);
    await connect(data.data.host,data.data.port);
    monitor(END, 'entry', ActFlagType.ENTRY);
  }
)();
