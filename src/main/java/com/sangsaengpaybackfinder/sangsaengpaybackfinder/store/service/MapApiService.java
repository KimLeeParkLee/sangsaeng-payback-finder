package com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.service;

import com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.response.KakaoApiResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class MapApiService {
    private final WebClient webClient;

    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    public KakaoApiResponseDto searchNearByStores(String lat, String lng) {
        final String SEARCH_QUERY = "음식점";
        final int RADIUS = 5000;
        final int SIZE = 15;

        // WebClient를 사용하여 비동기 API 호출
        Mono<KakaoApiResponseDto> responseMono = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("dapi.kakao.com")
                        .path("/v2/local/search/keyword.json")
                        .queryParam("y", lat)
                        .queryParam("x", lng)
                        .queryParam("radius", RADIUS)
                        .queryParam("query", SEARCH_QUERY)
                        .queryParam("size", SIZE)
                        .build())
                .header("Authorization", "KakaoAK " + kakaoApiKey)
                .retrieve() // 응답을 받아옴
                .bodyToMono(KakaoApiResponseDto.class); // 응답 본문을 KakaoApiRersponseDto로 변한

        // 동기적으로 결과를 받아옴 (실제 서비스에서는 비동기 처리를 고려하는 것이 좋음)
        KakaoApiResponseDto responseDto = responseMono.block();

        log.info("Kakao API response: {} stores found.", responseDto.getDocuments().size());

        return responseDto;
    }
}
