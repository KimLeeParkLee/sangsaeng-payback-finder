import { useEffect, useMemo, useState } from 'react';
import KakaoMap from '@/components/map/KakaoMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StoreList from '@/components/store/StoreList';
import type { Store } from '@/types/store';
import type { LatLng } from '@/types/map';
import { getBrowserLocation } from '@/lib/geolocation';

const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 }; // 서울 시청 근처

export default function HomePage() {
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [q, setQ] = useState('');

  // 샘플 매장 (임시)
  const stores: Store[] = useMemo(
    () => [
      {
        id: '1',
        name: '상생 카페 시청점',
        address: '서울 중구 태평로1가',
        category: '카페',
        lat: 37.5668,
        lng: 126.9785,
        recognized: true,
      },
      {
        id: '2',
        name: '비인정 편의점 A',
        address: '서울 중구 무교동',
        category: '편의점',
        lat: 37.5672,
        lng: 126.9769,
        recognized: false,
      },
    ],
    []
  );

  const markers = stores.map((s) => ({
    id: s.id,
    title: s.name,
    position: { lat: s.lat, lng: s.lng },
    recognized: s.recognized,
  }));

  useEffect(() => {
    getBrowserLocation()
      .then((pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }))
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="mb-3 flex gap-2">
          <Input
            placeholder="장소나 주소를 검색하세요"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button>검색</Button>
        </div>
        <KakaoMap center={center} markers={markers} className="h-[60vh] w-full rounded-xl border" />
      </div>
      <div>
        <div className="mb-2 text-sm text-muted-foreground">주변 인정 매장</div>
        <StoreList
          stores={stores}
          onSelect={(s) => alert(`상세: ${s.name}`)}
          onJudge={(s) => alert(`판별: ${s.name}`)}
        />
      </div>
    </div>
  );
}

