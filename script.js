// Ultra-optimized JS for Back Redirect Landing Page

// === CONFIGURATION ===
const CHECKOUT_URL = '{{COLE_AQUI_O_LINK_DO_CHECKOUT}}';
const PRICES = {
    old: 'R$ 24,90',
    pix: 'R$ 22,41',
    final: 'R$ 19,90'
};
const TIMER_SECONDS = 445; // 7:25

// === INIT ===
let timeLeft = TIMER_SECONDS;
let interval;

document.addEventListener('DOMContentLoaded', () => {
    // Set prices
    document.getElementById('price-old').textContent = PRICES.old;
    document.getElementById('price-pix').textContent = PRICES.pix;
    document.getElementById('price-final').textContent = PRICES.final;

    // Start timer
    startTimer();

    // CTA click handler
    document.getElementById('btn').addEventListener('click', () => {
        if (timeLeft > 0) {
            window.location.href = buildCheckoutURL(CHECKOUT_URL);
        }
    });
});

// === TIMER ===
function startTimer() {
    const saved = localStorage.getItem('backRedirectEnd');
    const now = Date.now();

    if (saved && parseInt(saved) > now) {
        timeLeft = Math.floor((parseInt(saved) - now) / 1000);
    } else {
        const end = now + (TIMER_SECONDS * 1000);
        localStorage.setItem('backRedirectEnd', end);
        timeLeft = TIMER_SECONDS;
    }

    updateDisplay();

    interval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(interval);
            handleExpired();
        }
        updateDisplay();
    }, 1000);
}

function updateDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    const display = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    const timer = document.getElementById('timer');
    timer.textContent = display;

    if (timeLeft <= 60 && timeLeft > 0) {
        timer.style.color = '#ff3366';
    }
}

function handleExpired() {
    const timer = document.getElementById('timer');
    const btn = document.getElementById('btn');
    const expired = document.getElementById('expired');
    const btnSecondary = document.getElementById('btn-secondary');

    timer.classList.add('expired');
    timer.textContent = '00:00';
    btn.disabled = true;
    btn.textContent = 'Oferta expirada';
    expired.style.display = 'block';
    btnSecondary.href = buildCheckoutURL(CHECKOUT_URL);

    localStorage.removeItem('backRedirectEnd');
}

// === UTM HANDLER ===
function buildCheckoutURL(base) {
    try {
        const url = new URL(base);
        const params = new URLSearchParams(window.location.search);

        for (const [key, value] of params.entries()) {
            if (!url.searchParams.has(key)) {
                url.searchParams.set(key, value);
            }
        }

        return url.toString();
    } catch {
        return base;
    }
}

// Prevent accidental close
window.addEventListener('beforeunload', (e) => {
    if (timeLeft > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});
