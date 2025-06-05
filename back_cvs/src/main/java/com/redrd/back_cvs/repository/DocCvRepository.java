package com.redrd.back_cvs.repository;

import com.redrd.back_cvs.model.DocumentoCv;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DocCvRepository extends JpaRepository<DocumentoCv, UUID> {
}
