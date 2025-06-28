package com.servitask.servitask;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.servitask"})
@EnableJpaRepositories(basePackages = {"com.servitask"})
@ComponentScan(basePackages = {"com.servitask"})
public class ServitaskApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServitaskApplication.class, args);
	}

}
