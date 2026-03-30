import{useState,useEffect,useRef}from 'react';
import styled,{keyframes}from 'styled-components';
import{useAuth}from '../../context/AuthContext';

const fadeUp=keyframes`from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}`;
const fadeOut=keyframes`from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-10px)}`;

const ToastStack=styled.div`
  position:fixed;top:16px;left:16px;right:16px;
  z-index:9999;
  display:flex;flex-direction:column;gap:10px;
  pointer-events:none;
  @media(min-width:520px){left:50%;transform:translateX(-50%);width:420px;}
`;

const ToastItem=styled.div`
  background:${props=>props.$type==='error'?'linear-gradient(135deg,#EF4444,#DC2626)':props.$type==='warning'?'linear-gradient(135deg,#F59E0B,#D97706)':props.$type==='info'?'linear-gradient(135deg,#3B82F6,#2563EB)':'linear-gradient(135deg,#10B981,#059669)'};
  color:white;padding:14px 16px;border-radius:16px;
  font-size:.9rem;font-weight:600;
  box-shadow:0 8px 32px rgba(0,0,0,.25);
  animation:${fadeUp} .3s ease;
  display:flex;align-items:center;gap:12px;
  pointer-events:all;cursor:pointer;
  position:relative;overflow:hidden;
  &:before{content:'';position:absolute;bottom:0;left:0;height:3px;background:rgba(255,255,255,.3);animation:shrink ${props=>props.$duration}ms linear forwards;}
  @keyframes shrink{from{width:100%}to{width:0%}}
  &:hover{opacity:.95;}
`;

const ToastIcon=styled.div`font-size:1.3rem;`;

const ToastContent=styled.div`flex:1;`;
const ToastTitle=styled.div`font-weight:700;font-size:.88rem;`;
const ToastBody=styled.div`font-size:.75rem;opacity:.9;margin-top:2px;`;

const ToastClose=styled.button`
  background:rgba(255,255,255,.2);
  border:none;border-radius:8px;
  color:white;padding:6px;cursor:pointer;
  &:hover{background:rgba(255,255,255,.3);}
`;

const EVENT_TOAST_CONFIG={
  'nueva_solicitud':{type:'success',icon:'🆕',titleFn:(d)=>'¡Nuevo trabajito disponible!',bodyFn:(d)=>d.data?.categoria||'Hay un servicio cerca de ti',duration:8000},
  'solicitud_aceptada':{type:'success',icon:'✅',titleFn:(d)=>'Trabajito aceptado',bodyFn:(d)=>`${d.data?.prestador?.nombre||'Un prestador'} aceptó tu solicitud`,duration:8000},
  'estado_actualizado':{type:'info',icon:'🔄',titleFn:(d)=>{
    const map={en_curso:'Servicio en progreso',completada:'¡Servicio completado!',cancelada:'Servicio cancelado'};
    return map[d.data?.estado]||'Estado actualizado';
  },bodyFn:(d)=>{
    const map={en_curso:'El trabajo ha comenzado',completada:'¡Buen trabajo!',cancelada:'La solicitud fue cancelada'};
    return map[d.data?.estado]||'';
  },duration:6000},
  'nuevo_mensaje':{type:'info',icon:'💬',titleFn:(d)=>'Nuevo mensaje',bodyFn:(d)=>d.data?.contenido?.substring(0,60)||'Tienes un mensaje nuevo',duration:6000}
};

const GlobalNotifications=()=>{
  const{usuario,socketEvents}=useAuth();
  const[toasts,setToasts]=useState([]);
  const toastTimers=useRef({});
  const processedEvents=useRef(new Set());

  const removeToast=(id,animate=true)=>{
    if(toastTimers.current[id]){
      clearTimeout(toastTimers.current[id]);
      delete toastTimers.current[id];
    }
    if(animate){
      setToasts(prev=>prev.filter(t=>t.id!==id));
    }else{
      setToasts([]);
    }
  };

  const addToast=(type,icon,title,body,duration=6000)=>{
    const id=Date.now()+Math.random();
    setToasts(prev=>[...prev.slice(-4),{id,type,icon,title,body}]);
    toastTimers.current[id]=setTimeout(()=>removeToast(id,false),duration);
    return id;
  };

  useEffect(()=>{
    if(!socketEvents||socketEvents.length===0||!usuario)return;
    const lastEvent=socketEvents[socketEvents.length-1];
    if(!lastEvent)return;
    if(processedEvents.current.has(lastEvent))return;
    processedEvents.current.add(lastEvent);
    if(processedEvents.current.size>100)processedEvents.current=new Set();
    const config=EVENT_TOAST_CONFIG[lastEvent.type];
    if(!config)return;
    addToast(config.type,config.icon,config.titleFn(lastEvent),config.bodyFn(lastEvent),config.duration);
  },[socketEvents,usuario]);

  useEffect(()=>{
    return()=>{
      Object.values(toastTimers.current).forEach(clearTimeout);
    };
  },[]);

  if(!usuario)return null;

  return(
    <ToastStack>
      {toasts.map(t=>(
        <ToastItem key={t.id} $type={t.type} $duration={7000} onClick={()=>removeToast(t.id)}>
          <ToastIcon>{t.icon}</ToastIcon>
          <ToastContent>
            <ToastTitle>{t.title}</ToastTitle>
            {t.body&&<ToastBody>{t.body}</ToastBody>}
          </ToastContent>
          <ToastClose onClick={(e)=>{e.stopPropagation();removeToast(t.id);}}>✕</ToastClose>
        </ToastItem>
      ))}
    </ToastStack>
  );
};
export default GlobalNotifications;
