declare global {
  interface Window {
    kakao?: any;
  }
}

// Kakao Maps JS SDK 동적 로더
export async function loadKakaoMaps(appKey: string) {
  if (typeof window === 'undefined') throw new Error('Must run in browser');
  if (!appKey) throw new Error('VITE_KAKAO_MAP_APP_KEY is missing');
  if (window.kakao?.maps) return window.kakao;

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer,drawing`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Kakao Maps SDK'));
    document.head.appendChild(script);
  });

  return new Promise((resolve) => {
    window.kakao.maps.load(() => resolve(window.kakao));
  });
}

