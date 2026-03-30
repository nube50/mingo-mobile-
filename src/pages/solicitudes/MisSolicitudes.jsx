import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';
import {Star, MapPin, Clock, MessageCircle, CheckCircle, XCircle, Play, User, Briefcase} from 'lucide-react';
import api from '../../services/api';
import {useAuth} from '../../context/AuthContext';
import {Card, Badge, Avatar, Row, Stack, SectionTitle, Spinner, SpinnerDark, EmptyState, PageWrap, Button} from '../../components/common/UI';
import DetalleModal from '../../components/common/DetalleModal';

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const Header = styled.div`
  background: linear-gradient(135deg, #8A2BE2 0%, #6A0DAD 100%);
  padding: 20px 16px 24px;
  border-radius: 0 0 24px 24px;
`;

const HeaderTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  margin-bottom: 4px;
`;

const HeaderSub = styled.p`
  font-size: 0.88rem;
  color: rgba(255,255,255,0.85);
`;

const TabRow = styled.div`
  display: flex;
  gap: 4px;
  background: #F5F5F5;
  border-radius: 12px;
  padding: 4px;
  margin: 16px;
`;

const TabBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  cursor: pointer;
  background: ${props => props.$a ? 'white' : 'transparent'};
  color: ${props => props.$a ? '#8A2BE2' : '#6B7280'};
  box-shadow: ${props => props.$a ? '0 2px 4px rgba(138,43,226,0.15)' : 'none'};
  transition: all 0.15s;
`;

const SolicitudCard = styled(Card)`
  animation: ${fadeUp} 0.3s ease both;
  cursor: pointer;
  transition: transform 0.15s;
  &:active { transform: scale(0.98); }
`;

const CardHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const CardInfo = styled.div`flex: 1;`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 4px;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.78rem;
  color: #6B7280;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
`;

const PriceTag = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: #10B981;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${props => props.$highlight ? '#FFF0EB' : '#F5F5F5'};
  border-radius: 10px;
  margin-top: 10px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #333333;
`;

const UserStats = styled.div`
  font-size: 0.72rem;
  color: #6B7280;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RatingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: rgba(245,158,11,.1);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: .68rem;
  font-weight: 700;
  color: #F59E0B;
`;

const StatusConfig = {
  'publicada': { bg: '#D1FAE5', color: '#059669', label: 'Disponible' },
  'aceptada': { bg: '#DBEAFE', color: '#2563EB', label: 'En conversación' },
  'en_curso': { bg: '#FEF3C7', color: '#D97706', label: 'En progreso' },
  'completada': { bg: '#F0F0F0', color: '#6B7280', label: 'Completado' },
  'cancelada': { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelado' }
};

const MisSolicitudes = () => {
  const {usuario} = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('cliente');
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [solicitudesCogidas, setSolicitudesCogidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  useEffect(() => {
    cargarSolicitudes();
  }, [tab]);

  const handleTabChange = (newTab) => {
    if (newTab !== tab) {
      setTab(newTab);
    }
  };

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      if (tab === 'cliente') {
        const res = await api.get('/solicitudes/mis-solicitudes');
        setMisSolicitudes(res.data.solicitudes || []);
      } else {
        const res = await api.get('/solicitudes/mis-trabajos');
        setSolicitudesCogidas(res.data.solicitudes || []);
      }
    } catch (e) {
      console.error('Error:', e);
      if (tab === 'cliente') setMisSolicitudes([]);
      else setSolicitudesCogidas([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', {day: 'numeric', month: 'short'});
  };

  const formatPrice = (price) => {
    if (!price) return 'A convenir';
    return '$' + parseFloat(price).toLocaleString('es-CO');
  };

  const getStatusBadge = (estado) => {
    const config = StatusConfig[estado] || StatusConfig['publicada'];
    return (
      <StatusBadge style={{background: config.bg, color: config.color}}>
        {estado === 'completada' && <CheckCircle size={10} />}
        {estado === 'cancelada' && <XCircle size={10} />}
        {config.label}
      </StatusBadge>
    );
  };

  const datos = tab === 'cliente' ? misSolicitudes : solicitudesCogidas;

  return (
    <PageWrap>
      <Header>
        <HeaderTitle>Mis Trabajitos</HeaderTitle>
        <HeaderSub>Seguimiento de tus servicios</HeaderSub>
      </Header>

      <TabRow>
        <TabBtn $a={tab === 'cliente'} onClick={() => handleTabChange('cliente')}>
          <Briefcase size={14} style={{marginRight: 4}}/>
          Mis publicaciones
        </TabBtn>
        <TabBtn $a={tab === 'prestador'} onClick={() => handleTabChange('prestador')}>
          <User size={14} style={{marginRight: 4}}/>
          Trabajos cogidos
        </TabBtn>
      </TabRow>

      <div style={{padding: '0 16px 16px'}}>
        {loading ? (
          <EmptyState style={{background: 'transparent'}}><SpinnerDark $s="32px" /></EmptyState>
        ) : datos.length === 0 ? (
          <EmptyState>
            <Briefcase size={48} color="#C4C9D4" />
            <p style={{marginTop: 12}}>
              {tab === 'cliente' 
                ? 'No has publicado trabajitos aún' 
                : 'No has cogido trabajos aún'}
            </p>
            <p style={{fontSize: '0.78rem', color: '#C4C9D4'}}>
              {tab === 'cliente' 
                ? 'Lanza tu primer trabajito desde el Home'
                : 'Explora trabajitos disponibles en Buscar'}
            </p>
          </EmptyState>
        ) : (
          <Stack $g="12px">
            {datos.map((s, i) => (
              <SolicitudCard 
                key={s.id || i} 
                style={{animationDelay: i * 0.05 + 's'}}
                onClick={() => setSelectedSolicitud(s)}
              >
                <CardHeader>
                  <Avatar $s="48px">
                    {tab === 'cliente' 
                      ? (s.nombre_prestador || s.nombre_cliente || 'T')[0]
                      : (s.nombre_cliente || 'T')[0]
                    }
                  </Avatar>
                  <CardInfo>
                    <CardTitle>{s.titulo || 'Trabajito'}</CardTitle>
                    <CardMeta>
                      <MetaItem>
                        <Star size={11} color="#F59E0B" fill="#F59E0B"/>
                        {s.nombre_cliente || 'Cliente'}
                        {s.calificacion_cliente && (
                          <span style={{color:'#F59E0B',fontWeight:700,marginLeft:2}}>
                            {parseFloat(s.calificacion_cliente).toFixed(1)}
                          </span>
                        )}
                      </MetaItem>
                      <MetaItem>
                        <MapPin size={10} />
                        {s.direccion_texto?.split(',')[0] || 'Colombia'}
                      </MetaItem>
                      <MetaItem>
                        <Clock size={10} />
                        {formatDate(s.creado_en)}
                      </MetaItem>
                    </CardMeta>
                  </CardInfo>
                  {getStatusBadge(s.estado)}
                </CardHeader>

                {tab === 'cliente' && s.nombre_prestador && s.estado !== 'publicada' && (
                  <UserCard $highlight>
                    <Avatar $s="44px" style={{background: '#3B82F6', boxShadow: '0 2px 8px rgba(59,130,246,0.3)'}}>
                      {s.nombre_prestador[0]}
                    </Avatar>
                    <UserInfo>
                      <UserName>{s.nombre_prestador}</UserName>
                      <UserStats>
                        <RatingBadge>
                          <Star size={10} fill="#F59E0B" color="#F59E0B"/>
                          {s.calificacion_prestador ? parseFloat(s.calificacion_prestador).toFixed(1) : '4.8'}
                        </RatingBadge>
                        <span style={{color:'#9CA3AF'}}>|</span>
                        <span style={{fontWeight:600,color:'#10B981'}}>{s.servicios_prestador || 0}</span>
                        <span style={{color:'#9CA3AF'}}>servicios</span>
                      </UserStats>
                    </UserInfo>
                    <Badge $c="primary">Prestador</Badge>
                  </UserCard>
                )}

                {tab === 'prestador' && s.nombre_cliente && (
                  <UserCard>
                    <Avatar $s="44px" style={{background:'#8A2BE2',boxShadow:'0 2px 8px rgba(138,43,226,0.3)'}}>
                      {s.nombre_cliente[0]}
                    </Avatar>
                    <UserInfo>
                      <UserName>{s.nombre_cliente}</UserName>
                      <UserStats>
                        <RatingBadge>
                          <Star size={10} fill="#F59E0B" color="#F59E0B"/>
                          {s.calificacion_cliente ? parseFloat(s.calificacion_cliente).toFixed(1) : '4.8'}
                        </RatingBadge>
                        <span style={{color:'#9CA3AF'}}>|</span>
                        <span style={{color:'#6B7280'}}>{s.categoria || 'Cliente'}</span>
                      </UserStats>
                    </UserInfo>
                    <Badge $c="warning">Cliente</Badge>
                  </UserCard>
                )}

                <CardFooter>
                  <PriceTag>{formatPrice(s.presupuesto_cliente)}</PriceTag>
                  {['aceptada', 'en_curso'].includes(s.estado) && (
                    <Badge $c="primary">
                      <MessageCircle size={10} /> Chat disponible
                    </Badge>
                  )}
                </CardFooter>
              </SolicitudCard>
            ))}
          </Stack>
        )}
      </div>

      {selectedSolicitud && (
        <DetalleModal
          solicitud={selectedSolicitud}
          onClose={() => setSelectedSolicitud(null)}
          onCoger={cargarSolicitudes}
          onContactar={(id) => {
            setSelectedSolicitud(null);
            navigate('/chat/' + id);
          }}
        />
      )}
    </PageWrap>
  );
};

export default MisSolicitudes;
