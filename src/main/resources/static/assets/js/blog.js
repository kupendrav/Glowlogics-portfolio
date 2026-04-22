(() => {
    const article = document.getElementById("blog-article");

    const RELATED_VISUALS = [
        {
            title: "Remote API and architecture collaboration",
            imageUrl: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            sourceUrl: "https://www.pexels.com/photo/macbook-pro-on-table-beside-white-imac-and-magic-keyboard-1181244/",
            alt: "Developer collaborating while reviewing architecture and API contracts",
            keywords: ["spring", "api", "architecture", "backend", "system", "design"]
        },
        {
            title: "Hands-on coding and product iteration",
            imageUrl: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            sourceUrl: "https://www.pexels.com/photo/person-using-macbook-pro-574071/",
            alt: "Close-up of coding workflow for UI and product delivery",
            keywords: ["ui", "ux", "css", "performance", "frontend", "animation", "dx", "admin"]
        },
        {
            title: "Code depth and performance diagnostics",
            imageUrl: "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            sourceUrl: "https://www.pexels.com/photo/shallow-focus-photo-of-computer-codes-1089438/",
            alt: "Abstract code visualization representing diagnostics and optimization",
            keywords: ["seo", "roadmap", "optimization", "analysis", "monitoring", "data"]
        }
    ];

    const escapeHtml = (value) => String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const normalize = (value) => String(value || "").toLowerCase();

    const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const estimateReadTime = (wordCount) => Math.max(1, Math.round(wordCount / 220));

    const inferAudience = (topicText) => {
        if (topicText.includes("api") || topicText.includes("architecture")) {
            return "backend and platform engineers";
        }
        if (topicText.includes("ui") || topicText.includes("ux") || topicText.includes("css")) {
            return "frontend developers and product designers";
        }
        if (topicText.includes("admin") || topicText.includes("dx")) {
            return "teams building internal tools";
        }
        return "developers modernizing production systems";
    };

    const inferOutcome = (topicText) => {
        if (topicText.includes("api") || topicText.includes("architecture")) {
            return "clearer service boundaries and easier API evolution";
        }
        if (topicText.includes("ui") || topicText.includes("animation")) {
            return "smoother user journeys with better perceived performance";
        }
        if (topicText.includes("admin") || topicText.includes("dx")) {
            return "faster content operations and fewer editorial mistakes";
        }
        return "practical engineering decisions you can apply in your next sprint";
    };

    const buildHighlights = (post, wordCount, readMinutes) => {
        const tags = (post.tags || []).filter(Boolean);
        const topicText = normalize(`${post.title} ${post.summary} ${tags.join(" ")}`);

        return [
            {
                label: "Topic focus",
                value: tags.length ? tags.slice(0, 3).join(", ") : "Engineering fundamentals"
            },
            {
                label: "Read time",
                value: `${readMinutes} min read (${wordCount} words)`
            },
            {
                label: "Best for",
                value: inferAudience(topicText)
            },
            {
                label: "Expected outcome",
                value: inferOutcome(topicText)
            }
        ];
    };

    const pickRelatedVisuals = (post) => {
        const topicText = normalize(`${post.title} ${post.summary} ${(post.tags || []).join(" ")}`);
        return [...RELATED_VISUALS]
            .map((visual) => ({
                ...visual,
                score: visual.keywords.reduce((total, keyword) => (
                    topicText.includes(keyword) ? total + 1 : total
                ), 0)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    };

    const renderErrorState = (message) => {
        if (!article) {
            return;
        }
        article.innerHTML = `
            <h1>Post unavailable</h1>
            <p>${escapeHtml(message)}</p>
            <p><a class="btn btn-soft btn-sm" href="/index.html#blog">Back to blog list</a></p>
        `;
    };

    const renderBlog = (post) => {
        if (!article) {
            return;
        }

        const plainText = String(post.contentMarkdown || "")
            .replace(/[#>*_`~\-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        const wordCount = plainText ? plainText.split(" ").length : 0;
        const readMinutes = estimateReadTime(wordCount);
        const highlights = buildHighlights(post, wordCount, readMinutes);
        const relatedVisuals = pickRelatedVisuals(post);
        const tagLabel = (post.tags || []).length ? (post.tags || []).map(escapeHtml).join(" · ") : "General engineering";

        const markdown = window.marked
            ? window.marked.parse(post.contentMarkdown || "")
            : `<pre>${escapeHtml(post.contentMarkdown || "")}</pre>`;

        article.innerHTML = `
            <div class="blog-cover-wrap">
                <img src="${escapeHtml(post.coverImageUrl || "/assets/images/blog-placeholder.svg")}" alt="${escapeHtml(post.title)} cover" class="blog-cover" loading="lazy" width="1260" height="750">
            </div>
            <h1>${escapeHtml(post.title)}</h1>
            <p class="blog-meta">
                <span>${formatDate(post.createdAt)}</span>
                <span>${readMinutes} min read</span>
                <span>${tagLabel}</span>
            </p>
            <p class="blog-lead">${escapeHtml(post.summary)}</p>
            <section class="blog-insights" aria-label="Article insights">
                ${highlights.map((item) => `
                    <article class="blog-insight-card">
                        <span>${escapeHtml(item.label)}</span>
                        <p>${escapeHtml(item.value)}</p>
                    </article>
                `).join("")}
            </section>
            <section class="related-visuals" aria-label="Related visuals from the web">
                <h2>Related visuals</h2>
                <p>Reference imagery selected from public Pexels pages to support this topic.</p>
                <div class="related-visual-grid">
                    ${relatedVisuals.map((visual) => `
                        <article class="related-visual-card">
                            <img src="${escapeHtml(visual.imageUrl)}" alt="${escapeHtml(visual.alt)}" loading="lazy" width="1260" height="750">
                            <div class="related-visual-body">
                                <h3>${escapeHtml(visual.title)}</h3>
                                <a href="${escapeHtml(visual.sourceUrl)}" target="_blank" rel="noopener">Open source image</a>
                            </div>
                        </article>
                    `).join("")}
                </div>
            </section>
            <hr>
            <div class="markdown-body">${markdown}</div>
        `;

        document.title = `${post.title} | Glowlogics Blog`;
    };

    const init = async () => {
        if (window.ThemeManager) {
            window.ThemeManager.initTheme();
        }

        const yearElement = document.getElementById("year");
        if (yearElement) {
            yearElement.textContent = String(new Date().getFullYear());
        }

        const id = new URLSearchParams(window.location.search).get("id");
        if (!id || Number.isNaN(Number(id))) {
            renderErrorState("Invalid blog identifier.");
            return;
        }

        try {
            const post = await window.PortfolioAPI.getBlogById(id);
            renderBlog(post);
        } catch (error) {
            renderErrorState(error.payload?.message || "The requested post was not found.");
        }
    };

    document.addEventListener("DOMContentLoaded", init);
})();
