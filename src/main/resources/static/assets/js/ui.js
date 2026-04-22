(() => {
    const setupReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                const delay = Number(entry.target.dataset.revealDelay || 0);
                setTimeout(() => {
                    entry.target.classList.add("in-view");
                }, delay);
                observer.unobserve(entry.target);
            });
        }, {threshold: 0.18});

        document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    };

    const setupHeaderBehavior = () => {
        const header = document.getElementById("site-header");
        if (!header) {
            return;
        }

        const updateHeader = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 12);
        };

        updateHeader();
        window.addEventListener("scroll", updateHeader, {passive: true});
    };

    const setupActiveNav = () => {
        const links = Array.from(document.querySelectorAll("[data-nav]"));
        if (!links.length) {
            return;
        }

        const sections = links
            .map((link) => document.getElementById(link.dataset.nav))
            .filter(Boolean);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                links.forEach((link) => {
                    link.classList.toggle("active", link.dataset.nav === entry.target.id);
                });
            });
        }, {threshold: 0.42});

        sections.forEach((section) => observer.observe(section));
    };

    const setupMobileMenu = () => {
        const toggle = document.getElementById("menu-toggle");
        const links = document.getElementById("nav-links");

        if (!toggle || !links) {
            return;
        }

        toggle.addEventListener("click", () => {
            const isOpen = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        links.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                links.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    };

    const startTypewriter = (selector, words, speed = 90, pause = 1200) => {
        const target = document.querySelector(selector);
        if (!target || !Array.isArray(words) || words.length === 0) {
            return;
        }

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const tick = () => {
            const current = words[wordIndex];
            if (!deleting) {
                target.textContent = current.slice(0, charIndex + 1);
                charIndex += 1;
                if (charIndex === current.length) {
                    deleting = true;
                    setTimeout(tick, pause);
                    return;
                }
            } else {
                target.textContent = current.slice(0, Math.max(0, charIndex - 1));
                charIndex -= 1;
                if (charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }
            setTimeout(tick, deleting ? speed / 2 : speed);
        };

        tick();
    };

    const setupTiltCards = (selector) => {
        document.querySelectorAll(selector).forEach((card) => {
            card.addEventListener("mousemove", (event) => {
                const bounds = card.getBoundingClientRect();
                const x = event.clientX - bounds.left;
                const y = event.clientY - bounds.top;
                const rotateY = ((x / bounds.width) - 0.5) * 12;
                const rotateX = ((y / bounds.height) - 0.5) * -10;
                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
            });
        });
    };

    const initParticles = () => {
        const canvas = document.getElementById("particle-canvas");
        if (!canvas) {
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }

        const particles = [];

        const createParticles = (count) => {
            particles.length = 0;
            for (let i = 0; i < count; i += 1) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2.2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45
                });
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createParticles(Math.max(40, Math.floor(canvas.width / 28)));
        };

        const draw = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "rgba(15, 118, 110, 0.42)";

            particles.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.vx *= -1;
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.vy *= -1;
                }

                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fill();
            });

            requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener("resize", resize);
    };

    const initCursor = () => {
        const dot = document.querySelector(".cursor-dot");
        const ring = document.querySelector(".cursor-ring");

        if (!dot || !ring || window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        let ringX = 0;
        let ringY = 0;

        const move = (event) => {
            dot.style.opacity = "1";
            ring.style.opacity = "1";
            dot.style.transform = `translate(${event.clientX - 4}px, ${event.clientY - 4}px)`;
            ringX += (event.clientX - 14 - ringX) * 0.18;
            ringY += (event.clientY - 14 - ringY) * 0.18;
            ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
        };

        document.addEventListener("mousemove", move, {passive: true});
    };

    const hideLoader = () => {
        const loader = document.getElementById("page-loader");
        if (!loader) {
            return;
        }
        window.setTimeout(() => loader.classList.add("hidden"), 280);
    };

    window.PortfolioUI = {
        setupReveal,
        setupHeaderBehavior,
        setupActiveNav,
        setupMobileMenu,
        startTypewriter,
        setupTiltCards,
        initParticles,
        initCursor,
        hideLoader
    };
})();
