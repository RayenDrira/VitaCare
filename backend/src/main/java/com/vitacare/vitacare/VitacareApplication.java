package com.vitacare.vitacare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class VitacareApplication {

	public static void main(String[] args) {
		SpringApplication.run(VitacareApplication.class, args);
	}

}
