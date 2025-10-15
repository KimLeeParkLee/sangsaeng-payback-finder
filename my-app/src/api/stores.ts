import { api } from '@/api/client';
import type { Store } from '@/types/store';

export type NearbyParams = {
  lat: number;
  lng: number;
  radius?: number; // meters, default 1000 (server-side)
  sortBy?: 'distance' | 'confidence';
};

type ApiNearbyStore = {
  placeName: string;
  distance: string | number;
  placeUrl?: string;
  categoryName?: string;
  addressName?: string;
  roadAddressName?: string;
  storeId: string;
  phone?: string;
  location: { lat: string | number; lng: string | number };
  eligibility?: {
    status?: string;
    reason?: string;
    confidence?: number;
  };
};

type NearbyResponse = {
  success: boolean;
  data?: {
    stores?: ApiNearbyStore[];
  };
};

const toNumber = (v: string | number | undefined | null) =>
  typeof v === 'number' ? v : v ? Number(v) : NaN;

export async function fetchNearbyStores(params: NearbyParams): Promise<Store[]> {
  const res = await api.get<NearbyResponse>('stores/nearby', {
    params,
    validateStatus: (s) => s < 500, // 4xx는 결과로 처리
  });

  if (!res.data?.success) {
    return [];
  }
  const list = res.data.data?.stores ?? [];
  return list
    .map<Store>((s, idx) => {
      const lat = toNumber(s.location?.lat);
      const lng = toNumber(s.location?.lng);
      const distanceMeters = toNumber(s.distance);
      const id = s.storeId ?? `${lat}_${lng}_${idx}`;
      return {
        id: String(id),
        name: s.placeName,
        address: s.roadAddressName || s.addressName || '',
        category: s.categoryName,
        lat: isNaN(lat) ? 0 : lat,
        lng: isNaN(lng) ? 0 : lng,
        recognized: s.eligibility?.status === 'ELIGIBLE',
        distanceMeters: isNaN(distanceMeters) ? undefined : distanceMeters,
        placeUrl: s.placeUrl,
        roadAddressName: s.roadAddressName,
        phone: s.phone,
        eligibilityConfidence: s.eligibility?.confidence,
        eligibilityStatus: s.eligibility?.status as any,
        eligibilityReason: s.eligibility?.reason,
      };
    })
    .filter((s) => !isNaN(s.lat) && !isNaN(s.lng));
}
