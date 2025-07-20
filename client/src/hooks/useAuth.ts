// Minimal useAuth hook replacement
export function useAuth() {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false
  };
}