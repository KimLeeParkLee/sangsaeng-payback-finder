package com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.service;

import com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.Eligibility;
import com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.response.KakaoApiResponseDto;
import com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.response.StoresResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreService {
    private final MapApiService mapApiService;
    private final EligibilityService eligibilityService;

    public StoresResponseDto getStores(String lat, String lng, String sortBy) {
        // 1. 카카오 API를 호출하여 주변 상점 목록을 가져옴
        KakaoApiResponseDto kakaoApiResponseDto = mapApiService.searchNearByStores(lat, lng);

        // 2. 카카오 API 응답(DocumentDto)을 StoreInfoResponseDto로 변환
        List<StoresResponseDto.StoreResponseDto> resultStores = kakaoApiResponseDto.getDocuments().stream()
                .map(doc -> {
                    // 각 매장에 대해 인정 여부 판별
                    Eligibility eligibility = eligibilityService.check(doc.getPlaceName(), doc.getCategoryName());

                    return StoresResponseDto.StoreResponseDto.builder()
                            .placeName(doc.getPlaceName())
                            .distance(doc.getDistance())
                            .placeUrl(doc.getPlaceUrl())
                            .categoryName(doc.getCategoryName())
                            .addressName(doc.getAddressName())
                            .roadAddressName(doc.getRoadAddressName())
                            .storeId(doc.getStoreId())
                            .phone(doc.getPhone())
                            .location(new StoresResponseDto.StoreResponseDto.Location(doc.getLatitude(), doc.getLongitude()))
                            .eligibility(eligibility)
                            .build();
                })
                .collect(Collectors.toList());

        // 3. 정렬 로직 추후 추가 예정(거리순, 정확도순)

        return new StoresResponseDto(resultStores);
    }

    private double parseDoubleSafe(String value) {
        if (value == null || value.isBlank()) {
            return 0.0;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private int parseIntSafe(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
