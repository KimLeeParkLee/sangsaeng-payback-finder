export type Store = {
  id: string;
  name: string;
  address: string;
  category?: string;
  lat: number;
  lng: number;
  recognized?: boolean; // 인정 여부
};

export type StoreDetail = Store & {
  description?: string;
  images?: string[];
  reviewsCount?: number;
  rating?: number;
  dataSource?: string; // 데이터 출처 표시용
};

