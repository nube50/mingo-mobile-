import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wrap = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background: #fff;
  padding: 20px;
  padding-bottom: 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #F0F0F0;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active { opacity: 0.6; }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 800;
  color: #333333;
`;

const Content = styled.div`
  font-size: 0.95rem;
  line-height: 1.7;
  color: #333333;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 800;
  color: #8A2BE2;
  margin-bottom: 12px;
`;

const SubTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 8px;
  margin-top: 16px;
`;

const Paragraph = styled.p`
  color: #4B5563;
  margin-bottom: 12px;
`;

const List = styled.ul`
  padding-left: 20px;
  margin-bottom: 12px;
`;

const ListItem = styled.li`
  color: #4B5563;
  margin-bottom: 6px;
`;

const Highlight = styled.span`
  font-weight: 600;
  color: #8A2BE2;
`;

const Terminos = () => {
  const navigate = useNavigate();

  return (
    <Wrap>
      <Header>
        <BackBtn onClick={()=>window.history.length>1?window.history.back():window.close()}>
          <ArrowLeft size={24} />
        </BackBtn>
        <Title>Términos y Condiciones</Title>
      </Header>

      <Content>
        <Section>
          <SectionTitle>1. INTRODUCCIÓN</SectionTitle>
          <Paragraph>
            Bienvenido a <Highlight>Mingo</Highlight>, una plataforma tecnológica que facilita la conexión entre personas que buscan y ofrecen servicios independientes.
          </Paragraph>
          <Paragraph>
            Al acceder y utilizar la plataforma, usted acepta estos términos.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>2. NATURALEZA DEL SERVICIO</SectionTitle>
          <Paragraph>
            Mingo es una plataforma de intermediación tecnológica.
          </Paragraph>
          <Paragraph>
            <Highlight>No es empleador, ni contratante, ni proveedor de servicios.</Highlight>
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>3. RELACIÓN ENTRE USUARIOS</SectionTitle>
          <Paragraph>
            Los acuerdos son entre usuarios.
          </Paragraph>
          <Paragraph>
            Mingo no participa ni interviene en los acuerdos entre usuarios.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>4. AUSENCIA DE RELACIÓN LABORAL</SectionTitle>
          <Paragraph>
            <Highlight>No existe relación laboral entre Mingo y los usuarios.</Highlight>
          </Paragraph>
          <Paragraph>
            Los prestadores de servicio actúan de manera independiente.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>5. USO DE LA PLATAFORMA</SectionTitle>
          <Paragraph>
            El usuario debe usar la plataforma de forma legal y responsable.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>6. SISTEMA DE CRÉDITOS</SectionTitle>
          <Paragraph>
            Los créditos:
          </Paragraph>
          <List>
            <ListItem>No garantizan resultados</ListItem>
            <ListItem>No son pagos por servicios</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>7. SISTEMA DE REPUTACIÓN</SectionTitle>
          <Paragraph>
            Las calificaciones son generadas por usuarios.
          </Paragraph>
          <Paragraph>
            <Highlight>Mingo no valida las calificaciones.</Highlight>
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. LIMITACIÓN DE RESPONSABILIDAD</SectionTitle>
          <Paragraph>
            Mingo no responde por:
          </Paragraph>
          <List>
            <ListItem>Incumplimientos entre usuarios</ListItem>
            <ListItem>Calidad del servicio</ListItem>
            <ListItem>Daños entre usuarios</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>9. COMUNICACIÓN</SectionTitle>
          <Paragraph>
            Mingo no supervisa los chats ni los acuerdos entre usuarios.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>10. PROHIBICIONES</SectionTitle>
          <Paragraph>
            No se permite:
          </Paragraph>
          <List>
            <ListItem>Fraude</ListItem>
            <ListItem>Contenido ilegal</ListItem>
            <ListItem>Suplantación de identidad</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>11. PROTECCIÓN DE DATOS</SectionTitle>
          <Paragraph>
            Se manejan datos conforme a la ley colombiana de protección de datos personales.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>12. MODIFICACIONES</SectionTitle>
          <Paragraph>
            Mingo puede cambiar estos términos en cualquier momento.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>13. LEGISLACIÓN</SectionTitle>
          <Paragraph>
            Aplica la ley colombiana.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>14. INTERMEDIACIÓN</SectionTitle>
          <Paragraph>
            Mingo es solo un intermediario tecnológico.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>15. INDEPENDENCIA</SectionTitle>
          <Paragraph>
            Los usuarios actúan por cuenta propia y riesgo.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>16. EXONERACIÓN</SectionTitle>
          <Paragraph>
            Mingo no responde por daños, fraudes o incumplimientos entre usuarios.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>17. SIN GARANTÍAS</SectionTitle>
          <Paragraph>
            La plataforma se ofrece "tal cual".
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>18. LÍMITE DE RESPONSABILIDAD</SectionTitle>
          <Paragraph>
            Responsabilidad limitada a pagos realizados (si aplica).
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>19. CONTENIDO DE USUARIOS</SectionTitle>
          <Paragraph>
            <Highlight>Los usuarios son responsables de lo que publican.</Highlight>
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>20. CRÉDITOS</SectionTitle>
          <Paragraph>
            Los créditos son no reembolsables y no tienen valor fuera de la plataforma.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>21. SUSPENSIÓN</SectionTitle>
          <Paragraph>
            Mingo puede suspender cuentas que incumplan los términos.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>22. CONFLICTOS</SectionTitle>
          <Paragraph>
            Los usuarios resuelven sus propios conflictos.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>23. INDEMNIDAD</SectionTitle>
          <Paragraph>
            El usuario protege a Mingo ante cualquier reclamo derivados del uso de la plataforma.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>24. JURISDICCIÓN</SectionTitle>
          <Paragraph>
            Leyes de Colombia.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>25. ACEPTACIÓN</SectionTitle>
          <Paragraph>
            El uso de la plataforma implica aceptación de estos términos.
          </Paragraph>
        </Section>
      </Content>
    </Wrap>
  );
};

export default Terminos;