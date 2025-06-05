package com.redrd.back_cvs.exceptions;

public class AlreadyExistException extends RuntimeException {
    public AlreadyExistException(String messages) {
        super(messages);
    }
}
