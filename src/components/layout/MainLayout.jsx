import styled from 'styled-components';
import BottomNav from './BottomNav';
import GlobalNotifications from '../common/GlobalNotifications';
import { useAuth } from '../../context/AuthContext';

const Wrap = styled.div`
  width: 100%; min-height: 100vh; min-height: 100dvh;
  background: #fff; display: flex; justify-content: center;
`;

const Inner = styled.div`
  width: 100%; min-height: 100vh; min-height: 100dvh;
  background: #FAFAFE;
  position: relative; display: flex; flex-direction: column; overflow-x: hidden;
  @media(min-width: 520px) { max-width: 480px; box-shadow: 0 0 40px rgba(0,0,0,0.08); }
`;

const TopBar = styled.div`
  position: fixed; top: 0; left: 0; right: 0;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 100;
  padding: calc(env(safe-area-inset-top, 0px) + 8px) 16px 8px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid rgba(138, 43, 226, 0.06);
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
  @media(min-width: 520px) { left: 50%; transform: translateX(-50%); max-width: 480px; }
`;

const Logo = styled.div`
  font-size: 1.4rem; font-weight: 900;
  background: linear-gradient(135deg, #8A2BE2 0%, #6A0DAD 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
`;

const AvatarBtn = styled.div`
  width: 36px; height: 36px; border-radius: 12px;
  background: linear-gradient(135deg, #F5E6FF 0%, #E9D5FF 100%);
  color: #8A2BE2; font-size: 0.9rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 2px 8px rgba(138,43,226,0.15);
  transition: all 0.2s;
  &:active { transform: scale(0.9); }
`;

/**
 * MainLayout: Wrapper para páginas internas.
 * En modo `mapMode` solo renderiza BottomNav (el mapa Home ocupa todo).
 */
const MainLayout = ({ children, mapMode }) => {
  const { autenticado, usuario } = useAuth();

  if (mapMode) {
    return (
      <>
        <GlobalNotifications />
        {autenticado && <BottomNav />}
      </>
    );
  }

  return (
    <Wrap>
      <GlobalNotifications />
      {autenticado && (
        <TopBar>
          <Logo>Mingo</Logo>
          <AvatarBtn>{usuario?.nombre?.[0]?.toUpperCase() || 'U'}</AvatarBtn>
        </TopBar>
      )}
      <Inner style={{ paddingTop: autenticado ? '56px' : 0 }}>
        {children}
        {autenticado && <BottomNav />}
      </Inner>
    </Wrap>
  );
};

export default MainLayout;
