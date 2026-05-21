/* ═══════════════════════════════════════════════
   APP VERSION
   - 1.0 = 2026-05-04 정식 출시
   - 이후 버그 수정/소소한 개선: 1.001, 1.002, ...
   - 큰 기능 추가: 1.1, 1.2, ...
   - 메이저 업데이트: 2.0
═══════════════════════════════════════════════ */

const APP_VERSION = '1.215-NOTHUMB';
const APP_VERSION_DATE = '2026-05-21';

// 버전 표시 갱신 함수
function applyAppVersion() {
  const el = document.getElementById('appVersion');
  if (el) {
    el.textContent = `v${APP_VERSION}`;
    el.style.color = '#ff9a3c';
    el.style.fontWeight = '700';
    el.title = '테스트 버전: 썸네일 생성 비활성화';
  }
  // 시작 시 한 번 토스트로 알림 (어떤 버전인지 명확히 보이게)
  setTimeout(() => {
    if (typeof showToast === 'function') {
      showToast('⚠️ 테스트 버전: 썸네일 OFF', 'ok');
    }
  }, 800);
}

if (typeof window !== 'undefined') {
  window.APP_VERSION = APP_VERSION;
  window.APP_VERSION_DATE = APP_VERSION_DATE;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAppVersion);
  } else {
    applyAppVersion();
  }
}
