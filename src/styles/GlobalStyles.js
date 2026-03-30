import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  
  *, *::before, *::after {
    box-sizing: border-box; margin: 0; padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  html {
    font-size: 16px; -webkit-text-size-adjust: 100%;
    height: 100%; background: #fff;
  }
  body {
    font-family: ${({ theme }) => theme.fonts.base};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5; min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden; overscroll-behavior-y: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }
  #root { min-height: 100vh; min-height: 100dvh; position: relative; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; touch-action: manipulation; }
  input, textarea, select { font-family: inherit; font-size: 16px; -webkit-appearance: none; }
  img { max-width: 100%; display: block; }
  ::-webkit-scrollbar { width: 0; }

  /* Capacitor safe areas */
  .safe-area-top { padding-top: env(safe-area-inset-top, 0px); }
  .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }

  /* Leaflet customizations */
  .leaflet-container {
    width: 100%;
    height: 100%;
    z-index: 1;
    font-family: ${({ theme }) => theme.fonts.base};
  }
  .leaflet-control-zoom { display: none !important; }
  .leaflet-control-attribution { display: none !important; }
  
  .custom-marker-pulse {
    animation: marker-pulse 2s ease-in-out infinite;
  }
  @keyframes marker-pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 0.4; }
  }
  
  .user-location-pulse {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: rgba(59,130,246,0.15);
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation: user-pulse 2.5s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes user-pulse {
    0%, 100% { transform: translate(-50%,-50%) scale(0.5); opacity: 0.9; }
    50% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
  }
`;

export default GlobalStyles;
