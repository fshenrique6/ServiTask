package com.servitask.servitask.exception;

import org.springframework.http.HttpStatus;

public class UserException extends RuntimeException {
    
    private final HttpStatus httpStatus;
    
    public UserException(String message) {
        super(message);
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }
    
    public UserException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
    
    public UserException(String message, Throwable cause) {
        super(message, cause);
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }
    
    public UserException(String message, Throwable cause, HttpStatus httpStatus) {
        super(message, cause);
        this.httpStatus = httpStatus;
    }
    
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
} 