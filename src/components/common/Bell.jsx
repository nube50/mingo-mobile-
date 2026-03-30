import{useState,useEffect}from 'react';
import styled,{keyframes}from 'styled-components';
import{Bell as BellIcon,X,Check,Clock,MessageCircle,PlusCircle,UserCheck,RefreshCw,Trash2}from 'lucide-react';

const fadeIn=keyframes`from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}`;
const slideIn=keyframes`from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}`;
const pulse=keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.15)}`;

const BellButton=styled.button`
  position:relative;
  width:44px;height:44px;
  background:${props=>props.$active?'linear-gradient(135deg,#F5E6FF,#E9D5FF)':'#F8F9FA'};
  border:none;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;
  transition:all .25s cubic-bezier(.4,0,.2,1);
  &:hover{transform:scale(1.05);box-shadow:0 4px 12px rgba(138,43,226,.2);}
  &:active{transform:scale(.95);}
`;

const BellIconStyled=styled(BellIcon)`
  color:${props=>props.$active?'#8A2BE2':'#6B7280'};
  transition:color .2s;
`;

const Badge=styled.div`
  position:absolute;top:-3px;right:-3px;
  min-width:20px;height:20px;
  background:linear-gradient(135deg,#EF4444,#DC2626);
  border-radius:10px;
  font-size:.65rem;font-weight:700;color:white;
  display:flex;align-items:center;justify-content:center;
  padding:0 5px;
  animation:${pulse} 2s ease-in-out infinite;
  box-shadow:0 2px 6px rgba(239,68,68,.4);
`;

const Overlay=styled.div`
  position:fixed;top:0;left:0;right:0;bottom:0;
  background:rgba(0,0,0,.4);
  backdrop-filter:blur(4px);
  z-index:599;
  animation:fadeIn .2s ease;
`;

const Panel=styled.div`
  position:fixed;top:0;right:0;bottom:0;
  width:100%;max-width:400px;
  background:#FAFAFA;
  box-shadow:-8px 0 40px rgba(0,0,0,.15);
  z-index:600;
  display:flex;flex-direction:column;
  animation:${slideIn} .3s cubic-bezier(.4,0,.2,1);
`;

const PanelHeader=styled.div`
  background:white;
  padding:20px 20px 16px;
  border-bottom:1px solid #F0F0F0;
`;

const PanelTitle=styled.h2`
  font-size:1.25rem;font-weight:700;color:#333333;
  margin-bottom:4px;
`;

const PanelSubtitle=styled.p`
  font-size:.8rem;color:#9CA3AF;
`;

const ActionBar=styled.div`
  display:flex;gap:8px;margin-top:12px;
`;

const ActionBtn=styled.button`
  display:flex;align-items:center;gap:6px;
  padding:8px 14px;
  background:${props=>props.$primary?'#8A2BE2':'#F3F4F6'};
  color:${props=>props.$primary?'white':'#6B7280'};
  border:none;border-radius:10px;
  font-size:.8rem;font-weight:600;
  cursor:pointer;
  transition:all .2s;
  &:hover{opacity:.9;transform:translateY(-1px);}
  &:active{transform:translateY(0);}
`;

const NotificationList=styled.div`
  flex:1;overflow-y:auto;
  padding:12px;
  scroll-behavior:smooth;
  &::-webkit-scrollbar{width:6px;}
  &::-webkit-scrollbar-track{background:transparent;}
  &::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:3px;}
`;

const SectionTitle=styled.div`
  font-size:.7rem;font-weight:700;color:#9CA3AF;
  text-transform:uppercase;letter-spacing:.5px;
  margin:8px 0 12px 4px;
`;

const NotificationItem=styled.div`
  background:${props=>props.$read?'white':'linear-gradient(135deg,#FFF9F7,#FFF5F2)'};
  border-radius:16px;
  padding:16px;
  margin-bottom:10px;
  border:1px solid ${props=>props.$read?'#F0F0F0':'#FFE4D9'};
  cursor:pointer;
  transition:all .2s cubic-bezier(.4,0,.2,1);
  display:flex;gap:14px;align-items:flex-start;
  &:hover{
    transform:translateX(-4px);
    box-shadow:0 4px 16px rgba(0,0,0,.08);
  }
  &:active{transform:scale(.98);}
`;

const NotifIconWrap=styled.div`
  width:44px;height:44px;
  border-radius:12px;
  background:${props=>{
    switch(props.$type){
      case'nueva_solicitud':return'linear-gradient(135deg,#FEF3C7,#FDE68A)';
      case'solicitud_aceptada':return'linear-gradient(135deg,#D1FAE5,#A7F3D0)';
      case'estado_actualizado':return'linear-gradient(135deg,#DBEAFE,#BFDBFE)';
      case'nuevo_mensaje':return'linear-gradient(135deg,#F3E8FF,#E9D5FF)';
      default:return'linear-gradient(135deg,#F3F4F6,#E5E7EB)';
    }
  }};
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
`;

const NotifContent=styled.div`
  flex:1;min-width:0;
`;

const NotifTitle=styled.div`
  font-size:.9rem;font-weight:700;color:#333333;
  margin-bottom:4px;
`;

const NotifBody=styled.div`
  font-size:.8rem;color:#6B7280;
  line-height:1.4;
  overflow:hidden;text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
`;

const NotifMeta=styled.div`
  display:flex;align-items:center;justify-content:space-between;
  margin-top:10px;
`;

const NotifTime=styled.div`
  display:flex;align-items:center;gap:4px;
  font-size:.7rem;color:#9CA3AF;
`;

const NotifStatus=styled.div`
  width:8px;height:8px;
  border-radius:50%;
  background:${props=>props.$read?'transparent':'#10B981'};
`;

const EmptyState=styled.div`
  text-align:center;padding:60px 20px;
  color:#9CA3AF;
`;

const EmptyIcon=styled.div`
  width:80px;height:80px;
  border-radius:50%;
  background:linear-gradient(135deg,#F3F4F6,#E5E7EB);
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 16px;
`;

const getIcon=(type)=>{
  switch(type){
    case'nueva_solicitud':return<PlusCircle size={22} color="#D97706"/>;
    case'solicitud_aceptada':return<UserCheck size={22} color="#059669"/>;
    case'estado_actualizado':return<RefreshCw size={22} color="#2563EB"/>;
    case'nuevo_mensaje':return<MessageCircle size={22} color="#9333EA"/>;
    default:return<BellIcon size={22} color="#6B7280"/>;
  }
};

const BellNotify=({notifications,onNotificationClick,onMarkAllRead,onClear})=>{
  const[open,setOpen]=useState(false);
  const unreadCount=notifications.filter(n=>!n.read).length;

  const formatTime=(date)=>{
    const now=new Date();
    const d=date instanceof Date?date:new Date(date);
    const diff=Math.floor((now-d)/1000);
    if(diff<60)return'ahora';
    if(diff<3600)return'hace '+Math.floor(diff/60)+'m';
    if(diff<86400)return'hace '+Math.floor(diff/3600)+'h';
    return d.toLocaleDateString('es-CO',{day:'numeric',month:'short'});
  };

  const handleItemClick=(notif)=>{
    onNotificationClick(notif);
    setOpen(false);
  };

  useEffect(()=>{
    const handleEscape=(e)=>{
      if(e.key==='Escape')setOpen(false);
    };
    if(open)document.addEventListener('keydown',handleEscape);
    return()=>document.removeEventListener('keydown',handleEscape);
  },[open]);

  const unreads=notifications.filter(n=>!n.read);
  const reads=notifications.filter(n=>n.read);

  return(
    <>
      <BellButton $active={unreadCount>0} onClick={()=>setOpen(true)}>
        <BellIconStyled size={22} $active={unreadCount>0}/>
        {unreadCount>0&&<Badge>{unreadCount>99?'99+':unreadCount}</Badge>}
      </BellButton>
      
      {open&&(
        <>
          <Overlay onClick={()=>setOpen(false)}/>
          <Panel>
            <PanelHeader>
              <PanelTitle>Notificaciones</PanelTitle>
              <PanelSubtitle>{unreadCount} sin leer</PanelSubtitle>
              <ActionBar>
                {unreadCount>0&&(
                  <ActionBtn onClick={onMarkAllRead}>
                    <Check size={14}/>Marcar leídas
                  </ActionBtn>
                )}
                {notifications.length>0&&(
                  <ActionBtn onClick={onClear}>
                    <Trash2 size={14}/>Limpiar
                  </ActionBtn>
                )}
              </ActionBar>
            </PanelHeader>
            
            <NotificationList>
              {notifications.length===0?(
                <EmptyState>
                  <EmptyIcon>
                    <BellIcon size={36} color="#9CA3AF"/>
                  </EmptyIcon>
                  <p style={{fontWeight:600,marginBottom:4}}>Todo tranquilo</p>
                  <p style={{fontSize:'.85rem'}}>No tienes notificaciones nuevas</p>
                </EmptyState>
              ):(
                <>
                  {unreads.length>0&&(
                    <>
                      <SectionTitle>Nuevas</SectionTitle>
                      {unreads.map(notif=>(
                        <NotificationItem key={notif.id} $read={false} onClick={()=>handleItemClick(notif)}>
                          <NotifIconWrap $type={notif.type}>
                            {getIcon(notif.type)}
                          </NotifIconWrap>
                          <NotifContent>
                            <NotifTitle>{notif.title}</NotifTitle>
                            <NotifBody>{notif.body}</NotifBody>
                            <NotifMeta>
                              <NotifTime><Clock size={11}/>{formatTime(notif.timestamp)}</NotifTime>
                              <NotifStatus $read={false}/>
                            </NotifMeta>
                          </NotifContent>
                        </NotificationItem>
                      ))}
                    </>
                  )}
                  {reads.length>0&&(
                    <>
                      <SectionTitle>Anteriores</SectionTitle>
                      {reads.map(notif=>(
                        <NotificationItem key={notif.id} $read={true} onClick={()=>handleItemClick(notif)}>
                          <NotifIconWrap $type={notif.type}>
                            {getIcon(notif.type)}
                          </NotifIconWrap>
                          <NotifContent>
                            <NotifTitle style={{color:'#6B7280'}}>{notif.title}</NotifTitle>
                            <NotifBody style={{color:'#9CA3AF'}}>{notif.body}</NotifBody>
                            <NotifMeta>
                              <NotifTime style={{color:'#D1D5DB'}}><Clock size={11}/>{formatTime(notif.timestamp)}</NotifTime>
                              <NotifStatus $read={true}/>
                            </NotifMeta>
                          </NotifContent>
                        </NotificationItem>
                      ))}
                    </>
                  )}
                </>
              )}
            </NotificationList>
          </Panel>
        </>
      )}
    </>
  );
};

export default BellNotify;
