export type LatLng = { lat: number; lng: number };

export type MapMarker = {
  id: string;
  position: LatLng;
  title?: string;
  recognized?: boolean; // 인정 여부에 따라 마커 스타일 변경
};

export type MapBounds = {
  sw: LatLng; // south-west
  ne: LatLng; // north-east
};
