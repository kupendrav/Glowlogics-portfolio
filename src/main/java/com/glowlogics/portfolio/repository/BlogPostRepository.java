package com.glowlogics.portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.glowlogics.portfolio.model.BlogPost;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    List<BlogPost> findAllByOrderByCreatedAtDesc();

    List<BlogPost> findByPublishedTrueOrderByCreatedAtDesc();

    Optional<BlogPost> findByIdAndPublishedTrue(Long id);
}
