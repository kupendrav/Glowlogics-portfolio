(() => {
    const state = {
        projects: [],
        blogs: []
    };

    const projectForm = document.getElementById("project-form");
    const projectFeedback = document.getElementById("project-feedback");
    const projectTableBody = document.querySelector("#project-table tbody");

    const blogForm = document.getElementById("blog-form");
    const blogFeedback = document.getElementById("blog-feedback");
    const blogTableBody = document.querySelector("#blog-table tbody");

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

    const parseList = (value) => value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const setFeedback = (element, message, type = "") => {
        if (!element) {
            return;
        }
        element.textContent = message;
        element.className = `form-feedback ${type}`.trim();
    };

    const extractError = (error) => {
        if (error.status === 401 || error.status === 403) {
            window.location.href = "/admin/login";
            return "Session expired. Please login again.";
        }

        if (error.payload?.fieldErrors) {
            return Object.values(error.payload.fieldErrors).join(" ");
        }
        return error.payload?.message || error.message || "Something went wrong";
    };

    const loadProjects = async () => {
        state.projects = await window.PortfolioAPI.getAdminProjects();
        renderProjectTable();
    };

    const renderProjectTable = () => {
        if (!projectTableBody) {
            return;
        }

        if (!state.projects.length) {
            projectTableBody.innerHTML = "<tr><td colspan='4'>No projects available.</td></tr>";
            return;
        }

        projectTableBody.innerHTML = state.projects.map((project) => `
            <tr>
                <td>${escapeHtml(project.title)}</td>
                <td>${escapeHtml(project.category)}</td>
                <td>${project.featured ? "Yes" : "No"}</td>
                <td>
                    <button class="mini-btn" data-action="edit-project" data-id="${project.id}">Edit</button>
                    <button class="mini-btn" data-action="delete-project" data-id="${project.id}">Delete</button>
                </td>
            </tr>
        `).join("");
    };

    const resetProjectForm = () => {
        projectForm?.reset();
        const projectId = document.getElementById("project-id");
        if (projectId) {
            projectId.value = "";
        }
        setFeedback(projectFeedback, "");
    };

    const fillProjectForm = (project) => {
        document.getElementById("project-id").value = project.id;
        document.getElementById("project-title").value = project.title;
        document.getElementById("project-category").value = project.category;
        document.getElementById("project-image").value = project.imageUrl || "";
        document.getElementById("project-live").value = project.liveDemoUrl || "";
        document.getElementById("project-github").value = project.githubUrl || "";
        document.getElementById("project-stack").value = (project.techStack || []).join(", ");
        document.getElementById("project-description").value = project.description;
        document.getElementById("project-featured").checked = Boolean(project.featured);
    };

    const onProjectSubmit = async (event) => {
        event.preventDefault();

        const id = document.getElementById("project-id").value;
        const payload = {
            title: document.getElementById("project-title").value.trim(),
            description: document.getElementById("project-description").value.trim(),
            imageUrl: document.getElementById("project-image").value.trim(),
            liveDemoUrl: document.getElementById("project-live").value.trim(),
            githubUrl: document.getElementById("project-github").value.trim(),
            category: document.getElementById("project-category").value.trim(),
            techStack: parseList(document.getElementById("project-stack").value),
            featured: document.getElementById("project-featured").checked
        };

        try {
            if (id) {
                await window.PortfolioAPI.updateProject(id, payload);
                setFeedback(projectFeedback, "Project updated successfully.", "success");
            } else {
                await window.PortfolioAPI.createProject(payload);
                setFeedback(projectFeedback, "Project created successfully.", "success");
            }
            resetProjectForm();
            await loadProjects();
        } catch (error) {
            setFeedback(projectFeedback, extractError(error), "error");
        }
    };

    const onProjectTableClick = async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const action = target.dataset.action;
        const id = Number(target.dataset.id);
        if (!action || Number.isNaN(id)) {
            return;
        }

        const project = state.projects.find((item) => item.id === id);
        if (!project) {
            return;
        }

        if (action === "edit-project") {
            fillProjectForm(project);
            window.scrollTo({top: 0, behavior: "smooth"});
            return;
        }

        if (action === "delete-project" && window.confirm("Delete this project?")) {
            try {
                await window.PortfolioAPI.deleteProject(id);
                setFeedback(projectFeedback, "Project deleted successfully.", "success");
                await loadProjects();
            } catch (error) {
                setFeedback(projectFeedback, extractError(error), "error");
            }
        }
    };

    const loadBlogs = async () => {
        state.blogs = await window.PortfolioAPI.getAdminBlogs({});
        renderBlogTable();
    };

    const renderBlogTable = () => {
        if (!blogTableBody) {
            return;
        }

        if (!state.blogs.length) {
            blogTableBody.innerHTML = "<tr><td colspan='4'>No blog posts available.</td></tr>";
            return;
        }

        blogTableBody.innerHTML = state.blogs.map((blog) => `
            <tr>
                <td>${escapeHtml(blog.title)}</td>
                <td>${blog.published ? "Published" : "Draft"}</td>
                <td>${formatDate(blog.updatedAt || blog.createdAt)}</td>
                <td>
                    <button class="mini-btn" data-action="edit-blog" data-id="${blog.id}">Edit</button>
                    <button class="mini-btn" data-action="delete-blog" data-id="${blog.id}">Delete</button>
                </td>
            </tr>
        `).join("");
    };

    const resetBlogForm = () => {
        blogForm?.reset();
        const blogId = document.getElementById("blog-id");
        if (blogId) {
            blogId.value = "";
        }
        document.getElementById("blog-published").checked = true;
        setFeedback(blogFeedback, "");
    };

    const fillBlogForm = (blog) => {
        document.getElementById("blog-id").value = blog.id;
        document.getElementById("blog-title").value = blog.title;
        document.getElementById("blog-image").value = blog.coverImageUrl || "";
        document.getElementById("blog-tags").value = (blog.tags || []).join(", ");
        document.getElementById("blog-summary").value = blog.summary;
        document.getElementById("blog-content").value = blog.contentMarkdown;
        document.getElementById("blog-published").checked = Boolean(blog.published);
    };

    const onBlogSubmit = async (event) => {
        event.preventDefault();

        const id = document.getElementById("blog-id").value;
        const payload = {
            title: document.getElementById("blog-title").value.trim(),
            summary: document.getElementById("blog-summary").value.trim(),
            contentMarkdown: document.getElementById("blog-content").value.trim(),
            coverImageUrl: document.getElementById("blog-image").value.trim(),
            tags: parseList(document.getElementById("blog-tags").value),
            published: document.getElementById("blog-published").checked
        };

        try {
            if (id) {
                await window.PortfolioAPI.updateBlog(id, payload);
                setFeedback(blogFeedback, "Blog updated successfully.", "success");
            } else {
                await window.PortfolioAPI.createBlog(payload);
                setFeedback(blogFeedback, "Blog created successfully.", "success");
            }
            resetBlogForm();
            await loadBlogs();
        } catch (error) {
            setFeedback(blogFeedback, extractError(error), "error");
        }
    };

    const onBlogTableClick = async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const action = target.dataset.action;
        const id = Number(target.dataset.id);
        if (!action || Number.isNaN(id)) {
            return;
        }

        const blog = state.blogs.find((item) => item.id === id);
        if (!blog) {
            return;
        }

        if (action === "edit-blog") {
            fillBlogForm(blog);
            window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
            return;
        }

        if (action === "delete-blog" && window.confirm("Delete this blog post?")) {
            try {
                await window.PortfolioAPI.deleteBlog(id);
                setFeedback(blogFeedback, "Blog deleted successfully.", "success");
                await loadBlogs();
            } catch (error) {
                setFeedback(blogFeedback, extractError(error), "error");
            }
        }
    };

    const init = async () => {
        if (!window.PortfolioAPI) {
            return;
        }

        projectForm?.addEventListener("submit", onProjectSubmit);
        blogForm?.addEventListener("submit", onBlogSubmit);
        document.getElementById("project-reset")?.addEventListener("click", resetProjectForm);
        document.getElementById("blog-reset")?.addEventListener("click", resetBlogForm);
        projectTableBody?.addEventListener("click", onProjectTableClick);
        blogTableBody?.addEventListener("click", onBlogTableClick);

        try {
            await Promise.all([loadProjects(), loadBlogs()]);
        } catch (error) {
            setFeedback(projectFeedback, extractError(error), "error");
            setFeedback(blogFeedback, extractError(error), "error");
        }
    };

    document.addEventListener("DOMContentLoaded", init);
})();
