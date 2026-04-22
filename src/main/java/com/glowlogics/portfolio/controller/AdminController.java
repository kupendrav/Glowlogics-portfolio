package com.glowlogics.portfolio.controller;

import com.glowlogics.portfolio.dto.BlogDetailResponse;
import com.glowlogics.portfolio.dto.ProjectResponse;
import com.glowlogics.portfolio.service.BlogService;
import com.glowlogics.portfolio.service.ProjectService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProjectService projectService;
    private final BlogService blogService;

    public AdminController(ProjectService projectService, BlogService blogService) {
        this.projectService = projectService;
        this.blogService = blogService;
    }

    @GetMapping("/projects")
    public List<ProjectResponse> getProjectsForAdmin() {
        return projectService.getProjects("all");
    }

    @GetMapping("/blogs")
    public List<BlogDetailResponse> getBlogsForAdmin(@RequestParam(required = false) String query,
                                                     @RequestParam(required = false) String tag) {
        return blogService.getAllBlogsForAdmin(query, tag);
    }

    @GetMapping("/blogs/{id}")
    public BlogDetailResponse getBlogByIdForAdmin(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return blogService.getBlogForAdmin(id);
    }
}
