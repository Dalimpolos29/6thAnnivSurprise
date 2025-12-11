/* =============================================
   DEN & ANNA - Main Application
   ============================================= */

// =============================================
// PWA Service Worker Registration
// =============================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              showUpdateNotification();
            }
          });
        });
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

function showUpdateNotification() {
  if (confirm('A new version is available! Reload to update?')) {
    window.location.reload();
  }
}

// =============================================
// App Initialization
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Supabase
  initSupabase();

  // Check authentication for protected pages
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const protectedPages = ['home.html', 'chat.html', 'gallery.html'];

  if (protectedPages.includes(currentPage) && !isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  // Initialize page-specific features
  initCurrentPage(currentPage);

  // Initialize common features
  initTheme();
  initToasts();
  initFloatingHearts();

  // Update online status
  if (isLoggedIn()) {
    updateOnlineStatus(true);
  }
});

// =============================================
// Page Initialization
// =============================================

function initCurrentPage(page) {
  switch (page) {
    case 'index.html':
    case '':
      initLoginPage();
      break;
    case 'home.html':
      initHomePage();
      break;
    case 'chat.html':
      initChatPage();
      break;
    case 'gallery.html':
      initGalleryPage();
      break;
  }
}

// =============================================
// Anniversary Counter
// =============================================

function calculateTimeTogether() {
  const now = new Date();
  const anniversary = APP_CONFIG.anniversaryDate;

  let years = now.getFullYear() - anniversary.getFullYear();
  let months = now.getMonth() - anniversary.getMonth();
  let days = now.getDate() - anniversary.getDate();

  // Adjust for negative days
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  // Calculate total days
  const totalDays = Math.floor((now - anniversary) / (1000 * 60 * 60 * 24));

  // Calculate hours, minutes, seconds for detailed view
  const totalMs = now - anniversary;
  const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(totalMs / (1000 * 60));
  const totalSeconds = Math.floor(totalMs / 1000);

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds
  };
}

function updateCounter() {
  const time = calculateTimeTogether();

  // Update counter elements if they exist
  const elements = {
    years: document.getElementById('counter-years'),
    months: document.getElementById('counter-months'),
    days: document.getElementById('counter-days'),
    totalDays: document.getElementById('counter-total-days')
  };

  if (elements.years) {
    animateCounterValue(elements.years, time.years);
  }
  if (elements.months) {
    animateCounterValue(elements.months, time.months);
  }
  if (elements.days) {
    animateCounterValue(elements.days, time.days);
  }
  if (elements.totalDays) {
    animateCounterValue(elements.totalDays, time.totalDays);
  }
}

function animateCounterValue(element, newValue) {
  const currentValue = parseInt(element.textContent) || 0;
  if (currentValue !== newValue) {
    element.textContent = newValue;
    element.classList.add('counter-animate');
    setTimeout(() => element.classList.remove('counter-animate'), 500);
  }
}

// =============================================
// Theme Management
// =============================================

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // Animate theme toggle
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

// =============================================
// Toast Notifications
// =============================================

let toastContainer = null;

function initToasts() {
  if (!document.querySelector('.toast-container')) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  } else {
    toastContainer = document.querySelector('.toast-container');
  }
}

function showToast(message, type = 'info', duration = 3000) {
  if (!toastContainer) initToasts();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${getToastIcon(type)}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function getToastIcon(type) {
  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  return icons[type] || icons.info;
}

// =============================================
// Floating Hearts Animation
// =============================================

function initFloatingHearts() {
  const container = document.querySelector('.particles-container');
  if (!container) return;

  const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '✨', '🌸'];
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    createHeart(container, hearts);
  }
}

function createHeart(container, hearts) {
  const heart = document.createElement('span');
  heart.className = 'particle';
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

  // Random position and timing
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDelay = `${Math.random() * 15}s`;
  heart.style.animationDuration = `${15 + Math.random() * 10}s`;
  heart.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;

  container.appendChild(heart);
}

// =============================================
// Utility Functions
// =============================================

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const dayMs = 24 * 60 * 60 * 1000;

  if (diff < dayMs) {
    return 'Today';
  } else if (diff < 2 * dayMs) {
    return 'Yesterday';
  } else {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

function formatRelativeTime(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return formatDate(date);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// =============================================
// Navigation
// =============================================

function navigateTo(page) {
  // Add exit animation
  document.body.classList.add('page-exit-active');

  setTimeout(() => {
    window.location.href = page;
  }, 300);
}

// =============================================
// Export utilities
// =============================================

window.calculateTimeTogether = calculateTimeTogether;
window.updateCounter = updateCounter;
window.toggleTheme = toggleTheme;
window.showToast = showToast;
window.formatTime = formatTime;
window.formatDate = formatDate;
window.formatRelativeTime = formatRelativeTime;
window.debounce = debounce;
window.throttle = throttle;
window.navigateTo = navigateTo;
