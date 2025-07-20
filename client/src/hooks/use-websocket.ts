// Minimal websocket hook with proper typing
export function useWebSocket() {
  return {
    isConnected: false,
    connected: false,
    socket: null,
    sendMessage: () => {},
    messages: []
  };
}