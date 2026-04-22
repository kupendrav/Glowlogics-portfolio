(() => {
    const jsonHeaders = {
        "Content-Type": "application/json"
    };

    const buildQueryString = (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && String(value).trim() !== "") {
                searchParams.set(key, value);
            }
        });
        const query = searchParams.toString();
        return query ? `?${query}` : "";
    };

    const request = async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...jsonHeaders,
                ...(options.headers || {})
            }
        });

        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get("content-type") || "";
        const payload = contentType.includes("application/json")
            ? await response.json()
            : await response.text();

        if (!response.ok) {
            const error = new Error(payload?.message || "Request failed");
            error.status = response.status;
            error.payload = payload;
            throw error;
        }

        return payload;
    };

    window.PortfolioAPI = {
        getProjects: (category) => request(`/api/projects${buildQueryString({category})}`, {method: "GET"}),
        getProjectById: (id) => request(`/api/projects/${id}`, {method: "GET"}),
        createProject: (data) => request("/api/projects", {method: "POST", body: JSON.stringify(data)}),
        updateProject: (id, data) => request(`/api/projects/${id}`, {method: "PUT", body: JSON.stringify(data)}),
        deleteProject: (id) => request(`/api/projects/${id}`, {method: "DELETE"}),

        getBlogs: (params) => request(`/api/blogs${buildQueryString(params)}`, {method: "GET"}),
        getBlogById: (id) => request(`/api/blogs/${id}`, {method: "GET"}),
        createBlog: (data) => request("/api/blogs", {method: "POST", body: JSON.stringify(data)}),
        updateBlog: (id, data) => request(`/api/blogs/${id}`, {method: "PUT", body: JSON.stringify(data)}),
        deleteBlog: (id) => request(`/api/blogs/${id}`, {method: "DELETE"}),

        getAdminProjects: () => request("/api/admin/projects", {method: "GET"}),
        getAdminBlogs: (params) => request(`/api/admin/blogs${buildQueryString(params)}`, {method: "GET"}),

        getSkills: () => request("/api/skills", {method: "GET"}),
        submitContact: (data) => request("/api/contact", {method: "POST", body: JSON.stringify(data)})
    };
})();
