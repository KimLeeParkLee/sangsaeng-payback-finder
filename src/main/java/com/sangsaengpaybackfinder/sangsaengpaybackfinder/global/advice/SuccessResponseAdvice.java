package com.sangsaengpaybackfinder.sangsaengpaybackfinder.global.advice;

import com.sangsaengpaybackfinder.sangsaengpaybackfinder.global.response.SuccessResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice(basePackages = "com.sangsaengpaybackfinder.sangsaengpaybackfinder")
public class SuccessResponseAdvice implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        if (returnType.getParameterType().isAssignableFrom(SuccessResponse.class)) {
            return false;
        }

        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        if (body == null) {
            return SuccessResponse.success();
        }

        return SuccessResponse.success(body);
    }
}
