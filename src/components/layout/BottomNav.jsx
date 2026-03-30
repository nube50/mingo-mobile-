import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map, Briefcase, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const pulse = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.15)}`;

const Nav = styled.nav`
  position: fixed; bottom: 0; left: 0; right: 0;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(138, 43, 226, 0.06);
  display: flex; z-index: 100;
  padding: 6px 16px 0;
  padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.04);
  @media(min-width: 520px) {
    left: 50%; transform: translateX(-50%); max-width: 480px;
  }
`;

const Item = styled.button`
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 3px; padding: 8px 4px 10px;
  background: none; border: none; cursor: pointer;
  min-height: 56px; position: relative;
  transition: all 0.2s;
  &:active { transform: scale(0.9); }
`;

const IconWrap = styled.div`
  width: 44px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 16px;
  background: ${({ $active }) => $active
    ? 'linear-gradient(135deg, #8A2BE2 0%, #9D4EDD 100%)'
    : 'transparent'};
  box-shadow: ${({ $active }) => $active
    ? '0 4px 14px rgba(138,43,226,0.4)'
    : 'none'};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateY(${({ $active }) => $active ? '-2px' : '0'});
`;

const IconColor = styled.div`
  color: ${({ $active }) => $active ? '#FFFFFF' : '#A0A5B0'};
  display: flex; align-items: center; justify-content: center;
  transition: all 0.25s;
  transform: scale(${({ $active }) => $active ? 1.1 : 1});
`;

const Lbl = styled.span`
  font-size: 0.65rem;
  font-weight: ${({ $active }) => $active ? 800 : 600};
  color: ${({ $active }) => $active ? '#8A2BE2' : '#A0A5B0'};
  transition: all 0.2s;
  letter-spacing: 0.01em;
`;

const ChatBadge = styled.div`
  position: absolute; top: 4px; left: 50%; transform: translateX(8px);
  min-width: 18px; height: 18px;
  background: linear-gradient(135deg, #EF4444, #DC2626);
  border-radius: 9px; font-size: 0.6rem; font-weight: 800; color: white;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
  animation: ${pulse} 2s ease-in-out infinite;
  box-shadow: 0 2px 8px rgba(239,68,68,0.5);
  border: 2px solid white;
`;

const ActiveDot = styled.div`
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 5px; height: 5px; border-radius: 50%;
  background: #8A2BE2;
  box-shadow: 0 0 10px rgba(138,43,226,0.7);
`;

const ITEMS = [
  { icon: Map, label: 'Mapa', path: '/home' },
  { icon: Briefcase, label: 'Mis Jobs', path: '/mis-solicitudes' },
  { icon: MessageCircle, label: 'Chat', path: '/chat', showBadge: true },
  { icon: User, label: 'Perfil', path: '/perfil' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { unreadMessages } = useAuth();

  const isActive = (p) => {
    if (p === '/home') return pathname === '/home';
    return pathname.startsWith(p);
  };

  return (
    <Nav>
      {ITEMS.map(({ icon: Ico, label, path, showBadge }) => {
        const a = isActive(path);
        return (
          <Item key={path} onClick={() => navigate(path)}>
            {a && <ActiveDot />}
            <IconWrap $active={a}>
              <IconColor $active={a}>
                <Ico size={20} strokeWidth={a ? 2.5 : 2} />
              </IconColor>
            </IconWrap>
            {showBadge && unreadMessages > 0 && (
              <ChatBadge>{unreadMessages > 99 ? '99+' : unreadMessages}</ChatBadge>
            )}
            <Lbl $active={a}>{label}</Lbl>
          </Item>
        );
      })}
    </Nav>
  );
};

export default BottomNav;
