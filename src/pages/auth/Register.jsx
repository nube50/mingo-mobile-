import{useState}from 'react';
import{useNavigate,Link}from 'react-router-dom';
import styled, {keyframes}from 'styled-components';
import{User,Mail,Lock,Eye,EyeOff,CheckCircle,MapPin}from 'lucide-react';
import api from '../../services/api';
import{useAuth}from '../../context/AuthContext';
import{Button,Card,FieldWrap,FieldLabel,InputWrap,IcoLeft,IcoRight,Input}from '../../components/common/UI';

const fadeUp=keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

const Wrap=styled.div`
  min-height:100vh;min-height:100dvh;background:#fff;
  display:flex;flex-direction:column;align-items:center;
  justify-content:flex-start;
  padding:max(24px,env(safe-area-inset-top,24px)) 24px
  calc(24px + env(safe-area-inset-bottom,0px));
  overflow-y:auto;
  animation:${fadeUp} .4s ease both;
`;

const Logo=styled.div`
  font-size:2.2rem;font-weight:800;color:#8A2BE2;letter-spacing:-1px;margin-bottom:4px;
`;

const Sub=styled.p`font-size:.9rem;color:#6B7280;margin-bottom:32px;`;

const FormCard=styled(Card)`
  width:100%;max-width:400px;padding:28px 24px;
  box-shadow:0 4px 24px rgba(138,43,226,0.12);
  margin:20px 0;
`;

const Title=styled.h1`font-size:1.5rem;font-weight:800;color:#333333;margin-bottom:4px;`;
const SubTitle=styled.p`font-size:.85rem;color:#6B7280;margin-bottom:24px;`;

const ErrorBox=styled.div`
  background:#FEE2E2;border:1px solid #FECACA;border-radius:12px;
  padding:12px 16px;font-size:.85rem;color:#EF4444;text-align:center;
`;

const SuccessBox=styled.div`
  background:#D1FAE5;border:1px solid #A7F3D0;border-radius:12px;
  padding:12px 16px;font-size:.85rem;color:#059669;text-align:center;
`;

const BenefitRow=styled.div`
  display:flex;align-items:center;gap:8px;padding:6px 0;
  font-size:.82rem;color:#6B7280;
`;

const Footer=styled.p`
  text-align:center;color:#6B7280;font-size:.88rem;margin-top:20px;
  a{color:#8A2BE2;font-weight:700;}
`;

const TermsCheck=styled.label`
  display:flex;align-items:flex-start;gap:10px;cursor:pointer;
  font-size:.85rem;color:#333333;line-height:1.5;
  background:#F5F5F5;border-radius:12px;padding:12px;
  border:1.5px solid #E5E7EB;
`;

const Checkbox=styled.input`
  width:18px;height:18px;margin-top:2px;accent-color:#8A2BE2;cursor:pointer;
`;

const Register=()=>{
  const navigate=useNavigate();
  const{login}=useAuth();
  const[nombre,setNombre]=useState('');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[confirmar,setConfirmar]=useState('');
  const[show,setShow]=useState(false);
  const[termsAccepted,setTermsAccepted]=useState(false);
  const[error,setError]=useState('');
  const[loading,setLoading]=useState(false);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!nombre||!email||!password)return setError('Completa todos los campos');
    if(password!==confirmar)return setError('Las contraseñas no coinciden');
    if(password.length<6)return setError('La contraseña debe tener al menos 6 caracteres');
    if(!termsAccepted)return setError('Debes aceptar los Términos y Condiciones');
    setLoading(true);setError('');
    try{
      const res=await api.post('/auth/registro',{
        nombre,
        email,
        password,
        roles:['cliente','prestador'],
        termsAccepted:true
      });
      
      const {usuario,token}=res.data;
      login({...usuario,roles:['cliente','prestador']},token);
      
      setTimeout(async()=>{
        try{
          const dispRes=await api.post('/usuarios/disponibilidad',{
            disponible:true,
            lat:4.624335,
            lng:-74.063644
          });
          console.log('Perfil prestador creado:',dispRes.data);
        }catch(dispErr){
          console.log('Prestador profile setup:',dispErr.response?.data?.mensaje||'Continuando...');
        }
      },100);
      
      navigate('/home');
    }catch(e){
      setError(e.response?.data?.mensaje||'No pudimos crear tu cuenta');
      setLoading(false);
    }
  };

  return(
    <Wrap>
      <Logo>Mingo</Logo>
      <Sub>Crea tu cuenta en segundos</Sub>

      <FormCard>
        <Title>Regístrate gratis</Title>
        <SubTitle>Accede como cliente y prestador al instante</SubTitle>

        <BenefitRow><CheckCircle size={15} color="#10B981"/><span>Sin selección de rol — tienes ambos</span></BenefitRow>
        <BenefitRow><CheckCircle size={15} color="#10B981"/><span>Gratis para siempre</span></BenefitRow>
        <BenefitRow style={{marginBottom:'12px'}}><CheckCircle size={15} color="#10B981"/><span>Recibe y ofrece trabajitos</span></BenefitRow>

        {error&&<ErrorBox>{error}</ErrorBox>}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'14px',marginTop:'8px'}}>
          <FieldWrap>
            <FieldLabel>Nombre completo</FieldLabel>
            <InputWrap>
              <IcoLeft><User size={17}/></IcoLeft>
              <Input $ico type="text" placeholder="Tu nombre" value={nombre}
                onChange={e=>setNombre(e.target.value)} autoComplete="name"/>
            </InputWrap>
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Correo electrónico</FieldLabel>
            <InputWrap>
              <IcoLeft><Mail size={17}/></IcoLeft>
              <Input $ico type="email" placeholder="tu@correo.com" value={email}
                onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
            </InputWrap>
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Contraseña</FieldLabel>
            <InputWrap>
              <IcoLeft><Lock size={17}/></IcoLeft>
              <Input $ico type={show?'text':'password'} placeholder="Mínimo 6 caracteres" value={password}
                onChange={e=>setPassword(e.target.value)} autoComplete="new-password"/>
              <IcoRight type="button" onClick={()=>setShow(!show)}>
                {show?<EyeOff size={17}/>:<Eye size={17}/>}
              </IcoRight>
            </InputWrap>
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Confirmar contraseña</FieldLabel>
            <InputWrap>
              <IcoLeft><Lock size={17}/></IcoLeft>
              <Input $ico type={show?'text':'password'} placeholder="Repite la contraseña" value={confirmar}
                onChange={e=>setConfirmar(e.target.value)} autoComplete="new-password"/>
            </InputWrap>
          </FieldWrap>

          <div style={{
            background:'#F5E6FF',
            borderRadius:'12px',
            padding:'12px',
            display:'flex',
            gap:'10px',
            alignItems:'flex-start'
          }}>
            <MapPin size={18} color="#8A2BE2" style={{flexShrink:0,marginTop:2}}/>
            <div style={{fontSize:'0.8rem',color:'#6B7280'}}>
              <strong style={{color:'#8A2BE2'}}>Ubicación inicial:</strong> Bogotá, Colombia
              <br/>Podrás cambiarla después en tu perfil
            </div>
          </div>

          <TermsCheck style={{marginTop:"8px",padding:"12px",background:"#F5E6FF",borderRadius:"12px",border:"1.5px solid #8A2BE2",display:"flex",alignItems:"flex-start",gap:"10px"}}>
            <Checkbox type="checkbox" checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)}/>
            <span>He leído y acepto los <Link to="/terminos" target="_blank" style={{color:'#8A2BE2',fontWeight:700}}>Términos y Condiciones</Link></span>
          </TermsCheck>

          <Button type="submit" $full disabled={loading}>
            {loading?'Creando cuenta...':'Crear cuenta gratis'}
          </Button>
        </form>

        <Footer>¿Ya tienes cuenta? <a href="/">Inicia sesión</a></Footer>
      </FormCard>
    </Wrap>
  );
};
export default Register;
