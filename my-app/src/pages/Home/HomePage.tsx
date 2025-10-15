import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import KakaoMap from '@/components/map/KakaoMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StoreList from '@/components/store/StoreList';
import type { Store } from '@/types/store';
import type { LatLng } from '@/types/map';
import { getBrowserLocation } from '@/lib/geolocation';
import { fetchNearbyStores } from '@/api/stores';

const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 }; // 서울 시청 근처 (지오로케이션 실패 시 사용)

export default function HomePage() {
  const [center, setCenter] = useState<LatLng | null>(null);
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'confidence'>('distance');
  const [nearby, setNearby] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idleTimer = useRef<number | null>(null);
  const [level, setLevel] = useState<number>(5);
  const [computedRadius, setComputedRadius] = useState<number>(1000);

  // 샘플 매장 (임시)
  const stores: Store[] = useMemo(() => nearby, [nearby]);

  const markers = stores.map((s) => ({
    id: s.id,
    title: s.name,
    position: { lat: s.lat, lng: s.lng },
    recognized: s.recognized,
  }));

  useEffect(() => {
    let done = false;
    getBrowserLocation()
      .then((pos) => {
        if (done) return;
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      })
      .catch(() => {
        // 권한 거부/실패 시 기본 중심으로 설정
        setCenter(DEFAULT_CENTER);
      });
    return () => {
      done = true;
    };
  }, []);

  const doSearch = async (origin?: LatLng, r?: number) => {
    const c = origin ?? center;
    if (!c) {
      setError('위치 정보가 아직 준비되지 않았습니다');
      return;
    }
    const rad = r ?? computedRadius;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchNearbyStores({ lat: c.lat, lng: c.lng, radius: rad, sortBy });
      setNearby(list);
    } catch (e: any) {
      setError(e?.message || '검색 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 위치가 바뀌면 자동 검색(초기 한번)
  useEffect(() => {
    if (center) {
      doSearch(center, computedRadius);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, computedRadius, sortBy]);

  // 거리 계산(Haversine)
  const dist = (a: LatLng, b: LatLng) => {
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const handleMapIdle = useCallback(
    (c: LatLng, lvl?: number, bounds?: { sw: LatLng; ne: LatLng }) => {
      // 디바운스하여 과도한 요청 방지 + 변경 없으면 무시
      const changed = !center ||
        Math.abs(c.lat - center.lat) > 1e-6 || Math.abs(c.lng - center.lng) > 1e-6;
      // 반경 계산: 보이는 영역의 대각선 절반(=반경) 사용
      if (bounds) {
        const diagonal = dist(bounds.sw, bounds.ne);
        const nextRadius = Math.max(100, Math.round(diagonal / 2));
        setComputedRadius(nextRadius);
      } else if (typeof lvl === 'number') {
        // 레벨 기반 대략값(예비): 카카오 level 1~14
        // 경험적 매핑(서울 위도 기준 근사): level 커질수록 반경 증가
        const approx = [200, 300, 500, 800, 1200, 1800, 2500, 3500, 5000, 7500, 10000, 15000, 22000, 30000];
        const idx = Math.max(1, Math.min(14, Math.round(lvl))) - 1;
        setComputedRadius(approx[idx]);
      }
      if (!changed) return; // 중심 변화 없으면 center 업데이트 생략
      if (idleTimer.current) {
        window.clearTimeout(idleTimer.current);
      }
      idleTimer.current = window.setTimeout(() => {
        setCenter(c);
        if (typeof lvl === 'number') setLevel(lvl);
      }, 350);
    },
    [center]
  );

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Input
            placeholder="장소나 주소를 검색하세요(로컬 검색은 추후)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
          <div className="rounded-md border bg-white px-2 py-1 text-gray-700">
            반경 약 {computedRadius.toLocaleString()} m (zoom {level})
          </div>
          <Button size="sm" onClick={() => doSearch()} disabled={loading || !center}>
            {loading ? '검색 중...' : '검색'}
          </Button>
        </div>
        {center ? (
          <KakaoMap
            center={center}
            markers={markers}
            onIdle={(c, lvl, b) => handleMapIdle(c, lvl, b)}
            className="h-[60vh] w-full rounded-xl border"
          />
        ) : (
          <div className="flex h-[60vh] w-full items-center justify-center rounded-xl border text-sm text-muted-foreground">
            위치 정보를 불러오는 중...
          </div>
        )}
        {error && (
          <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>주변 인정 매장</span>
          <label className="flex items-center gap-2 text-gray-700">
            정렬
            <select
              className="rounded-md border bg-white px-2 py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="distance">거리순</option>
              <option value="confidence">신뢰도순</option>
            </select>
          </label>
        </div>
        <StoreList
          stores={stores}
          onSelect={(s) => alert(`상세: ${s.name}`)}
          onJudge={(s) => alert(`판별: ${s.name}`)}
        />
      </div>
    </div>
  );
}
