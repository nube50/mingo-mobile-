import{io}from 'socket.io-client';
let s=null;
export const conectar=(token)=>{if(s?.connected)return s;s=io(import.meta.env.VITE_SOCKET_URL,{auth:{token},transports:['websocket','polling'],reconnection:true});return s;};
export const getSocket=()=>s;
