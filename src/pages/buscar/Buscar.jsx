import {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';
import {Search, SlidersHorizontal, Star, MapPin} from 'lucide-react';
import api from '../../services/api';
import {Card, Badge, Avatar, Row, Stack, SectionTitle, Spinner, EmptyState, PageWrap} from '../../components/common/UI';
import DetalleModal from '../../components/common/DetalleModal';

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const SearchHeader = styled.div`
  background: #fff;
  padding: 20px 20px 12px;
  border-bottom: 1px solid #F0F0F0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
`;

const SearchRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const FilterBtn = styled.button`
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: #F8F9FA;
  border: 1.5px solid #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
  &:hover { background: #F0F0F0; border-color: #E5E7EB; }
  &:active { transform: scale(0.95); }
`;

const CatRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 16px 0 4px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const CatChip = styled.button`
  flex-shrink: 0;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 700;
  font-family: inherit;
  border: 1.5px solid ${props => props.$a ? '#8A2BE2' : '#F0F0F0'};
  background: ${props => props.$a ? '#8A2BE2' : 'white'};
  color: ${props => props.$a ? 'white' : '#6B7280'};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$a ? '0 4px 12px rgba(138,43,226,0.3)' : 'none'};
  &:hover { border-color: #8A2BE2; color: ${props => props.$a ? 'white' : '#8A2BE2'}; }
  &:active { transform: scale(0.95); }
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FilterTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 800;
  color: #333333;
  margin-bottom: 12px;
`;

const FilterTag = styled.button`
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  border: 1.5px solid ${props => props.$a ? '#8A2BE2' : '#F3F4F6'};
  background: ${props => props.$a ? '#F5E6FF' : 'white'};
  color: ${props => props.$a ? '#8A2BE2' : '#4B5563'};
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #8A2BE2; }
`;

const ResultCard = styled(Card)`
  animation: ${fadeUp} 0.3s ease both;
  cursor: pointer;
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #F0F0F0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); border-color: #8A2BE233; }
  &:active { transform: scale(0.98); }
`;

const ResultTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: #333333;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
`;

const FilterPanel = styled.div`
  background: #F9FAFB;
  border-radius: 20px;
  padding: 20px;
  border: 1.5px solid #F0F0F0;
  margin-top: 14px;
  animation: ${fadeUp} 0.3s ease;
`;

const ResultTop = styled.div`
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #6B7280;
  flex-wrap: wrap;
  font-weight: 500;
`;

const RatingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(245,158,11,.12);
  padding: 3px 8px;
  border-radius: 8px;
  font-size: .72rem;
  font-weight: 800;
  color: #F59E0B;
`;

const ResultDesc = styled.p`
  font-size: 0.88rem;
  color: #4B5563;
  line-height: 1.5;
  margin-bottom: 8px;
`;

const ResultBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #F3F4F6;
`;

const Price = styled.div`
  font-size: 1.15rem;
  font-weight: 800;
  color: #10B981;
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$status === 'publicada' ? '#10B981' : '#6B7280'};
  margin-right: 4px;
`;

const CATS = [
  {id: 'Todas', lbl: 'Todas', emoji: '✨'},
  {id: 'Limpieza', lbl: 'Limpieza', emoji: '🧹'},
  {id: 'Plomeria', lbl: 'Plomeria', emoji: '🔧'},
  {id: 'Electricidad', lbl: 'Electricidad', emoji: '⚡'},
  {id: 'Pintura', lbl: 'Pintura', emoji: '🎨'},
  {id: 'Mudanza', lbl: 'Mudanza', emoji: '🚚'},
  {id: 'Aseo', lbl: 'Aseo', emoji: '🧼'},
  {id: 'Jardineria', lbl: 'Jardineria', emoji: '🌿'},
  {id: 'Cerrajeria', lbl: 'Cerrajeria', emoji: '🔐'}
];
const ZONAS = ['Todas', 'Bogota', 'Medellin', 'Cali', 'Barranquilla'];
const ORDENES = ['Recomendado', 'Menor precio', 'Mayor precio'];

const Buscar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState('Todas');
  const [zona, setZona] = useState('Todas');
  const [orden, setOrden] = useState('Recomendado');
  const [filtros, setFiltros] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/solicitudes/disponibles');
      let data = res.data.solicitudes || [];
      
      if (query) {
        const q = query.toLowerCase();
        data = data.filter(s => 
          (s.titulo && s.titulo.toLowerCase().includes(q)) ||
          (s.descripcion && s.descripcion.toLowerCase().includes(q)) ||
          (s.direccion_texto && s.direccion_texto.toLowerCase().includes(q))
        );
      }
      
      if (zona !== 'Todas') {
        data = data.filter(s => 
          s.direccion_texto && s.direccion_texto.toLowerCase().includes(zona.toLowerCase())
        );
      }
      
      if (cat !== 'Todas') {
        data = data.filter(s => {
          const catLower = cat.toLowerCase();
          return (
            (s.categoria && s.categoria.toLowerCase().includes(catLower)) ||
            (s.subcategoria && s.subcategoria.toLowerCase().includes(catLower)) ||
            (s.titulo && s.titulo.toLowerCase().includes(catLower)) ||
            (s.descripcion && s.descripcion.toLowerCase().includes(catLower))
          );
        });
      }
      
      if (orden === 'Menor precio') {
        data = [...data].sort((a, b) => (parseFloat(a.presupuesto_cliente) || 0) - (parseFloat(b.presupuesto_cliente) || 0));
      } else if (orden === 'Mayor precio') {
        data = [...data].sort((a, b) => (parseFloat(b.presupuesto_cliente) || 0) - (parseFloat(a.presupuesto_cliente) || 0));
      }
      
      setResults(data);
    } catch (e) {
      console.error('Error:', e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, cat, zona, orden]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  const handleSearch = () => {
    buscar();
  };

  const handleCardClick = (solicitud) => {
    setSelectedSolicitud(solicitud);
  };

  const handleCoger = () => {
    buscar();
  };

  const handleContactar = (solicitudId) => {
    navigate('/chat/' + solicitudId);
  };

  const formatPrice = (price) => {
    if (!price) return 'A convenir';
    return '$' + parseFloat(price).toLocaleString('es-CO');
  };

  return (
    <PageWrap>
      <SearchHeader>
        <SearchRow>
          <div style={{flex: 1, position: 'relative', display: 'flex', alignItems: 'center'}}>
            <Search size={17} style={{position: 'absolute', left: 14, color: '#C4C9D4'}} />
            <input
              style={{
                width: '100%',
                minHeight: 52,
                padding: '14px 14px 14px 44px',
                background: '#F5F5F5',
                border: '1.5px solid #F0F0F0',
                borderRadius: 14,
                color: '#333333',
                fontSize: 16,
                fontFamily: 'inherit',
                outline: 'none'
              }}
              placeholder="Buscar trabajitos..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <FilterBtn onClick={() => setFiltros(!filtros)}>
            <SlidersHorizontal size={18} color="#6B7280" />
          </FilterBtn>
        </SearchRow>
        <CatRow>
          {CATS.map(c => (
            <CatChip key={c.id} $a={cat === c.id} onClick={() => setCat(c.id)}>
              <span>{c.emoji}</span>
              {c.lbl}
            </CatChip>
          ))}
        </CatRow>

        {filtros && (
          <FilterPanel>
            <FilterTitle>Zona</FilterTitle>
            <FilterTags>
              {ZONAS.map(z => (
                <FilterTag key={z} $a={zona === z} onClick={() => setZona(z)}>
                  {z}
                </FilterTag>
              ))}
            </FilterTags>
            <FilterTitle style={{marginTop: 12}}>Ordenar</FilterTitle>
            <FilterTags>
              {ORDENES.map(o => (
                <FilterTag key={o} $a={orden === o} onClick={() => setOrden(o)}>
                  {o}
                </FilterTag>
              ))}
            </FilterTags>
          </FilterPanel>
        )}
      </SearchHeader>

      <div style={{padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
        <Row $j="space-between">
          <SectionTitle>{results.length} trabajitos {cat !== 'Todas' ? `en ${cat}` : 'disponibles'}</SectionTitle>
          <Badge $c={cat !== 'Todas' ? 'warning' : 'success'}>{zona !== 'Todas' ? zona : 'Colombia'}</Badge>
        </Row>

        {loading ? (
          <EmptyState><Spinner $s="28px" /></EmptyState>
        ) : results.length === 0 ? (
          <EmptyState>
            <Search size={48} color="#C4C9D4" />
            <p>No encontramos trabajitos</p>
            <p style={{fontSize: '0.78rem'}}>Intenta con otros filtros</p>
          </EmptyState>
        ) : (
          results.map((s, i) => (
            <ResultCard 
              key={s.id || i} 
              onClick={() => handleCardClick(s)}
              style={{animationDelay: i * 0.04 + 's'}}
            >
              <ResultTop>
                <Avatar $s="50px">
                  {s.nombre_cliente ? s.nombre_cliente.charAt(0) : 'T'}
                </Avatar>
                <ResultInfo>
                  <ResultTitle>{s.titulo || 'Trabajo'}</ResultTitle>
                  <ResultMeta>
                    <Star size={11} color="#F59E0B" fill="#F59E0B" />
                    {s.nombre_cliente || 'Usuario'}
                    <span style={{color:'#D1D5DB'}}>|</span>
                    <MapPin size={10} />
                    {s.direccion_texto ? s.direccion_texto.split(',')[0] : 'Colombia'}
                    {s.distancia_km && <span style={{color:'#10B981',fontWeight:600}}> · {s.distancia_km.toFixed(1)}km</span>}
                  </ResultMeta>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginTop:'6px'}}>
                    <RatingBadge>
                      <Star size={10} fill="#F59E0B" color="#F59E0B"/>
                      {s.calificacion_cliente ? parseFloat(s.calificacion_cliente).toFixed(1) : '4.8'}
                    </RatingBadge>
                    {s.servicios_cliente && (
                      <span style={{fontSize:'.72rem',color:'#6B7280'}}>{s.servicios_cliente} servicios</span>
                    )}
                  </div>
                </ResultInfo>
                <Badge $c="success">
                  <StatusDot $status={s.estado} />
                  Disponible
                </Badge>
              </ResultTop>
              <ResultDesc>
                {s.descripcion ? s.descripcion.substring(0, 100) + (s.descripcion.length > 100 ? '...' : '') : 'Toca para ver detalles'}
              </ResultDesc>
              <ResultBottom>
                <Price>{formatPrice(s.presupuesto_cliente)}</Price>
                <Badge $c="muted">Toca para ver detalles →</Badge>
              </ResultBottom>
            </ResultCard>
          ))
        )}
      </div>

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

export default Buscar;

