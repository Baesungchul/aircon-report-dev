/* ═══════════════════════════════════════════════
   온보딩 (첫 실행 시 기본 세팅 안내)
═══════════════════════════════════════════════ */

const ONBOARDING_DONE_KEY = 'ac_onboarding_done_v1';
let _obStep = 1;
let _obData = { coName: '', coTel: '', coIcon: '❄️', folderSet: false };

function safeGetItem(key) {
  try { return localStorage.getItem(key); } catch(e) {}
  try { return sessionStorage.getItem(key); } catch(e) {}
  return null;
}
function safeSetItem(key, val) {
  try { localStorage.setItem(key, val); return; } catch(e) {}
  try { sessionStorage.setItem(key, val); } catch(e) {}
}

function getSlides() {
  return [
    { id: 'intro',   render: renderSlideIntro },
    { id: 's1',      render: renderSlideScreen1 },
    { id: 's2',      render: renderSlideScreen2 },
    { id: 's3',      render: renderSlideScreen3 },
    { id: 's4',      render: renderSlideScreen4 },
    { id: 's5',      render: renderSlideScreen5 },
    { id: 's6',      render: renderSlideScreen6 },
    { id: 'setup',   render: renderSlideSetup },
  ];
}

function showOnboarding() {
  _obStep = 1;
  _obData = { coName: '', coTel: '', coIcon: '❄️', folderSet: false };
  const modal = document.getElementById('onboardingModal');
  if (!modal) return;
  modal.classList.add('open');
  renderOnboardingStep();
}
function hideOnboarding() { document.getElementById('onboardingModal').classList.remove('open'); }
function closeOnboarding(completed) {
  if (completed) safeSetItem(ONBOARDING_DONE_KEY, '1');
  hideOnboarding();
}

function renderOnboardingStep() {
  const slides = getSlides();
  const total  = slides.length;
  const content     = document.getElementById('obContent');
  const counter     = document.getElementById('obStepCounter');
  const progressBar = document.getElementById('obProgressBar');
  const prevBtn     = document.getElementById('obPrev');
  const nextBtn     = document.getElementById('obNext');
  if (!content) {
    console.warn('[온보딩] obContent를 찾을 수 없음');
    return;
  }

  // ★ 이전 inline 스타일 모두 초기화 (이전 애니메이션 잔재 제거)
  content.style.cssText = '';

  if (counter)     counter.textContent = `${_obStep} / ${total}`;
  if (progressBar) progressBar.style.width = `${(_obStep / total) * 100}%`;
  if (prevBtn)     prevBtn.style.display = _obStep > 1 ? 'inline-flex' : 'none';
  if (nextBtn) {
    nextBtn.textContent = _obStep === total ? '시작하기 🚀' : '다음 →';
    nextBtn.className   = _obStep === total ? 'btn b-green' : 'btn b-blue';
  }

  try {
    slides[_obStep - 1].render(content);
    console.log(`[온보딩] 슬라이드 ${_obStep}/${total} 렌더 완료`);
  } catch(e) {
    console.error('[온보딩] 렌더 실패:', e);
    content.innerHTML = `<div style="padding:20px;text-align:center;color:var(--tx);">
      <div style="font-size:14px;font-weight:700;margin-bottom:8px;">화면 표시 오류</div>
      <div style="font-size:11px;color:var(--mu);">${e.message}</div>
    </div>`;
  }
}

function onboardingNext() {
  const total = getSlides().length;
  if (_obStep === total) { applyOnboardingSettings(); closeOnboarding(true); return; }
  _obStep++; renderOnboardingStep();
}
function onboardingPrev() { if (_obStep > 1) { _obStep--; renderOnboardingStep(); } }

function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function badge(n) { return `<span class="ob-badge">${n}</span>`; }
function callout(n, text) {
  return `<div class="ob-callout"><span class="ob-callout-num">${n}</span><span class="ob-callout-txt">${text}</span></div>`;
}


/* ── 슬라이드 1: 소개 ── */
function renderSlideIntro(c) {
  c.innerHTML = `
  <div class="ob-slide ob-slide-intro">
    <div class="ob-intro-icon">❄️</div>
    <h2 class="ob-intro-title">에어컨 보고서 작성기</h2>
    <p class="ob-intro-sub">현장 사진을 전문 보고서로<br>고객 관리까지 한번에</p>
    <div class="ob-intro-feats">
      <div class="ob-feat"><span>📸</span><div><b>작업 전·후 사진 정리</b><br><small>호수별로 체계적 관리</small></div></div>
      <div class="ob-feat"><span>📄</span><div><b>PDF · JPG 보고서</b><br><small>전문 보고서 즉시 출력</small></div></div>
      <div class="ob-feat"><span>👥</span><div><b>고객 자동 관리</b><br><small>전화번호로 이력 추적</small></div></div>
      <div class="ob-feat"><span>💾</span><div><b>자동 저장·백업</b><br><small>내 폴더에 안전 보관</small></div></div>
    </div>
    <div class="ob-intro-hint">👉 6장의 화면으로 사용법을 안내해드려요</div>
  </div>`;
}

/* ── 슬라이드 2: 메인 화면 구성 (실제 캡쳐 + 번호 오버레이) ── */
function renderSlideScreen1(c) {
  c.innerHTML = `
  <div class="ob-slide">
    <div class="ob-slide-ttl">① 메인 화면 구성</div>
    <div class="ob-img-wrap">
      <img src="./assets/onboarding/screen1.jpeg" alt="메인 화면">
      <!-- ① 작업 정보 입력 -->
      <div class="ob-zone" style="top:10.4%;left:3%;width:94%;height:14.1%;"></div>
      <div class="ob-pin" style="top:10.4%;left:6%;">1</div>
      <!-- ② 작업 유형 선택 -->
      <div class="ob-zone" style="top:25.3%;left:3%;width:94%;height:11.1%;"></div>
      <div class="ob-pin" style="top:25.3%;left:6%;">2</div>
      <!-- ③ 주요 버튼 -->
      <div class="ob-zone" style="top:37.1%;left:3%;width:94%;height:8.9%;"></div>
      <div class="ob-pin" style="top:37.1%;left:6%;">3</div>
      <!-- ④ 호수 관리 -->
      <div class="ob-zone" style="top:49%;left:3%;width:94%;height:18.6%;"></div>
      <div class="ob-pin" style="top:49%;left:6%;">4</div>
    </div>
    <div class="ob-callouts">
      ${callout(1,'작업명·작업일자·담당자를 입력해요')}
      ${callout(2,'가정용(호수별 다른 고객) 또는 공용시설(전체가 한 고객) 선택')}
      ${callout(3,'⚙️설정 · 🆕새작업 · 💾저장 · 📄보고서 버튼')}
      ${callout(4,'호수 추가(개별·일괄·🗑️삭제) · 검색 · 전체 펼치기/접기')}
    </div>
  </div>`;
}

/* ── 슬라이드 3: 호수 추가 / 카드 구성 (실제 캡쳐 + 번호 오버레이) ── */
function renderSlideScreen2(c) {
  c.innerHTML = `
  <div class="ob-slide">
    <div class="ob-slide-ttl">② 호수 추가 · 카드 구성</div>
    <div class="ob-img-wrap">
      <img src="./assets/onboarding/screen2_card.jpg" alt="호수 카드">
      <!-- ① 호수명 + 완료/순서편집/삭제 -->
      <div class="ob-zone" style="top:1%;left:3%;width:94%;height:22%;"></div>
      <div class="ob-pin" style="top:1%;left:6%;">1</div>
      <!-- ② 작업 전/후 라벨 + 카메라/파일 버튼 -->
      <div class="ob-zone" style="top:25%;left:3%;width:94%;height:24%;"></div>
      <div class="ob-pin" style="top:25%;left:6%;">2</div>
      <!-- ③ 사진 썸네일 -->
      <div class="ob-zone" style="top:50%;left:3%;width:94%;height:33%;"></div>
      <div class="ob-pin" style="top:50%;left:6%;">3</div>
      <!-- ④ 특이사항 -->
      <div class="ob-zone" style="top:87%;left:3%;width:94%;height:12%;"></div>
      <div class="ob-pin" style="top:87%;left:6%;">4</div>
    </div>
    <div class="ob-callouts">
      ${callout(1,'호수명 ✏️ 수정 · ✅완료 · 🔄순서편집 · 🗑️삭제')}
      ${callout(2,'작업 전(🔴) / 작업 후(🟢) 각각 📷카메라 또는 📁파일로 사진 추가')}
      ${callout(3,'사진 썸네일 — ✓완료 · ✗삭제 · ⬇️다운로드(원본 받기)')}
      ${callout(4,'⚠️ 특이사항 추가 (사진+메모로 기록)')}
    </div>
  </div>`;
}

/* ── 슬라이드 4: 사진 정렬 · 순서 편집 (실제 캡쳐 + 번호 오버레이) ── */
function renderSlideScreen3(c) {
  c.innerHTML = `
  <div class="ob-slide">
    <div class="ob-slide-ttl">③ 사진 정렬 · 순서 편집</div>
    <div class="ob-img-wrap">
      <img src="./assets/onboarding/screen3_reorder.jpg" alt="사진 순서 편집">
      <!-- ① 헤더 -->
      <div class="ob-zone" style="top:0%;left:3%;width:94%;height:9%;"></div>
      <div class="ob-pin" style="top:3%;left:7%;">1</div>
      <!-- ② 안내문 -->
      <div class="ob-zone" style="top:11%;left:3%;width:94%;height:10%;"></div>
      <div class="ob-pin" style="top:14%;left:7%;">2</div>
      <!-- ③ 사진 정렬 영역 (좌: 작업 전, 우: 작업 후) -->
      <div class="ob-zone" style="top:23%;left:3%;width:94%;height:62%;"></div>
      <div class="ob-pin" style="top:26%;left:7%;">3</div>
      <!-- ④ 취소/저장 버튼 -->
      <div class="ob-zone" style="top:87%;left:50%;width:47%;height:12%;"></div>
      <div class="ob-pin" style="top:90%;left:54%;">4</div>
    </div>
    <div class="ob-callouts">
      ${callout(1,'호수의 🔄순서편집 버튼을 누르면 이 화면이 열려요')}
      ${callout(2,'≡ 핸들을 드래그해서 순서 변경 · 사진을 탭하면 크게 보기')}
      ${callout(3,'좌측 작업 전(🔴) / 우측 작업 후(🟢) — 같은 번호끼리 보고서에서 짝이 됨 (전1↔후1)')}
      ${callout(4,'저장하면 새 순서가 적용 · 취소하면 원래 순서 유지')}
    </div>
  </div>`;
}

/* ── 슬라이드 5: 작업 기록 (실제 캡쳐 + 번호 오버레이) ── */
function renderSlideScreen4(c) {
  c.innerHTML = `
  <div class="ob-slide">
    <div class="ob-slide-ttl">④ 작업 기록 · 고객 관리</div>
    <div class="ob-img-wrap">
      <img src="./assets/onboarding/screen5_records.jpg" alt="작업 기록">
      <!-- ① 통계 패널 -->
      <div class="ob-zone" style="top:4%;left:3%;width:94%;height:16%;"></div>
      <div class="ob-pin" style="top:7%;left:7%;">1</div>
      <!-- ② 기간 필터 -->
      <div class="ob-zone" style="top:20%;left:3%;width:94%;height:12%;"></div>
      <div class="ob-pin" style="top:23%;left:7%;">2</div>
      <!-- ③ 검색 + 작업 카드 목록 -->
      <div class="ob-zone" style="top:35%;left:3%;width:94%;height:55%;"></div>
      <div class="ob-pin" style="top:38%;left:7%;">3</div>
      <!-- ④ 하단 버튼 (엑셀 파일 위치) -->
      <div class="ob-zone" style="top:92%;left:38%;width:60%;height:6%;"></div>
      <div class="ob-pin" style="top:95%;left:42%;">4</div>
    </div>
    <div class="ob-callouts">
      ${callout(1,'전체 고객 수 · 재작업 건수 · 최근 30일 작업 통계')}
      ${callout(2,'기간 변경 / 최근 3·7·30일로 빠르게 좁히기 (전체 X건 표시)')}
      ${callout(3,'카드 탭 또는 📂열기로 작업 불러오기 · ✏️정보 수정 · 🗑️삭제')}
      ${callout(4,'고객 데이터 엑셀 파일 위치 확인 (Excel·구글 시트로 열어보기)')}
    </div>
  </div>`;
}

/* ── 슬라이드 6: 보고서 출력 (실제 캡쳐 + 번호 오버레이) ── */
function renderSlideScreen5(c) {
  c.innerHTML = `
  <div class="ob-slide">
    <div class="ob-slide-ttl">⑤ 보고서 출력 · 공유</div>
    <div class="ob-img-wrap">
      <img src="./assets/onboarding/screen4_report.jpg" alt="보고서 미리보기">
      <!-- ① 상단 툴바 -->
      <div class="ob-zone" style="top:0%;left:1%;width:98%;height:9%;"></div>
      <div class="ob-pin" style="top:3%;left:5%;">1</div>
      <!-- ② 표지 본문 -->
      <div class="ob-zone" style="top:14%;left:5%;width:90%;height:41%;"></div>
      <div class="ob-pin" style="top:17%;left:9%;">2</div>
      <!-- ③ 통계 + 작업 상세 목록 -->
      <div class="ob-zone" style="top:57%;left:5%;width:90%;height:25%;"></div>
      <div class="ob-pin" style="top:60%;left:9%;">3</div>
    </div>
    <div class="ob-callouts">
      ${callout(1,'📄보고서 / ➖➕ 줌 / ⬇️PDF · 🖼️JPG 저장 / ❌ 닫기')}
      ${callout(2,'표지: 회사 정보 · 작업 현장 · 작업일 · 담당자 · 완료 비율')}
      ${callout(3,'통계 요약 + 호수별 작업 상세 목록 (총 사진/완료/특이사항)')}
      ${callout(4,'각 호수별 페이지엔 작업 전·후 사진이 짝지어 출력 (좌:전 / 우:후)')}
    </div>
  </div>`;
}

/* ── 슬라이드 7: ⚙️ 설정 (실제 캡쳐 + 번호 오버레이) ── */
function renderSlideScreen6(c) {
  c.innerHTML = `
  <div class="ob-slide">
    <div class="ob-slide-ttl">⑥ ⚙️ 설정</div>
    <div class="ob-img-wrap">
      <img src="./assets/onboarding/screen6_settings.jpg" alt="설정 화면">
      <!-- ① 업체 정보 -->
      <div class="ob-zone" style="top:3%;left:2%;width:96%;height:16%;"></div>
      <div class="ob-pin" style="top:6%;left:6%;">1</div>
      <!-- ② 도구 모음 -->
      <div class="ob-zone" style="top:20%;left:2%;width:96%;height:17%;"></div>
      <div class="ob-pin" style="top:23%;left:6%;">2</div>
      <!-- ③ 자동저장 폴더 -->
      <div class="ob-zone" style="top:38%;left:2%;width:96%;height:17%;"></div>
      <div class="ob-pin" style="top:41%;left:6%;">3</div>
      <!-- ④ 외관 (테마/글자크기/언어) -->
      <div class="ob-zone" style="top:55%;left:2%;width:96%;height:40%;"></div>
      <div class="ob-pin" style="top:58%;left:6%;">4</div>
    </div>
    <div class="ob-callouts">
      ${callout(1,'업체명·연락처·사업자번호 등 보고서에 표시될 정보 수정')}
      ${callout(2,'초기 설정 다시 / 캐시 초기화(버튼 안 먹힐 때) / 작업기록 재생성 / 홈 화면에 앱 설치')}
      ${callout(3,'자동저장 폴더 위치 확인 · 변경 · 해제 (사진과 작업 데이터 자동 저장)')}
      ${callout(4,'테마(다크/라이트) · 보고서 디자인 · 글자 크기 · 언어 선택')}
    </div>
  </div>`;
}

/* ── 슬라이드 7: 세팅 ── */
function renderSlideSetup(c) {
  const hasFolder = (typeof photoFolderHandle !== 'undefined' && photoFolderHandle);
  c.innerHTML = `
  <div class="ob-slide">
    <div class="ob-slide-ttl">⑦ 업체 정보 설정</div>
    <p class="ob-setup-sub">보고서에 표시될 정보를 입력해요<br><small style="color:var(--mu);">⚙️설정에서 언제든 변경 가능</small></p>
    <div class="ob-setup-form">
      <div class="ob-setup-icons">
        <button class="ob-icon-opt" data-ic="❄️">❄️</button>
        <button class="ob-icon-opt" data-ic="🔧">🔧</button>
        <button class="ob-icon-opt" data-ic="🏠">🏠</button>
        <button class="ob-icon-opt" data-ic="🧼">🧼</button>
        <button class="ob-icon-opt" data-ic="⚡">⚡</button>
        <button class="ob-icon-opt" data-ic="🛠️">🛠️</button>
        <button class="ob-icon-opt" data-ic="🎨">🎨</button>
        <button class="ob-icon-opt" data-ic="🚗">🚗</button>
      </div>
      <label class="ob-setup-label">업체명 <span style="color:var(--dn);">*</span></label>
      <input class="ob-setup-input" id="obCoName" type="text" placeholder="예: 평택에어컨1004" value="">
      <label class="ob-setup-label">대표 연락처</label>
      <input class="ob-setup-input" id="obCoTel" type="text" inputmode="tel" placeholder="010-1234-5678" value="">
      <label class="ob-setup-label">저장 폴더 <span style="color:var(--mu);font-size:11px;">(사진·데이터 자동 저장)</span></label>
      <button class="btn ${hasFolder ? 'b-green' : 'b-blue'}" id="obSelectFolder"
        style="width:100%;justify-content:center;padding:10px;">
        ${hasFolder ? `✅ ${escHtml(photoFolderHandle.name)}` : '📁 저장 폴더 선택하기'}
      </button>
    </div>
  </div>`;

  document.querySelectorAll('.ob-icon-opt').forEach(btn => {
    if (btn.dataset.ic === _obData.coIcon) btn.classList.add('selected');
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ob-icon-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      _obData.coIcon = btn.dataset.ic;
    });
  });

  const nameEl = document.getElementById('obCoName');
  const telEl  = document.getElementById('obCoTel');
  if (nameEl) { nameEl.value = _obData.coName || ''; nameEl.addEventListener('input', e => { _obData.coName = e.target.value; }); }
  if (telEl)  { telEl.value  = _obData.coTel  || ''; telEl.addEventListener('input', e => {
    const raw = e.target.value.replace(/[^\d]/g,'');
    if (raw.length===11) e.target.value=`${raw.slice(0,3)}-${raw.slice(3,7)}-${raw.slice(7)}`;
    else if (raw.length===10) e.target.value=`${raw.slice(0,3)}-${raw.slice(3,6)}-${raw.slice(6)}`;
    _obData.coTel = e.target.value;
  }); }

  const folderBtn = document.getElementById('obSelectFolder');
  if (folderBtn && 'showDirectoryPicker' in window) {
    folderBtn.addEventListener('click', async () => {
      try {
        if (typeof selectPhotoFolder === 'function') await selectPhotoFolder();
        if (photoFolderHandle) {
          folderBtn.textContent = `✅ ${escHtml(photoFolderHandle.name)}`;
          folderBtn.className = 'btn b-green';
          folderBtn.style.cssText = 'width:100%;justify-content:center;padding:10px;';
          _obData.folderSet = true;
        }
      } catch(e) {}
    });
  }
}

/* ── 설정 적용 ── */
// CO_KEY, CO_ICON_KEY는 state.js에서 이미 선언됨 (중복 선언 금지!)
// const CO_KEY, const CO_ICON_KEY 사용

async function applyOnboardingSettings() {
  try {
    const ci = JSON.parse(safeGetItem(CO_KEY) || '{}');
    if (_obData.coName) ci.coName = _obData.coName;
    if (_obData.coTel)  ci.coTel  = _obData.coTel;
    if (_obData.coIcon) { ci.coIcon = _obData.coIcon; safeSetItem(CO_ICON_KEY, _obData.coIcon); }
    safeSetItem(CO_KEY, JSON.stringify(ci));
    const coNameEl = document.getElementById('coName');
    const coTelEl  = document.getElementById('coTel');
    if (coNameEl && _obData.coName) coNameEl.value = _obData.coName;
    if (coTelEl  && _obData.coTel)  coTelEl.value  = _obData.coTel;
    if (_obData.coIcon) {
      const el = document.getElementById('logoIcon');
      if (el) el.textContent = _obData.coIcon;
    }
  } catch(e) {}
}

/* ── 체크 + 이벤트 ── */
function checkAndStartOnboarding() {
  const done = safeGetItem(ONBOARDING_DONE_KEY);
  console.log('[온보딩] DONE_KEY 값:', done);
  if (done === '1') {
    console.log('[온보딩] 이미 완료됨 - 스킵');
    return;
  }
  console.log('[온보딩] 시작 예약 (300ms 후)');
  setTimeout(() => {
    console.log('[온보딩] 시작!');
    showOnboarding();
  }, 300);
}

function bindOnboardingEvents() {
  console.log('[온보딩] bindOnboardingEvents 호출');
  const next = document.getElementById('obNext');
  const prev = document.getElementById('obPrev');
  const skip = document.getElementById('obSkip');
  console.log('[온보딩] 버튼 존재 여부:', { next: !!next, prev: !!prev, skip: !!skip });

  next?.addEventListener('click', onboardingNext);
  prev?.addEventListener('click', onboardingPrev);
  skip?.addEventListener('click', () => closeOnboarding(true));
}

// ★ 전역으로 노출 (HTML onclick에서 호출)
window.replayOnboarding = function() {
  document.getElementById('settingsModal')?.classList.remove('open');
  try {
    const ci = JSON.parse(safeGetItem(CO_KEY) || '{}');
    _obData.coName = ci.coName || '';
    _obData.coTel  = ci.coTel  || '';
    _obData.coIcon = safeGetItem(CO_ICON_KEY) || '❄️';
    _obData.folderSet = !!(typeof photoFolderHandle !== 'undefined' && photoFolderHandle);
  } catch(e) {}
  _obStep = 1;
  showOnboarding();
};

// ★ showOnboarding도 전역 노출 (디버깅용 - 콘솔에서 호출 가능)
window.showOnboarding = showOnboarding;
window.checkOnboardingState = function() {
  console.log('DONE_KEY:', safeGetItem(ONBOARDING_DONE_KEY));
  console.log('모달 요소:', !!document.getElementById('onboardingModal'));
  console.log('모달 클래스:', document.getElementById('onboardingModal')?.className);
};

function _initOnboarding() {
  console.log('[온보딩] _initOnboarding 호출');
  bindOnboardingEvents();
  checkAndStartOnboarding();
}

if (document.readyState === 'loading') {
  console.log('[온보딩] DOMContentLoaded 대기');
  document.addEventListener('DOMContentLoaded', _initOnboarding);
} else {
  console.log('[온보딩] 즉시 초기화 (readyState:', document.readyState, ')');
  _initOnboarding();
}
