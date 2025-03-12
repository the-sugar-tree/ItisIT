/**
 * It is IT 동아리 홈페이지 메인 자바스크립트 (최적화)
 */

// 전역 변수
let introButtonPressed = false;

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
  if (existingAlert) {
    existingAlert.remove();
  }
  
  // 새 알림창 요소 생성
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  
  // 알림창 내용 구성
  alertBox.innerHTML = `
    <div class="alert-content">
      <div class="alert-icon">
        <i class="fa-solid fa-circle-info"></i>
      </div>
      <div class="alert-message">${message}</div>
      <button class="alert-close">확인</button>
    </div>
  `;
  
  // 알림창을 DOM에 추가
  document.body.appendChild(alertBox);
  
  // 등장 애니메이션
  setTimeout(() => {
    alertBox.classList.add('show');
  }, 10);
  
  // 닫기 함수
  const closeAlert = () => {
    alertBox.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(alertBox)) {
        alertBox.remove();
        if (callback) callback();
      }
    }, 300);
  };
  
  // 확인 버튼 클릭 이벤트
  const closeButton = alertBox.querySelector('.alert-close');
  closeButton.addEventListener('click', closeAlert);
  
  // 배경 클릭 이벤트
  alertBox.addEventListener('click', (e) => {
    if (e.target === alertBox) closeAlert();
  });
  
  // 모바일에서는 자동으로 5초 후 닫히게 설정
  if (isMobileDevice()) {
    setTimeout(() => {
      if (document.body.contains(alertBox)) closeAlert();
    }, 5000);
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
      const applicationUrl = "https://forms.gle/UgucYhfGQ23WXC1V8";
      
      showCustomAlert("반드시 학교계정으로 로그인 해 주세요!", function() {
        window.open(applicationUrl, '_blank');
      });
    });
  }
}

/**
 * 부드러운 스크롤 설정 함수
 */
function setupSmoothScroll() {
  // CSS scroll-behavior를 지원하지 않는 브라우저용 폴백
  if (typeof window.scroll !== 'function' || !('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId !== "#") {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({behavior: 'smooth'});
          }
        }
      });
    });
  }
}

/**
 * 이미지 지연 로딩 설정 함수
 */
function setupLazyLoading() {
  // 로고 이미지를 제외한 모든 이미지에 지연 로딩 적용
  document.querySelectorAll('img').forEach(img => {
    if (!img.classList.contains('logo-img') && !img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
  });
}

/**
 * 커리큘럼 박스 최적화 함수
 */
function optimizeCurriculumBoxes() {
  const curriBoxes = document.querySelectorAll('.curri-box');
  
  if (curriBoxes.length === 0) return;
  
  // 첫 로드 시 강제 리플로우/리페인트 실행
  setTimeout(function() {
    curriBoxes.forEach(box => {
      // 텍스트 요소들 정리
      const textElements = box.querySelectorAll('.darkT.smls.pret.tacen');
      textElements.forEach(el => {
        // 강제로 스타일 재설정
        el.style.display = 'block';
        el.style.width = '100%';
        el.style.textAlign = isMobileDevice() ? 'left' : 'center';
        el.style.padding = '0 0.5rem';
        el.style.boxSizing = 'border-box';
        el.style.margin = '0.5rem 0';
        
        // 내용이 있는지 확인하고 빈 내용이면 숨김
        if (!el.textContent.trim()) {
          el.style.display = 'none';
        }
      });
      
      // 박스 가시성 확인 및 처리
      box.classList.add('optimized');
    });
    
    // 새로고침 상태 확인 및 처리
    if (sessionStorage.getItem('pageReloaded') === 'true') {
      handlePageReload(curriBoxes);
    }
  }, 100);
}

/**
 * 페이지 리소스 최적화 함수
 */
function optimizePageResources() {
  // 필요에 따라 리소스 지연 로드
  setTimeout(() => {
    // Font Awesome 아이콘을 실제로 사용하는 시점에 로드
    const faIcons = document.querySelectorAll('.fa-brands, .fa-solid');
    if (faIcons.length > 0 && !document.querySelector('#font-awesome-css')) {
      const faLink = document.createElement('link');
      faLink.id = 'font-awesome-css';
      faLink.rel = 'stylesheet';
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      document.head.appendChild(faLink);
    }
  }, 1000);
}

/**
 * 새로고침 후 페이지 처리 함수
 * @param {NodeList} curriBoxes - 커리큘럼 박스 요소들
 */
function handlePageReload(curriBoxes) {
  // 세션 스토리지 플래그 초기화
  sessionStorage.removeItem('pageReloaded');
  
  // 커리큘럼 섹션 특별 처리
  setTimeout(function() {
    // 커리큘럼 박스에 특별 클래스 추가
    curriBoxes.forEach(box => {
      box.classList.add('reloaded');
    });
    
    // 박스들의 레이아웃 강제 리플로우
    const curriculumSection = document.querySelector('.curriculum');
    if (curriculumSection) {
      curriculumSection.style.opacity = '0.99';
      setTimeout(() => {
        curriculumSection.style.opacity = '1';
      }, 50);
    }
  }, 200);
}

/**
 * 스크롤 이벤트 최적화 함수
 */
function setupScrollEvents() {
  // 스크롤 성능 개선을 위한 쓰로틀링
  let scrollTimeout;
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        // 현재 스크롤 위치가 마지막 처리 위치와 충분히 다를 때만 처리
        if (Math.abs(window.scrollY - lastScrollY) > 50) {
          checkVisibleElements();
          lastScrollY = window.scrollY;
        }
        scrollTimeout = null;
      }, 100);
    }
  }, {passive: true});
}

/**
 * 뷰포트에 보이는 요소 처리 함수
 */
function checkVisibleElements() {
  // 뷰포트에 보이는 커리큘럼 박스만 처리
  const curriBoxes = document.querySelectorAll('.curri-box');
  curriBoxes.forEach(box => {
    const rect = box.getBoundingClientRect();
    const isVisible = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    
    if (isVisible && !box.classList.contains('visible')) {
      // 가시 영역에 들어온 박스 재조정
      box.classList.add('visible');
      
      // 텍스트 요소 렌더링 안정화
      box.querySelectorAll('.darkT.smls.pret.tacen').forEach(el => {
        void el.offsetHeight; // 강제 리플로우
      });
    }
  });
}

/**
 * 모바일 터치 이벤트 최적화 함수
 */
function setupTouchEvents() {
  // 모바일에서 터치 이벤트 지연 해결
  document.addEventListener('touchstart', function() {}, {passive: true});
  
  // 모바일에서 탭 네비게이션 개선
  const allLinks = document.querySelectorAll('a, button');
  allLinks.forEach(link => {
    link.addEventListener('touchend', function(e) {
      if (this === document.activeElement) {
        e.preventDefault();
        this.click();
      }
    });
  });
}

/**
 * 방향 전환 이벤트 처리 함수
 */
function setupOrientationEvent() {
  window.addEventListener('orientationchange', function() {
    // 방향 전환 시 0.3초 후 화면 재조정 (레이아웃 재계산)
    setTimeout(function() {
      window.scrollBy(0, 1);
    }, 300);
  });
}

/**
 * 페이지 로드 완료 시 실행되는 초기화 함수
 */
document.addEventListener('DOMContentLoaded', function() {
  // 모바일 디바이스 감지 및 body에 클래스 추가
  if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
  }
  
  // 각종 기능 초기화
  setupButtonEvents();
  setupSmoothScroll();
  setupLazyLoading();
  setupTouchEvents();
  optimizeCurriculumBoxes();
  setupScrollEvents();
  setupOrientationEvent();
  optimizePageResources();
  
  // 새로고침 이벤트 감지 및 처리
  window.addEventListener('beforeunload', function() {
    // 페이지 상태 세션 스토리지에 저장
    sessionStorage.setItem('pageReloaded', 'true');
  });
  
  // 초기 페이지 로드 시간 측정 (개발용)
  console.log('페이지 로드 완료 시간: ' + (performance.now() / 1000).toFixed(2) + '초');
});

/**
 * 페이지 완전 로드 후 추가 최적화
 */
window.addEventListener('load', function() {
  // 모든 리소스 로드 후 성능 최적화
  setTimeout(() => {
    // 사용하지 않는 리소스 해제
    if (window.CollectGarbage) {
      window.CollectGarbage();
    }
    
    // 커리큘럼 박스 최종 정리
    const curriBoxes = document.querySelectorAll('.curri-box');
    curriBoxes.forEach(box => {
      // 최종 레이아웃 안정화
      if (!box.style.minHeight) {
        box.style.minHeight = box.offsetHeight + 'px';
      }
    });
    
    // 모바일 기기에서 폰트 렌더링 최적화
    if (isMobileDevice()) {
      document.body.style.textRendering = 'optimizeSpeed';
    }
  }, 500);
});