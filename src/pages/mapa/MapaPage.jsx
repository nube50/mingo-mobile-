import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {MapPin,Star,Clock,Navigation} from 'lucide-react';
import {MapContainer,TileLayer,Marker,Popup,useMap} from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';
import {Card,Badge,Avatar,PageWrap,SpinnerDark,SectionTitle} from '../../components/common/UI';
import DetalleModal from '../../components/common/DetalleModal';
import 'leaflet/dist/leaflet.css';

const MapWrapper = styled.div`
  height: 45vh;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  gap: 8px;
`;

const LocationBtn = styled.button`
  flex: 1;
  padding: 10px 16px;
  background: white;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #333333;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  cursor: pointer;
  &:active { transform: scale(0.98); }
`;

const ListSection = styled.div`
  padding: 16px;
  background: #F8F9FA;
  min-height: 50vh;
`;

const SolicitudCard = styled(Card)`
  margin-bottom: 12px;
  cursor: pointer;
  &:active { transform: scale(0.98); }
`;

const CardHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
`;

const CardInfo = styled.div`flex: 1;`;

const CardTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #333333;
`;

const CardMeta = styled.div`
  display: flex;
  gap: 8px;
  font-size: 0.75rem;
  color: #6B7280;
  margin-top: 4px;
`;

const PriceTag = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: #10B981;
`;

const DistTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(16,185,129,0.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #10B981;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6B7280;
`;

const MarkerIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    background: linear-gradient(135deg, #8A2BE2, #6A0DAD);
    width: 40px;
    height: 40px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(138,43,226,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <div style="
      transform: rotate(45deg);
      color: white;
      font-size: 14px;
      font-weight: 800;
    "></div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const UserMarkerIcon = L.divIcon({
  className: 'user-marker',
  html: `<div style="
    background: #3B82F6;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(59,130,246,0.5);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapCenter({position}) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);
  return null;
}

const MapaPage = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  useEffect(() => {
    cargarSolicitudes();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setUserPos([4.624335, -74.063644]);
      return;
    }
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLoadingLoc(false);
      },
      () => {
        setUserPos([4.624335, -74.063644]);
        setLoadingLoc(false);
      },
      {timeout: 10000}
    );
  };

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/solicitudes/disponibles');
      setSolicitudes(res.data?.solicitudes || []);
    } catch (e) {
      console.error('Error:', e);
      setSolicitudes([]);
    }
    setLoading(false);
  };

  const formatPrice = (price) => {
    if (!price) return 'A convenir';
    return '$' + parseFloat(price).toLocaleString('es-CO');
  };

  const handleCardClick = (s) => {
    setSelectedId(s.id);
    setSelectedSolicitud(s);
    if (s.latitud && s.longitud) {
      setUserPos([parseFloat(s.latitud), parseFloat(s.longitud)]);
    }
  };

  const handleCoger = () => {
    cargarSolicitudes();
    setSelectedSolicitud(null);
  };

  const handleContactar = (solicitudId) => {
    setSelectedSolicitud(null);
    navigate('/chat/' + solicitudId);
  };

  const defaultCenter = userPos || [4.624335, -74.063644];

  return (
    <PageWrap style={{paddingBottom: 0}}>
      <MapWrapper>
        <MapOverlay>
          <LocationBtn onClick={getUserLocation} disabled={loadingLoc}>
            {loadingLoc ? <SpinnerDark $s="16px" /> : <Navigation size={16} color="#3B82F6" />}
            {loadingLoc ? 'Buscando...' : 'Mi ubicacion'}
          </LocationBtn>
        </MapOverlay>
        
        <MapContainer
          center={defaultCenter}
          zoom={14}
          style={{height: '100%', width: '100%'}}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {userPos && <Marker position={userPos} icon={UserMarkerIcon} />}
          
          {solicitudes.map((s) => {
            if (!s.latitud || !s.longitud) return null;
            return (
              <Marker
                key={s.id}
                position={[parseFloat(s.latitud), parseFloat(s.longitud)]}
                icon={selectedId === s.id ? MarkerIcon : MarkerIcon}
                eventHandlers={{click: () => handleCardClick(s)}}
              >
                <Popup>
                  <div style={{minWidth: 180, padding: '4px 0'}}>
                    <strong style={{fontSize: '0.9rem'}}>{s.titulo}</strong>
                    <p style={{fontSize: '0.8rem', color: '#6B7280', margin: '4px 0'}}>
                      {s.direccion_texto?.split(',')[0]}
                    </p>
                    <p style={{fontSize: '1rem', fontWeight: 700, color: '#10B981'}}>
                      {formatPrice(s.presupuesto_cliente)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          <MapCenter position={userPos} />
        </MapContainer>
      </MapWrapper>

      <ListSection>
        <SectionTitle style={{marginBottom: 12}}>
          {solicitudes.length} trabajitos cerca
        </SectionTitle>
        
        {loading ? (
          <EmptyState><SpinnerDark $s="28px" /></EmptyState>
        ) : solicitudes.length === 0 ? (
          <EmptyState>
            <MapPin size={48} color="#C4C9D4" />
            <p>No hay trabajitos disponibles</p>
          </EmptyState>
        ) : (
          solicitudes.map((s) => (
            <SolicitudCard 
              key={s.id} 
              onClick={() => handleCardClick(s)}
              style={{
                borderLeft: selectedId === s.id ? '4px solid #8A2BE2' : '4px solid transparent'
              }}
            >
              <CardHeader>
                <Avatar $s="44px">{s.nombre_cliente?.charAt(0) || 'T'}</Avatar>
                <CardInfo>
                  <CardTitle>{s.titulo}</CardTitle>
                  <CardMeta>
                    <Star size={11} color="#F59E0B" fill="#F59E0B"/>
                    {s.nombre_cliente}
                  </CardMeta>
                  <CardMeta style={{marginTop: 4}}>
                    <MapPin size={10} />
                    {s.direccion_texto?.split(',')[0] || 'Colombia'}
                    {s.distancia_km && <span style={{color: '#10B981', marginLeft: 4}}>{s.distancia_km.toFixed(1)}km</span>}
                  </CardMeta>
                </CardInfo>
                <PriceTag>{formatPrice(s.presupuesto_cliente)}</PriceTag>
              </CardHeader>
              {s.distancia_km && (
                <DistTag>
                  <MapPin size={10} />
                  {s.distancia_km.toFixed(1)} km
                </DistTag>
              )}
            </SolicitudCard>
          ))
        )}
      </ListSection>

      {selectedSolicitud && (
        <DetalleModal
          solicitud={selectedSolicitud}
          onClose={() => setSelectedSolicitud(null)}
          onCoger={handleCoger}
          onContactar={handleContactar}
        />
      )}
    </PageWrap>
  );
};

export default MapaPage;
