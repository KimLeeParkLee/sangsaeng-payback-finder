export type Store = {
  id: string;
  name: string;
  address: string;
  category?: string;
  lat: number;
  lng: number;
  recognized?: boolean; // 인정 여부
  // Nearby 전용 추가 정보(옵션)
  distanceMeters?: number;
  placeUrl?: string;
  roadAddressName?: string;
  phone?: string;
  eligibilityConfidence?: number;
  eligibilityStatus?: 'ELIGIBLE' | 'INELIGIBLE' | string;
  eligibilityReason?: string;
};

export type StoreDetail = Store & {
  description?: string;
  images?: string[];
  reviewsCount?: number;
  rating?: number;
  dataSource?: string; // 데이터 출처 표시용
};
