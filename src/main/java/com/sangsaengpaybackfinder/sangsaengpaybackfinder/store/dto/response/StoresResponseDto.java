package com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.Eligibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoresResponseDto {
    @Builder.Default
    private List<StoreResponseDto> stores = new ArrayList<>();

    @Builder
    @Getter
    public static class StoreResponseDto {
        private String placeName;

        private String distance;

        private String placeUrl;

        private String categoryName;

        private String addressName;

        private String roadAddressName;

        private String storeId;

        private String phone;

        private Location location;

        private Eligibility eligibility;

        @Getter
        @AllArgsConstructor
        public static class Location {
            private String lat;
            private String lng;
        }
    }
}
