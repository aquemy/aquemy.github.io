document.addEventListener('DOMContentLoaded', function() {
    // Research threads as tabs. A hash pointing at a panel or inside one opens that panel.
    const tabList = document.querySelector('.tab-list');
    if (tabList) {
        const tabs = Array.from(tabList.querySelectorAll('.tab'));
        const panels = tabs.map(t => document.getElementById(t.dataset.tab));
        const show = (i) => {
            tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
            panels.forEach((p, k) => { p.hidden = k !== i; });
        };
        const fromHash = () => {
            const target = location.hash && document.getElementById(location.hash.slice(1));
            if (!target) return false;
            const i = panels.findIndex(p => p === target || p.contains(target));
            if (i < 0) return false;
            show(i);
            return true;
        };
        tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
        tabList.addEventListener('keydown', (e) => {
            const i = tabs.findIndex(t => t === document.activeElement);
            if (i < 0) return;
            const n = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : -1;
            if (n >= 0) { show(n); tabs[n].focus(); e.preventDefault(); }
        });
        if (!fromHash()) show(0);
        window.addEventListener('hashchange', fromHash);
    }
    // A hash pointing inside a closed fold opens it.
    const openFold = () => {
        const target = location.hash && document.getElementById(location.hash.slice(1));
        if (!target) return;
        const fold = target.closest('details.fold');
        if (fold) { fold.open = true; target.scrollIntoView(); }
    };
    openFold();
    window.addEventListener('hashchange', openFold);
    
    // --- Theme Toggler ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');

    function applyTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        if (darkIcon) darkIcon.classList.toggle('hidden', !isDark);
        if (lightIcon) lightIcon.classList.toggle('hidden', isDark); 
    };
    
    applyTheme();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            applyTheme();
        });
    }

    const animatedElements = document.querySelectorAll('.scroll-fade-in');
    if (animatedElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => scrollObserver.observe(el));
    }

    // --- Active Navigation Link ---
    const currentPage = window.location.pathname.split("/").pop().split(".")[0] || 'index';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.setAttribute('data-page-active', 'true');
        }
    });

    // --- Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuCloseButton = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton) mobileMenuButton.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
    if (mobileMenuCloseButton) mobileMenuCloseButton.addEventListener('click', () => mobileMenu.classList.add('hidden'));

    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- CV Page Toggle Switch Logic (Corrected and Final) ---
    const detailToggle = document.getElementById('detail-toggle');
    if (detailToggle) {
        const overviewLabel = document.getElementById('overview-label');
        const detailedLabel = document.getElementById('detailed-label');
        const detailLists = document.querySelectorAll('.detail-list');

        const setViewMode = (isDetailed) => {
            detailLists.forEach(list => {
                if (isDetailed) {
                    list.classList.add('show');
                } else {
                    list.classList.remove('show');
                }
            });
            
            if (isDetailed) {
                if (overviewLabel) {
                    overviewLabel.classList.remove('font-semibold', 'text-ink', 'dark:text-dark-ink');
                    overviewLabel.classList.add('text-stone-400', 'dark:text-stone-500');
                }
                if (detailedLabel) {
                    detailedLabel.classList.add('font-semibold', 'text-ink', 'dark:text-dark-ink');
                    detailedLabel.classList.remove('text-stone-400', 'dark:text-stone-500');
                }
            } else {
                if (detailedLabel) {
                    detailedLabel.classList.remove('font-semibold', 'text-ink', 'dark:text-dark-ink');
                    detailedLabel.classList.add('text-stone-400', 'dark:text-stone-500');
                }
                if (overviewLabel) {
                    overviewLabel.classList.add('font-semibold', 'text-ink', 'dark:text-dark-ink');
                    overviewLabel.classList.remove('text-stone-400', 'dark:text-stone-500');
                }
            }
            sessionStorage.setItem('cvDetailedView', isDetailed);
        };

        detailToggle.addEventListener('change', () => {
            setViewMode(detailToggle.checked);
        });

        const savedState = sessionStorage.getItem('cvDetailedView') === 'true';
        detailToggle.checked = savedState;
        setViewMode(savedState);
    }

    // --- Blog Page Category Filtering Logic (Corrected and Final) ---
    const tagFilterList = document.getElementById('tag-filter-list');
    if (tagFilterList) {
        const filterButtons = tagFilterList.querySelectorAll('.tag-filter');
        const blogEntries = document.querySelectorAll('.blog-entry-item[data-category]');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedCategory = button.getAttribute('data-category-filter');

                // Update active state on buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter blog entries
                blogEntries.forEach(entry => {
                    const entryCategory = entry.getAttribute('data-category');
                    if (selectedCategory === 'all' || entryCategory === selectedCategory) {
                        entry.classList.remove('filtered');
                    } else {
                        entry.classList.add('filtered');
                    }
                });
            });
        });
    }

    // --- Blog Entry Sticky ToC and Scroll-Spy Logic ---
    // --- Blog Entry Sticky ToC and Scroll-Spy Logic ---
    const tocSidebar = document.getElementById('toc-sidebar');
    const proseContent = document.getElementById('prose-content');
    
    if (tocSidebar && proseContent) {
        const toc = proseContent.querySelector('.toc');
        if (toc) {
            tocSidebar.appendChild(toc);
            
            const headings = Array.from(proseContent.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            const tocLinks = tocSidebar.querySelectorAll('a');

            const activateLink = (targetId) => {
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.add('active');
                    }
                });
            };

            const headingObserver = new IntersectionObserver((entries) => {
                let intersectingHeadings = [];
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        intersectingHeadings.push(entry.target);
                    }
                });

                if (intersectingHeadings.length > 0) {
                    intersectingHeadings.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
                    activateLink(intersectingHeadings[0].id);
                }
            }, {
                rootMargin: '0px 0px -80% 0px',
                threshold: 0
            });

            headings.forEach(heading => {
                if(heading.id) {
                     headingObserver.observe(heading);
                }
            });

            if (tocLinks.length > 0) {
                tocLinks[0].classList.add('active');
            }
        }
    }

    

    // Add to your main.js DOMContentLoaded event listener
    const fullscreenBtn = document.getElementById('fullscreen-notebook');
    const notebookModal = document.getElementById('notebook-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const fullscreenIframe = document.getElementById('notebook-iframe-fullscreen');

    if (fullscreenBtn && notebookModal && closeModalBtn && fullscreenIframe) {
        const notebookUrl = document.getElementById('notebook-iframe').src;
        
        fullscreenBtn.addEventListener('click', () => {
            fullscreenIframe.src = notebookUrl;
            notebookModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
        
        closeModalBtn.addEventListener('click', () => {
            notebookModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            fullscreenIframe.src = '';
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !notebookModal.classList.contains('hidden')) {
                closeModalBtn.click();
            }
        });
    }

    
    // --- Generic Sticky Sidebar Logic for Research & CV pages ---
    const pageSidebar = document.querySelector('#research-sidebar-nav, #cv-sidebar-nav');
    if (pageSidebar) {
        const sections = document.querySelectorAll('.scroll-section');
        const sidebarLinks = pageSidebar.querySelectorAll('.sidebar-link');

        const activateLink = (targetId) => {
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-target') === targetId) {
                    link.classList.add('active');
                }
            });
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            const firstIntersecting = entries.find(entry => entry.isIntersecting);
            if(firstIntersecting) {
                activateLink(firstIntersecting.target.id);
            }
        }, { 
            rootMargin: '0px 0px -70% 0px',
            threshold: 0
        });

        if (window.scrollY < 200 && sections.length > 0) {
            activateLink(sections[0].id);
        }

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // --- Collapsible Sections Logic (GitHub Details style) ---
    // Simple and bulletproof implementation
    window.addEventListener('load', function() {
        // Find all collapse blocks
        var blocks = document.getElementsByClassName('collapse-block');
        
        for (var i = 0; i < blocks.length; i++) {
            (function(block) {
                var header = block.getElementsByClassName('collapse-header')[0];
                var content = block.getElementsByClassName('collapse-content')[0];
                var toggle = block.getElementsByClassName('collapse-toggle')[0];
                
                if (header && content && toggle) {
                    // Set cursor style
                    header.style.cursor = 'pointer';
                    
                    // Add click handler
                    header.addEventListener('click', function(e) {
                        // Prevent any bubbling issues
                        e.stopPropagation();
                        
                        // Check current state
                        var isExpanded = content.className.indexOf('expanded') !== -1;
                        
                        if (isExpanded) {
                            // Collapse
                            content.className = content.className.replace(' expanded', '');
                            toggle.className = toggle.className.replace(' expanded', '');
                        } else {
                            // Expand
                            content.className += ' expanded';
                            toggle.className += ' expanded';
                        }
                    });
                }
            })(blocks[i]);
        }
    });
});