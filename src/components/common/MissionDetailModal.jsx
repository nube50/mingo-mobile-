import {useState, useEffect, useContext} from 'react';
import styled, {keyframes} from 'styled-components';
import {X, MapPin, DollarSign, Calendar, Users, Clock, CheckCircle, MessageCircle, PartyPopper, Briefcase} from 'lucide-react';
import api from '../../services/api';
import {Avatar, Badge, Button} from './UI';
import {useAuth} from '../../context/AuthContext';

const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.05)}`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 300;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
  backdrop-filter: blur(4px);
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 92vh;
  background: white;
  border-radius: 24px 24px 0 0;
  animation: ${slideUp} 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 20px 20px 16px;
  border-bottom: 1px solid #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #333333;
  flex: 1;
`;

const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #F5F5F5;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active { background: #F0F0F0; }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const SuccessBanner = styled.div`
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 16px;
  animation: ${pulse} 0.5s ease;
`;

const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
`;

const SuccessTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 4px;
`;

const SuccessSubtitle = styled.div`
  font-size: 0.85rem;
  opacity: 0.9;
`;

const EmpresaCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 16px;
  margin-bottom: 16px;
`;

const EmpresaInfo = styled.div`
  flex: 1;
`;

const EmpresaName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #333333;
`;

const EmpresaStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  font-size: 0.8rem;
  color: #6B7280;
`;

const SectionTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #F5F5F5;
  &:last-child { border-bottom: none; }
`;

const InfoIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #F5E6FF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #6B7280;
  margin-bottom: 2px;
`;

const InfoValue = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #333333;
`;

const Description = styled.div`
  font-size: 0.9rem;
  color: #4B5563;
  line-height: 1.5;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 12px;
  margin-top: 12px;
`;

const PriceTag = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #10B981;
  margin-top: 8px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  background: ${props => {
    switch(props.$status) {
      case 'abierta': return '#D1FAE5';
      case 'en_proceso': return '#FEF3C7';
      case 'completada': return '#F0F0F0';
      default: return '#F5F5F5';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'abierta': return '#059669';
      case 'en_proceso': return '#D97706';
      case 'completada': return '#6B7280';
      default: return '#6B7280';
    }
  }};
`;

const ModalFooter = styled.div`
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid #F0F0F0;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #F0F0F0;
  border-radius: 4px;
  margin-top: 16px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #8A2BE2, #6A0DAD);
  border-radius: 4px;
  width: ${props => {
    if (!props.$total || props.$total === 0) return '0%';
    return Math.min((props.$confirmados / props.$total) * 100, 100) + '%';
  }};
`;

const StatusLabel = {
  'abierta': 'Abierta',
  'en_proceso': 'En proceso',
  'completada': 'Completada',
  'cancelada': 'Cancelada'
};

const MissionDetailModal = ({ mision, onClose, onSumarse }) => {
  const { usuario } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSumarse = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await api.post('/misiones/' + mision.id + '/sumarse');
      setShowSuccess(true);
      if (onSumarse) onSumarse();
    } catch (e) {
      setError(e.response?.data?.mensaje || 'Error al sumarse');
    } finally {
      setActionLoading(false);
    }
  };

  const handleIrChat = () => {
    if (onClose) onClose();
  };

  if (!mision) return null;

  const estado = mision.estado || 'abierta';
  const puedeSumarse = estado === 'abierta' && !mision.ya_aplicado;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Por definir';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatPrice = (price) => {
    if (!price) return 'A convenir';
    return '$' + parseFloat(price).toLocaleString('es-CO');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Detalle de misión</ModalTitle>
          <CloseBtn onClick={onClose}>
            <X size={20} color="#6B7280" />
          </CloseBtn>
        </ModalHeader>

        <ModalContent>
          {showSuccess && (
            <SuccessBanner>
              <SuccessIcon>
                <PartyPopper size={32} color="white" />
              </SuccessIcon>
              <SuccessTitle>¡Te sumaste!</SuccessTitle>
              <SuccessSubtitle>La empresa revisará tu solicitud</SuccessSubtitle>
            </SuccessBanner>
          )}

          {error && (
            <div style={{
              background: '#FEE2E2',
              color: '#DC2626',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <SectionTitle style={{margin: 0}}>Empresa</SectionTitle>
            <StatusBadge $status={estado}>
              {StatusLabel[estado] || estado}
            </StatusBadge>
          </div>

          <EmpresaCard>
            <Avatar $s="56px" style={{background: 'linear-gradient(135deg, #8A2BE2, #6A0DAD)'}}>
              {getInitials(mision.creador_nombre)}
            </Avatar>
            <EmpresaInfo>
              <EmpresaName>{mision.creador_nombre || 'Empresa'}</EmpresaName>
              <EmpresaStats>
                <span>Misiones: {mision.total_misiones || 'Varias'}</span>
              </EmpresaStats>
            </EmpresaInfo>
          </EmpresaCard>

          <ProgressBar>
            <ProgressFill 
              $confirmados={mision.personas_confirmadas || 0} 
              $total={mision.personas_requeridas} 
            />
          </ProgressBar>
          <div style={{fontSize: '0.78rem', color: '#6B7280', marginTop: '6px'}}>
            {mision.personas_confirmadas || 0} de {mision.personas_requeridas} personas confirmadas
          </div>

          <SectionTitle style={{marginTop: '20px'}}>Información</SectionTitle>

          <InfoRow>
            <InfoIcon><Briefcase size={18} color="#8A2BE2" /></InfoIcon>
            <InfoContent>
              <InfoLabel>Tipo de trabajo</InfoLabel>
              <InfoValue>{mision.tipo_trabajo || 'No especificado'}</InfoValue>
            </InfoContent>
          </InfoRow>

          <InfoRow>
            <InfoIcon><Users size={18} color="#6366F1" /></InfoIcon>
            <InfoContent>
              <InfoLabel>Personas requeridas</InfoLabel>
              <InfoValue>{mision.personas_requeridas} personas</InfoValue>
            </InfoContent>
          </InfoRow>

          <InfoRow>
            <InfoIcon><Calendar size={18} color="#8B5CF6" /></InfoIcon>
            <InfoContent>
              <InfoLabel>Fecha de inicio</InfoLabel>
              <InfoValue>{formatDate(mision.fecha_inicio)}</InfoValue>
            </InfoContent>
          </InfoRow>

          {mision.fecha_fin && (
            <InfoRow>
              <InfoIcon><Clock size={18} color="#8B5CF6" /></InfoIcon>
              <InfoContent>
                <InfoLabel>Fecha de fin</InfoLabel>
                <InfoValue>{formatDate(mision.fecha_fin)}</InfoValue>
              </InfoContent>
            </InfoRow>
          )}

          <InfoRow>
            <InfoIcon><MapPin size={18} color="#8A2BE2" /></InfoIcon>
            <InfoContent>
              <InfoLabel>Ubicación</InfoLabel>
              <InfoValue>{mision.direccion || 'No especificada'}</InfoValue>
            </InfoContent>
          </InfoRow>

          <InfoRow>
            <InfoIcon><DollarSign size={18} color="#10B981" /></InfoIcon>
            <InfoContent>
              <InfoLabel>Remuneración</InfoLabel>
              <PriceTag>{formatPrice(mision.remuneracion)}</PriceTag>
              <div style={{fontSize: '0.72rem', color: '#6B7280'}}>por persona</div>
            </InfoContent>
          </InfoRow>

          {mision.descripcion && (
            <>
              <SectionTitle>Descripción</SectionTitle>
              <Description>{mision.descripcion}</Description>
            </>
          )}

          {mision.requisitos && (
            <div style={{marginTop: '16px'}}>
              <SectionTitle>Requisitos</SectionTitle>
              <Description>{mision.requisitos}</Description>
            </div>
          )}
        </ModalContent>

        <ModalFooter>
          {mision.ya_aplicado ? (
            <Button $v="primary" $full onClick={handleIrChat}>
              <MessageCircle size={18} /> Ver chat de misión
            </Button>
          ) : puedeSumarse ? (
            <Button 
              $v="primary" 
              $full 
              onClick={handleSumarse}
              disabled={actionLoading}
              style={{fontSize: '1rem', padding: '16px'}}
            >
              {actionLoading ? 'Sumándose...' : '🐾 Sumarme a esta misión'}
            </Button>
          ) : (
            <Button $v="ghost" $full disabled>
              {StatusLabel[estado] || estado}
            </Button>
          )}
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
};

export default MissionDetailModal;
