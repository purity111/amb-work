import { io, Socket } from 'socket.io-client';

let globalSocket: Socket | null = null;

export function getGlobalSocket(): Socket {
  if (!globalSocket) {
    globalSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://172.20.1.185:3000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
    
    globalSocket.on('connect', () => {
      console.log('Global socket connected:', globalSocket?.id);
    });
    
    globalSocket.on('disconnect', (reason) => {
      console.log('Global socket disconnected:', reason);
    });
  }
  
  return globalSocket;
}

export function disconnectGlobalSocket() {
  if (globalSocket) {
    globalSocket.disconnect();
    globalSocket = null;
  }
}

