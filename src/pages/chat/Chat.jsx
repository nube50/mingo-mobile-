import{useState,useEffect,useRef}from 'react';
import{useParams,useNavigate}from 'react-router-dom';
import styled, {keyframes}from 'styled-components';
import{ArrowLeft,Send,Phone,MessageCircle,Clock}from 'lucide-react';
import api from '../../services/api';
import{getSocket}from '../../services/socket';
import{useAuth}from '../../context/AuthContext';
import{Avatar,Badge,Card,Spinner,EmptyState,PageWrap}from '../../components/common/UI';

const fadeUp=keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;

const ChatHeader=styled.div`
  background:#fff;border-bottom:1px solid #F0F0F0;
  padding:12px 16px;display:flex;align-items:center;gap:12px;
  position:sticky;top:0;z-index:10;
`;

const BackBtn=styled.button`
  background:none;border:none;color:#6B7280;cursor:pointer;padding:4px;
  &:active{opacity:.6;}
`;

const ChatInfo=styled.div`flex:1;`;
const ChatName=styled.h2`font-size:1rem;font-weight:700;color:#333333;`;
const ChatStatus=styled.p`font-size:.73rem;color:#10B981;`;

const MessagesArea=styled.div`
  flex:1;overflow-y:auto;padding:16px;
  display:flex;flex-direction:column;gap:6px;
`;

const DateTag=styled.div`text-align:center;font-size:.72rem;color:#C4C9D4;margin:8px 0;`;

const Bubble=styled.div`
  max-width:76%;padding:11px 15px;border-radius:18px;
  font-size:.9rem;line-height:1.45;animation:${fadeUp}.2s ease;
  align-self:${({$m})=>$m?'flex-end':'flex-start'};
  background:${({$m})=>
    $m?'#8A2BE2':'#F5F5F5'};
  color:${({$m})=>$m?'white':'#333333'};
  border-bottom-right-radius:${({$m})=>$m?'4px':'18px'};
  border-bottom-left-radius:${({$m})=>!$m?'4px':'18px'};
`;

const MsgTime=styled.span`
  font-size:.65rem;color:${({$m})=>$m?'rgba(255,255,255,.65)':'#C4C9D4'};
  margin-top:3px;display:block;text-align:right;
`;

const InputArea=styled.div`
  padding:12px 16px;padding-bottom:calc(12px + env(safe-area-inset-bottom,0px));
  background:#fff;border-top:1px solid #F0F0F0;
  display:flex;gap:10px;align-items:center;
`;

const SendBtn=styled.button`
  width:48px;height:48px;border-radius:14px;
  background:#8A2BE2;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 12px rgba(138,43,226,.3);
  &:active{opacity:.85;} &:disabled{opacity:.4;cursor:not-allowed;}
`;

const ConvList=styled(Card)`
  display:flex;align-items:center;gap:12px;cursor:pointer;
  &:active{transform:scale(.985);}
`;

const ConvInfo=styled.div`flex:1;overflow:hidden;`;
const ConvName=styled.h3`font-size:.95rem;font-weight:700;color:#333333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
const ConvMsg=styled.p`font-size:.8rem;color:#6B7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;`;

const ConvMeta=styled.div`display:flex;flex-direction:column;align-items:flex-end;gap:4px;`;
const ConvTime=styled.span`font-size:.72rem;color:#C4C9D4;`;

const Unread=styled.div`
  width:20px;height:20px;border-radius:50%;
  background:#8A2BE2;font-size:.65rem;font-weight:700;
  color:white;display:flex;align-items:center;justify-content:center;
`;

const ServMini=styled.div`
  background:#F5E6FF;border-radius:12px;padding:10px 14px;margin:0 16px 8px;
  display:flex;align-items:center;gap:10px;
`;

const MiniInfo=styled.div`flex:1;overflow:hidden;`;
const MiniTitle=styled.p`font-size:.85rem;font-weight:600;color:#333333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
const MiniPrice=styled.p`font-size:.78rem;color:#10B981;font-weight:700;`;

const StatusBadge=styled.span`
  display:inline-block;
  padding:2px 8px;
  border-radius:10px;
  font-size:.65rem;
  font-weight:600;
  background:${props=>props.$s==='publicada'?'#D1FAE5':props.$s==='aceptada'?'#DBEAFE':props.$s==='en_curso'?'#FEF3C7':'#F5F5F5'};
  color:${props=>props.$s==='publicada'?'#059669':props.$s==='aceptada'?'#2563EB':props.$s==='en_curso'?'#D97706':'#6B7280'};
`;

const Chat=()=>{
  const{id}=useParams();
  const navigate=useNavigate();
  const{usuario,decrementUnreadMessages}=useAuth();
  const[msgs,setMsgs]=useState([]);
  const[text,setText]=useState('');
  const[convId,setConvId]=useState(id);
  const[convs,setConvs]=useState([]);
  const[other,setOther]=useState({nombre:'Usuario'});
  const[servicio,setServicio]=useState(null);
  const[loadingMsgs,setLoadingMsgs]=useState(false);
  const msgsRef=useRef(null);

  useEffect(()=>{
    if(id){
      setConvId(id);
      cargarChat(id);
    }
  },[id]);

  useEffect(()=>{
    if(convId){
      decrementUnreadMessages(999);
    }
  },[convId]);

  useEffect(()=>{
    cargarConversaciones();
  },[]);

  useEffect(()=>{
    const sock=getSocket();
    if(!sock)return;
    
    const handleNuevoMensaje=(m)=>{
      if(convId && m.solicitud_id===convId){
        setMsgs(p=>[...p,{...m,esMio:false}]);
      }
    };
    
    sock.on('nuevo_mensaje',handleNuevoMensaje);
    
    return()=>{
      sock.off('nuevo_mensaje',handleNuevoMensaje);
    };
  },[convId]);

  useEffect(()=>{msgsRef.current?.scrollTo({top:msgsRef.current.scrollHeight,behavior:'smooth'});},[msgs]);

  const cargarConversaciones=async()=>{
    try{
      const[misCli, misPres]=await Promise.all([
        api.get('/solicitudes/mis-solicitudes?rol=cliente').catch(()=>({data:{solicitudes:[]}})),
        api.get('/solicitudes/mis-solicitudes?rol=prestador').catch(()=>({data:{solicitudes:[]}}))
      ]);
      const todas=[...(misCli.data.solicitudes||[]),...(misPres.data.solicitudes||[])];
      const unicas=todas.filter((s,i,a)=>a.findIndex(x=>x.id===s.id)===i);
      const activas=unicas.filter(s=>['aceptada','en_curso'].includes(s.estado));
      setConvs(activas);
    }catch(e){console.error('Error conversaciones:',e);}
  };

  const cargarChat=async(cid)=>{
    setLoadingMsgs(true);
    setMsgs([]);
    try{
      const r=await api.get('/chat/'+cid);
      const mensajes=r.data.mensajes||[];
      setMsgs(mensajes.map(m=>({
        ...m,
        esMio:m.remitente_id===usuario?.id,
        contenido:m.contenido
      })));
      setServicio({
        titulo:r.data.solicitud?.titulo||'Trabajito',
        categoria:r.data.solicitud?.categoria,
        precio:r.data.solicitud?.presupuesto_cliente
      });
      if(r.data.solicitud){
        const esCliente=r.data.solicitud.cliente_id===usuario?.id;
        setOther({
          nombre:esCliente?r.data.solicitud.nombre_prestador:r.data.solicitud.nombre_cliente,
          id:esCliente?r.data.solicitud.prestador_id:r.data.solicitud.cliente_id
        });
      }
    }catch(e){
      console.error('Error chat:',e);
      setMsgs([{contenido:'No se pudieron cargar los mensajes',esMio:false,created_en:new Date().toISOString()}]);
    }finally{setLoadingMsgs(false);}
  };

  const enviar=async()=>{
    if(!text.trim())return;
    const tmpId=Date.now();
    const tmp={id:tmpId,contenido:text,esMio:true,creado_en:new Date().toISOString(),_tmp:true};
    setMsgs(p=>[...p,tmp]);
    const txt=text;setText('');
    try{
      const r=await api.post('/chat/'+convId,{contenido:txt});
      setMsgs(p=>p.map(m=>m._tmp?{...r.data.data,esMio:true}:m));
    }catch(e){
      setMsgs(p=>p.filter(m=>m._tmp!==true));
      alert(e.response?.data?.mensaje||'Error al enviar');
    }
  };

  const formatTime=(dateStr)=>{
    if(!dateStr)return'';
    const d=new Date(dateStr);
    const hoy=new Date();
    if(d.toDateString()===hoy.toDateString())return d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    return d.toLocaleDateString('es-CO',{day:'numeric',month:'short'});
  };

  if(!id){
    return(
      <PageWrap>
        <ChatHeader>
          <ChatInfo><ChatName>Mensajes</ChatName></ChatInfo>
        </ChatHeader>
        <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:'10px'}}>
          {convs.length===0?
            <EmptyState>
              <MessageCircle size={48} color="#C4C9D4"/>
              <p>No tienes conversaciones</p>
              <p style={{fontSize:'0.78rem',color:'#C4C9D4'}}>
                Coge un trabajito para chatear
              </p>
            </EmptyState>:
            convs.map(c=>(
              <ConvList key={c.id} $click onClick={()=>navigate('/chat/'+c.id)}>
                <Avatar $s="50px">
                  {c.cliente_id===usuario?.id?(c.nombre_prestador||'P')[0]:(c.nombre_cliente||'C')[0]}
                </Avatar>
                <ConvInfo>
                  <ConvName>
                    {c.cliente_id===usuario?.id?(c.nombre_prestador||'Prestador'):(c.nombre_cliente||'Cliente')}
                  </ConvName>
                  <ConvMsg>{c.titulo||'Trabajito'}</ConvMsg>
                </ConvInfo>
                <ConvMeta>
                  <StatusBadge $s={c.estado}>{c.estado}</StatusBadge>
                  <ConvTime><Clock size={10} style={{marginRight:3}}/>{formatTime(c.actualizado_en)}</ConvTime>
                </ConvMeta>
              </ConvList>
            ))
          }
        </div>
      </PageWrap>
    );
  }

  return(
    <PageWrap>
      <ChatHeader>
        <BackBtn onClick={()=>navigate('/chat')}><ArrowLeft size={22}/></BackBtn>
        <Avatar $s="40px">{other.nombre?.[0]||'U'}</Avatar>
        <ChatInfo>
          <ChatName>{other.nombre}</ChatName>
          <ChatStatus>● {servicio?.titulo||'Chat'}</ChatStatus>
        </ChatInfo>
      </ChatHeader>

      {servicio&&(
        <ServMini>
          <Badge $c="success">{servicio.categoria||'Servicio'}</Badge>
          <MiniInfo>
            <MiniTitle>{servicio.titulo}</MiniTitle>
            <MiniPrice>${(servicio.precio||0).toLocaleString()}</MiniPrice>
          </MiniInfo>
        </ServMini>
      )}

      <MessagesArea ref={msgsRef}>
        {loadingMsgs?
          <EmptyState><Spinner $s="28px"/></EmptyState>:
          <>
            {msgs.length===0&&<EmptyState><p style={{color:'#C4C9D4'}}>Sin mensajes aún</p></EmptyState>}
            {msgs.map((m,i)=>(
              <Bubble key={m.id||m._tmp||i} $m={m.esMio}>
                {m.contenido}
                <MsgTime $m={m.esMio}>{formatTime(m.created_en||m.creado_en)}</MsgTime>
              </Bubble>
            ))}
          </>
        }
      </MessagesArea>

      <InputArea>
        <input
          style={{flex:1,minHeight:48,padding:'12px 16px',background:'#F5F5F5',
            border:'1.5px solid #F0F0F0',borderRadius:14,color:'#333333',fontSize:16,
            fontFamily:'inherit',outline:'none'}}
          placeholder="Escribe un mensaje..."
          value={text} onChange={e=>setText(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&enviar()}
        />
        <SendBtn onClick={enviar} disabled={!text.trim()}>
          <Send size={20} color="white"/>
        </SendBtn>
      </InputArea>
    </PageWrap>
  );
};
export default Chat;
