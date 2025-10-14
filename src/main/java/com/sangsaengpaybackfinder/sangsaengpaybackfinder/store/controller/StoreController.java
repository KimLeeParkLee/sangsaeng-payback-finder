package com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.controller;

import com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.dto.response.StoresResponseDto;
import com.sangsaengpaybackfinder.sangsaengpaybackfinder.store.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stores")
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;

    @GetMapping("/nearby")
    public StoresResponseDto getStores(@RequestParam String lat, @RequestParam String lng, @RequestParam String sortBy) {
        return storeService.getStores(lat, lng, sortBy);
    }
}
