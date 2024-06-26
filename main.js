// Scroll effects, e.g. photo blur and alignment

// Parallax - one screen height of scroll slides the bg image up fully
function handleHero() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const heroScrollPercent = Math.min(scrollTop / windowHeight, 1);
  const hero = document.querySelector(".hero");
  hero.style.backgroundPositionY = `${heroScrollPercent * 100}%`;
}

// Transition should happen from top of portrait to 100px from bottom
function handlePortrait() {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const polaroids = document.querySelectorAll(".polaroid-container");
  polaroids.forEach((polaroid) => {
    polaroid.classList.contains("polaroid-right");
    const invert = polaroid.classList.contains("polaroid-right") ? -1 : 1;
    const rect = polaroid.getBoundingClientRect();
    const scrollPercent = Math.max(
      0,
      Math.min(1, (windowHeight - rect.top) / (rect.height - 100))
    );

    const headshotRotate = invert * (6 - 8 * scrollPercent);
    const headshotScale = 1 + 0.1 * (1 - scrollPercent);
    const headshotBlur = windowWidth < 700 ? 0 : 5 * (1 - scrollPercent);
    polaroid.style.transform = `rotate(${headshotRotate}deg) scale(${headshotScale})`;
    polaroid.style.filter = `blur(${headshotBlur}px)`;
    polaroid.style.opacity = `${0.5 + 0.5 * scrollPercent}`;
  });
}

// Transition should start when top of header is exposed
// Finish 100px before next section appears
function handleMediaScroller() {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const topContent = document.querySelector(".top-content");
  const mediaHeader = document.querySelector(".media-coverage .header");
  const experience = document.querySelector(".experience");
  const topContentRect = topContent.getBoundingClientRect();
  const mediaHeaderRect = mediaHeader.getBoundingClientRect();
  const experienceRect = experience.getBoundingClientRect();
  const scrollPercent = Math.max(
    0,
    Math.min(
      1,
      (mediaHeaderRect.top - topContentRect.bottom) /
        (mediaHeaderRect.top - 100)
    )
  );
  const hidden =
    experienceRect.top <= 0 || topContentRect.bottom >= windowHeight;
  const mediaContainer = document.querySelector(".media-coverage");
  const mediaSection = document.querySelector(".media-coverage-logos");
  if (hidden) {
    mediaContainer.style.visibility = "hidden";
  } else {
    const blur = windowWidth < 700 ? 0 : (1 - scrollPercent) * 20;
    mediaSection.style.filter = `blur(${blur}px)`;
    mediaSection.style.opacity = `${scrollPercent}`;
    mediaContainer.style.visibility = "visible";
  }
}

// If there are 3 things for example...
// From 0 to 0.25: first row fades
// From 0.25 to 0.5: second row fades
// From 0.5 to 0.75: third fades in
function getRowVisibility(scrollPercent, num) {
  const multiples = 1 / (num + 1);
  const indexAppearing = Math.floor(scrollPercent / multiples);
  const result = [];
  for (let i = 0; i < num; i++) {
    if (i < indexAppearing) {
      result.push(1);
    } else if (i === indexAppearing) {
      // From 0 to 1 of how far along scroll is from nth multiple to n+1th.
      const amount = (scrollPercent - indexAppearing * multiples) / multiples;
      result.push(amount);
    } else {
      result.push(0);
    }
  }
  return result;
}

function handleExperience() {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const rect = document.querySelector(".experience").getBoundingClientRect();
  const scrollPercent = Math.max(
    0,
    Math.min(1, (windowHeight * 0.75 - rect.top) / rect.height)
  );

  const rows = document.querySelectorAll(".timeline-row");
  const visibility = getRowVisibility(scrollPercent, rows.length);
  for (let i = 0; i < rows.length; i++) {
    const blur = windowWidth < 700 ? 0 : (1 - visibility[i]) * 20;
    rows[i].style.filter = `blur(${blur}px)`;
    rows[i].style.opacity = `${visibility[i]}`;
  }
}

function onScroll() {
  handleHero();
  handlePortrait();
  handleMediaScroller();
  handleExperience();
}

onScroll();
document.addEventListener("scroll", onScroll);

function getRandomElements(arr, numElements = 12) {
  if (arr.length <= numElements) {
    return arr.slice();
  }

  const result = [];
  const usedIndices = new Set();

  while (result.length < numElements) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      result.push(arr[randomIndex]);
    }
  }

  return result;
}

function createRow(randLinks) {
  const scrollerWrapper = document.createElement("div");
  scrollerWrapper.className = "scroller-wrapper";
  const scroller = document.createElement("div");
  scroller.className = "scroller";
  scroller.style.marginLeft = `-${Math.floor(Math.random() * 100)}px`;
  scrollerWrapper.appendChild(scroller);

  const addLink = (link) => {
    const a = document.createElement("a");
    a.href = link.href;
    a.target = "_blank";

    const img = document.createElement("img");
    img.src = `logos/${link.src}`;
    img.alt = link.alt;

    a.appendChild(img);
    scroller.appendChild(a);
  };
  // Do it few times for smooth scrolling
  randLinks.forEach(addLink);
  randLinks.forEach(addLink);
  return scrollerWrapper;
}

function addToScroller() {
  const mediaSection = document.querySelector(".media-coverage-logos");
  mediaSection.innerHTML = "";
  const windowHeight = window.innerHeight;
  const rows = windowHeight / 50;
  for (let i = 0; i < rows; i++) {
    const randLinks = getRandomElements(links);
    const row = createRow(randLinks);
    mediaSection.appendChild(row);
  }
}

addToScroller();
window.addEventListener("resize", addToScroller);
