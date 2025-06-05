package com.redrd.back_cvs.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CiviIaConfig {

    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }
}
