package com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.service;

import com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.Eligibility;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

import static com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.Status.ELIGIBLE;
import static com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.Status.INELIGIBLE;

@Service
public class EligibilityService {
    // 실제로는 DB나 설정 파일에서 관리하는 것이 좋습니다.
    private static final List<String> BLACKLIST_KEYWORDS = Arrays.asList(
            "스타벅스", "올리브영", "롯데리아", "이마트24", "GS25", "CU", "유니클로"
    );

    private static final List<String> WHITELIST_KEYWORDS = Arrays.asList(
            "본죽", "이디야", "메가커피", "빽다방", "맘스터치", "파리바게뜨", "다이소"
    );

    private static final List<String> INELIGIBLE_CATEGORIES = Arrays.asList(
            "대형마트", "백화점", "쇼핑센터", "골프", "유흥주점"
    );

    public Eligibility check(String placeName, String categoryName) {
        // 1단계: 블랙리스트 키워드 확인
        if (containsKeyword(placeName, BLACKLIST_KEYWORDS)) {
            return Eligibility.builder()
                    .status(INELIGIBLE)
                    .reason("대기업 직영점 또는 정책상 제외 업종입니다.")
                    .confidence(1.0)
                    .build();
        }

        // 2단계: 화이트리스트 키워드 확인
        if (containsKeyword(placeName, WHITELIST_KEYWORDS)) {
            return Eligibility.builder()
                    .status(ELIGIBLE)
                    .reason("소상공인 운영 가맹점일 확률이 높습니다.")
                    .confidence(0.95)
                    .build();
        }

        // 3단계: 불인정 카테고리 확인
        if (containsKeyword(categoryName, INELIGIBLE_CATEGORIES)) {
            return Eligibility.builder()
                    .status(INELIGIBLE)
                    .reason("소비액 불인정 업종입니다.")
                    .confidence(0.9)
                    .build();
        }

        // 4단계: 위 모든 조건에 해당하지 않으면 일단 '적격'으로 판단
        return Eligibility.builder()
                .status(ELIGIBLE)
                .reason("소상공인이 운영하는 매장으로 추정됩니다.")
                .confidence(0.7)
                .build();
    }

    private boolean containsKeyword(String text, List<String> keywords) {
        if (text == null || text.isEmpty()) {
            return false;
        }
        // text안에 keywords 리스트의 단어가 하나라도 포함되어 있는지 확인
        return keywords.stream().anyMatch(text::contains);
    }
}
