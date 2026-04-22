package com.glowlogics.portfolio.service;

import com.glowlogics.portfolio.dto.ProjectRequest;
import com.glowlogics.portfolio.dto.ProjectResponse;
import com.glowlogics.portfolio.exception.ResourceNotFoundException;
import com.glowlogics.portfolio.model.Project;
import com.glowlogics.portfolio.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects(String category) {
        List<Project> projects;
        if (category == null || category.isBlank() || "all".equalsIgnoreCase(category)) {
            projects = projectRepository.findAllByOrderByCreatedAtDesc();
        } else {
            projects = projectRepository.findByCategoryIgnoreCaseOrderByCreatedAtDesc(category.trim());
        }
        return projects.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        return toResponse(findProject(id));
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        Project project = new Project();
        applyRequest(project, request);
        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = findProject(id);
        applyRequest(project, request);
        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = findProject(id);
        projectRepository.delete(project);
    }

    private Project findProject(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id));
    }

    private void applyRequest(Project project, ProjectRequest request) {
        project.setTitle(request.title().trim());
        project.setDescription(request.description().trim());
        project.setImageUrl(normalizeOptional(request.imageUrl()));
        project.setLiveDemoUrl(normalizeOptional(request.liveDemoUrl()));
        project.setGithubUrl(normalizeOptional(request.githubUrl()));
        project.setCategory(request.category().trim());
        project.setTechStack(normalizeValues(request.techStack()));
        project.setFeatured(request.featured());
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

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getImageUrl(),
                project.getLiveDemoUrl(),
                project.getGithubUrl(),
                project.getCategory(),
                List.copyOf(project.getTechStack()),
                project.isFeatured(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}
