package com.servitask.servitask;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.servitask.servitask.entity", "com.servitask.model"})
@EnableJpaRepositories(basePackages = {"com.servitask.servitask.repository", "com.servitask.repository"})
@ComponentScan(basePackages = {"com.servitask.servitask", "com.servitask.controller", "com.servitask.service"})
public class ServitaskApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServitaskApplication.class, args);
	}

}
