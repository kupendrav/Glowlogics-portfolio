package com.glowlogics.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.glowlogics.portfolio.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByOrderByCreatedAtDesc();

    List<Project> findByCategoryIgnoreCaseOrderByCreatedAtDesc(String category);
}
