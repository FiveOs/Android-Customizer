// Minimal websocket hook
export function useWebSocket() {
  return {
    isConnected: false,
    sendMessage: () => {},
    messages: []
  };
}