/**
 * IT 동아리 홈페이지 메인 자바스크립트 (최적화)
 */

// 전역 변수와 캐시
let introButtonPressed = false;
const isMobile = isMobileDevice();
const documentBody = document.body;

/**
 * 모바일 환경 감지 함수
 * @returns {boolean} 모바일 기기 여부
 */
function isMobileDevice() {
  return (window.innerWidth <= 700 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

/**
 * 커스텀 알림창 함수
 * @param {string} message - 표시할 메시지 내용
 * @param {function|null} callback - 알림창이 닫힌 후 실행할 콜백 함수 (선택적)
 */
function showCustomAlert(message, callback = null) {
  // 이미 알림창이 있다면 제거
  const existingAlert = document.querySelector('.custom-alert');
  if (existingAlert) existingAlert.remove();
  
  // 새 알림창 요소 생성
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  
  // 알림창 내용 구성 (템플릿 리터럴 대신 문자열 연결 사용)
  alertBox.innerHTML = 
    '<div class="alert-content">' +
    '<div class="alert-icon">' +
    '<i class="fa-solid fa-circle-info"></i>' +
    '</div>' +
    '<div class="alert-message">' + message + '</div>' +
    '<button class="alert-close">확인</button>' +
    '</div>';
  
  // 알림창을 DOM에 추가
  documentBody.appendChild(alertBox);
  
  // 등장 애니메이션 (setTimeout 최소화)
  requestAnimationFrame(() => alertBox.classList.add('show'));
  
  // 닫기 함수
  const closeAlert = () => {
    alertBox.classList.remove('show');
    setTimeout(() => {
      if (documentBody.contains(alertBox)) {
        alertBox.remove();
        if (callback) callback();
      }
    }, 300);
  };
  
  // 확인 버튼 클릭 이벤트
  alertBox.querySelector('.alert-close').addEventListener('click', closeAlert);
  
  // 배경 클릭 이벤트
  alertBox.addEventListener('click', (e) => {
    if (e.target === alertBox) closeAlert();
  });
  
  // 모바일에서는 자동으로 5초 후 닫히게 설정
  if (isMobile) {
    setTimeout(closeAlert, 5000);
  }
}

/**
 * 버튼 이벤트 설정 함수
 */
function setupButtonEvents() {
  const introApplyButton = document.getElementById('apply-button');
  const mainApplyButton = document.getElementById('main-apply-button');
  
  // 인트로 신청 버튼 이벤트
  if (introApplyButton) {
    introApplyButton.addEventListener('click', function(event) {
      event.preventDefault();
      
      if (!introButtonPressed) {
        showCustomAlert('설마 밑에 안 읽으신건 아니죠..?', function() {
          document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
        });
        introButtonPressed = true;
      } else {
        document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // 실제 신청 버튼 이벤트
  if (mainApplyButton) {
    mainApplyButton.addEventListener('click', function(event) {
      event.preventDefault();
      
      showCustomAlert("반드시 학교계정으로 로그인 해 주세요!", function() {
        window.open("https://forms.gle/UgucYhfGQ23WXC1V8", '_blank');
      });
    });
  }
}

/**
 * 보안 기능 설정 함수 (우클릭 방지, 개발자 도구 방지)
 */
function setupSecurityFeatures() {
  // 전체 문서에 우클릭 이벤트 방지
  document.addEventListener('contextmenu', (e) => e.preventDefault(), { passive: true });
  
  // 드래그 선택 방지 (입력 필드 제외)
  document.addEventListener('selectstart', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return true;
    e.preventDefault();
  }, { passive: false });
  
  // 개발자 도구 방지 키 조합 처리
  document.addEventListener('keydown', (e) => {
    // F12 키 방지
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    
    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U 방지
    if (e.ctrlKey && (
        (e.shiftKey && /^[ijc]$/i.test(e.key)) ||
        /^[u]$/i.test(e.key)
      )) {
      e.preventDefault();
      return false;
    }
  }, { passive: false });
}

/**
 * 부드러운 스크롤 및 내비게이션 설정 함수
 */
function setupNavigation() {
  // 모든 내부 링크에 부드러운 스크롤 적용
  if (typeof window.scroll !== 'function' || !('scrollBehavior' in document.documentElement.style)) {
    const anchors = document.querySelectorAll('a[href^="#"]');
    const anchorCount = anchors.length;
    
    for (let i = 0; i < anchorCount; i++) {
      anchors[i].addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId !== "#") {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({behavior: 'smooth'});
          }
        }
      });
    }
  }
}

/**
 * 이미지 및 리소스 최적화 함수
 */
function optimizeResources() {
  // 로고 이미지를 제외한 모든 이미지에 지연 로딩 적용
  const images = document.querySelectorAll('img:not(.logo-img)');
  const imageCount = images.length;
  
  for (let i = 0; i < imageCount; i++) {
    if (!images[i].hasAttribute('loading')) {
      images[i].loading = 'lazy';
    }
  }
  
  // Font Awesome 지연 로드
  let faLoaded = false;
  
  function loadFontAwesome() {
    if (!faLoaded && !document.querySelector('#font-awesome-css')) {
      const faIcons = document.querySelectorAll('.fa-brands, .fa-solid');
      if (faIcons.length > 0) {
        const faLink = document.createElement('link');
        faLink.id = 'font-awesome-css';
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(faLink);
        faLoaded = true;
      }
    }
  }
  
  // 200ms 지연 후 아이콘 사용 여부 확인
  setTimeout(loadFontAwesome, 200);
}

/**
 * 커리큘럼 박스 최적화 함수
 */
function optimizeCurriculumBoxes() {
  const curriBoxes = document.querySelectorAll('.curri-box');
  const boxCount = curriBoxes.length;
  
  if (boxCount === 0) return;
  
  // RAF 사용하여 렌더링 최적화
  requestAnimationFrame(() => {
    for (let i = 0; i < boxCount; i++) {
      const box = curriBoxes[i];
      const textElements = box.querySelectorAll('.darkT.smls.pret.tacen');
      const elemCount = textElements.length;
      
      // 텍스트 요소 최적화
      for (let j = 0; j < elemCount; j++) {
        const el = textElements[j];
        // 공통 스타일 속성을 클래스로 이동하고 인라인 스타일 최소화
        el.style.textAlign = isMobile ? 'left' : 'center';
        el.style.display = el.textContent.trim() ? 'block' : 'none';
      }
      
      // 박스 가시성 최적화
      box.classList.add('optimized');
    }
    
    // 새로고침 상태 확인 및 처리
    if (sessionStorage.getItem('pageReloaded') === 'true') {
      handlePageReload(curriBoxes);
    }
  });
}

/**
 * 새로고침 후 페이지 처리 함수
 * @param {NodeList} curriBoxes - 커리큘럼 박스 요소들
 */
function handlePageReload(curriBoxes) {
  // 세션 스토리지 플래그 초기화
  sessionStorage.removeItem('pageReloaded');
  
  // 박스 최적화 (타이밍 조정으로 성능 개선)
  requestAnimationFrame(() => {
    // 커리큘럼 박스에 특별 클래스 추가
    const boxCount = curriBoxes.length;
    for (let i = 0; i < boxCount; i++) {
      curriBoxes[i].classList.add('reloaded');
    }
    
    // 박스들의 레이아웃 강제 리플로우 (단일 리플로우로 최적화)
    const curriculumSection = document.querySelector('.curriculum');
    if (curriculumSection) {
      curriculumSection.style.opacity = '0.99';
      requestAnimationFrame(() => {
        curriculumSection.style.opacity = '1';
      });
    }
  });
}

/**
 * 스크롤 이벤트 최적화 함수
 */
function setupScrollEvents() {
  // 브라우저 IntersectionObserver API 사용 (최적화)
  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // 텍스트 요소 렌더링 안정화 (한 번만 실행)
          if (!entry.target.dataset.processed) {
            const textElems = entry.target.querySelectorAll('.darkT.smls.pret.tacen');
            if (textElems.length > 0) {
              void textElems[0].offsetHeight; // 단일 강제 리플로우로 최적화
            }
            entry.target.dataset.processed = 'true';
          }
        }
      });
    }, {
      rootMargin: '0px',
      threshold: 0.1
    });
    
    // 모든 커리큘럼 박스 관찰
    const curriBoxes = document.querySelectorAll('.curri-box');
    curriBoxes.forEach(box => visibilityObserver.observe(box));
  } else {
    // 폴백: 쓰로틀링된 스크롤 이벤트
    let scrollTimeout;
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
          // 현재 스크롤 위치 변화량이 충분할 때만 처리
          if (Math.abs(window.scrollY - lastScrollY) > 50) {
            checkVisibleElements();
            lastScrollY = window.scrollY;
          }
          scrollTimeout = null;
        }, 100);
      }
    }, {passive: true});
  }
}

/**
 * 뷰포트에 보이는 요소 처리 함수 (폴백)
 */
function checkVisibleElements() {
  // 뷰포트에 보이는 커리큘럼 박스 처리
  const curriBoxes = document.querySelectorAll('.curri-box:not(.visible)');
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  
  curriBoxes.forEach(box => {
    const rect = box.getBoundingClientRect();
    const isVisible = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= viewportHeight &&
      rect.right <= viewportWidth
    );
    
    if (isVisible) {
      box.classList.add('visible');
    }
  });
}

/**
 * 수상 실적 효과 설정 함수
 */
function setupAwardEffects() {
  // 메달 클래스가 있는 실적 아이템 찾기
  const medalItems = document.querySelectorAll('.medal-gold, .medal-bronze');
  const medalCount = medalItems.length;
  
  if (medalCount === 0) return;
  
  // 각 메달 아이템에 지연 적용 (성능 최적화)
  for (let i = 0; i < medalCount; i++) {
    const item = medalItems[i];
    
    // 빛나는 효과에 랜덤 지연 추가
    const shineEffect = item.querySelector('.shine-effect');
    if (shineEffect) {
      shineEffect.style.animationDelay = `${Math.random() * 2}s`;
    }
    
    // 금메달 아이템에 파티클 효과 (고성능 버전)
    if (item.classList.contains('medal-gold') && !item.dataset.particlesAdded) {
      addGoldParticles(item);
    }
  }
  
  // ScrollReveal 통합 (존재할 경우만)
  if (window.sr) {
    window.sr.reveal(".medal-gold", {
      origin: "top",
      duration: 800,
      distance: "20px",
      scale: 1.05,
      reset: false,
      delay: 200
    });
    
    window.sr.reveal(".medal-bronze", {
      origin: "bottom",
      duration: 600,
      distance: "20px",
      reset: false,
      delay: 100
    });
  }
}

/**
 * 금메달 아이템에 최적화된 파티클 효과
 * @param {HTMLElement} element - 금메달 아이템 요소
 */
function addGoldParticles(element) {
  element.dataset.particlesAdded = "true";
  
  // 파티클 개수 (성능 최적화)
  const particleCount = 8;
  
  // DocumentFragment 사용하여 단일 DOM 조작
  const fragment = document.createDocumentFragment();
  
  // 파티클 추가
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'gold-particle';
    
    // 인라인 스타일 최소화 (클래스로 대체할 부분 제외)
    particle.style.cssText = 
      'position:absolute;' +
      `width:${4 + Math.random() * 6}px;` +
      `height:${4 + Math.random() * 6}px;` +
      'background:rgba(255,215,0,0.9);' +
      'box-shadow:0 0 10px rgba(255,165,0,0.8),0 0 5px rgba(255,165,0,0.6);' +
      'border-radius:50%;' +
      `top:${Math.random() * 100}%;` +
      `left:${Math.random() * 100}%;` +
      'z-index:3;' +
      'opacity:0;' +
      'pointer-events:none;' +
      `animation:particles ${2 + Math.random() * 3}s infinite ease-in-out;` +
      `animation-delay:${Math.random() * 5}s;`;
    
    // Fragment에 추가
    fragment.appendChild(particle);
  }
  
  // 단일 DOM 조작으로 모든 파티클 추가
  element.appendChild(fragment);
}

/**
 * 섹션 전환 애니메이션 최적화
 */
function enhanceSectionTransitions() {
  // ScrollReveal 존재 확인
  if (!window.sr) return;
  
  // 묶음 처리로 성능 최적화
  const reveals = [
    {
      selector: ".achievements .section-title",
      options: { origin: "top", duration: 800, distance: "30px", delay: 100 }
    },
    {
      selector: ".section-divider",
      options: { origin: "left", duration: 1000, distance: "100%", delay: 200 }
    },
    {
      selector: ".projects-section .section-title",
      options: { origin: "top", duration: 800, distance: "30px", delay: 300 }
    },
    {
      selector: ".project-item",
      options: { origin: "bottom", duration: 600, distance: "30px", interval: 200 }
    }
  ];
  
  // 한번에 등록
  reveals.forEach(({ selector, options }) => {
    if (document.querySelector(selector)) {
      window.sr.reveal(selector, options);
    }
  });
}

/**
 * 섹션 스크롤 효과 최적화
 */
function setupScrollEffects() {
  // IntersectionObserver 지원 확인 및 활용
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-active');
          
          // 특정 섹션에만 추가 효과 적용 (조건부 처리)
          if (entry.target.classList.contains('achievements') || 
              entry.target.classList.contains('projects-section')) {
            // 이미 처리되었는지 확인하여 중복 실행 방지
            if (!entry.target.dataset.highlighted) {
              highlightItems(entry.target);
              entry.target.dataset.highlighted = 'true';
            }
          }
          
          // 항목이 활성화된 후 관찰 중단 (성능 최적화)
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    // 섹션 관찰 시작
    document.querySelectorAll('.page').forEach(section => {
      sectionObserver.observe(section);
    });
  }
}

/**
 * 섹션 내 아이템 강조 효과 최적화
 * @param {HTMLElement} section - 강조할 아이템을 포함한 섹션
 */
function highlightItems(section) {
  // 모든 아이템 선택
  const items = section.querySelectorAll('.achievement-item, .project-item');
  const itemCount = items.length;
  
  if (itemCount === 0) return;
  
  // 효율적인 지연 적용 방법
  for (let i = 0; i < itemCount; i++) {
    const item = items[i];
    // 클로저 사용을 피하고 인덱스 활용
    setTimeout(() => {
      item.classList.add('item-highlight');
      
      // 메달 아이템에 추가 효과
      if (item.classList.contains('medal-gold') || item.classList.contains('medal-bronze')) {
        item.classList.add('medal-highlight');
      }
    }, 200 * i); // 지연 시간 미세 최적화
  }
}

/**
 * 가시성 변경 이벤트 최적화
 */
function setupVisibilityHandler() {
  document.addEventListener('visibilitychange', function() {
    const isHidden = document.hidden;
    const playState = isHidden ? 'paused' : 'running';
    
    // 애니메이션 요소 선택자 (CSS 선택자 성능 최적화)
    const selectors = [
      '.medal-gold .shine-effect',
      '.medal-bronze .shine-effect',
      '.gold-particle'
    ];
    
    // 요소 선택 최소화 및 스타일 변경 최적화
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      const elemCount = elements.length;
      
      if (elemCount > 0) {
        for (let i = 0; i < elemCount; i++) {
          elements[i].style.animationPlayState = playState;
        }
      }
    });
  });
}

/**
 * 모바일 환경 최적화 함수
 */
function setupMobileOptimizations() {
  // 모바일 환경일 때만 실행
  if (!isMobile) return;
  
  // 모바일에서 터치 이벤트 최적화
  document.addEventListener('touchstart', function() {}, {passive: true});
  
  // 모바일 폰트 렌더링 최적화
  documentBody.style.textRendering = 'optimizeSpeed';
  
  // 방향 전환 처리
  window.addEventListener('orientationchange', function() {
    // 리소스 사용 최소화
    setTimeout(function() {
      window.scrollBy(0, 1);
    }, 300);
  });
}

/**
 * 새로고침 상태 추적 함수
 */
function setupReloadTracking() {
  // 새로고침 감지
  window.addEventListener('beforeunload', function() {
    sessionStorage.setItem('pageReloaded', 'true');
    sessionStorage.setItem('scrollPosition', window.scrollY);
  });
  
  // 페이지 로드 시 이전 스크롤 위치 복원
  if (sessionStorage.getItem('pageReloaded') === 'true') {
    const savedPosition = parseInt(sessionStorage.getItem('scrollPosition'), 10);
    if (!isNaN(savedPosition)) {
      // 약간의 지연 후 스크롤 복원 (렌더링이 완료된 후)
      setTimeout(() => {
        window.scrollTo(0, savedPosition);
        // 스크롤 위치에 있는 애니메이션 요소들 즉시 표시
        forceShowAnimationsInView();
      }, 100);
    }
  }
}

/**
 * 뷰포트 내 애니메이션 요소들 즉시 표시
 */
function forceShowAnimationsInView() {
  // ScrollReveal이 있는 경우 관련 요소 처리
  if (window.sr) {
    // 주요 애니메이션 요소들 선택자
    const selectors = [
      '.achievement-item', 
      '.curri-box', 
      '.cur',
      '.medal-gold',
      '.medal-bronze'
    ];
    
    // 뷰포트 치수 가져오기
    const viewportHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollBottom = scrollTop + viewportHeight;
    
    // 각 선택자에 대해 뷰포트 내 요소 확인 및 강제 표시
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        const elementBottom = elementTop + rect.height;
        
        // 뷰포트 내에 있는 요소인지 확인
        if (elementBottom >= scrollTop && elementTop <= scrollBottom) {
          // ScrollReveal 요소 강제 표시
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.transition = 'none';
          
          // 애니메이션 완료 클래스 추가
          el.classList.add('sr-reveal-complete');
          el.classList.add('visible');
          el.classList.add('item-highlight');
          
          // 메달 효과 처리
          if (el.classList.contains('medal-gold') || el.classList.contains('medal-bronze')) {
            el.classList.add('medal-highlight');
          }
        }
      });
    });
  }
}

/**
 * ScrollReveal 설정 최적화 함수 추가
 */
function setupScrollReveal() {
  // ScrollReveal 초기화 여부 확인
  if (!window.sr && window.ScrollReveal) {
    // reset을 false로 설정하여 한 번만 애니메이션 적용되도록 함
    window.sr = ScrollReveal({ 
      reset: false,           // 중요: 한 번만 애니메이션 적용
      useDelay: 'onload',     // 페이지 로드 시에만 지연 적용
      viewFactor: 0.2,        // 20%만 보여도 애니메이션 시작
      viewOffset: {
        top: 40,              // 상단 여백
        bottom: 40            // 하단 여백
      }
    });
    
    // 로고 이미지 애니메이션: 위에서 아래로 내려오는 효과
    sr.reveal(".logo-img", {
      origin: "top",          // 시작 위치: 상단
      duration: 500,          // 애니메이션 시간(ms)
      distance: "200px",      // 이동 거리
    });

    // 로고 텍스트 애니메이션: 오른쪽에서 왼쪽으로 이동
    sr.reveal(".logo", {
      origin: "right",        // 시작 위치: 오른쪽
      duration: 500,          // 애니메이션 시간(ms)
      distance: "200px",      // 이동 거리
    });

    // 로고 설명 애니메이션: 아래에서 위로 올라오는 효과
    sr.reveal(".logo-des", {
      origin: "bottom",       // 시작 위치: 하단
      duration: 500,          // 애니메이션 시간(ms)
      distance: "200px",      // 이동 거리
    });
    
    // 자랑 섹션 제목 애니메이션: 왼쪽에서 오른쪽으로 이동
    sr.reveal(".PR-title", {
      origin: "left",         // 시작 위치: 왼쪽
      duration: 500,          // 애니메이션 시간(ms)
      distance: "100px",      // 이동 거리
    });
    
    // 교육 내용 항목 애니메이션: 순차적으로 아래에서 위로 
    sr.reveal(".cur", {
      origin: "bottom",       // 시작 위치: 하단
      duration: 500,          // 애니메이션 시간(ms)
      distance: "50px",       // 이동 거리
      interval: 200           // 각 항목 간 시간 간격(ms)
    });
    
    // 실적 아이템 애니메이션: 순차적으로 아래에서 위로
    sr.reveal(".achievement-item", {
      origin: "bottom",       // 시작 위치: 하단
      duration: 500,          // 애니메이션 시간(ms)
      distance: "50px",       // 이동 거리
      interval: 200           // 각 항목 간 시간 간격(ms)
    });
    
    // 커리큘럼 박스 애니메이션: 오른쪽에서 왼쪽으로 순차적 이동
    sr.reveal(".curri-box", {
      origin: "right",        // 시작 위치: 오른쪽
      duration: 500,          // 애니메이션 시간(ms)
      distance: "50px",       // 이동 거리
      interval: 100           // 각 항목 간 시간 간격(ms)
    });

    // 금메달 아이템에 추가 효과
    sr.reveal(".medal-gold", {
      origin: "top",
      duration: 800,
      distance: "20px",
      scale: 1.05,
      reset: false,
      delay: 200
    });
    
    // 동메달 아이템에 추가 효과
    sr.reveal(".medal-bronze", {
      origin: "bottom",
      duration: 600,
      distance: "20px",
      reset: false,
      delay: 100
    });
  }
}

/**
 * 스크롤 중인지 감지하는 플래그 설정
 */
function setupScrollDetection() {
  let scrollTimeout;
  let isScrolling = false;
  
  // 스크롤 시작 시 클래스 추가
  window.addEventListener('scroll', function() {
    if (!isScrolling) {
      document.documentElement.classList.add('scrolling');
      isScrolling = true;
    }
    
    // 스크롤 종료 감지 (지연 실행)
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      document.documentElement.classList.remove('scrolling');
      isScrolling = false;
    }, 150);
  }, {passive: true});
}

/**
 * 초기화 함수 통합 및 최적화
 */
function initializeAll() {
  // 모바일 감지를 바로 적용
  if (isMobile) {
    documentBody.classList.add('mobile-device');
  }
  
  // 주요 기능 초기화 (중요도 및 실행 순서 최적화)
  setupButtonEvents();
  setupNavigation();
  optimizeResources();
  setupSecurityFeatures();
  setupScrollReveal(); // ScrollReveal 설정 통합 함수 호출
  setupScrollDetection();
  
  // 지연 실행이 가능한 기능 (마이크로태스크로 최적화)
  Promise.resolve().then(() => {
    optimizeCurriculumBoxes();
    setupScrollEvents();
    setupAwardEffects();
    setupMobileOptimizations();
    setupReloadTracking();
    setupVisibilityHandler();
  });
  
  // 추가 UI 효과 (가장 마지막에 처리)
  requestIdleCallback ? requestIdleCallback(() => {
    enhanceSectionTransitions();
    setupScrollEffects();
  }) : setTimeout(() => {
    enhanceSectionTransitions();
    setupScrollEffects();
  }, 100);
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', initializeAll);

// 페이지 완전 로드 후 추가 최적화
window.addEventListener('load', function() {
  // 커리큘럼 박스 최종 정리 (필요한 경우만)
  const curriBoxes = document.querySelectorAll('.curri-box:not([style*="min-height"])');
  if (curriBoxes.length > 0) {
    requestAnimationFrame(() => {
      curriBoxes.forEach(box => {
        box.style.minHeight = box.offsetHeight + 'px';
      });
    });
  }
  
  // 가비지 컬렉션 유도 (지원하는 브라우저만)
  if (window.CollectGarbage) {
    setTimeout(() => window.CollectGarbage(), 500);
  }
});