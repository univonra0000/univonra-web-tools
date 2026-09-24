import {WebSocketServer} from "ws";
import http from "http";

const server=http.createServer((req,res)=>{
  if(req.url==="/health"){res.writeHead(200,{"content-type":"application/json"});res.end(JSON.stringify({ok:true,service:"senquara-relay"}));return}
  res.writeHead(404);res.end("Not found");
});
const wss=new WebSocketServer({server});
const rooms=new Map();
wss.on("connection",ws=>{
  ws.room="default";
  if(!rooms.has(ws.room)) rooms.set(ws.room,new Set());
  rooms.get(ws.room).add(ws);
  ws.send(JSON.stringify({type:"connected",room:ws.room}));
  ws.on("message",data=>{
    for(const peer of rooms.get(ws.room)||[]) if(peer!==ws && peer.readyState===1) peer.send(data.toString());
  });
  ws.on("close",()=>rooms.get(ws.room)?.delete(ws));
});
const port=process.env.RELAY_PORT||8787;
server.listen(port,()=>console.log(`SENQUARA relay listening on :${port}`));
