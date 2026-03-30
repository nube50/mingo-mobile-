import {useState, useEffect} from 'react';
import styled, {keyframes} from 'styled-components';
import {X, MapPin, DollarSign, Tag, FileText, PartyPopper, Loader} from 'lucide-react';
import api from '../../services/api';

const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;

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
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 16px;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
`;

const SuccessTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 4px;
`;

const SuccessSubtitle = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: #F5F5F5;
  border: 1.5px solid ${props => props.$error ? '#EF4444' : '#F0F0F0'};
  border-radius: 12px;
  color: #333333;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #8A2BE2;
    background: #fff;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  background: #F5F5F5;
  border: 1.5px solid #F0F0F0;
  border-radius: 12px;
  color: #333333;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;
  &:focus {
    border-color: #8A2BE2;
    background: #fff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  background: #F5F5F5;
  border: 1.5px solid #F0F0F0;
  border-radius: 12px;
  color: #333333;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  &:focus {
    border-color: #8A2BE2;
    background-color: #fff;
  }
`;

const LocationBox = styled.div`
  background: #F5E6FF;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LocationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #8A2BE2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LocationText = styled.div`
  flex: 1;
  font-size: 0.85rem;
  color: #6B7280;
`;

const LocationName = styled.div`
  font-weight: 600;
  color: #333333;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #8A2BE2 0%, #6A0DAD 100%);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(244, 131, 92, 0.4);
  transition: opacity 0.2s;
  &:active { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ErrorText = styled.div`
  color: #EF4444;
  font-size: 0.78rem;
  margin-top: 4px;
`;

const CrearSolicitudModal = ({ onClose, onCreated }) => {
  const [categorias, setCategorias] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria_id: '',
    subcategoria_id: '',
    presupuesto_cliente: '',
    direccion_texto: 'Bogotá, Colombia'
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoadingCats(true);
    try {
      const res = await api.get('/usuarios/categorias');
      setCategorias(res.data.categorias || []);
    } catch (e) {
      console.error('Error categorías:', e);
      setCategorias([]);
    } finally {
      setLoadingCats(false);
    }
  };

  const getSubcategorias = () => {
    const cat = categorias.find(c => c.id === parseInt(form.categoria_id));
    return cat?.subcategorias || [];
  };

  const handleChange = (field, value) => {
    setForm(f => ({...f, [field]: value}));
    if (field === 'categoria_id') {
      setForm(f => ({...f, subcategoria_id: ''}));
    }
  };

  const handleSubmit = async () => {
    if (!form.titulo.trim()) {
      setError('El título es requerido');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim() || null,
        subcategoria_id: form.subcategoria_id || null,
        latitud: 4.624335,
        longitud: -74.063644,
        direccion_texto: form.direccion_texto || 'Bogotá, Colombia',
        presupuesto_cliente: form.presupuesto_cliente ? parseFloat(form.presupuesto_cliente) : null
      };

      await api.post('/solicitudes', payload);
      setShowSuccess(true);
      
      setTimeout(() => {
        if (onCreated) onCreated();
        if (onClose) onClose();
      }, 2000);
    } catch (e) {
      const msg = e.response?.data?.mensaje || 'Error al crear la solicitud';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value) => {
    const num = value.replace(/\D/g, '');
    if (!num) return '';
    return parseInt(num).toLocaleString('es-CO');
  };

  if (showSuccess) {
    return (
      <Overlay onClick={onClose}>
        <ModalBox onClick={e => e.stopPropagation()}>
          <ModalContent style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh'}}>
            <SuccessBanner>
              <SuccessIcon>
                <PartyPopper size={32} color="white" />
              </SuccessIcon>
              <SuccessTitle>¡Trabajito publicado!</SuccessTitle>
              <SuccessSubtitle>Los prestadores cercanos serán notificados</SuccessSubtitle>
            </SuccessBanner>
          </ModalContent>
        </ModalBox>
      </Overlay>
    );
  }

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Lanzar trabajito</ModalTitle>
          <CloseBtn onClick={onClose}>
            <X size={20} color="#6B7280" />
          </CloseBtn>
        </ModalHeader>

        <ModalContent>
          <LocationBox>
            <LocationIcon>
              <MapPin size={20} color="white" />
            </LocationIcon>
            <LocationText>
              <LocationName>Ubicación: Bogotá</LocationName>
              Tu trabajito será visible para prestadores en esta zona
            </LocationText>
          </LocationBox>

          <FormGroup style={{marginTop: 20}}>
            <Label>¿Qué necesitas? *</Label>
            <Input 
              $error={error && !form.titulo}
              placeholder="Ej: Limpieza de apartamento 80m2"
              value={form.titulo}
              onChange={e => handleChange('titulo', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Categoría</Label>
            <Select 
              value={form.categoria_id}
              onChange={e => handleChange('categoria_id', e.target.value)}
              disabled={loadingCats}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </Select>
          </FormGroup>

          {form.categoria_id && getSubcategorias().length > 0 && (
            <FormGroup>
              <Label>Tipo de servicio</Label>
              <Select 
                value={form.subcategoria_id}
                onChange={e => handleChange('subcategoria_id', e.target.value)}
              >
                <option value="">Selecciona el tipo</option>
                {getSubcategorias().map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                ))}
              </Select>
            </FormGroup>
          )}

          <FormGroup>
            <Label>Presupuesto ($COP)</Label>
            <Input 
              type="text"
              placeholder="Ej: 80000"
              value={form.presupuesto_cliente}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                handleChange('presupuesto_cliente', val);
              }}
            />
            {form.presupuesto_cliente && (
              <div style={{fontSize: '0.78rem', color: '#10B981', marginTop: 4}}>
                ${formatPrice(form.presupuesto_cliente)} COP
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Descripción detallada</Label>
            <Textarea 
              placeholder="Describe los detalles del trabajo, requisitos, horarios disponibles..."
              value={form.descripcion}
              onChange={e => handleChange('descripcion', e.target.value)}
            />
          </FormGroup>

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

          <SubmitBtn 
            onClick={handleSubmit}
            disabled={loading || !form.titulo.trim()}
          >
            {loading ? (
              <>
                <Loader size={20} className="spin" /> Publicando...
              </>
            ) : (
              '🚀 Publicar trabajito'
            )}
          </SubmitBtn>
        </ModalContent>
      </ModalBox>
    </Overlay>
  );
};

export default CrearSolicitudModal;
