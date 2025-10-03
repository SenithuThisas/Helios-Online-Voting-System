import { useEffect, useState } from 'react';
import { socketService } from '../services/socketService';
import useAuthStore from '../store/authStore';

export const useSocket = () => {
  const { isAuthenticated, token } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);
      setIsConnected(true);

      socketService.on('connect', () => {
        setIsConnected(true);
      });

      socketService.on('disconnect', () => {
        setIsConnected(false);
      });

      return () => {
        socketService.disconnect();
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, token]);

  const emit = (event: string, data?: any) => {
    socketService.emit(event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    socketService.on(event, callback);
  };

  const off = (event: string, callback?: (data: any) => void) => {
    socketService.off(event, callback);
  };

  return {
    isConnected,
    emit,
    on,
    off,
  };
};
