import { useEffect, useRef } from 'react';
import { loadKakaoMaps } from '@/lib/kakao';
import type { LatLng, MapMarker } from '@/types/map';

type Props = {
  center: LatLng;
  zoom?: number; // kakao: level (낮을수록 확대)
  markers?: MapMarker[];
  onMarkerClick?: (id: string) => void;
  className?: string;
};

export function KakaoMap({ center, zoom = 5, markers = [], onMarkerClick, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // init map
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY as string;
        const kakao = await loadKakaoMaps(appKey);
        if (!mounted || !containerRef.current) return;
        const { maps } = kakao;
        mapRef.current = new maps.Map(containerRef.current, {
          center: new maps.LatLng(center.lat, center.lng),
          level: zoom, // level: 1(가까이) ~ 14(멀리)
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[KakaoMap] init error:', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // center/zoom updates
  useEffect(() => {
    const map = mapRef.current;
    const kakao = (window as any).kakao;
    if (!map || !kakao?.maps) return;
    map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    map.setLevel(zoom);
  }, [center.lat, center.lng, zoom]);

  // markers updates
  useEffect(() => {
    const map = mapRef.current;
    const kakao = (window as any).kakao;
    if (!map || !kakao?.maps) return;

    // clear existing
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    markers.forEach((m) => {
      const pos = new kakao.maps.LatLng(m.position.lat, m.position.lng);
      // custom marker by recognized
      const color = m.recognized ? '#16a34a' : '#ef4444';
      const marker = new kakao.maps.Marker({
        position: pos,
        title: m.title,
        // 심플한 커스텀 이미지(원형 SVG data URI)
        image: new kakao.maps.MarkerImage(
          `data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
              <circle cx='14' cy='14' r='10' fill='${color}'/>
            </svg>`
          )}`,
          new kakao.maps.Size(28, 28)
        ),
      });
      marker.setMap(map);
      if (onMarkerClick) {
        kakao.maps.event.addListener(marker, 'click', () => onMarkerClick(m.id));
      }
      markersRef.current.push(marker);
    });
  }, [markers, onMarkerClick]);

  return <div ref={containerRef} className={className} />;
}

export default KakaoMap;

