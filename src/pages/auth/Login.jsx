import{useState}from 'react';
import{useNavigate,Link}from 'react-router-dom';
import styled, {keyframes}from 'styled-components';
import{Mail,Lock,Eye,EyeOff}from 'lucide-react';
import api from '../../services/api';
import{useAuth}from '../../context/AuthContext';
import{Button,Card,FieldWrap,FieldLabel,InputWrap,IcoLeft,IcoRight,Input}from '../../components/common/UI';

const fadeUp=keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

const Wrap=styled.div`
  min-height:100vh;min-height:100dvh;background:#fff;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:24px;animation:${fadeUp} .4s ease both;
`;

const Logo=styled.div`
  font-size:2.2rem;font-weight:800;color:#8A2BE2;letter-spacing:-1px;
  margin-bottom:4px;
`;

const Sub=styled.p`
  font-size:.9rem;color:#6B7280;margin-bottom:32px;
`;

const FormCard=styled(Card)`
  width:100%;max-width:400px;padding:28px 24px;
  box-shadow:0 4px 24px rgba(138,43,226,0.12);
`;

const Title=styled.h1`
  font-size:1.5rem;font-weight:800;color:#333333;margin-bottom:4px;
`;

const SubTitle=styled.p`
  font-size:.85rem;color:#6B7280;margin-bottom:24px;
`;

const ErrorBox=styled.div`
  background:#FEE2E2;border:1px solid #FECACA;border-radius:12px;
  padding:12px 16px;font-size:.85rem;color:#EF4444;text-align:center;
`;

const Divider=styled.div`
  display:flex;align-items:center;gap:12px;margin:4px 0;
  color:#C4C9D4;font-size:.8rem;
  &::before,&::after{content:'';flex:1;height:1px;background:#F0F0F0;}
`;

const Footer=styled.p`
  text-align:center;color:#6B7280;font-size:.88rem;margin-top:20px;
  a{color:#8A2BE2;font-weight:700;}
`;

const Login=()=>{
  const navigate=useNavigate();
  const{login}=useAuth();
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[show,setShow]=useState(false);
  const[error,setError]=useState('');
  const[loading,setLoading]=useState(false);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!email||!password)return setError('Ingresa tu correo y contraseña');
    setLoading(true);setError('');
    try{
      const res=await api.post('/auth/login',{email,password});
      login(res.data.usuario,res.data.token);
      navigate('/home');
    }catch(e){
      setError(e.response?.data?.mensaje||'No pudimos iniciar sesión');
    }finally{setLoading(false);}
  };

  return(
    <Wrap>
      <Logo>Mingo</Logo>
      <Sub>Lanza tu trabajito. Caza tu oportunidad.</Sub>

      <FormCard>
        <Title>¡Bienvenido!</Title>
        <SubTitle>Ingresa a tu cuenta para continuar</SubTitle>

        {error&&<ErrorBox>{error}</ErrorBox>}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'18px'}}>
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
              <Input $ico type={show?'text':'password'} placeholder="Tu contraseña" value={password}
                onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/>
              <IcoRight type="button" onClick={()=>setShow(!show)}>
                {show?<EyeOff size={17}/>:<Eye size={17}/>}
              </IcoRight>
            </InputWrap>
          </FieldWrap>

          <Button type="submit" $full disabled={loading}>
            {loading?'Ingresando...':'Entrar'}
          </Button>
        </form>

        <Footer>¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link></Footer>
      </FormCard>
    </Wrap>
  );
};
export default Login;
