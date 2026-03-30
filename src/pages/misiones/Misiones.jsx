import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';
import {Briefcase, Users, Calendar, MapPin, DollarSign, Clock, Plus, CheckCircle, XCircle, MessageCircle, Info} from 'lucide-react';
import api from '../../services/api';
import MissionDetailModal from '../../components/common/MissionDetailModal';
import {Card, Badge, Avatar, Row, Stack, SectionTitle, Spinner, EmptyState, PageWrap, Button} from '../../components/common/UI';

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
  padding: 8px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  cursor: pointer;
  background: ${props => props.$a ? 'white' : 'transparent'};
  color: ${props => props.$a ? '#8A2BE2' : '#6B7280'};
  box-shadow: ${props => props.$a ? '0 2px 4px rgba(138,43,226,0.15)' : 'none'};
  transition: all 0.15s;
`;

const MisionCard = styled(Card)`
  animation: ${fadeUp} 0.3s ease both;
  cursor: pointer;
  transition: transform 0.15s;
  &:active { transform: scale(0.98); }
`;

const MisionHead = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const MisionInfo = styled.div`
  flex: 1;
`;

const MisionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 4px;
`;

const MisionMeta = styled.div`
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

const MisionDesc = styled.p`
  font-size: 0.85rem;
  color: #6B7280;
  line-height: 1.4;
  margin-bottom: 12px;
`;

const MisionFooter = styled.div`
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

const ApplyBtn = styled.button`
  padding: 8px 20px;
  border-radius: 10px;
  background: #8A2BE2;
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  font-family: inherit;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(244, 131, 92, 0.3);
  &:active { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #F0F0F0;
  border-radius: 3px;
  margin-top: 12px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #8A2BE2, #6A0DAD);
  border-radius: 3px;
  width: ${props => {
    if (!props.$total || props.$total === 0) return '0%';
    return Math.min((props.$confirmados / props.$total) * 100, 100) + '%';
  }};
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #F5E6FF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

const VerDetalleBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(138,43,226,0.1);
  color: #8A2BE2;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 10px;
`;

const Misiones = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('disponibles');
  const [misiones, setMisiones] = useState([]);
  const [misMisiones, setMisMisiones] = useState({como_creador: [], como_participante: []});
  const [loading, setLoading] = useState(false);
  const [selectedMision, setSelectedMision] = useState(null);

  const cargarMisiones = async () => {
    setLoading(true);
    try {
      const res = await api.get('/misiones');
      setMisiones(res.data.misiones || []);
    } catch (e) {
      console.error('Error:', e);
      setMisiones([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarMisMisiones = async () => {
    try {
      const res = await api.get('/misiones/mis-misiones');
      setMisMisiones(res.data);
    } catch (e) {
      console.error('Error:', e);
    }
  };

  useEffect(() => {
    if (tab === 'disponibles') {
      cargarMisiones();
    } else {
      cargarMisMisiones();
    }
  }, [tab]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', {day: 'numeric', month: 'short'});
  };

  const formatPrice = (price) => {
    if (!price) return 'A convenir';
    return '$' + parseFloat(price).toLocaleString('es-CO');
  };

  const getBadgeVariant = (estado) => {
    switch(estado) {
      case 'abierta': return 'success';
      case 'en_proceso': return 'error';
      case 'completada': return 'muted';
      default: return 'muted';
    }
  };

  const handleSumarse = () => {
    cargarMisiones();
  };

  const handleCardClick = (mision) => {
    setSelectedMision(mision);
  };

  return (
    <PageWrap>
      <Header>
        <HeaderTitle>Misiones</HeaderTitle>
        <HeaderSub>Trabajos en masa para empresas</HeaderSub>
      </Header>

      <TabRow>
        <TabBtn $a={tab === 'disponibles'} onClick={() => setTab('disponibles')}>
          Disponibles
        </TabBtn>
        <TabBtn $a={tab === 'mis'} onClick={() => setTab('mis')}>
          Mis Misiones
        </TabBtn>
      </TabRow>

      <div style={{padding: '0 16px 16px'}}>
        {loading ? (
          <EmptyState><Spinner $s="28px" /></EmptyState>
        ) : tab === 'disponibles' ? (
          <>
            <SectionTitle style={{marginBottom: '12px'}}>
              {misiones.length} misiones disponibles
            </SectionTitle>
            
            {misiones.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <Briefcase size={32} color="#8A2BE2" />
                </EmptyIcon>
                <p>No hay misiones disponibles</p>
                <p style={{fontSize: '0.78rem', color: '#C4C9D4'}}>
                  Las empresas pronto lanzarán misiones
                </p>
              </EmptyState>
            ) : (
              <Stack $g="12px">
                {misiones.map((m, i) => (
                  <MisionCard 
                    key={m.id || i} 
                    style={{animationDelay: i * 0.05 + 's'}}
                    onClick={() => handleCardClick(m)}
                  >
                    <MisionHead>
                      <Avatar $s="48px" style={{background: 'linear-gradient(135deg, #8A2BE2, #6A0DAD)'}}>
                        {m.creador_nombre ? m.creador_nombre.charAt(0) : 'E'}
                      </Avatar>
                      <MisionInfo>
                        <MisionTitle>{m.titulo}</MisionTitle>
                        <MisionMeta>
                          <MetaItem>
                            <Users size={12} />
                            {m.personas_requeridas} personas
                          </MetaItem>
                          <MetaItem>
                            <Calendar size={12} />
                            {formatDate(m.fecha_inicio)}
                          </MetaItem>
                          {m.direccion && (
                            <MetaItem>
                              <MapPin size={12} />
                              {m.direccion.substring(0, 15)}...
                            </MetaItem>
                          )}
                        </MisionMeta>
                      </MisionInfo>
                      <Badge $c={getBadgeVariant(m.estado)}>
                        {m.estado}
                      </Badge>
                    </MisionHead>
                    
                    <MisionDesc>{m.descripcion}</MisionDesc>
                    
                    <ProgressBar>
                      <ProgressFill 
                        $confirmados={m.personas_confirmadas || 0} 
                        $total={m.personas_requeridas} 
                      />
                    </ProgressBar>
                    <div style={{fontSize: '0.72rem', color: '#6B7280', marginTop: '4px'}}>
                      {m.personas_confirmadas || 0} de {m.personas_requeridas} confirmados
                    </div>
                    
                    <MisionFooter>
                      <div>
                        <PriceTag>{formatPrice(m.remuneracion)}</PriceTag>
                        <div style={{fontSize: '0.72rem', color: '#C4C9D4'}}>por persona</div>
                      </div>
                      <ApplyBtn onClick={(e) => {e.stopPropagation(); handleCardClick(m);}}>
                        Ver detalles
                      </ApplyBtn>
                    </MisionFooter>
                    <VerDetalleBtn onClick={(e) => {e.stopPropagation(); handleCardClick(m);}}>
                      <Info size={12} /> Toca para ver detalles completos
                    </VerDetalleBtn>
                  </MisionCard>
                ))}
              </Stack>
            )}
          </>
        ) : (
          <>
            <SectionTitle style={{marginBottom: '8px'}}>Como creador</SectionTitle>
            {misMisiones.como_creador.length === 0 ? (
              <p style={{fontSize: '0.85rem', color: '#6B7280', marginBottom: '16px'}}>
                No has creado misiones
              </p>
            ) : (
              <Stack $g="12px" style={{marginBottom: '20px'}}>
                {misMisiones.como_creador.map((m, i) => (
                  <MisionCard key={m.id || i}>
                    <MisionHead>
                      <MisionInfo>
                        <MisionTitle>{m.titulo}</MisionTitle>
                        <MisionMeta>
                          <MetaItem>
                            <Users size={12} />
                            {m.personas_requeridas} personas
                          </MetaItem>
                          <MetaItem>
                            <Calendar size={12} />
                            {formatDate(m.fecha_inicio)}
                          </MetaItem>
                        </MisionMeta>
                      </MisionInfo>
                      <Badge $c={getBadgeVariant(m.estado)}>{m.estado}</Badge>
                    </MisionHead>
                    <Row $g="12px">
                      <Badge $c="success">{m.confirmados || 0} confirmados</Badge>
                      <ApplyBtn 
                        style={{padding: '4px 12px', fontSize: '0.75rem'}}
                        onClick={() => navigate('/chat/mision/' + m.id)}
                      >
                        <MessageCircle size={12} /> Chat
                      </ApplyBtn>
                    </Row>
                  </MisionCard>
                ))}
              </Stack>
            )}

            <SectionTitle style={{marginBottom: '8px', marginTop: '8px'}}>Como participante</SectionTitle>
            {misMisiones.como_participante.length === 0 ? (
              <p style={{fontSize: '0.85rem', color: '#6B7280'}}>
                No te has sumarse a ninguna misión
              </p>
            ) : (
              <Stack $g="12px">
                {misMisiones.como_participante.map((m, i) => (
                  <MisionCard key={m.id || i}>
                    <MisionHead>
                      <MisionInfo>
                        <MisionTitle>{m.titulo}</MisionTitle>
                        <MisionMeta>
                          <MetaItem>
                            <Briefcase size={12} />
                            {m.creador_nombre}
                          </MetaItem>
                          <MetaItem>
                            <Calendar size={12} />
                            {formatDate(m.fecha_inicio)}
                          </MetaItem>
                        </MisionMeta>
                      </MisionInfo>
                      <Badge $c={m.mi_estado === 'confirmado' ? 'success' : m.mi_estado === 'rechazado' ? 'error' : 'muted'}>
                        {m.mi_estado === 'confirmado' ? <CheckCircle size={10} /> : 
                         m.mi_estado === 'rechazado' ? <XCircle size={10} /> : null}
                        {m.mi_estado}
                      </Badge>
                    </MisionHead>
                    <MisionDesc>{m.descripcion}</MisionDesc>
                    <MisionFooter>
                      <PriceTag>{formatPrice(m.remuneracion)}</PriceTag>
                      <ApplyBtn 
                        style={{padding: '4px 12px', fontSize: '0.75rem'}}
                        onClick={() => navigate('/chat/mision/' + m.id)}
                      >
                        <MessageCircle size={12} /> Chat
                      </ApplyBtn>
                    </MisionFooter>
                  </MisionCard>
                ))}
              </Stack>
            )}
          </>
        )}
      </div>

      {selectedMision && (
        <MissionDetailModal
          mision={selectedMision}
          onClose={() => setSelectedMision(null)}
          onSumarse={handleSumarse}
        />
      )}
    </PageWrap>
  );
};

export default Misiones;
