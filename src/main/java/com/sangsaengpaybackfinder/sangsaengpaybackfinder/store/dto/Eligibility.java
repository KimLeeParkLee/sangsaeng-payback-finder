package com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Eligibility {
    private Status status;

    private String reason;

    private double confidence;
}
