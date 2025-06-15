document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Setup ---
    const html = document.documentElement;
    
    const applyTheme = (theme) => {
        const themeIcon = document.getElementById('theme-icon');
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    };

    const setupThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
                localStorage.setItem('theme', newTheme);
                applyTheme(newTheme);
            });
        }
    };
    
    const setupNavIndicator = () => {
        const navLinks = document.querySelectorAll('.nav-link');
        const indicator = document.getElementById('nav-indicator');
        const currentFile = window.location.pathname.split("/").pop() || "index.html";

        navLinks.forEach((link) => {
            if (link.getAttribute('href').endsWith(currentFile)) {
                link.classList.add('active');
                if (indicator) {
                    indicator.style.top = `${link.offsetTop}px`;
                    indicator.style.opacity = '1';
                }
            } else {
                 link.classList.remove('active');
            }
        });
    };

    const setupScrollAnimations = () => {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.setProperty('--delay', index);
                    entry.target.classList.add('visible');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.scroll-anim').forEach(el => scrollObserver.observe(el));
    };

    const setupMobileSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        if (sidebar && sidebarToggle && sidebarOverlay) {
            sidebarToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.add('open');
                sidebarOverlay.classList.remove('hidden');
            });
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.add('hidden');
            });
        }
    };

    const runKaTeX = () => {
         if (window.renderMathInElement) {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: "$$", right: "$$", display: true}, {left: "\\(", right: "\\)", display: false},
                    {left: "$", right: "$", display: false}, {left: "\\[", right: "\\]", display: true}
                ]
            });
        }
    };
    
    function initializePage() {
        setupThemeToggle();
        setupNavIndicator();
        setupScrollAnimations();
        setupMobileSidebar();
        runKaTeX();
        setupSpaNavigation();
        if (document.getElementById('home')) {
            initInteractiveCanvas();
        }
    }
    
    // SPA-like navigation
    function setupSpaNavigation() {
        document.querySelectorAll('a[href^="./"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!e.ctrlKey && !e.metaKey && href.endsWith('.html')) {
                    e.preventDefault();
                    navigate(href);
                }
            });
        });
    }

    async function navigate(path) {
        const contentContainer = document.querySelector('main');
        contentContainer.style.transition = 'opacity 0.2s ease-in-out';
        contentContainer.style.opacity = 0;
        
        try {
            const response = await fetch(path);
            const text = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(text, 'text/html');
            const newContent = newDoc.querySelector('main').innerHTML;
            const newTitle = newDoc.querySelector('title').innerText;

            document.title = newTitle;
            contentContainer.innerHTML = newContent;
            window.history.pushState({}, '', path);
            
            initializePage(); // Re-initialize scripts for new content

            setTimeout(() => {
                contentContainer.style.opacity = 1;
            }, 50);

        } catch (error) {
            console.error('Failed to load page:', error);
            window.location.href = path; // Fallback to full page load
        }
    }

    window.addEventListener('popstate', () => {
        // Simple full reload on back/forward to ensure canvas/animations re-init correctly
        window.location.reload(); 
    });


    // Initial Load
    initializePage();

    // -- Interactive Particle Canvas for Homepage --
    function initInteractiveCanvas() {
        const canvas = document.getElementById('interactive-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('mousemove', e => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        class Particle {
             constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                this.color = document.documentElement.classList.contains('dark') ? 'rgba(56, 189, 248, 0.8)' : 'rgba(37, 99, 235, 0.8)';
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;
                
                if (distance < mouse.radius) {
                    this.x -= directionX * 0.5;
                    this.y -= directionY * 0.5;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx/10;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy/10;
                    }
                }
                this.draw();
            }
        }
        
        function initParticles() {
            particles.length = 0;
            const particleCount = Math.floor(canvas.width / 30);
            for(let i=0; i < particleCount; i++){
                particles.push(new Particle());
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0,0,canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        function connectParticles() {
             for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                 + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        const opacity = 1 - (distance / 20000);
                        ctx.strokeStyle = document.documentElement.classList.contains('dark') ? `rgba(56, 189, 248, ${opacity})` : `rgba(37, 99, 235, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        resizeCanvas();
        initParticles();
        animateParticles();
    }
});