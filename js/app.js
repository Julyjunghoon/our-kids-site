// 아이랑 뭐하지 - 홈페이지 렌더링 스크립트
// data/kids.js, data/posts.js 에 정의된 KIDS_DATA, POSTS_DATA, SITE_INFO를 사용합니다.

const CATEGORY_ICON = {
  전체: "🏡",
  놀이: "🧸",
  공부: "📚",
  음식: "🍚",
  여행맛집: "✈️",
  아이템: "🎁",
  육아정보: "💡",
};

// 카테고리 값(class명/필터링용)과 화면에 보여줄 이름이 다른 경우 여기 적어주세요.
const CATEGORY_LABEL = {
  여행맛집: "여행/맛집",
};

function categoryLabel(cat) {
  return CATEGORY_LABEL[cat] || cat;
}

const CATEGORIES = ["놀이", "공부", "음식", "여행맛집", "아이템", "육아정보"];

let currentCategory = "전체";

function renderHeader() {
  document.title = SITE_INFO.title;
  const titleEl = document.getElementById("siteTitleText");
  if (titleEl) titleEl.textContent = SITE_INFO.title;
  const subtitleEl = document.getElementById("siteSubtitle");
  if (subtitleEl) subtitleEl.textContent = SITE_INFO.subtitle;

  const profileEl = document.getElementById("kidsSection");
  profileEl.innerHTML = KIDS_DATA.map(
    (kid) => `
      <div class="kid-badge">
        <div class="kid-avatar" style="background:${kid.color}">${kid.emoji}</div>
        <div>
          <div class="kid-name">${kid.nickname}</div>
          <div class="kid-age">${kid.age}살</div>
        </div>
      </div>`
  ).join("");
}

function renderHeroStats() {
  const statsEl = document.getElementById("heroStats");
  if (!statsEl) return;
  statsEl.innerHTML = `<span class="hero-stats-pill">기록된 이야기 <strong>${POSTS_DATA.length}개+</strong></span>`;
}

function renderMarquee() {
  const trackEl = document.getElementById("marqueeTrack");
  if (!trackEl) return;
  const items = CATEGORIES.map(
    (cat) => `<span class="marquee-item">${CATEGORY_ICON[cat]} ${categoryLabel(cat)}</span>`
  ).join("");
  // 두 번 반복해서 끊김 없이 흐르도록 만듭니다.
  trackEl.innerHTML = items + items;
}

function renderCategoryCards() {
  const cardsEl = document.getElementById("categoryCards");
  if (!cardsEl) return;

  cardsEl.innerHTML = CATEGORIES.map((cat) => {
    const count = POSTS_DATA.filter((p) => p.category === cat).length;
    return `
      <button class="category-card cat-card-${cat}" data-category="${cat}">
        <span class="category-card-icon">${CATEGORY_ICON[cat]}</span>
        <span class="category-card-name">${categoryLabel(cat)}</span>
        <span class="category-card-count">${count}개</span>
      </button>`;
  }).join("");

  cardsEl.querySelectorAll(".category-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      renderTabs();
      renderPosts();
      document.getElementById("postsSection").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function renderTabs() {
  const categories = ["전체", ...CATEGORIES];
  const tabsEl = document.getElementById("filterTabs");
  tabsEl.innerHTML = categories
    .map(
      (cat) =>
        `<button class="cat-btn cat-btn-${cat}${cat === currentCategory ? " active" : ""}" data-category="${cat}">${CATEGORY_ICON[cat]} ${categoryLabel(cat)}</button>`
    )
    .join("");

  tabsEl.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      renderTabs();
      renderPosts();
    });
  });
}

// 장소 이름/주소로 네이버지도·구글지도 검색 링크 버튼을 만들어줍니다.
function mapLinksHtml(query) {
  const q = encodeURIComponent(query);
  const naverUrl = `https://map.naver.com/p/search/${q}`;
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
  return `<a href="${naverUrl}" target="_blank" rel="noopener noreferrer" class="map-link map-link-naver">네이버지도</a><a href="${googleUrl}" target="_blank" rel="noopener noreferrer" class="map-link map-link-google">구글지도</a>`;
}

const WISHLIST_CATEGORY_ICON = {
  수영: "🏊",
  캠핑: "🏕️",
  볼거리: "🎡",
};

function renderWishlist() {
  const wrapEl = document.getElementById("wishlistGroups");
  if (!wrapEl) return;

  const data = typeof WISHLIST_DATA !== "undefined" ? WISHLIST_DATA : [];
  if (data.length === 0) {
    wrapEl.innerHTML = `<div class="empty-state">아직 등록된 장소가 없어요. data/wishlist.js에 가보고 싶은 곳을 적어보세요! 🗺️</div>`;
    return;
  }

  const groups = {};
  data.forEach((item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  wrapEl.innerHTML = Object.keys(groups)
    .map((cat) => {
      const icon = WISHLIST_CATEGORY_ICON[cat] || "📍";
      const itemsHtml = groups[cat]
        .map(
          (item) => `
            <li class="wishlist-item">
              <span class="wishlist-item-name">${item.name}</span>
              <span class="wishlist-item-links">${mapLinksHtml(item.name)}</span>
            </li>`
        )
        .join("");
      return `
        <div class="wishlist-group">
          <h3 class="wishlist-group-title">${icon} ${cat}</h3>
          <ul class="wishlist-items">${itemsHtml}</ul>
        </div>`;
    })
    .join("");
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function renderPosts() {
  const grid = document.getElementById("postsGrid");
  const sorted = [...POSTS_DATA].sort((a, b) => (a.date < b.date ? 1 : -1));
  const filtered =
    currentCategory === "전체"
      ? sorted
      : sorted.filter((p) => p.category === currentCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">아직 이 카테고리에 게시글이 없어요. 사진을 올리고 이야기를 들려주세요! 🌱</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map((post, postIndex) => {
      const hasImage = post.images && post.images.length > 0;
      const thumbIsVideo = hasImage && isVideoFile(post.images[0]);
      const countBadge =
        hasImage && post.images.length > 1
          ? `<span class="post-image-count">${thumbIsVideo ? "🎬" : "📷"} ${post.images.length}</span>`
          : "";
      const thumbMedia = thumbIsVideo
        ? `<video class="post-image" src="images/posts/${post.images[0]}" muted playsinline preload="metadata"></video>
           <span class="post-play-icon">▶</span>`
        : `<img class="post-image" src="images/posts/${post.images[0]}" alt="${post.title}" onerror="this.outerHTML='<div class=&quot;post-image-placeholder&quot;>${CATEGORY_ICON[post.category] || "📷"}</div>'">`;
      const imageHtml = hasImage
        ? `<div class="post-image-wrap" data-post-index="${postIndex}">
            ${thumbMedia}
            ${countBadge}
          </div>`
        : `<div class="post-image-placeholder">${CATEGORY_ICON[post.category] || "📷"}</div>`;

      const kidsHtml =
        post.kids && post.kids.length > 0
          ? `<div class="post-kids">👪 ${post.kids.join(", ")}</div>`
          : "";

      const locationHtml = post.location
        ? `
          <div class="post-location">
            <span class="post-location-name">📍 ${post.location.name}</span>
            <span class="post-location-links">${mapLinksHtml(post.location.address || post.location.name)}</span>
          </div>`
        : "";

      return `
        <article class="post-card">
          ${imageHtml}
          <div class="post-body">
            <div class="post-meta">
              <span class="category-chip cat-${post.category}">${categoryLabel(post.category)}</span>
              <span>${formatDate(post.date)}</span>
            </div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-content">${post.content}</p>
            ${locationHtml}
            ${kidsHtml}
          </div>
        </article>`;
    })
    .join("");

  grid.querySelectorAll(".post-image-wrap").forEach((wrap) => {
    wrap.addEventListener("click", () => {
      const post = filtered[Number(wrap.dataset.postIndex)];
      if (post) openLightbox(post.images, 0);
    });
  });
}

/* ===== Lightbox (여러 장 사진 보기) ===== */
let lightboxImages = [];
let lightboxIndex = 0;

function isVideoFile(path) {
  return /\.(mp4|mov|webm)$/i.test(path);
}

function renderLightboxMedia() {
  const wrap = document.getElementById("lightboxMediaWrap");
  const path = lightboxImages[lightboxIndex];
  const src = `images/posts/${path}`;
  wrap.innerHTML = isVideoFile(path)
    ? `<video class="lightbox-media" src="${src}" controls autoplay></video>`
    : `<img class="lightbox-media" src="${src}" alt="">`;

  document.getElementById("lightboxCounter").textContent =
    lightboxImages.length > 1
      ? `${lightboxIndex + 1} / ${lightboxImages.length}`
      : "";

  const showNav = lightboxImages.length > 1;
  document.getElementById("lightboxPrev").style.display = showNav ? "flex" : "none";
  document.getElementById("lightboxNext").style.display = showNav ? "flex" : "none";
}

function openLightbox(images, index = 0) {
  if (!images || images.length === 0) return;
  lightboxImages = images;
  lightboxIndex = index;
  renderLightboxMedia();
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
  document.getElementById("lightboxMediaWrap").innerHTML = "";
}

function showPrevImage() {
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  renderLightboxMedia();
}

function showNextImage() {
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  renderLightboxMedia();
}

function initLightbox() {
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", showPrevImage);
  document.getElementById("lightboxNext").addEventListener("click", showNextImage);
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("lightbox").classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrevImage();
    if (e.key === "ArrowRight") showNextImage();
  });
}

function init() {
  renderHeader();
  renderHeroStats();
  renderMarquee();
  renderCategoryCards();
  renderWishlist();
  renderTabs();
  renderPosts();
  initLightbox();
}

document.addEventListener("DOMContentLoaded", init);
