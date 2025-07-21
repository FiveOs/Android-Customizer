import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Default fetcher for react-query
export async function apiRequest(method: string, url: string, data?: any) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || 'Network request failed';
    } catch {
      errorMessage = errorText || 'Network request failed';
    }
    throw new Error(`${response.status}: ${errorMessage}`);
  }

  return response.json();
}

// Set default query function
queryClient.setQueryDefaults([], {
  queryFn: ({ queryKey }) => {
    const [url] = queryKey as [string];
    return apiRequest('GET', url);
  },
});