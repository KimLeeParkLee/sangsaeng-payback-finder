package com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty; // 💡 import 추가!
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DocumentDto {
    @JsonProperty("place_name")
    private String placeName;

    @JsonProperty("distance")
    private String distance;

    @JsonProperty("place_url")
    private String placeUrl;

    @JsonProperty("category_name")
    private String categoryName;

    @JsonProperty("address_name")
    private String addressName;

    @JsonProperty("road_address_name")
    private String roadAddressName;

    @JsonProperty("id")
    private String storeId;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("y")
    private String latitude;

    @JsonProperty("x")
    private String longitude;
}