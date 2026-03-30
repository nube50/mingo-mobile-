import styled, { css, keyframes } from 'styled-components';

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Button = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 54px; padding: 14px 24px;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 1rem; font-weight: 700; font-family: inherit;
  cursor: pointer; border: none; transition: all 0.15s;
  width: ${({ $full }) => $full ? '100%' : 'auto'};

  ${({ $v = 'primary' }) => $v === 'primary' && css`
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    box-shadow: 0 4px 16px rgba(138,43,226,0.35);
    &:active { transform: scale(0.97); background: ${({ theme }) => theme.colors.primaryDark}; }
  `}
  ${({ $v }) => $v === 'outline' && css`
    background: transparent; color: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    &:active { background: ${({ theme }) => theme.colors.primaryLight}; }
  `}
  ${({ $v }) => $v === 'ghost' && css`
    background: ${({ theme }) => theme.colors.surface2};
    color: ${({ theme }) => theme.colors.textMuted};
    &:active { background: ${({ theme }) => theme.colors.border }; }
  `}
  ${({ $v }) => $v === 'success' && css`
    background: ${({ theme }) => theme.colors.success};
    color: white;
    &:active { transform: scale(0.97); }
  `}
  &:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface || '#FFFFFF'};
  border-radius: ${({ theme }) => theme.radii.lg || '16px'};
  border: 1px solid ${({ theme }) => theme.colors.border || '#E5E7EB'};
  padding: ${({ $p }) => $p || '16px'};
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: transform 0.15s, box-shadow 0.15s;
  ${({ $click }) => $click && css`
    cursor: pointer;
    &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
    &:active { transform: scale(0.98); }
  `}
`;

export const CardInner = styled.div`
  padding: 20px;
`;

export const FieldWrap = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`;
export const FieldLabel = styled.label`
  font-size: 0.82rem; font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;
export const InputWrap = styled.div`
  position: relative; display: flex; align-items: center;
`;
export const IcoLeft = styled.div`
  position: absolute; left: 14px;
  color: ${({ theme }) => theme.colors.textFaint};
  display: flex; pointer-events: none;
`;
export const IcoRight = styled.button`
  position: absolute; right: 12px; background: none; border: none;
  color: ${({ theme }) => theme.colors.textFaint}; cursor: pointer; padding: 4px;
`;
export const Input = styled.input`
  width: 100%; min-height: 54px;
  padding: 14px 14px 14px ${({ $ico }) => $ico ? '46px' : '14px'};
  background: ${({ theme }) => theme.colors.surface2};
  border: 1.5px solid ${({ $err, theme }) => $err ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px; font-family: inherit; outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder { color: ${({ theme }) => theme.colors.textFaint}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(138,43,226,0.15);
    background: white;
  }
`;
export const ErrText = styled.p`
  font-size: 0.78rem; color: ${({ theme }) => theme.colors.error};
`;

export const Badge = styled.span`
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 12px; border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.72rem; font-weight: 700;
  background: ${({ $c, theme }) => {
    if ($c === 'success') return theme.colors.successLight;
    if ($c === 'error') return theme.colors.errorLight;
    if ($c === 'muted') return 'rgba(0,0,0,0.06)';
    return theme.colors.primaryLight;
  }};
  color: ${({ $c, theme }) => {
    if ($c === 'success') return theme.colors.success;
    if ($c === 'error') return theme.colors.error;
    if ($c === 'muted') return theme.colors.textMuted;
    return theme.colors.primary;
  }};
`;

export const Spinner = styled.div`
  width: ${({ $s }) => $s || '22px'}; height: ${({ $s }) => $s || '22px'};
  border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%;
  animation: spin 0.7s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;
export const SpinnerDark = styled(Spinner)`
  border-color: rgba(0,0,0,0.1); border-top-color: ${({ theme }) => theme.colors.primary};
`;

export const Row = styled.div`
  display: flex; align-items: ${({ $a }) => $a || 'center'};
  justify-content: ${({ $j }) => $j || 'flex-start'};
  gap: ${({ $g }) => $g || '10px'};
`;
export const Stack = styled.div`
  display: flex; flex-direction: column; gap: ${({ $g }) => $g || '16px'};
`;

export const Avatar = styled.div`
  width: ${({ $s }) => $s || '44px'}; height: ${({ $s }) => $s || '44px'};
  border-radius: 14px;
  background: linear-gradient(135deg, #F5E6FF 0%, #E9D5FF 100%);
  color: #8A2BE2;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 1rem; flex-shrink: 0; overflow: hidden;
  box-shadow: 0 2px 8px rgba(138,43,226,0.15);
  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const PageWrap = styled.div`
  min-height: 100vh; min-height: 100dvh;
  background: ${({ theme }) => theme.colors.bg || '#F8F9FA'};
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem; font-weight: 700;
  color: #333333;
  margin-bottom: 12px;
`;

export const EmptyState = styled.div`
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 48px 24px; text-align: center;
  gap: 10px; color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;
