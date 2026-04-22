(() => {
    const state = {
        projects: [],
        selectedProjectCategory: "all",
        selectedBlogTag: "",
        blogSearch: "",
        blogTags: []
    };

    const el = {
        skillsGrid: document.getElementById("skills-grid"),
        projectFilters: document.getElementById("project-filters"),
        projectsGrid: document.getElementById("projects-grid"),
        blogsGrid: document.getElementById("blogs-grid"),
        blogTagFilters: document.getElementById("blog-tag-filters"),
        blogSearch: document.getElementById("blog-search"),
        contactForm: document.getElementById("contact-form"),
        feedback: document.getElementById("form-feedback"),
        contactSubmit: document.getElementById("contact-submit")
    };

    const escapeHtml = (value) => String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    const setFeedback = (message, type = "") => {
        if (!el.feedback) {
            return;
        }
        el.feedback.textContent = message;
        el.feedback.className = `form-feedback ${type}`.trim();
    };

    const renderSkills = async () => {
        if (!el.skillsGrid) {
            return;
        }

        try {
            const skills = await window.PortfolioAPI.getSkills();
            el.skillsGrid.innerHTML = skills.map((skill) => `
                <article class="skill-card reveal">
                    <div class="skill-head">
                        <h4>${escapeHtml(skill.name)}</h4>
                        <span>${escapeHtml(skill.category)}</span>
                    </div>
                    <div class="skill-bar">
                        <i data-level="${Math.max(0, Math.min(100, Number(skill.level)))}"></i>
                    </div>
                </article>
            `).join("");

            requestAnimationFrame(() => {
                el.skillsGrid.querySelectorAll(".skill-bar > i").forEach((bar) => {
                    const level = bar.getAttribute("data-level") || "0";
                    bar.style.width = `${level}%`;
                });
            });

            window.PortfolioUI.setupReveal();
        } catch (error) {
            el.skillsGrid.innerHTML = "<p>Unable to load skills right now.</p>";
        }
    };

    const renderProjectFilters = () => {
        if (!el.projectFilters) {
            return;
        }

        const categories = ["all", ...new Set(state.projects.map((item) => item.category))];
        el.projectFilters.innerHTML = categories.map((category) => `
            <button class="filter-chip ${state.selectedProjectCategory === category ? "active" : ""}" 
                    data-category="${escapeHtml(category)}">
                ${escapeHtml(category)}
            </button>
        `).join("");

        el.projectFilters.querySelectorAll(".filter-chip").forEach((button) => {
            button.addEventListener("click", () => {
                state.selectedProjectCategory = button.dataset.category;
                renderProjectFilters();
                renderProjects();
            });
        });
    };

    const renderProjects = () => {
        if (!el.projectsGrid) {
            return;
        }

        const visible = state.selectedProjectCategory === "all"
            ? state.projects
            : state.projects.filter((project) => project.category === state.selectedProjectCategory);

        if (!visible.length) {
            el.projectsGrid.innerHTML = "<p>No projects found for this category.</p>";
            return;
        }

        el.projectsGrid.innerHTML = visible.map((project) => `
            <article class="project-card tilt-card reveal">
                <div class="card-thumb">
                    <img src="${escapeHtml(project.imageUrl || "/assets/images/project-placeholder.svg")}" 
                         alt="${escapeHtml(project.title)} preview" loading="lazy" width="640" height="400">
                </div>
                <div class="card-body">
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description)}</p>
                    <div class="tech-tags">
                        ${(project.techStack || []).map((tech) => `<span>${escapeHtml(tech)}</span>`).join("")}
                    </div>
                    <div class="card-links">
                        ${project.liveDemoUrl ? `<a href="${escapeHtml(project.liveDemoUrl)}" target="_blank" rel="noopener">Live Demo</a>` : ""}
                        ${project.githubUrl ? `<a href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noopener">GitHub</a>` : ""}
                    </div>
                </div>
            </article>
        `).join("");

        window.PortfolioUI.setupTiltCards(".project-card");
        window.PortfolioUI.setupReveal();
    };

    const loadProjects = async () => {
        if (!el.projectsGrid) {
            return;
        }

        try {
            state.projects = await window.PortfolioAPI.getProjects("all");
            renderProjectFilters();
            renderProjects();
        } catch (error) {
            el.projectsGrid.innerHTML = "<p>Unable to load projects at the moment.</p>";
        }
    };

    const renderBlogTagFilters = () => {
        if (!el.blogTagFilters) {
            return;
        }

        const tags = ["", ...state.blogTags];
        el.blogTagFilters.innerHTML = tags.map((tag) => `
            <button class="filter-chip ${state.selectedBlogTag === tag ? "active" : ""}" data-tag="${escapeHtml(tag)}">
                ${tag ? escapeHtml(tag) : "All"}
            </button>
        `).join("");

        el.blogTagFilters.querySelectorAll(".filter-chip").forEach((button) => {
            button.addEventListener("click", () => {
                state.selectedBlogTag = button.dataset.tag;
                renderBlogTagFilters();
                loadBlogs();
            });
        });
    };

    const renderBlogs = (blogs) => {
        if (!el.blogsGrid) {
            return;
        }

        if (!blogs.length) {
            el.blogsGrid.innerHTML = "<p>No matching blog posts found.</p>";
            return;
        }

        el.blogsGrid.innerHTML = blogs.map((post) => `
            <article class="blog-card reveal">
                <div class="card-thumb">
                    <img src="${escapeHtml(post.coverImageUrl || "/assets/images/blog-placeholder.svg")}" 
                         alt="${escapeHtml(post.title)}" loading="lazy" width="640" height="400">
                </div>
                <div class="card-body">
                    <h3>${escapeHtml(post.title)}</h3>
                    <p>${escapeHtml(post.summary)}</p>
                    <div class="blog-tags">
                        ${(post.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
                    </div>
                    <div class="card-links">
                        <a href="/blog.html?id=${post.id}">Read article</a>
                        <span>${formatDate(post.createdAt)}</span>
                    </div>
                </div>
            </article>
        `).join("");

        window.PortfolioUI.setupReveal();
    };

    const loadBlogs = async () => {
        if (!el.blogsGrid) {
            return;
        }

        try {
            const blogs = await window.PortfolioAPI.getBlogs({
                query: state.blogSearch,
                tag: state.selectedBlogTag
            });
            renderBlogs(blogs);
        } catch (error) {
            el.blogsGrid.innerHTML = "<p>Unable to load blog posts right now.</p>";
        }
    };

    const initBlogFilters = async () => {
        if (!el.blogTagFilters) {
            return;
        }

        try {
            const initialBlogs = await window.PortfolioAPI.getBlogs({});
            state.blogTags = [...new Set(initialBlogs.flatMap((post) => post.tags || []))];
            renderBlogTagFilters();
            renderBlogs(initialBlogs);
        } catch (error) {
            el.blogsGrid.innerHTML = "<p>Unable to load blog posts right now.</p>";
        }

        if (el.blogSearch) {
            let timeoutId = 0;
            el.blogSearch.addEventListener("input", () => {
                window.clearTimeout(timeoutId);
                timeoutId = window.setTimeout(() => {
                    state.blogSearch = el.blogSearch.value.trim();
                    loadBlogs();
                }, 250);
            });
        }
    };

    const initContactForm = () => {
        if (!el.contactForm) {
            return;
        }

        el.contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            setFeedback("");

            const payload = {
                name: document.getElementById("name")?.value.trim() || "",
                email: document.getElementById("email")?.value.trim() || "",
                message: document.getElementById("message")?.value.trim() || ""
            };

            if (payload.name.length < 2) {
                setFeedback("Please enter a valid name.", "error");
                return;
            }
            if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
                setFeedback("Please enter a valid email address.", "error");
                return;
            }
            if (payload.message.length < 10) {
                setFeedback("Message should be at least 10 characters.", "error");
                return;
            }

            try {
                if (el.contactSubmit) {
                    el.contactSubmit.disabled = true;
                }
                const response = await window.PortfolioAPI.submitContact(payload);
                setFeedback(response.message || "Message sent successfully.", "success");
                el.contactForm.reset();
            } catch (error) {
                const message = error.payload?.message || "Failed to send message. Please try again.";
                setFeedback(message, "error");
            } finally {
                if (el.contactSubmit) {
                    el.contactSubmit.disabled = false;
                }
            }
        });
    };

    const init = async () => {
        if (window.ThemeManager) {
            window.ThemeManager.initTheme();
        }

        if (window.PortfolioUI) {
            window.PortfolioUI.hideLoader();
            window.PortfolioUI.setupHeaderBehavior();
            window.PortfolioUI.setupMobileMenu();
            window.PortfolioUI.setupReveal();
            window.PortfolioUI.setupActiveNav();
            window.PortfolioUI.initParticles();
            window.PortfolioUI.initCursor();
            window.PortfolioUI.startTypewriter("#typewriter", [
                "Spring Boot precision",
                "pixel-perfect interfaces",
                "scalable API architecture"
            ]);
        }

        const yearElement = document.getElementById("year");
        if (yearElement) {
            yearElement.textContent = String(new Date().getFullYear());
        }

        await Promise.all([
            renderSkills(),
            loadProjects(),
            initBlogFilters()
        ]);

        initContactForm();
    };

    document.addEventListener("DOMContentLoaded", init);
})();
