import { logout } from './auth';

/**
 * تهيئة التفاعلات في واجهة المستخدم (التبويبات، تسجيل الخروج، إلخ)
 */
export function initUi() {
  const tabs = document.querySelectorAll('.nav-tab');
  const contents = document.querySelectorAll('.tab-content');

  // ربط أحداث النقر للتبويبات ديناميكياً لتجنب onclick المباشر في HTML
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetTabId = tab.getAttribute('data-tab');
      if (!targetTabId) return;

      // إزالة الحالة النشطة من كل التبويبات والمحتويات
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // تفعيل التبويب المختار
      tab.classList.add('active');
      const targetContent = document.getElementById(`tab-${targetTabId}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // إضافة زر تسجيل الخروج ديناميكياً في الهيدر إذا لم يكن موجوداً
  setupLogoutButton();
}

/**
 * إعداد زر تسجيل الخروج لزيادة الأمان وقفل لوحة التحكم عند الحاجة
 */
function setupLogoutButton() {
  const header = document.querySelector('.header');
  if (!header) return;

  // التحقق من عدم وجود الزر مسبقاً
  if (document.getElementById('logoutBtn')) return;

  const logoutBtn = document.createElement('button');
  logoutBtn.id = 'logoutBtn';
  logoutBtn.textContent = '🔒 قفل التقرير';
  logoutBtn.style.cssText = `
    position: absolute;
    top: 24px;
    left: 24px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    transition: all 0.2s ease;
  `;

  logoutBtn.addEventListener('mouseenter', () => {
    logoutBtn.style.background = 'rgba(239, 68, 68, 0.2)';
    logoutBtn.style.borderColor = 'rgba(239, 68, 68, 0.4)';
  });

  logoutBtn.addEventListener('mouseleave', () => {
    logoutBtn.style.background = 'rgba(255, 255, 255, 0.12)';
    logoutBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
  });

  logoutBtn.addEventListener('click', () => {
    if (confirm('هل ترغب في قفل لوحة التحكم وتسجيل الخروج؟')) {
      logout();
    }
  });

  header.appendChild(logoutBtn);
}
