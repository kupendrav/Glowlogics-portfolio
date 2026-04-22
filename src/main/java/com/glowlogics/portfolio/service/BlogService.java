package com.glowlogics.portfolio.service;

import com.glowlogics.portfolio.dto.BlogDetailResponse;
import com.glowlogics.portfolio.dto.BlogRequest;
import com.glowlogics.portfolio.dto.BlogSummaryResponse;
import com.glowlogics.portfolio.exception.ResourceNotFoundException;
import com.glowlogics.portfolio.model.BlogPost;
import com.glowlogics.portfolio.repository.BlogPostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Locale;

@Service
public class BlogService {

    private final BlogPostRepository blogPostRepository;

    public BlogService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    @Transactional(readOnly = true)
    public List<BlogSummaryResponse> getPublicBlogs(String query, String tag) {
        return filterBlogs(blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc(), query, tag)
                .stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public BlogDetailResponse getPublicBlogById(Long id) {
        BlogPost post = blogPostRepository.findByIdAndPublishedTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id " + id));
        return toDetail(post);
    }

    @Transactional(readOnly = true)
    public List<BlogDetailResponse> getAllBlogsForAdmin(String query, String tag) {
        return filterBlogs(blogPostRepository.findAllByOrderByCreatedAtDesc(), query, tag)
                .stream()
                .map(this::toDetail)
                .toList();
    }

    @Transactional
    public BlogDetailResponse createBlog(BlogRequest request) {
        BlogPost blogPost = new BlogPost();
        applyRequest(blogPost, request);
        return toDetail(blogPostRepository.save(blogPost));
    }

    @Transactional
    public BlogDetailResponse updateBlog(Long id, BlogRequest request) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id " + id));
        applyRequest(blogPost, request);
        return toDetail(blogPostRepository.save(blogPost));
    }

    @Transactional
    public void deleteBlog(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id " + id));
        blogPostRepository.delete(blogPost);
    }

    @Transactional(readOnly = true)
    public BlogDetailResponse getBlogForAdmin(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id " + id));
        return toDetail(post);
    }

    private List<BlogPost> filterBlogs(List<BlogPost> posts, String query, String tag) {
        String normalizedQuery = normalize(query);
        String normalizedTag = normalize(tag);
        return posts.stream()
                .filter(post -> matchesQuery(post, normalizedQuery))
                .filter(post -> matchesTag(post, normalizedTag))
                .toList();
    }

    private boolean matchesQuery(BlogPost post, String normalizedQuery) {
        if (normalizedQuery == null) {
            return true;
        }
        return post.getTitle().toLowerCase(Locale.ROOT).contains(normalizedQuery)
                || post.getSummary().toLowerCase(Locale.ROOT).contains(normalizedQuery)
                || post.getContentMarkdown().toLowerCase(Locale.ROOT).contains(normalizedQuery);
    }

    private boolean matchesTag(BlogPost post, String normalizedTag) {
        if (normalizedTag == null) {
            return true;
        }
        return post.getTags().stream().anyMatch(tag -> tag.equalsIgnoreCase(normalizedTag));
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim().toLowerCase(Locale.ROOT);
    }

    private void applyRequest(BlogPost blogPost, BlogRequest request) {
        blogPost.setTitle(request.title().trim());
        blogPost.setSummary(request.summary().trim());
        blogPost.setContentMarkdown(request.contentMarkdown().trim());
        blogPost.setCoverImageUrl(normalizeOptional(request.coverImageUrl()));
        blogPost.setTags(normalizeValues(request.tags()));
        blogPost.setPublished(request.published());
    }

    private List<String> normalizeValues(List<String> values) {
        if (values == null) {
            return Collections.emptyList();
        }
        return values.stream()
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .distinct()
                .toList();
    }

    private String normalizeOptional(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private BlogSummaryResponse toSummary(BlogPost post) {
        return new BlogSummaryResponse(
                post.getId(),
                post.getTitle(),
                post.getSummary(),
                post.getCoverImageUrl(),
                List.copyOf(post.getTags()),
                post.getCreatedAt()
        );
    }

    private BlogDetailResponse toDetail(BlogPost post) {
        return new BlogDetailResponse(
                post.getId(),
                post.getTitle(),
                post.getSummary(),
                post.getContentMarkdown(),
                post.getCoverImageUrl(),
                List.copyOf(post.getTags()),
                post.isPublished(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
