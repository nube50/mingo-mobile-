import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, DollarSign, Star, Clock, CheckCircle, MessageCircle, 
  Play, XCircle, UserCheck, ThumbsUp, ShieldCheck, ArrowRight
} from 'lucide-react';

import api from '../../services/api';
import { Avatar, Badge, Button } from './UI';
import { useAuth } from '../../context/AuthContext';

/* ─── Premium Animations ─── */
const shimmer = keyframes`0% { background-position: -200% 0; } 100% { background-position: 200% 0; }`;

const Overlay = styled(motion.div)`
  position: fixed; inset: 0;
  background: rgba(15, 15, 26, 0.7);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex; align-items: flex-end; justify-content: center;
`;

const ModalBox = styled(motion.div)`
  width: 100%; max-width: 500px;
  background: #FFFFFF;
  border-radius: 32px 32px 0 0;
  box-shadow: 0 -15px 50px rgba(0,0,0,0.25);
  display: flex; flex-direction: column;
  max-height: 94vh; overflow: hidden;
  position: relative;
`;

const Handle = styled.div`
  width: 40px; height: 5px; border-radius: 3px;
  background: #E5E7EB; margin: 12px auto 8px;
`;

const ModalHeader = styled.div`
  padding: 8px 24px 20px;
  display: flex; align-items: center; justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem; font-weight: 800; color: #1A1A2E;
  letter-spacing: -0.02em;
`;

const ModalContent = styled.div`
  flex: 1; overflow-y: auto; padding: 0 24px 32px;
  -webkit-overflow-scrolling: touch;
`;

/* ─── Cards & Sections ─── */
const InfoCard = styled.div`
  background: #F9FAFB; border-radius: 24px; padding: 20px;
  margin-bottom: 20px; border: 1px solid rgba(0,0,0,0.03);
`;

const UserStrip = styled.div`
  display: flex; align-items: center; gap: 16px;
  padding: 16px; background: #FFFFFF; border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  margin-bottom: 20px; border: 1.5px solid ${props => props.$pro ? '#8A2BE2' : '#F3F4F6'};
`;

const PriceRow = styled.div`
  display: flex; align-items: baseline; gap: 8px;
  margin-top: 10px;
`;

const PriceVal = styled.span`
  font-size: 2rem; font-weight: 900; color: #10B981;
  letter-spacing: -0.04em;
`;

const SectionHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px; margin-top: 24px;
`;

const LabelName = styled.h4`
  font-size: 0.75rem; font-weight: 800; color: #9CA3AF;
  text-transform: uppercase; letter-spacing: 0.05em;
`;

const DescText = styled.p`
  font-size: 1rem; color: #4B5563; line-height: 1.6;
  background: #F3F4F6; padding: 16px; border-radius: 18px;
`;

const StatusPill = styled.div`
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 15px;
  font-size: 0.85rem; font-weight: 700;
  background: ${props => {
    if (props.$s === 'publicada') return 'rgba(16, 185, 129, 0.15)';
    if (props.$s === 'aceptada') return 'rgba(138, 43, 226, 0.15)';
    if (props.$s === 'en_curso') return 'rgba(245, 158, 11, 0.15)';
    return '#F3F4F6';
  }};
  color: ${props => {
    if (props.$s === 'publicada') return '#10B981';
    if (props.$s === 'aceptada') return '#8A2BE2';
    if (props.$s === 'en_curso') return '#D97706';
    return '#6B7280';
  }};
`;

const Footer = styled.div`
  padding: 24px; border-top: 1px solid #F3F4F6;
  background: white; gap: 12px; display: flex; flex-direction: column;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
`;

const SuccessOverlay = styled(motion.div)`
  position: absolute; inset: 0; background: #10B981; z-index: 100;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: white; padding: 40px; text-align: center;
`;

const DetalleModal = ({ solicitud, onClose, onCoger, onContactar }) => {
  const { usuario } = useAuth();
  const [data, setData] = useState(solicitud);
  const [loading, setLoading] = useState(false);
  const [actionDone, setActionDone] = useState(false);
  const [error, setError] = useState(null);

  const esDuenio = data?.cliente_id === usuario?.id;
  const esAsignado = data?.prestador_id === usuario?.id;

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await api.get(`/solicitudes/${solicitud.id}`);
        setData(res.data.solicitud);
      } catch (e) { console.error('Error cargando detalle profundo'); }
    };
    fetchDetalle();
  }, [solicitud.id]);

  const handleAction = async (method, endpoint, payload = {}) => {
    setLoading(true);
    setError(null);
    try {
      await api[method](endpoint, payload);
      setActionDone(true);
      setTimeout(() => {
        if (onCoger) onCoger();
        onClose();
      }, 2000);
    } catch (e) {
      setError(e.response?.data?.mensaje || 'Error en la operación');
      setLoading(false);
    }
  };

  if (!solicitud) return null;

  const statusMap = {
    'publicada': 'Disponible',
    'aceptada': 'Reservado',
    'en_curso': 'En Progreso',
    'completada': 'Finalizado'
  };

  return (
    <AnimatePresence>
      <Overlay 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
      >
        <ModalBox
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={e => e.stopPropagation()}
        >
          <Handle />
          
          <AnimatePresence>
            {actionDone && (
              <SuccessOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <CheckCircle size={80} strokeWidth={2.5} />
                <h2 style={{ marginTop: 24, fontSize: '1.8rem', fontWeight: 900 }}>¡Listo!</h2>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, marginTop: 8 }}>Misión actualizada con éxito</p>
              </SuccessOverlay>
            )}
          </AnimatePresence>

          <ModalHeader>
            <ModalTitle>{data.titulo || 'Detalle'}</ModalTitle>
            <StatusPill $s={data.estado}>{statusMap[data.estado] || data.estado}</StatusPill>
          </ModalHeader>

          <ModalContent>
            {error && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ color: '#EF4444', background: '#FEE2E2', padding: 12, borderRadius: 12, marginBottom: 16, fontSize: '0.85rem', fontWeight: 700 }}>
                ⚠️ {error}
              </motion.div>
            )}

            <UserStrip $pro={!esDuenio}>
              <Avatar $s="56px" style={{ background: '#F3F4F6' }}>
                {data.nombre_cliente?.[0] || 'T'}
              </Avatar>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1rem', fontWeight: 800 }}>{esDuenio ? (data.nombre_prestador || 'Pendiente...') : (data.nombre_cliente || 'Cliente')}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <Badge $c="warning" style={{ fontSize: '0.7rem' }}><Star size={10} fill="currentColor" /> 4.9</Badge>
                  <Badge $c="secondary" style={{ fontSize: '0.7rem' }}>Verificado</Badge>
                </div>
              </div>
              <ShieldCheck size={28} color="#10B981" />
            </UserStrip>

            <SectionHeader>
              <LabelName>Sobre el trabajo</LabelName>
            </SectionHeader>
            <InfoCard>
              <PriceRow>
                <DollarSign size={20} color="#10B981" />
                <PriceVal>${(parseFloat(data.presupuesto_cliente) || 0).toLocaleString('es-CO')}</PriceVal>
              </PriceRow>
              <div style={{ display: 'flex', gap: 15, marginTop: 16, color: '#6B7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem' }}>
                  <MapPin size={14} /> {data.direccion_texto?.split(',')[0]}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem' }}>
                  <Clock size={14} /> Hace 5 min
                </div>
              </div>
            </InfoCard>

            <SectionHeader><LabelName>Descripción</LabelName></SectionHeader>
            <DescText>{data.descripcion || 'Sin descripción adicional.'}</DescText>
          </ModalContent>

          <Footer>
            {data.estado === 'publicada' && !esDuenio && (
              <Button $v="primary" $full onClick={() => handleAction('put', `/solicitudes/${data.id}/aceptar`)} disabled={loading}>
                {loading ? 'Confirmando...' : '🐶 Aceptar Trabajito'}
              </Button>
            )}

            {esDuenio && data.estado === 'aceptada' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <Button $v="outline" style={{ flex: 1 }} onClick={() => handleAction('put', `/solicitudes/${data.id}/estado`, { estado: 'cancelada' })}>Cancelar</Button>
                <Button $v="primary" style={{ flex: 1 }} onClick={() => handleAction('put', `/solicitudes/${data.id}/estado`, { estado: 'en_curso' })}>Iniciar</Button>
              </div>
            )}

            {(esAsignado || (esDuenio && data.estado !== 'publicada')) && (
              <Button $v="secondary" $full onClick={() => onContactar(data.id)}>
                <MessageCircle size={18} /> Chat de coordinación
              </Button>
            )}

            <Button $v="ghost" onClick={onClose}>Cerrar vista</Button>
          </Footer>
        </ModalBox>
      </Overlay>
    </AnimatePresence>
  );
};

export default DetalleModal;
