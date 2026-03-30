import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Geolocation } from '@capacitor/geolocation';
import {
  Search, Star, MapPin, Plus, Navigation, Crosshair, Sparkles, Briefcase,
  MessageCircle, Zap
} from 'lucide-react';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DetalleModal from '../../components/common/DetalleModal';
import CrearSolicitudModal from '../../components/common/CrearSolicitudModal';
import 'leaflet/dist/leaflet.css';

/* ─── Estilos y Animaciones de Alto Nivel ─── */
const pulse = keyframes`0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0}`;
const glow = keyframes`0%,100%{box-shadow:0 0 10px rgba(138,43,226,0.3)}50%{box-shadow:0 0 25px rgba(138,43,226,0.6)}`;

const AppContainer = styled.div`
  position: fixed; inset: 0;
  background: #0F0F1A;
  font-family: 'Inter', sans-serif;
`;

const MapHeader = styled.div`
  position: absolute; top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: calc(env(safe-area-inset-top, 12px) + 12px) 16px 12px;
  display: flex; gap: 10px;
  pointer-events: none;
  > * { pointer-events: auto; }
`;

const SearchBar = styled.button`
  flex: 1; display: flex; align-items: center; gap: 12px;
  padding: 14px 18px;
  background: rgba(255,255,255,0.98);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  color: #6B7280; font-size: 0.95rem; font-weight: 500;
  transition: all 0.2s;
  &:active { transform: scale(0.97); }
`;

const HeaderBtn = styled.button`
  width: 52px; height: 52px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  display: flex; align-items: center; justify-content: center;
  border: none; color: #1A1A2E; position: relative;
  &:active { transform: scale(0.92); }
`;

const NotifBadge = styled.div`
  position: absolute; top: -2px; right: -2px;
  min-width: 20px; height: 20px;
  background: #EF4444; border-radius: 10px;
  font-size: 0.7rem; font-weight: 800; color: white;
  display: flex; align-items: center; justify-content: center;
  border: 3px solid white;
`;

const MapControls = styled.div`
  position: absolute; right: 16px; bottom: 50%; z-index: 1000;
  display: flex; flex-direction: column; gap: 12px;
  pointer-events: none;
  > * { pointer-events: auto; }
`;

const MapCtrlBtn = styled.button`
  width: 50px; height: 50px;
  border-radius: 15px;
  background: white;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  display: flex; align-items: center; justify-content: center;
  border: none; color: #333;
  transition: all 0.2s;
  &:active { transform: scale(0.9); }
`;

const FAB = styled(motion.button)`
  position: absolute; z-index: 1000;
  width: 64px; height: 64px;
  border-radius: 22px;
  background: linear-gradient(135deg, #8A2BE2 0%, #6A0DAD 100%);
  color: white; border: none;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 12px 30px rgba(138,43,226,0.4);
  right: 16px; bottom: 42%;
  animation: ${glow} 3s infinite;
`;

const QuickActions = styled.div`
  position: fixed; bottom: calc(90px + env(safe-area-inset-bottom, 0px));
  left: 0; right: 0; z-index: 999;
  display: flex; gap: 10px; padding: 0 16px;
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; }
`;

const ActionPill = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 20px; flex-shrink: 0;
  font-size: 0.85rem; font-weight: 700;
  border: none;
  background: ${({ $pri }) => $pri ? 'white' : 'rgba(255,255,255,0.9)'};
  color: ${({ $pri }) => $pri ? '#8A2BE2' : '#1A1A2E'};
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.2s;
  &:active { transform: scale(0.95); }
`;

/* ─── Marcadores Customizados (Estilo Uber) ─── */
const UserIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:24px;height:24px;">
    <div style="position:absolute;inset:-8px;border-radius:50%;background:rgba(59,130,246,0.3);animation:${pulse} 2s infinite"></div>
    <div style="width:24px;height:24px;border-radius:50%;background:#3B82F6;border:3px solid white;box-shadow:0 4px 12px rgba(59,130,246,0.4);position:relative;z-index:2"></div>
  </div>`,
  iconSize: [24, 24], iconAnchor: [12, 12],
});

const createJobMarker = (emoji, isSelected = false) => L.divIcon({
  className: '',
  html: `<div style="
    width:${isSelected ? '54px' : '48px'}; height:${isSelected ? '54px' : '48px'};
    border-radius:16px; background:${isSelected ? '#8A2BE2' : 'white'};
    display:flex; align-items:center; justify-content:center;
    font-size:${isSelected ? '1.8rem' : '1.5rem'};
    box-shadow: 0 8px 24px ${isSelected ? 'rgba(138,43,226,0.4)' : 'rgba(0,0,0,0.15)'};
    border: 3px solid ${isSelected ? 'white' : 'rgba(138,43,226,0.1)'};
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: ${isSelected ? 'scale(1.15) translateY(-5px)' : 'scale(1)'};
  ">${emoji}</div>`,
  iconSize: [48, 48], iconAnchor: [24, 24],
});

/* ─── Utilidades ─── */
const getCategoryEmoji = (t, d) => {
  const s = ((t||'')+' '+(d||'')).toLowerCase();
  if (s.includes('limp')) return '🧹';
  if (s.includes('plom')) return '🔧';
  if (s.includes('elect')) return '⚡';
  if (s.includes('pint')) return '🎨';
  if (s.includes('mudan')) return '🚚';
  return '⭐';
};

function MapViewHandler({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 15, { duration: 1.5, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
}

/* ─── COMPONENTE PRINCIPAL ─── */
const Home = () => {
  const navigate = useNavigate();
  const { usuario, socketEvents, unreadMessages } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);

  // 1. Geolocalización Nativa con Capacitor
  const updateLocation = useCallback(async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000
      });
      const coords = [position.coords.latitude, position.coords.longitude];
      setUserPos(coords);
      if (!userPos) setFlyTarget(coords);
    } catch (e) {
      console.warn('Error en Geolocalización Nativa, usando fallback', e);
      const fallback = [4.6243, -74.0636]; // Bogotá
      setUserPos(fallback);
      setFlyTarget(fallback);
    }
  }, [userPos]);

  useEffect(() => {
    updateLocation();
    const watchId = Geolocation.watchPosition({ enableHighAccuracy: true }, (pos) => {
      if (pos) setUserPos([pos.coords.latitude, pos.coords.longitude]);
    });
    return () => Geolocation.clearWatch({ id: watchId });
  }, []);

  // 2. Carga de Datos
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/solicitudes/disponibles');
      setServicios(res.data?.solicitudes || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 3. WebSockets en Tiempo Real
  useEffect(() => {
    if (!socketEvents?.length) return;
    const last = socketEvents[socketEvents.length - 1];
    
    if (last.type === 'nueva_solicitud') {
      const newJob = {
        id: last.data.solicitud_id,
        titulo: last.data.categoria,
        descripcion: last.data.descripcion,
        latitud: last.data.latitud, // El backend debe enviar estos datos
        longitud: last.data.longitud,
        distancia_km: last.data.distancia_km,
        estado: 'publicada'
      };
      setServicios(prev => [newJob, ...prev.filter(s => s.id !== newJob.id)]);
    }
  }, [socketEvents]);

  const handleMarkerTap = (s) => {
    setHighlightedId(s.id);
    setSelectedJob(s);
    setFlyTarget([parseFloat(s.latitud), parseFloat(s.longitud)]);
  };

  return (
    <AppContainer>
      <MapContainer
        center={userPos || [4.6243, -74.0636]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        
        {flyTarget && <MapViewHandler center={flyTarget} />}
        {userPos && <Marker position={userPos} icon={UserIcon} />}
        
        {servicios.map(s => (
          s.latitud && s.longitud && (
            <Marker
              key={s.id}
              position={[parseFloat(s.latitud), parseFloat(s.longitud)]}
              icon={createJobMarker(getCategoryEmoji(s.titulo, s.descripcion), highlightedId === s.id)}
              eventHandlers={{ click: () => handleMarkerTap(s) }}
            />
          )
        ))}
      </MapContainer>

      {/* Interfaz Superior */}
      <MapHeader>
        <SearchBar onClick={() => navigate('/buscar')}>
          <Search size={18} color="#8A2BE2" />
          <span>¿Qué ayuda necesitas hoy?</span>
        </SearchBar>
        <HeaderBtn onClick={() => navigate('/chat')}>
          <MessageCircle size={22} />
          {unreadMessages > 0 && <NotifBadge>{unreadMessages}</NotifBadge>}
        </HeaderBtn>
      </MapHeader>

      {/* Controles de Mapa */}
      <MapControls>
        <MapCtrlBtn onClick={() => setFlyTarget([...userPos])}>
          <Crosshair size={22} color="#3B82F6" />
        </MapCtrlBtn>
        <MapCtrlBtn onClick={fetchData}>
          <Navigation size={22} color="#8A2BE2" />
        </MapCtrlBtn>
      </MapControls>

      {/* Acciones Rápidas */}
      <QuickActions>
        <ActionPill $pri onClick={fetchData}>
          <Sparkles size={16} /> Ver trabajitos ({servicios.length})
        </ActionPill>
        <ActionPill onClick={() => navigate('/mis-solicitudes')}>
          <Briefcase size={16} /> Mis Solicitudes
        </ActionPill>
        <ActionPill onClick={() => navigate('/misiones')}>
          <Zap size={16} /> Misiones Pro
        </ActionPill>
      </QuickActions>

      <FAB whileTap={{ scale: 0.9 }} onClick={() => setShowCreate(true)}>
        <Plus size={32} strokeWidth={2.5} />
      </FAB>

      {/* Modales Premium */}
      <AnimatePresence>
        {selectedJob && (
          <DetalleModal
            solicitud={selectedJob}
            onClose={() => { setSelectedJob(null); setHighlightedId(null); }}
            onCoger={() => { fetchData(); setSelectedJob(null); }}
            onContactar={(id) => navigate(`/chat/${id}`)}
          />
        )}
      </AnimatePresence>

      {showCreate && <CrearSolicitudModal onClose={() => setShowCreate(false)} onCreated={fetchData} />}
      
    </AppContainer>
  );
};

export default Home;
