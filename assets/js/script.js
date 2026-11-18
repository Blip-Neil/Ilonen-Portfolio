const body = document.body;
const toggleSwitch = document.querySelector('.toggle-switch');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.navbar-nav');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

function applyTheme(theme) {
    const isLight = theme === 'light';
    body.classList.toggle('light-theme', isLight);
    if (toggleSwitch) {
        toggleSwitch.classList.toggle('active', !isLight);
    }
    localStorage.setItem('portfolio-theme', theme);
}

function setInitialTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        applyTheme('light');
        return;
    }
    applyTheme('dark');
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const setCurrentSection = () => {
        let currentId = 'home';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === '#' + currentId;
            link.classList.toggle('active', isActive);
        });
    };

    setCurrentSection();
    window.addEventListener('scroll', setCurrentSection, { passive: true });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navMenu) {
                navMenu.classList.remove('menu-open');
            }
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function setupThemeToggle() {
    if (!toggleSwitch) return;

    toggleSwitch.addEventListener('click', () => {
        const nextTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
        applyTheme(nextTheme);
    });

    toggleSwitch.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleSwitch.click();
        }
    });
}

function setupMobileMenu() {
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

            projectCards.forEach((card) => {
                const matches = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !matches);
            });
        });
    });
}

function setupCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach((counter) => {
        const target = Number(counter.dataset.target || 0);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));

        const updateCounter = () => {
            current += step;
            if (current >= target) {
                counter.textContent = `${target}+`;
                return;
            }
            counter.textContent = `${current}+`;
            requestAnimationFrame(updateCounter);
        };

        updateCounter();
    });
}

function setupFormSubmission() {
    if (!contactForm || !formStatus) return;

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name')?.toString().trim() || 'there';
        const email = formData.get('email')?.toString().trim() || '';
        const subject = formData.get('subject')?.toString().trim() || 'Portfolio Inquiry';
        const message = formData.get('message')?.toString().trim() || '';

        const mailtoLink = `mailto:christinejoyilonen7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

        formStatus.textContent = `Thanks ${name}! Your default email app will open with your message ready to send.`;
        window.location.href = mailtoLink;
        contactForm.reset();
    });
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach((element) => {
    observer.observe(element);
});

setInitialTheme();
setupThemeToggle();
setupSmoothScroll();
setupMobileMenu();
setupProjectFilters();
setupCounters();
setupFormSubmission();
updateActiveNav();
