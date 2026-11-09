(() => {
  'use strict';
  const content = window.PERSONAL_CONTENT || { lifeMedia: [], works: [] };
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const dialog = document.querySelector('#showcase-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let dialogTrigger;
  let toastTimer;

  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, document.baseURI);
      if (url.username || url.password) return null;
      if (['https:', 'http:'].includes(url.protocol)) return url.href;
      if (url.protocol === 'file:' && location.protocol === 'file:') return url.href;
    } catch { /* Invalid content entry: omit its link. */ }
    return null;
  }
  function externalLink(label, value) {
    const url = safeUrl(value);
    if (!url) return null;
    const link = node('a', '', label);
    link.href = url;
    if (new URL(url).origin !== location.origin) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    return link;
  }
  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '展开导航');
    navigation.classList.remove('open');
  }
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? '展开导航' : '收起导航');
    navigation.classList.toggle('open', !expanded);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

  function showToast(message) {
    const toast = document.querySelector('.toast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }
  async function copyText(text, message) {
    const active = document.activeElement;
    let area;
    try {
      let copied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(text); copied = true; } catch { /* Try local fallback. */ }
      }
      if (!copied) {
        area = node('textarea');
        area.value = text;
        area.style.cssText = 'position:fixed;top:0;left:-9999px';
        document.body.appendChild(area);
        area.select();
        copied = document.execCommand('copy');
      }
      if (!copied) throw new Error('Clipboard unavailable');
      showToast(message);
    } catch { showToast('暂时无法自动复制，请选择文字后手动复制。'); }
    finally {
      if (area) area.remove();
      if (active) active.focus({ preventScroll: true });
    }
  }
  const citations = [
    '吕维霞, 刘丰玮. WSR理论视域下社区生活垃圾分类效果提升路径——基于16个社区的模糊集定性比较分析[J]. 理论探讨, 2025(01): 104-115.',
    'Xianglan Jin, Huizhu Cui, Fengwei Liu, et al. Does cybersecurity regulation promote digital transformation? Evidence from the Cyber Security Law in China[J]. Finance Research Letters, 2025, 76: 107041.',
    '刘丰玮, 吕维霞. 协同视角下城市生活垃圾分类三元合作治理机制[J]. 公关世界, 2024(03): 169-171.'
  ];
  document.querySelectorAll('.copy-citation').forEach(button => button.addEventListener('click', () => copyText(citations[Number(button.dataset.paper)], '论文引用已复制')));
  document.querySelector('.copy-email').addEventListener('click', () => copyText('cynthialau163@163.com', '邮箱地址已复制'));

  function makeImage(src, alt) {
    const url = safeUrl(src);
    if (!url) return null;
    const image = node('img');
    image.src = url;
    image.alt = alt || '';
    image.loading = 'lazy';
    image.addEventListener('error', () => image.replaceWith(node('span', 'media-error', '画面暂时无法加载')), { once: true });
    return image;
  }
  function openDialog(trigger, title, media) {
    dialogTrigger = trigger;
    dialogContent.replaceChildren();
    if (media) dialogContent.appendChild(media);
    const text = node('div', 'dialog-text');
    const heading = node('h2', '', title);
    heading.id = 'dialog-title';
    text.appendChild(heading);
    dialogContent.appendChild(text);
    dialog.showModal();
    document.body.classList.add('dialog-open');
    return text;
  }
  function cleanupDialog() {
    dialog.querySelectorAll('video').forEach(video => video.pause());
    dialogContent.replaceChildren();
    document.body.classList.remove('dialog-open');
    if (dialogTrigger && dialogTrigger.isConnected) dialogTrigger.focus({ preventScroll: true });
  }
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', cleanupDialog);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  function openWork(work, trigger) {
    const image = makeImage(work.cover, work.coverAlt || work.title);
    if (image) image.className = 'dialog-media';
    const text = openDialog(trigger, work.title, image);
    const badge = node('span', 'pill lavender', `${work.categoryLabel || '个人作品'} · ${work.status || '作品记录'}`);
    text.prepend(badge);
    if (work.summary) text.appendChild(node('p', '', work.summary));
    [['我的角色', work.role], ['创作过程', work.process], ['完成情况', work.outcome], ['工具与方式', work.tools]].forEach(([label, value]) => {
      if (value) { text.appendChild(node('h3', '', label)); text.appendChild(node('p', '', value)); }
    });
    const links = node('div', 'dialog-links');
    [['访问作品 ↗', work.demoUrl], ['查看源代码 ↗', work.sourceUrl]].forEach(([label, url]) => {
      const link = externalLink(label, url);
      if (link) links.appendChild(link);
    });
    if (links.childElementCount) text.appendChild(links);
    if (work.videoSrc) {
      const videoUrl = safeUrl(work.videoSrc);
      if (videoUrl) {
        const video = node('video', 'dialog-media');
        video.src = videoUrl;
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        text.appendChild(video);
      }
    }
  }
  const works = Array.isArray(content.works) ? content.works : [];
  const workGrid = document.querySelector('#portfolio-grid');
  function renderWorks(category) {
    workGrid.replaceChildren();
    const visible = works.filter(work => category === 'all' || work.category === category);
    visible.forEach((work, i) => {
      const card = node('article', 'work-card');
      const cover = node('button', 'work-cover');
      cover.type = 'button';
      cover.setAttribute('aria-label', `查看作品：${work.title}`);
      const image = makeImage(work.cover, work.coverAlt || work.title);
      if (image) cover.appendChild(image);
      cover.appendChild(node('span', 'work-number', `0${i + 1} / ${work.categoryLabel || '作品'}`));
      const expand = node('span', 'work-expand', '↗');
      expand.setAttribute('aria-hidden', 'true');
      cover.appendChild(expand);
      cover.addEventListener('click', () => openWork(work, cover));
      card.appendChild(cover);
      const info = node('div', 'work-info');
      const meta = node('div', 'work-meta');
      meta.appendChild(node('span', 'pill blue', work.status || '作品记录'));
      if (work.date) meta.appendChild(node('span', '', work.date));
      info.appendChild(meta);
      info.appendChild(node('h3', '', work.title));
      if (work.summary) info.appendChild(node('p', '', work.summary));
      const tags = node('div', 'work-tags');
      (work.tags || []).forEach(tag => tags.appendChild(node('span', '', tag)));
      info.appendChild(tags);
      const links = node('div', 'work-links');
      const details = node('button', '', '看创作过程 ↗');
      details.type = 'button';
      details.addEventListener('click', () => openWork(work, details));
      links.appendChild(details);
      const link = externalLink('访问作品 ↗', work.demoUrl);
      if (link) links.appendChild(link);
      info.appendChild(links);
      card.appendChild(info);
      workGrid.appendChild(card);
    });
    if (category === 'all' && visible.length) {
      const note = node('aside', 'creative-note');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#i-spark');
      svg.appendChild(use); note.appendChild(svg);
      const block = node('div');
      block.appendChild(node('span', 'mini-label', 'MAKE SOMETHING. LEARN SOMETHING.'));
      const title = node('h3');
      title.append('下一次尝试，', node('br'), '会是什么模样？');
      block.appendChild(title);
      block.appendChild(node('p', '', '一个网页、一段视频，或是一个尚未命名的灵感。保持好奇，把想法一点点变成作品。'));
      note.appendChild(block);
      note.appendChild(node('span', '', 'Always a work in progress.'));
      workGrid.appendChild(note);
    }
    document.querySelector('#portfolio-count').textContent = `已展示 ${visible.length} 件作品`;
    document.querySelector('#portfolio-empty').hidden = visible.length !== 0;
    workGrid.hidden = visible.length === 0;
  }
  function selectFilter(category) {
    document.querySelectorAll('.filter').forEach(button => {
      const selected = button.dataset.filter === category;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    renderWorks(category);
  }
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => selectFilter(button.dataset.filter)));
  document.querySelector('#show-all-work').addEventListener('click', () => {
    selectFilter('all');
    document.querySelector('.filter').focus({ preventScroll: true });
  });
  renderWorks('all');

  const lifeMedia = (Array.isArray(content.lifeMedia) ? content.lifeMedia : []).filter(item => safeUrl(item.src));
  const mediaGrid = document.querySelector('#life-media-grid');
  lifeMedia.forEach(item => {
    const button = node('button', 'media-card');
    button.type = 'button';
    button.setAttribute('aria-label', `查看${item.type === 'video' ? '视频' : '照片'}：${item.title}`);
    const cover = node('span', 'media-cover');
    const image = makeImage(item.type === 'video' ? item.poster : item.src, item.alt || item.title);
    if (image) cover.appendChild(image);
    if (item.type === 'video') cover.appendChild(node('span', 'play-badge', '▶'));
    const label = node('span', 'media-card-label');
    label.appendChild(node('b', '', item.title));
    if (item.caption) label.appendChild(node('small', '', item.caption));
    button.append(cover, label);
    button.addEventListener('click', () => {
      let media;
      if (item.type === 'video') {
        media = node('video', 'dialog-media');
        media.src = safeUrl(item.src);
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
        const poster = safeUrl(item.poster);
        if (poster) media.poster = poster;
        media.addEventListener('error', () => {
          media.replaceWith(node('p', 'dialog-fallback', '视频暂时无法播放，请稍后重试。'));
        }, { once: true });
      } else {
        media = makeImage(item.src, item.alt || item.title);
        if (media) media.className = 'dialog-media';
      }
      const text = openDialog(button, item.title, media);
      if (item.caption) text.appendChild(node('p', '', item.caption));
    });
    mediaGrid.appendChild(button);
  });
  document.querySelector('#life-empty').hidden = lifeMedia.length !== 0;
  mediaGrid.hidden = lifeMedia.length === 0;
  if (lifeMedia.length) document.querySelector('#life-media-status').textContent = `${lifeMedia.length} 个生活片段`;

  // Give the navigation context without moving content or blocking keyboard use.
  if ('IntersectionObserver' in window) {
    const links = [...navigation.querySelectorAll('a')];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => link.classList.toggle('current', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-15% 0px -45% 0px', threshold: [0, 0.1, 0.3] });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
  document.querySelectorAll('.skill-proof[href="#research"]').forEach(link => link.addEventListener('click', () => {
    document.querySelector('.research-details').open = true;
  }));
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
