package com.sangsaengpaybackfinder.sangsaengpaybackfinder.global.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ErrorResponse {
    private final boolean success = false;
    private final ErrorData error;

    @Getter
    @RequiredArgsConstructor
    public static class ErrorData {
        private final String code;
        private final String message;
    }
}
