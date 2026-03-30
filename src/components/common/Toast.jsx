import styled, { keyframes } from 'styled-components';
import { CheckCircle, XCircle, Info } from 'lucide-react';
const up = keyframes`from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}`;
const Wrap = styled.div`
  position:fixed;bottom:82px;left:12px;right:12px;z-index:400;
  display:flex;flex-direction:column;gap:8px;pointer-events:none;
  @media(min-width:520px){left:50%;transform:translateX(-50%);width:456px;right:auto;}
`;
const Item = styled.div`
  display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:14px;
  animation:${up} .3s ease;pointer-events:all;font-weight:600;font-size:.9rem;
  box-shadow:0 4px 20px rgba(0,0,0,0.15);
  background:${({$t,theme})=>$t==='success'?theme.colors.success:$t==='error'?theme.colors.error:theme.colors.primary};
  color:white;
`;
const icons={success:<CheckCircle size={18}/>,error:<XCircle size={18}/>,info:<Info size={18}/>};
const Toast=({toasts})=><Wrap>{toasts.map(({id,msg,tipo})=><Item key={id} $t={tipo}>{icons[tipo]}{msg}</Item>)}</Wrap>;
export default Toast;
