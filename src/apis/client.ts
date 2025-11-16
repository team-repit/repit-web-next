import { useAuthStore } from "@/stores/useAuthStore";

// props로 전달 받은 url과 쿼리 파라미터 객체를 합쳐 최종 요청 URL을 만들어줌
function buildUrl(url: string, params?: Record<string, string | number>) {
  const fullUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`;
  if (!params) return fullUrl;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return `${fullUrl}?${searchParams.toString()}`;
}

// fetch-wrapper
export async function apiFetch<T, B = unknown>(
  url: string,
  options: RequestInit & {
    query?: Record<string, string | number>;
    body?: B;
  } = {}
): Promise<T> {
  const { accessToken } = useAuthStore.getState();
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  console.log(headers);
  const finalUrl = buildUrl(url, options.query);

  const response = await fetch(finalUrl, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Api Error ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
