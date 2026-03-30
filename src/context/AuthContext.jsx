import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { conectar, getSocket } from '../services/socket';
import api from '../services/api';
import {
  getNotifPermission,
  requestNotifPermission,
  notifyNuevaSolicitud,
  notifySolicitudAceptada,
  notifyEstadoActualizado,
  notifyNuevoMensaje
} from '../services/notifications';

const Ctx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [socketEvents, setSocketEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const listenersRef = useRef({});
  const watchIdRef = useRef(null);

  // 1. Manejo Nativo de Ubicación para Prestadores
  const startLocationTracking = async () => {
    if (!usuario?.roles?.includes('prestador')) return;
    
    try {
      if (watchIdRef.current) return;

      watchIdRef.current = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 20000 },
        async (position) => {
          if (position) {
            const { latitude, longitude } = position.coords;
            // Actualizar backend inmutable
            try {
              await api.put('/geo/ubicacion', { latitud: latitude, longitud: longitude });
            } catch (e) { console.error('Error sincronizando ubicación:', e); }
          }
        }
      );
    } catch (e) {
      console.error('Error iniciando tracking nativo:', e);
    }
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current) {
      Geolocation.clearWatch({ id: watchIdRef.current });
      watchIdRef.current = null;
    }
  };

  // 2. Gestión de WebSockets Nativa
  const setupSocket = (authToken) => {
    const sock = conectar(authToken);
    if (!sock) return;

    const eventConfig = {
      'nueva_solicitud': (d) => {
        const n = notifyNuevaSolicitud(d);
        if (n) setNotifications(prev => [n, ...prev.slice(0, 49)]);
        setSocketEvents(prev => [...prev.slice(-19), { type: 'nueva_solicitud', data: d, time: new Date() }]);
      },
      'solicitud_aceptada': (d) => {
        const n = notifySolicitudAceptada(d);
        if (n) setNotifications(prev => [n, ...prev.slice(0, 49)]);
        setSocketEvents(prev => [...prev.slice(-19), { type: 'solicitud_aceptada', data: d, time: new Date() }]);
      },
      'estado_actualizado': (d) => {
        const n = notifyEstadoActualizado(d);
        if (n) setNotifications(prev => [n, ...prev.slice(0, 49)]);
        setSocketEvents(prev => [...prev.slice(-19), { type: 'estado_actualizado', data: d, time: new Date() }]);
      },
      'nuevo_mensaje': (d) => {
        const n = notifyNuevoMensaje(d);
        if (n) setNotifications(prev => [n, ...prev.slice(0, 49)]);
        setUnreadMessages(prev => prev + 1);
        setSocketEvents(prev => [...prev.slice(-19), { type: 'nuevo_mensaje', data: d, time: new Date() }]);
      }
    };

    Object.entries(eventConfig).forEach(([ev, handler]) => {
      if (!listenersRef.current[ev]) {
        sock.on(ev, handler);
        listenersRef.current[ev] = handler;
      }
    });
  };

  const clearSocket = () => {
    const sock = getSocket();
    if (!sock) return;
    Object.entries(listenersRef.current).forEach(([ev, h]) => sock.off(ev, h));
    listenersRef.current = {};
  };

  // 3. Inicialización
  useEffect(() => {
    const init = async () => {
      const t = localStorage.getItem('mingo_token');
      const u = localStorage.getItem('mingo_usuario');
      
      if (t && u) {
        const parsedUser = JSON.parse(u);
        setToken(t);
        setUsuario(parsedUser);
        setupSocket(t);
        
        // Permisos nativos proactivos
        await requestNotifPermission();
        if (parsedUser.roles?.includes('prestador')) {
          await startLocationTracking();
        }
      }
      
      // Cargar notificaciones guardadas
      const saved = localStorage.getItem('mingo_notifications');
      if (saved) {
        try { setNotifications(JSON.parse(saved).map(n => ({ ...n, timestamp: new Date(n.timestamp) }))); } catch(e) {}
      }
      
      setCargando(false);
    };
    init();
    return () => { clearSocket(); stopLocationTracking(); };
  }, []);

  // 4. Acciones de Auth
  const login = async (user, authToken) => {
    clearSocket();
    stopLocationTracking();
    
    setUsuario(user);
    setToken(authToken);
    localStorage.setItem('mingo_token', authToken);
    localStorage.setItem('mingo_usuario', JSON.stringify(user));
    
    setupSocket(authToken);
    await requestNotifPermission();
    if (user.roles?.includes('prestador')) {
      await startLocationTracking();
    }
  };

  const logout = () => {
    clearSocket();
    stopLocationTracking();
    setUsuario(null);
    setToken(null);
    setNotifications([]);
    setUnreadMessages(0);
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Ctx.Provider value={{
      usuario, token, cargando, login, logout, autenticado: !!token,
      socketEvents, notifications, unreadMessages,
      setUnreadMessages, clearUnreadMessages: () => setUnreadMessages(0)
    }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be inside AuthProvider');
  return c;
};

export default Ctx;
