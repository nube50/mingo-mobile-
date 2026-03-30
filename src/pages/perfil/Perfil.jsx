import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {Star,Edit3,LogOut,ChevronRight,Shield,Bell,Camera,Phone,MapPin,Mail,MapPinOff,CheckCircle,Plus,Wrench} from 'lucide-react';
import {useAuth} from '../../context/AuthContext';
import api from '../../services/api';
import {Card,Avatar,Badge,Row,Button,PageWrap,SpinnerDark} from '../../components/common/UI';

const ProfileHeader = styled.div`
  background: linear-gradient(160deg, #8A2BE2 0%, #9D4EDD 100%);
  padding: 32px 20px 40px;
  border-radius: 0 0 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 30px rgba(138,43,226,0.25);
  position: relative;
  overflow: hidden;
  &::after {
    content: ''; position: absolute; bottom: -20px; left: -20px; width: 100px; height: 100px;
    background: rgba(255,255,255,0.1); border-radius: 50%;
  }
`;

const AvatarWrap = styled.div`
  position: relative;
  margin-bottom: 16px;
  z-index: 2;
`;

const EditAvatarBtn = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: all 0.2s;
  &:hover { transform: scale(1.1); }
`;

const ProfileName = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.02em;
`;

const ProfileEmail = styled.p`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.85);
  margin-top: 4px;
  font-weight: 500;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 24px;
  z-index: 2;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatVal = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
`;

const StatLbl = styled.div`
  font-size: 0.72rem;
  color: rgba(255,255,255,0.7);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: all 0.2s;
  &:active { opacity: 0.6; transform: translateX(4px); }
`;

const MenuIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.$bg || 'rgba(244,131,92,0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
`;

const MenuText = styled.div`flex: 1;`;

const MenuTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #333333;
`;

const MenuSub = styled.div`
  font-size: 0.78rem;
  color: #6B7280;
  margin-top: 3px;
  font-weight: 500;
`;

const DangerMenu = styled(MenuItem)`
  color: #EF4444;
  padding: 16px;
`;

const ToggleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
`;

const ToggleLabel = styled.label`
  position: relative;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
  cursor: pointer;
  input { opacity: 0; width: 0; height: 0; }
`;

const ToggleTrack = styled.span`
  position: absolute;
  inset: 0;
  background: ${props => props.$on ? '#8A2BE2' : '#E5E7EB'};
  border-radius: 14px;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$on ? '0 4px 10px rgba(138,43,226,0.3)' : 'none'};
  &::after {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${props => props.$on ? '27px' : '3px'};
    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(26,26,46,0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 300;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

const ModalContent = styled.div`
  background: #FFFFFF;
  border-radius: 28px 28px 0 0;
  padding: 28px 24px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: #333333;
  text-align: center;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
`;

const Divider = styled.div`height: 1px; background: #F3F4F6; margin: 4px 0;`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 800;
  color: #333333;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  font-size: 0.92rem;
  color: #4B5563;
  font-weight: 500;
`;

const DisponibilidadCard = styled(Card)`
  background: ${props => props.$disponible ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' : '#F9FAFB'};
  border: 1px solid ${props => props.$disponible ? '#10B98122' : '#F0F0F0'};
  border-radius: 24px;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: ${props => props.$on ? '#10B981' : '#6B7280'};
  color: white;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 16px;
  box-shadow: ${props => props.$on ? '0 4px 12px rgba(16,185,129,0.3)' : 'none'};
`;

const CategoriaTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #F5E6FF;
  color: #8A2BE2;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  margin: 5px;
  box-shadow: 0 2px 6px rgba(138,43,226,0.1);
`;

const AddCatBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #F9FAFB;
  border: 2px dashed #D1D5DB;
  border-radius: 12px;
  color: #6B7280;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  margin: 5px;
  transition: all 0.2s;
  &:hover { border-color: #8A2BE2; color: #8A2BE2; background: #F5E6FF; }
`;

const Select = styled.select`
  width: 100%;
  padding: 16px;
  background: #F9FAFB;
  border: 2px solid #F3F4F6;
  border-radius: 14px;
  color: #333333;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  appearance: none;
  margin-bottom: 14px;
  transition: all 0.2s;
  &:focus { border-color: #8A2BE2; background: white; }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  background: #fff;
  border: 2px solid #F3F4F6;
  border-radius: 14px;
  color: #333333;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  margin-bottom: 14px;
  transition: all 0.2s;
  &:focus { border-color: #8A2BE2; box-shadow: 0 0 0 4px rgba(138,43,226,0.1); }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 16px;
  background: #fff;
  border: 2px solid #F3F4F6;
  border-radius: 14px;
  color: #333333;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 14px;
  transition: all 0.2s;
  &:focus { border-color: #8A2BE2; box-shadow: 0 0 0 4px rgba(138,43,226,0.1); }
`;

const Perfil = () => {
  const navigate = useNavigate();
  const {usuario, logout} = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disponible, setDisponible] = useState(false);
  const [savingDisp, setSavingDisp] = useState(false);
  const [editForm, setEditForm] = useState({nombre:'', telefono:'', ciudad:'', descripcion:''});
  const [savingEdit, setSavingEdit] = useState(false);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [catForm, setCatForm] = useState({categoria_id:'', subcategoria_id:'', experiencia_anos:'', tarifa_aproximada:'', descripcion:''});
  const [savingCat, setSavingCat] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    
    const fallbackData = usuario ? {
      id: usuario.id,
      nombre: usuario.nombre || 'Usuario',
      email: usuario.email || '',
      telefono: '',
      ciudad: '',
      descripcion: '',
      roles: usuario.roles || ['cliente', 'prestador'],
      verificado: false,
      categorias: []
    } : {
      nombre: 'Usuario',
      email: 'cargando@mingo.com',
      roles: ['cliente'],
      categorias: []
    };
    
    setPerfilData(fallbackData);
    setEditForm({
      nombre: fallbackData.nombre || '',
      telefono: '',
      ciudad: '',
      descripcion: ''
    });
    
    try {
      const res = await api.get('/usuarios/perfil');
      const data = res.data?.usuario;
      if (data && typeof data === 'object') {
        const completeData = {
          ...fallbackData,
          ...data,
          roles: data.roles || fallbackData.roles
        };
        setPerfilData(completeData);
        setDisponible(data.perfil_prestador?.disponible || false);
        setEditForm({
          nombre: data.nombre || fallbackData.nombre || '',
          telefono: data.telefono || '',
          ciudad: data.ciudad || '',
          descripcion: data.descripcion || ''
        });
      }
    } catch (e) {
      console.log('Error perfil:', e?.message);
    }

    try {
      const catsRes = await api.get('/usuarios/categorias');
      if (catsRes.data?.categorias) {
        setCategoriasDisponibles(catsRes.data.categorias);
      }
    } catch (e) {
      console.log('Error categorias:', e?.message);
    }
    
    setLoading(false);
  };

  const toggleDisponibilidad = async () => {
    setSavingDisp(true);
    try {
      await api.post('/usuarios/disponibilidad', {disponible: !disponible});
      setDisponible(!disponible);
    } catch (e) {
      alert(e.response?.data?.mensaje || 'Error al actualizar');
    } finally {
      setSavingDisp(false);
    }
  };

  const guardarPerfil = async () => {
    setSavingEdit(true);
    try {
      await api.put('/usuarios/perfil', editForm);
      await cargarPerfil();
      setEditOpen(false);
    } catch (e) {
      alert(e.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setSavingEdit(false);
    }
  };

  const agregarCategoria = async () => {
    if (!catForm.subcategoria_id) {
      alert('Selecciona un tipo de servicio');
      return;
    }
    setSavingCat(true);
    try {
      await api.post('/usuarios/categorias', {
        subcategoria_id: parseInt(catForm.subcategoria_id),
        experiencia_anos: catForm.experiencia_anos ? parseInt(catForm.experiencia_anos) : 0,
        tarifa_aproximada: catForm.tarifa_aproximada ? parseFloat(catForm.tarifa_aproximada) : null,
        descripcion_propia: catForm.descripcion || null
      });
      await cargarPerfil();
      setCatOpen(false);
      setCatForm({categoria_id:'', subcategoria_id:'', experiencia_anos:'', tarifa_aproximada:'', descripcion:''});
    } catch (e) {
      alert(e.response?.data?.mensaje || 'Error al agregar categoria');
    } finally {
      setSavingCat(false);
    }
  };

  const getSubcategorias = () => {
    const cat = categoriasDisponibles.find(c => c.id === parseInt(catForm.categoria_id));
    return cat?.subcategorias || [];
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isPrestador = perfilData?.roles?.includes('prestador');
  const userData = perfilData || usuario || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-CO', {day: 'numeric', month: 'long', year: 'numeric'});
  };

  const getRating = () => {
    const v = userData?.perfil_prestador?.calificacion_promedio;
    return v != null ? parseFloat(v).toFixed(1) : '4.8';
  };

  const getServicios = () => userData?.perfil_prestador?.total_servicios || 0;
  const getReviews = () => userData?.perfil_prestador?.total_calificaciones || 0;

  if (loading) {
    return (
      <PageWrap>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: '#FAFAFA'}}>
          <SpinnerDark $s="40px" />
        </div>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <ProfileHeader>
        <AvatarWrap>
          <Avatar $s="88px" style={{border: '3px solid rgba(255,255,255,0.3)'}}>
            {userData.nombre?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <EditAvatarBtn><Camera size={14} color="#8A2BE2" /></EditAvatarBtn>
        </AvatarWrap>
        <ProfileName>{userData.nombre || 'Usuario Mingo'}</ProfileName>
        <ProfileEmail>{userData.email || 'usuario@correo.com'}</ProfileEmail>
        <Row $g="8px" style={{marginTop: '8px'}}>
          {userData.verificado && <Badge $c="success">Verificado</Badge>}
          {isPrestador && <Badge $c="warning">Prestador</Badge>}
          {userData.roles?.includes('cliente') && <Badge $c="muted">Cliente</Badge>}
        </Row>
        <StatsRow>
          <Stat>
            <StatVal>{getRating()}</StatVal>
            <StatLbl><Star size={10} color="white" style={{display: 'inline'}} /> Rating</StatLbl>
          </Stat>
          <Stat>
            <StatVal>{getServicios()}</StatVal>
            <StatLbl>Servicios</StatLbl>
          </Stat>
          <Stat>
            <StatVal>{getReviews()}</StatVal>
            <StatLbl>Reviews</StatLbl>
          </Stat>
        </StatsRow>
      </ProfileHeader>

      <div style={{padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px'}}>
        
        {isPrestador && (
          <DisponibilidadCard $disponible={disponible}>
            <StatusIndicator $on={disponible}>
              {disponible ? <CheckCircle size={18}/> : <MapPinOff size={18}/>}
              {disponible ? 'Disponible para trabajar' : 'No disponible'}
            </StatusIndicator>
            <ToggleWrap style={{padding: 0}}>
              <div>
                <div style={{fontSize: '0.92rem', fontWeight: 600, color: '#333333'}}>
                  {disponible ? 'Recibiendo trabajitos' : 'Modo descanso'}
                </div>
                <div style={{fontSize: '0.75rem', color: '#6B7280', marginTop: 2}}>
                  {disponible ? 'Apareceras en busquedas cercanas' : 'No recibiras nuevas solicitudes'}
                </div>
              </div>
              <ToggleLabel $on={disponible}>
                <input type="checkbox" checked={disponible} onChange={toggleDisponibilidad} disabled={savingDisp}/>
                <ToggleTrack $on={disponible} />
              </ToggleLabel>
            </ToggleWrap>
          </DisponibilidadCard>
        )}

        {isPrestador && (
          <Card>
            <SectionTitle>Mis servicios</SectionTitle>
            <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: 8}}>
              {(!userData.categorias || userData.categorias.length === 0) ? (
                <p style={{fontSize: '0.85rem', color: '#6B7280', margin: 0}}>
                  No has agregado servicios aun
                </p>
              ) : (
                userData.categorias.map((cat, i) => (
                  <CategoriaTag key={i}>
                    <Wrench size={12}/> {cat.subcategoria || cat.categoria}
                    {cat.tarifa_aproximada && (
                      <span style={{fontSize: '0.72rem', opacity: 0.8}}>
                        ${parseFloat(cat.tarifa_aproximada).toLocaleString()}
                      </span>
                    )}
                  </CategoriaTag>
                ))
              )}
            </div>
            <AddCatBtn onClick={() => setCatOpen(true)}>
              <Plus size={14}/> Agregar servicio
            </AddCatBtn>
          </Card>
        )}

        <Card>
          <SectionTitle>Informacion personal</SectionTitle>
          <InfoRow><Mail size={16} color="#6B7280" /><span>{userData.email}</span></InfoRow>
          <InfoRow><Phone size={16} color="#6B7280" /><span>{userData.telefono || 'Sin telefono'}</span></InfoRow>
          <InfoRow><MapPin size={16} color="#6B7280" /><span>{userData.ciudad || 'Colombia'}</span></InfoRow>
          {userData.descripcion && (
            <div style={{padding: '10px 0', fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.5}}>
              {userData.descripcion}
            </div>
          )}
          <div style={{fontSize: '0.72rem', color: '#C4C9D4', marginTop: '8px'}}>
            Miembro desde {formatDate(userData.creado_en)}
          </div>
        </Card>

        <Card>
          <SectionTitle>Cuenta</SectionTitle>
          <ToggleWrap>
            <div>
              <div style={{fontSize: '0.92rem', fontWeight: 600, color: '#333333'}}>Notificaciones push</div>
              <div style={{fontSize: '0.75rem', color: '#6B7280', marginTop: 2}}>Recibe alertas de mensajes</div>
            </div>
            <ToggleLabel $on={true}>
              <input type="checkbox" defaultChecked={true}/>
              <ToggleTrack $on={true} />
            </ToggleLabel>
          </ToggleWrap>
          <Divider />
          <MenuItem onClick={() => setEditOpen(true)}>
            <MenuIcon $bg="rgba(138,43,226,0.15)"><Edit3 size={18} color="#8A2BE2" /></MenuIcon>
            <MenuText><MenuTitle>Editar perfil</MenuTitle><MenuSub>Cambia tu informacion</MenuSub></MenuText>
            <ChevronRight size={18} color="#C4C9D4" />
          </MenuItem>
          <Divider />
          <MenuItem>
            <MenuIcon $bg="rgba(16,185,129,0.15)"><Shield size={18} color="#10B981" /></MenuIcon>
            <MenuText><MenuTitle>Seguridad</MenuTitle><MenuSub>Contrasena y verificacion</MenuSub></MenuText>
            <ChevronRight size={18} color="#C4C9D4" />
          </MenuItem>
          <MenuItem>
            <MenuIcon $bg="rgba(245,158,11,0.15)"><Bell size={18} color="#F59E0B" /></MenuIcon>
            <MenuText><MenuTitle>Notificaciones</MenuTitle><MenuSub>Configurar alertas</MenuSub></MenuText>
            <ChevronRight size={18} color="#C4C9D4" />
          </MenuItem>
        </Card>

        <Card style={{padding: '0'}}>
          <DangerMenu onClick={handleLogout}>
            <MenuIcon $bg="rgba(239,68,68,0.15)"><LogOut size={18} color="#EF4444" /></MenuIcon>
            <MenuText><MenuTitle style={{color: '#EF4444'}}>Cerrar sesion</MenuTitle></MenuText>
          </DangerMenu>
        </Card>

        <p style={{textAlign: 'center', fontSize: '0.72rem', color: '#C4C9D4', marginTop: '4px'}}>
          Mingo v1.0.0 · Hecho en Colombia
        </p>
      </div>

      {editOpen && (
        <ModalOverlay onClick={() => setEditOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Editar perfil</ModalTitle>
            <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
              <div>
                <label style={{fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 4}}>Nombre completo</label>
                <Input value={editForm.nombre} onChange={e => setEditForm(f => ({...f, nombre: e.target.value}))}/>
              </div>
              <div>
                <label style={{fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 4}}>Telefono</label>
                <Input value={editForm.telefono} onChange={e => setEditForm(f => ({...f, telefono: e.target.value}))} placeholder="+57 300 123 4567"/>
              </div>
              <div>
                <label style={{fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 4}}>Ciudad</label>
                <Input value={editForm.ciudad} onChange={e => setEditForm(f => ({...f, ciudad: e.target.value}))} placeholder="Bogota, Colombia"/>
              </div>
              <div>
                <label style={{fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 4}}>Descripcion</label>
                <Textarea value={editForm.descripcion} onChange={e => setEditForm(f => ({...f, descripcion: e.target.value}))} placeholder="Cuentanos sobre ti..."/>
              </div>
              <Button $full onClick={guardarPerfil} disabled={savingEdit}>{savingEdit ? 'Guardando...' : 'Guardar cambios'}</Button>
              <Button $full $v="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {catOpen && (
        <ModalOverlay onClick={() => setCatOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Agregar servicio</ModalTitle>
            <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
              <div>
                <label style={{fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 4}}>Categoria *</label>
                <Select value={catForm.categoria_id} onChange={e => setCatForm(f => ({...f, categoria_id: e.target.value, subcategoria_id: ''}))}>
                  <option value="">Selecciona categoria</option>
                  {categoriasDisponibles.map(cat => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}
                </Select>
              </div>
              {catForm.categoria_id && getSubcategorias().length > 0 && (
                <div>
                  <label style={{fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 4}}>Tipo de servicio *</label>
                  <Select value={catForm.subcategoria_id} onChange={e => setCatForm(f => ({...f, subcategoria_id: e.target.value}))}>
                    <option value="">Selecciona tipo</option>
                    {getSubcategorias().map(sub => (<option key={sub.id} value={sub.id}>{sub.nombre}</option>))}
                  </Select>
                </div>
              )}
              <div>
                <label style={{fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 4}}>Anos de experiencia</label>
                <Input type="number" min="0" value={catForm.experiencia_anos} onChange={e => setCatForm(f => ({...f, experiencia_anos: e.target.value}))} placeholder="Ej: 2"/>
              </div>
              <div>
                <label style={{fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 4}}>Tarifa aproximada ($COP)</label>
                <Input type="number" value={catForm.tarifa_aproximada} onChange={e => setCatForm(f => ({...f, tarifa_aproximada: e.target.value}))} placeholder="Ej: 80000"/>
              </div>
              <div>
                <label style={{fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 4}}>Descripcion (opcional)</label>
                <Textarea value={catForm.descripcion} onChange={e => setCatForm(f => ({...f, descripcion: e.target.value}))} placeholder="Cuentanos sobre tu experiencia..."/>
              </div>
              <Button $full onClick={agregarCategoria} disabled={savingCat || !catForm.subcategoria_id}>{savingCat ? 'Agregando...' : 'Agregar servicio'}</Button>
              <Button $full $v="outline" onClick={() => setCatOpen(false)}>Cancelar</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrap>
  );
};

export default Perfil;
