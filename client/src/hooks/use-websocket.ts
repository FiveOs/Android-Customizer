import { useEffect, useState } from "react";
import { wsManager } from "@/lib/websocket";

export function useWebSocket(onMessage?: (data: any) => void) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket
    wsManager.connect();

    // Check connection status
    const checkConnection = () => {
      setIsConnected(wsManager.isConnected());
    };

    // Set up listener for messages
    const messageListener = (data: any) => {
      onMessage?.(data);
    };

    if (onMessage) {
      wsManager.addListener(messageListener);
    }

    // Check connection status periodically
    const interval = setInterval(checkConnection, 1000);
    checkConnection(); // Initial check

    return () => {
      clearInterval(interval);
      if (onMessage) {
        wsManager.removeListener(messageListener);
      }
    };
  }, [onMessage]);

  return { isConnected };
}
