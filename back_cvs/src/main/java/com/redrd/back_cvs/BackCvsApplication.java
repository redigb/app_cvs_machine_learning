package com.redrd.back_cvs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BackCvsApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackCvsApplication.class, args);
	}
}
