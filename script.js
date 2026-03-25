/* ════════════════════════════════════════════════════════════
   BABBITT LANDING — Interactions
   ════════════════════════════════════════════════════════════ */

/* ── 1. Word Cycling (hero headline) ── */
(function () {
    var nouns   = ['trade','craft','skill','hands','licence','crew','work','property','product','supply'];
    var verbs   = ['builds','frames','finishes','renovates','installs','completes','holds','starts','moves'];
    var objects = ['home','site','job','property','build','project','story','team','reputation'];
    var singles = ['Remembered','Respected','Rewarded','Redefines','Re-orders','Remains'];

    var idx  = { n: 0, v: 0, o: 0, s: 0 };
    var els  = {
        n: document.getElementById('c-noun'),
        v: document.getElementById('c-verb'),
        o: document.getElementById('c-obj'),
        s: document.getElementById('c-single')
    };
    var words = { n: nouns, v: verbs, o: objects, s: singles };

    function swapWord(key) {
        var el  = els[key];
        var arr = words[key];
        if (!el) return;
        el.classList.remove('anim-in');
        el.classList.add('anim-out');
        setTimeout(function () {
            idx[key] = (idx[key] + 1) % arr.length;
            el.textContent = arr[idx[key]];
            el.classList.remove('anim-out');
            el.classList.add('anim-in');
            setTimeout(function () { el.classList.remove('anim-in'); }, 300);
        }, 300);
    }

    setInterval(function () {
        swapWord('n'); swapWord('v'); swapWord('o'); swapWord('s');
    }, 2800);
})();

/* ── 2. Partner Hover — dim + vibrate/glow ── */
(function () {
    var btnPartner = document.getElementById('btnPartner');
    if (!btnPartner) return;
    btnPartner.addEventListener('mouseenter', function () {
        document.body.classList.add('partner-hover');
    });
    btnPartner.addEventListener('mouseleave', function () {
        document.body.classList.remove('partner-hover');
    });
})();

/* ── 3. Member Click — fly to top-right + yellow sweep ── */
(function () {
    var btnMember   = document.getElementById('btnMember');
    var yellowSweep = document.getElementById('yellowSweep');
    var sweepMsg    = document.getElementById('sweepMessage');
    if (!btnMember || !yellowSweep || !sweepMsg) return;

    btnMember.addEventListener('click', function () {
        var rect = this.getBoundingClientRect();
        var flyX = (window.innerWidth - rect.right) + rect.width * 0.5 - 20;
        var flyY = -(rect.top) + 18;

        this.classList.add('flying');
        this.style.transform = 'translate(' + flyX + 'px, ' + flyY + 'px) scale(0.32) rotate(6deg)';
        this.style.opacity   = '0.5';

        setTimeout(function () {
            yellowSweep.classList.add('active');
            sweepMsg.classList.add('active');
        }, 400);

        yellowSweep.addEventListener('click', function reset() {
            yellowSweep.classList.remove('active');
            sweepMsg.classList.remove('active');
            setTimeout(function () {
                btnMember.style.transform = '';
                btnMember.style.opacity   = '1';
                btnMember.classList.remove('flying');
            }, 250);
            yellowSweep.removeEventListener('click', reset);
        }, { once: true });
    });
})();

/* ── 4. 3D Tilt Cards (cursor-driven perspective) ── */
document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
            'perspective(800px) rotateY(' + (x * 16) + 'deg) rotateX(' + (-y * 16) + 'deg) scale3d(1.03,1.03,1.03)';
        card.style.boxShadow =
            (-x * 25) + 'px ' + (y * 25) + 'px 35px rgba(0,0,0,0.25), ' +
            (-x * 8) + 'px ' + (y * 8) + 'px 14px rgba(0,0,0,0.12)';
    });

    card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    });
});

/* ── 5. Hero Cursor Glare ── */
(function () {
    var hero = document.querySelector('.hero');
    var glare = document.getElementById('glareLayer');
    var glareWarm = document.getElementById('glareLayerWarm');
    if (!hero || !glare || !glareWarm) return;

    hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        glare.style.opacity = '1';
        glare.style.background =
            'radial-gradient(600px circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.07) 0%, transparent 50%)';

        glareWarm.style.opacity = '1';
        glareWarm.style.background =
            'radial-gradient(400px circle at ' + x + 'px ' + y + 'px, rgba(246,181,0,0.1) 0%, transparent 50%)';
    });

    hero.addEventListener('mouseleave', function () {
        glare.style.opacity = '0';
        glareWarm.style.opacity = '0';
    });
})();

/* ── 6. Scroll Reveal (IntersectionObserver) ── */
(function () {
    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // After animation ends, clear it so JS tilt transform can take over
                    if (entry.target.classList.contains('tilt-card')) {
                        entry.target.addEventListener('animationend', function () {
                            this.style.animation = 'none';
                            this.style.opacity = '1';
                            this.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
                        }, { once: true });
                    }
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.anim-up').forEach(function (el) {
        observer.observe(el);
    });
})();

/* ── 7. Smooth Scroll for Anchor Links ── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ── 8. Navbar Scroll Effect ── */
(function () {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.borderBottomColor = 'rgba(46,43,38,0.8)';
            navbar.style.backgroundColor = 'rgba(19,18,16,0.95)';
        } else {
            navbar.style.borderBottomColor = '';
            navbar.style.backgroundColor = '';
        }
    });
})();

/* ── 9. Form Submission (FormSubmit.co with built-in captcha) ── */
(function () {
    var form = document.getElementById('waitlistForm');
    var formMessage = document.getElementById('formMessage');
    var submitBtn = document.getElementById('submitBtn');
    if (!form) return;

    form.addEventListener('submit', function () {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        formMessage.textContent = 'Submitting your request...';
        formMessage.className = 'form-message';
        sessionStorage.setItem('formSubmitted', 'true');
    });

    var submitted = sessionStorage.getItem('formSubmitted');
    if (submitted && window.location.hash === '#waitlist') {
        formMessage.textContent = "Thank you for joining the waitlist! We'll be in touch soon.";
        formMessage.className = 'form-message success';
        form.reset();
        sessionStorage.removeItem('formSubmitted');
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
})();
