// ── PAGE NAVIGATION ──
let selectedAmt = '25';

// function showPage(page) {
//     document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
//     document.getElementById('page-' + page).classList.add('active');
//     document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
//     const btn = document.getElementById('nav-' + page);
//     if (btn) btn.classList.add('active');
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     setTimeout(initScrollReveal, 80);
// }

// Initialize EmailJS
emailjs.init({
    publicKey: "2uEUzqEv0yI9I5fFU",
});

async function handleSubmit(e) {
    e.preventDefault();

    const form = document.getElementById("contact-form");
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const templateParams = {
        first_name: document.getElementById("first-name").value.trim(),
        last_name: document.getElementById("last-name").value.trim(),
        email: document.getElementById("email").value.trim(),
        reason: document.getElementById("reason").value,
        message: document.getElementById("message").value.trim(),
    };

    try {
        await emailjs.send(
            "service_f69bzwc",
            "template_qcw0hhm",
            templateParams
        );

        form.reset();
        form.style.display = "none";
        document.getElementById("contact-success").style.display = "block";

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    } catch (error) {
        console.error("EmailJS Error:", error);

        submitButton.disabled = false;
        submitButton.textContent = "Send message 📨";

        alert(
            "Something went wrong. Please try again or email us directly at handsacrossborder@gmail.com."
        );
    }
}

function clearAmtSel() {
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
    selectedAmt = null;
}

function handleDonate() {
    const custom = document.getElementById('custom-amount').value;
    const amount = custom || selectedAmt;
    if (!amount || parseFloat(amount) <= 0) {
        alert('Please select or enter a donation amount!');
        return;
    }
    document.getElementById('donate-form-content').style.display = 'none';
    document.getElementById('donate-success').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── SCROLL REVEAL ──
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            // Trigger stat bars
            entry.target.querySelectorAll('.stat-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.width || '80%';
            });
            // Trigger counters
            entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.sr:not(.visible), .sr-stagger:not(.visible)').forEach(el => observer.observe(el));
}

// ── STAT COUNTER ──
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    if (isNaN(target)) return;
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.classList.add('pop');
    }
    requestAnimationFrame(tick);
}

// ── BUTTON RIPPLE ──
function initRipples() {
    document.querySelectorAll('.btn, .donate-submit, .nav-donate-btn').forEach(btn => {
        if (btn.dataset.ripple) return;
        btn.dataset.ripple = '1';
        btn.addEventListener('click', function(e) {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

// ── NAV SHRINK ON SCROLL ──
function initNavScroll() {
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}

// ── 3D CARD TILT ──
function initCardTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        if (card.dataset.tilt) return;
        card.dataset.tilt = '1';
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Drag-to-scroll for values strip
document.querySelectorAll('.values-scroll').forEach(el => {
    let isDown = false, startX, scrollLeft;

    el.addEventListener('mousedown', e => {
        isDown = true;
        el.style.scrollBehavior = 'auto';
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => { isDown = false; });
    el.addEventListener('mouseup', () => { isDown = false; el.style.scrollBehavior = 'smooth'; });

    el.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 1.5;
        el.scrollLeft = scrollLeft - walk;
    });

    // Scroll wheel support
    el.addEventListener('wheel', e => {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 2, behavior: 'smooth' });
    }, { passive: false });
});

function initNavHamburger() {
    const hamburger = document.querySelector('.nav-hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });


}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initRipples();
    initNavScroll();
    initCardTilt();
    initNavHamburger();
});
