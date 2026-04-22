package com.glowlogics.portfolio.service;

import com.glowlogics.portfolio.model.BlogPost;
import com.glowlogics.portfolio.model.Project;
import com.glowlogics.portfolio.model.Skill;
import com.glowlogics.portfolio.repository.BlogPostRepository;
import com.glowlogics.portfolio.repository.ProjectRepository;
import com.glowlogics.portfolio.repository.SkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SampleDataInitializer implements CommandLineRunner {

        private static final List<String> LEGACY_PROJECT_TITLES = List.of(
                        "Lumina Commerce",
                        "Pulse Analytics",
                        "Nebula Notes",
                        "Orbit LMS",
                        "Atlas Hiring Suite"
        );

    private final ProjectRepository projectRepository;
    private final BlogPostRepository blogPostRepository;
    private final SkillRepository skillRepository;

    public SampleDataInitializer(ProjectRepository projectRepository,
                                 BlogPostRepository blogPostRepository,
                                 SkillRepository skillRepository) {
        this.projectRepository = projectRepository;
        this.blogPostRepository = blogPostRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    public void run(String... args) {
        seedSkills();
        seedProjects();
        seedBlogs();
    }

    private void seedSkills() {
        if (skillRepository.count() > 0) {
            return;
        }

        skillRepository.saveAll(List.of(
                skill("Java", "Backend", 95, 1),
                skill("Spring Boot", "Backend", 92, 2),
                skill("PostgreSQL", "Backend", 88, 3),
                skill("REST API Design", "Backend", 90, 4),
                skill("HTML5", "Frontend", 96, 5),
                skill("CSS3", "Frontend", 94, 6),
                skill("JavaScript", "Frontend", 91, 7),
                skill("UI Motion", "Frontend", 86, 8),
                skill("Docker", "DevOps", 80, 9),
                skill("GitHub Actions", "DevOps", 78, 10)
        ));
    }

    private Skill skill(String name, String category, int level, int sortOrder) {
        Skill skill = new Skill();
        skill.setName(name);
        skill.setCategory(category);
        skill.setLevel(level);
        skill.setSortOrder(sortOrder);
        return skill;
    }

    private void seedProjects() {
        if (projectRepository.count() > 0) {
            boolean hasLegacyProjects = projectRepository.findAll().stream()
                    .map(Project::getTitle)
                    .anyMatch(LEGACY_PROJECT_TITLES::contains);

            if (!hasLegacyProjects) {
                return;
            }

            projectRepository.deleteAll();
        }

        projectRepository.saveAll(List.of(
                project(
                        "365-smiles",
                        "Habit tracker that keeps streaks, reminders, and progress insights simple and motivating.",
                        "/assets/images/project-lumina.svg",
                        "https://365-smiles.vercel.app/",
                        "https://github.com/kupendrav/365-smiles",
                        "Full Stack",
                        List.of("TypeScript", "React", "Node.js", "Productivity"),
                        true
                ),
                project(
                        "studX",
                        "Student productivity and operations platform for tracking academics, tasks, and milestones.",
                        "/assets/images/project-pulse.svg",
                        "https://stud-x.vercel.app/",
                        "https://github.com/kupendrav/studX",
                        "Full Stack",
                        List.of("TypeScript", "React", "Operations", "Dashboard"),
                        true
                ),
                project(
                        "pro-pdfs",
                        "PDF utility suite for converting, compressing, and managing documents with a clean UX.",
                        "/assets/images/project-nebula.svg",
                        "https://propdfs.netlify.app/",
                        "https://github.com/kupendrav/pro-pdfs",
                        "Full Stack",
                        List.of("TypeScript", "React", "PDF", "SaaS"),
                        true
                ),
                project(
                        "job-seekz",
                        "Hackathon-built job discovery app with personalized opportunities and polished UI flows.",
                        "/assets/images/project-orbit.svg",
                        "https://tjohn-hackathon.vercel.app/",
                        "https://github.com/kupendrav/tjohn-hackathon",
                        "Full Stack",
                        List.of("TypeScript", "React", "Hackathon", "Careers"),
                        true
                ),
                project(
                        "food-lovers",
                        "Interactive food-focused frontend app with curated sections, media-rich UI, and responsive layout.",
                        "/assets/images/project-atlas.svg",
                        "https://kupendrav.github.io/my_web_page_miniproject/",
                        "https://github.com/kupendrav/my_web_page_miniproject",
                        "Frontend",
                        List.of("HTML", "CSS", "JavaScript", "Responsive UI"),
                        true
                ),
                project(
                        "ProfileGuard-AI",
                        "AI-assisted profile evaluation workflow for faster and more consistent account risk checks.",
                        "/assets/images/project-lumina.svg",
                        "https://kupendrav.github.io/ProfileGuard-AI/",
                        "https://github.com/kupendrav/ProfileGuard-AI",
                        "AI / ML",
                        List.of("TypeScript", "AI", "Automation", "Risk Analysis"),
                        true
                ),
                project(
                        "natasha-ai",
                        "AI-powered assistant interface focused on smooth interactions and practical task support.",
                        "/assets/images/project-pulse.svg",
                        "https://kupendrav.github.io/natasha-ai-copy/",
                        "https://github.com/kupendrav/natasha-ai-copy",
                        "AI / ML",
                        List.of("TypeScript", "React", "Assistant", "UX"),
                        true
                ),
                project(
                        "AI-image-enhancer",
                        "Image enhancement app that improves visual clarity using AI-driven processing steps.",
                        "/assets/images/project-nebula.svg",
                        "https://ai-image-enhancer-gamma.vercel.app/",
                        "https://github.com/kupendrav/AI-image-enhancer",
                        "AI / ML",
                        List.of("JavaScript", "AI", "Image Processing", "Frontend"),
                        true
                ),
                project(
                        "code-reviewer-pro",
                        "AI-assisted code review experience for quick issue discovery and developer feedback loops.",
                        "/assets/images/project-orbit.svg",
                        "https://codepro-mu.vercel.app/",
                        "https://github.com/kupendrav/code-reviewer-pro",
                        "AI / ML",
                        List.of("TypeScript", "AI", "Code Quality", "Developer Tools"),
                        false
                ),
                project(
                        "cryptX",
                        "Web3 app with crypto-focused workflows, wallet interactions, and engaging frontend experiences.",
                        "/assets/images/project-atlas.svg",
                        "https://cryptgame.netlify.app/",
                        "https://github.com/kupendrav/cryptX",
                        "Web3",
                        List.of("TypeScript", "Blockchain", "Web3", "Frontend"),
                        false
                ),
                project(
                        "HealthChain",
                        "Blockchain concept project exploring trusted health records and transparent data access.",
                        "/assets/images/project-lumina.svg",
                        "https://kupendrav.github.io/HealthChain/",
                        "https://github.com/kupendrav/HealthChain",
                        "Web3",
                        List.of("TypeScript", "React", "Blockchain", "Healthcare"),
                        false
                ),
                project(
                        "SecureAudit",
                        "Security automation toolkit for identifying and reporting weak spots in development workflows.",
                        "/assets/images/project-pulse.svg",
                        null,
                        "https://github.com/kupendrav/SecureAudit",
                        "Cybersecurity",
                        List.of("TypeScript", "Security", "Automation", "Auditing"),
                        false
                )
        ));
    }

    private Project project(String title,
                            String description,
                            String imageUrl,
                            String liveDemoUrl,
                            String githubUrl,
                            String category,
                            List<String> techStack,
                            boolean featured) {
        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        project.setImageUrl(imageUrl);
        project.setLiveDemoUrl(liveDemoUrl);
        project.setGithubUrl(githubUrl);
        project.setCategory(category);
        project.setTechStack(techStack);
        project.setFeatured(featured);
        return project;
    }

    private void seedBlogs() {
        if (blogPostRepository.count() > 0) {
            return;
        }

        blogPostRepository.saveAll(List.of(
                blog(
                        "Designing a Portfolio API That Scales",
                        "How to model content-rich portfolio data with clean boundaries between public and admin use cases.",
                        """
                        # Designing a Portfolio API That Scales

                        A portfolio site looks simple, but it has two very different concerns:

                        - Public read-heavy endpoints
                        - Admin write-heavy endpoints

                        ## Core Strategy

                        1. Keep public and admin concerns explicit.
                        2. Use DTO boundaries instead of exposing entities.
                        3. Validate aggressively at the API edge.

                        ## Result

                        Your API remains maintainable as content volume and team size grow.
                        """,
                        "/assets/images/blog-api.svg",
                        List.of("Spring Boot", "API Design", "Architecture"),
                        true
                ),
                blog(
                        "Animation Principles for Developer Portfolios",
                        "Practical motion guidelines that make interfaces feel premium without hurting performance.",
                        """
                        # Animation Principles for Developer Portfolios

                        Motion should guide attention, not distract.

                        ## Use Motion With Purpose

                        - Reveal content in sequence
                        - Emphasize interaction feedback
                        - Build continuity between sections

                        ## Keep It Efficient

                        Prefer opacity and transform animations for smoother rendering.
                        """,
                        "/assets/images/blog-animation.svg",
                        List.of("UI/UX", "CSS", "Performance"),
                        true
                ),
                blog(
                        "From CRUD to Craft: Building Better Admin Panels",
                        "A practical blueprint for creating internal tools that are fast, safe, and easy to maintain.",
                        """
                        # From CRUD to Craft

                        Internal tools deserve good UX too.

                        ## Key Improvements

                        - Keyboard-friendly forms
                        - Clear success and error states
                        - Lightweight filtering and search

                        Small improvements compound into huge productivity gains.
                        """,
                        "/assets/images/blog-admin.svg",
                        List.of("Productivity", "Admin", "DX"),
                        true
                ),
                blog(
                        "Roadmap: Server-Side Rendering for Blogs",
                        "Upcoming improvements for richer SEO and content previews.",
                        """
                        # Draft: Server-Side Rendering for Blogs

                        This draft captures implementation notes for a future SSR enhancement.
                        """,
                        "/assets/images/blog-roadmap.svg",
                        List.of("Roadmap", "SEO", "Thymeleaf"),
                        false
                )
        ));
    }

    private BlogPost blog(String title,
                          String summary,
                          String content,
                          String coverImageUrl,
                          List<String> tags,
                          boolean published) {
        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(title);
        blogPost.setSummary(summary);
        blogPost.setContentMarkdown(content);
        blogPost.setCoverImageUrl(coverImageUrl);
        blogPost.setTags(tags);
        blogPost.setPublished(published);
        return blogPost;
    }
}
