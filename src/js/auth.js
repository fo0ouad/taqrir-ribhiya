// كلمة المرور الافتراضية للوحة التحكم
const SECURE_PASSWORD = "Family@2026";
const AUTH_KEY = "taqrir_family_auth_state";
const AUTH_VAL = "authenticated_2026_granted";

/**
 * التحقق مما إذا كان المستخدم مسجلاً دخوله بالفعل
 * @returns {boolean}
 */
export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === AUTH_VAL;
}

/**
 * محاولة تسجيل الدخول عبر مطابقة كلمة المرور
 * @param {string} password - كلمة المرور المدخلة
 * @returns {boolean}
 */
export function login(password) {
  if (password === SECURE_PASSWORD) {
    localStorage.setItem(AUTH_KEY, AUTH_VAL);
    return true;
  }
  return false;
}

/**
 * تسجيل الخروج وإزالة حالة التحقق
 */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.reload();
}

/**
 * تهيئة وإدارة شاشة الدخول في الواجهة
 * @param {Function} onSuccessCallback - الدالة التي سيتم تشغيلها عند نجاح الدخول
 */
export function initAuth(onSuccessCallback) {
  const authOverlay = document.getElementById("authOverlay");
  const dashboardContainer = document.getElementById("dashboardContainer");
  const authForm = document.getElementById("authForm");
  const passwordInput = document.getElementById("passwordInput");
  const authError = document.getElementById("authError");

  // دالة لتخطي شاشة الدخول وإظهار المحتوى
  function grantAccess() {
    authOverlay.classList.add("hidden");
    dashboardContainer.classList.remove("app-blurred");
    if (typeof onSuccessCallback === "function") {
      onSuccessCallback();
    }
  }

  // التحقق من حالة الدخول السابقة عند فتح الصفحة
  if (isAuthenticated()) {
    grantAccess();
  } else {
    // تشويش لوحة البيانات وعرض شاشة الدخول
    dashboardContainer.classList.add("app-blurred");
    authOverlay.classList.remove("hidden");
    passwordInput.focus();
  }

  // معالجة إرسال النموذج (الضغط على زر الدخول أو Enter)
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputPassword = passwordInput.value.trim();

    if (login(inputPassword)) {
      authError.classList.remove("visible");
      grantAccess();
    } else {
      // إظهار تنبيه الخطأ وعمل اهتزاز بصري خفيف
      authError.textContent = "⚠️ كلمة المرور خاطئة، يرجى المحاولة مرة أخرى.";
      authError.classList.add("visible");
      passwordInput.value = "";
      passwordInput.focus();

      // إحداث هزة خفيفة لكارد الدخول للتنبيه
      const card = document.querySelector(".auth-card");
      card.style.transform = "translateX(10px)";
      setTimeout(() => card.style.transform = "translateX(-10px)", 100);
      setTimeout(() => card.style.transform = "translateX(0)", 200);
    }
  });
}
