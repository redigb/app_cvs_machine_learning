package com.redrd.back_cvs.Dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentoCvDto {
    private UUID id;
    private String nombreOriginal;
    private String urlPublica;
}
