package com.sangsaengpaybackfinder.sangsaengpaybackfinder.global.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;

@Getter
@JsonPropertyOrder({ "success", "data" })
public class SuccessResponse<T> {
    private final boolean success = true;
    private final T data;

    private SuccessResponse(T data) {
        this.data = data;
    }

    public static <T> SuccessResponse<T> success(T data) {
        return new SuccessResponse<>(data);
    }

    public static <T> SuccessResponse<T> success() {
        return new SuccessResponse<>(null);
    }
}
