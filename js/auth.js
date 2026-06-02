// ===== auth.js =====
// إدارة تسجيل الدخول والخروج

function checkAuth() {
  const auth = localStorage.getItem('dashboard_auth');
  const expiry = localStorage.getItem('dashboard_auth_expiry');
  
  if (!auth || auth !== 'true' || !expiry || new Date() >= new Date(expiry)) {
    // غير مسجل دخوله — انتقل لصفحة الدخول
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem('dashboard_auth');
  localStorage.removeItem('dashboard_auth_expiry');
  window.location.href = 'login.html';
}

// تحقق عند تحميل أي صفحة محمية
checkAuth();
