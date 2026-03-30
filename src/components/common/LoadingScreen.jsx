import styled, { keyframes } from 'styled-components';

const rotate = keyframes`to{transform:rotate(360deg)}`;
const fadeIn = keyframes`from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}`;

const Wrap = styled.div`
  position: fixed; inset: 0;
  background: linear-gradient(135deg, #8A2BE2 0%, #6A0DAD 50%, #4A0E8F 100%);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 24px; z-index: 9999;
`;

const Logo = styled.div`
  font-size: 2.4rem; font-weight: 900;
  color: white; letter-spacing: -0.03em;
  animation: ${fadeIn} 0.6s ease both;
  text-shadow: 0 4px 20px rgba(0,0,0,0.2);
`;

const Sub = styled.div`
  font-size: 0.9rem; color: rgba(255,255,255,0.7);
  font-weight: 500; animation: ${fadeIn} 0.6s ease both 0.2s;
`;

const SpinRing = styled.div`
  width: 36px; height: 36px;
  border: 3px solid rgba(255,255,255,0.15);
  border-top-color: white;
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite, ${fadeIn} 0.4s ease both 0.3s;
`;

const LoadingScreen = () => (
  <Wrap>
    <Logo>Mingo</Logo>
    <Sub>Tu comunidad de trabajo</Sub>
    <SpinRing />
  </Wrap>
);

export default LoadingScreen;
