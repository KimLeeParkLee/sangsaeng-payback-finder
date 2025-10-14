package com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Status {
    ELIGIBLE("인정"),
    INELIGIBLE("불인정"),
    UNCERTAIN("불확실");

    private final String description;
}
