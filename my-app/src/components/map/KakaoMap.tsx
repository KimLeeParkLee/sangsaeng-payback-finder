import { useEffect, useRef } from 'react';
import { loadKakaoMaps } from '@/lib/kakao';
import type { LatLng, MapMarker, MapBounds } from '@/types/map';

type Props = {
  center: LatLng;
  zoom?: number; // kakao: level (낮을수록 확대)
  markers?: MapMarker[];
  onMarkerClick?: (id: string) => void;
  className?: string;
  onIdle?: (center: LatLng, level?: number, bounds?: MapBounds) => void;
};

export function KakaoMap({ center, zoom, markers = [], onMarkerClick, className, onIdle }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const idleListenerRef = useRef<any>(null);

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
          level: typeof zoom === 'number' ? zoom : 5, // 초기 레벨만 설정
        });

        // Attach idle listener to propagate center/level/bounds upward
        if (onIdle) {
          const handler = () => {
            try {
              const c = mapRef.current.getCenter();
              const level = mapRef.current.getLevel();
              const b = mapRef.current.getBounds();
              const sw = b.getSouthWest();
              const ne = b.getNorthEast();
              onIdle(
                { lat: c.getLat(), lng: c.getLng() },
                level,
                { sw: { lat: sw.getLat(), lng: sw.getLng() }, ne: { lat: ne.getLat(), lng: ne.getLng() } }
              );
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('[KakaoMap] idle callback error', e);
            }
          };
          maps.event.addListener(mapRef.current, 'idle', handler);
          idleListenerRef.current = handler;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[KakaoMap] init error:', e);
      }
    })();
    return () => {
      mounted = false;
      const kakao = (window as any).kakao;
      if (idleListenerRef.current && kakao?.maps?.event && mapRef.current) {
        kakao.maps.event.removeListener(mapRef.current, 'idle', idleListenerRef.current);
        idleListenerRef.current = null;
      }
    };
  }, []);

  // center/zoom updates (zoom은 명시된 경우에만 강제 적용)
  useEffect(() => {
    const map = mapRef.current;
    const kakao = (window as any).kakao;
    if (!map || !kakao?.maps) return;
    map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    if (typeof zoom === 'number') {
      map.setLevel(zoom);
    }
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
