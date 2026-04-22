package com.glowlogics.portfolio.controller;

import com.glowlogics.portfolio.dto.BlogDetailResponse;
import com.glowlogics.portfolio.dto.BlogRequest;
import com.glowlogics.portfolio.dto.BlogSummaryResponse;
import com.glowlogics.portfolio.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public List<BlogSummaryResponse> getPublicBlogs(@RequestParam(required = false) String query,
                                                    @RequestParam(required = false) String tag) {
        return blogService.getPublicBlogs(query, tag);
    }

    @GetMapping("/{id}")
    public BlogDetailResponse getPublicBlogById(@PathVariable Long id) {
        return blogService.getPublicBlogById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BlogDetailResponse createBlog(@Valid @RequestBody BlogRequest request) {
        return blogService.createBlog(request);
    }

    @PutMapping("/{id}")
    public BlogDetailResponse updateBlog(@PathVariable Long id, @Valid @RequestBody BlogRequest request) {
        return blogService.updateBlog(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
    }
}
