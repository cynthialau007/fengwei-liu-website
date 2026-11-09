(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
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
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 721px)').addEventListener('change', closeMenu);

  const papers = [...document.querySelectorAll('.publication')];
  document.querySelectorAll('.filter').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(filter => {
        const selected = filter === button;
        filter.classList.toggle('active', selected);
        filter.setAttribute('aria-pressed', String(selected));
      });
      let count = 0;
      papers.forEach(paper => {
        paper.hidden = button.dataset.filter !== 'all' && paper.dataset.category !== button.dataset.filter;
        if (!paper.hidden) count++;
      });
      document.querySelector('#filter-status').textContent = `共 ${count} 篇`;
    });
  });

  const citations = [
    '吕维霞, 刘丰玮. WSR理论视域下社区生活垃圾分类效果提升路径——基于16个社区的模糊集定性比较分析[J]. 理论探讨, 2025(01): 104-115.',
    'Xianglan Jin, Huizhu Cui, Fengwei Liu, et al. Does cybersecurity regulation promote digital transformation? Evidence from the Cyber Security Law in China[J]. Finance Research Letters, 2025, 76: 107041.',
    '刘丰玮, 吕维霞. 协同视角下城市生活垃圾分类三元合作治理机制[J]. 公关世界, 2024(03): 169-171.'
  ];
  let toastTimer;
  function showToast(message) {
    const toast = document.querySelector('.toast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }
  async function copyText(text, message) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const active = document.activeElement;
        const area = document.createElement('textarea');
        area.value = text;
        area.style.cssText = 'position:fixed;top:0;left:-9999px';
        document.body.appendChild(area);
        area.select();
        const success = document.execCommand('copy');
        area.remove();
        if (active) active.focus({ preventScroll: true });
        if (!success) throw new Error('Clipboard unavailable');
      }
      showToast(message);
    } catch {
      showToast('暂时无法自动复制，请选择页面文字后手动复制。');
    }
  }
  document.querySelectorAll('.copy-citation').forEach(button => {
    button.addEventListener('click', () => copyText(citations[Number(button.dataset.paper)], '论文引用已复制'));
  });
  document.querySelector('.copy-email').addEventListener('click', () => copyText('cynthialau163@163.com', '邮箱地址已复制'));
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
