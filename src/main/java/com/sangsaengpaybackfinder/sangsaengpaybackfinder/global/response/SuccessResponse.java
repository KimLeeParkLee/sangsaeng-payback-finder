package com.sangsaengpaybackfinder.sangsaengpaybackfinder.global.response;

import lombok.Getter;

@Getter
public class SuccessResponse<T> {
    private final boolean success = true;
    private final T data;

    public SuccessResponse(T data) {
        this.data = data;
    }
}
