import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * Mingo Notification Service - Native Android & Web
 * Maneja notificaciones locales con integración profunda en el sistema.
 */

export const isNotifSupported = () => true;

export const getNotifPermission = async () => {
  if (!Capacitor.isNativePlatform()) {
    return 'Notification' in window ? Notification.permission : 'unsupported';
  }
  const { display } = await LocalNotifications.checkPermissions();
  return display;
};

export const requestNotifPermission = async () => {
  if (!Capacitor.isNativePlatform()) {
    if (!('Notification' in window)) return 'unsupported';
    return await Notification.requestPermission();
  }
  const { display } = await LocalNotifications.requestPermissions();
  return display;
};

/**
 * Configura los canales de notificación para Android.
 * Esto asegura que las notificaciones tengan la prioridad correcta.
 */
const ensureChannels = async () => {
  if (Capacitor.getPlatform() === 'android') {
    await LocalNotifications.createChannel({
      id: 'mingo_services',
      name: 'Servicios de Mingo',
      description: 'Notificaciones sobre tus trabajos y solicitudes',
      importance: 5,
      visibility: 1,
      vibration: true,
    });
    
    await LocalNotifications.createChannel({
      id: 'mingo_chat',
      name: 'Chat de Mingo',
      description: 'Nuevos mensajes de clientes y prestadores',
      importance: 4,
      visibility: 1,
      vibration: true,
    });
  }
};

const showLocalNotification = async (title, body, channelId = 'mingo_services', extra = {}) => {
  try {
    if (Capacitor.isNativePlatform()) {
      await ensureChannels();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 1000000),
            title,
            body,
            channelId,
            extra,
            smallIcon: 'ic_stat_icon_config_sample', // Configurado en capacitor.config.json
            iconColor: '#8A2BE2',
            schedule: { at: new Date(Date.now() + 100) },
          }
        ]
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  } catch (err) {
    console.error('Error showing notification:', err);
  }
};

// --- Notificadores Específicos ---

export const notifyNuevaSolicitud = (data) => {
  const title = '🆕 Nuevo trabajito disponible';
  const body = `${data.categoria || 'Servicio'}: ${(data.descripcion || '').substring(0, 60)}...`;
  
  showLocalNotification(title, body, 'mingo_services', { type: 'nueva_solicitud', id: data.solicitud_id });

  return {
    id: `ns_${Date.now()}`,
    type: 'nueva_solicitud',
    title,
    message: body,
    timestamp: new Date(),
    read: false,
    data
  };
};

export const notifySolicitudAceptada = (data) => {
  const title = '✅ ¡Trabajo aceptado!';
  const body = `${data.prestador?.nombre || 'Un profesional'} ha aceptado tu solicitud.`;

  showLocalNotification(title, body, 'mingo_services', { type: 'solicitud_aceptada', id: data.solicitud_id });

  return {
    id: `sa_${Date.now()}`,
    type: 'solicitud_aceptada',
    title,
    message: body,
    timestamp: new Date(),
    read: false,
    data
  };
};

export const notifyEstadoActualizado = (data) => {
  const statusMap = {
    'en_curso': { title: '🔄 Servicio iniciado', body: 'Tu trabajito está en progreso.' },
    'completada': { title: '🎉 Servicio finalizado', body: '¡Misión cumplida! No olvides calificar.' },
    'cancelada': { title: '❌ Servicio cancelado', body: 'La solicitud ha sido retirada.' }
  };

  const config = statusMap[data.estado] || { title: 'Estado actualizado', body: `Nuevo estado: ${data.estado}` };
  
  showLocalNotification(config.title, config.body, 'mingo_services', { type: 'estado', id: data.solicitud_id });

  return {
    id: `eu_${Date.now()}`,
    type: 'estado_actualizado',
    title: config.title,
    message: config.body,
    timestamp: new Date(),
    read: false,
    data
  };
};

export const notifyNuevoMensaje = (data) => {
  // No notificar si el usuario ya está viendo el chat (opcional, pero mejora UX)
  if (typeof document !== 'undefined' && document.hasFocus() && window.location.pathname.includes('/chat')) {
    return null;
  }

  const title = `💬 Mensaje de ${data.remitente_nombre || 'Mingo'}`;
  const body = (data.contenido || 'Tienes un nuevo mensaje').substring(0, 80);

  showLocalNotification(title, body, 'mingo_chat', { type: 'mensaje', id: data.solicitud_id });

  return {
    id: `nm_${Date.now()}`,
    type: 'nuevo_mensaje',
    title,
    message: body,
    timestamp: new Date(),
    read: false,
    data
  };
};
