package com.redrd.back_cvs.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {
    private String message;
    private Object data;
}
