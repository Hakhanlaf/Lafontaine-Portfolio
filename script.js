(() => {
  'use strict';
  const data = window.PORTFOLIO;
  if (!data) return;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  // Accepte les fichiers relatifs et les liens HTTPS ; refuse les protocoles exécutables.
  const safeUrl = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    const valueTrimmed = value.trim();
    if (/^https:\/\//i.test(valueTrimmed)) return valueTrimmed;
    if (/^(?![\/\\#?])[^:\\]+$/.test(valueTrimmed) && !valueTrimmed.split('/').includes('..')) return valueTrimmed;
    return '';
  };
  if (data.name.trim()) {
    document.querySelectorAll('[data-name]').forEach(n => { n.textContent = data.name; });
    document.title = `${data.name} — Communication & graphisme`;
  }
  if (data.about.trim()) {
    document.querySelector('#about-text').textContent = data.about;
    document.querySelector('#about-placeholder').hidden = true;
  }
  const cv = safeUrl(data.cv);
  if (cv) {
    const link = document.querySelector('#cv-link');
    link.href = cv;
    link.hidden = false;
  }
  const contacts = document.querySelector('#contact-links');
  const addContact = (label, href) => {
    if (contacts.querySelector('p')) contacts.replaceChildren();
    const link = el('a', '', label); link.href = href; contacts.append(link);
  };
  if (/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)) addContact(data.email, `mailto:${data.email}`);
  if (/^https:\/\//i.test(data.linkedin) && safeUrl(data.linkedin)) addContact('LinkedIn ↗', data.linkedin);
  const grid = document.querySelector('#project-grid');
  const fields = [['context', 'Contexte'], ['role', 'Mon rôle'], ['approach', 'Fonctionnement'], ['tools', 'Outils'], ['result', 'Livrable / résultat'], ['credits', 'Crédits']];
  let incomplete = false;
  data.projects.forEach((project, index) => {
    const card = el('article', 'project-card');
    card.dataset.category = project.category;
    card.id = project.id;
    if (project.embed) card.classList.add('game-project');
    const number = el('span', 'project-number', String(index + 1).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    card.append(number);
    const visual = el('div', 'project-visual');
    const image = safeUrl(project.image);
    const placeholder = () => {
      const block = el('div', 'placeholder');
      const mark = el('b', '', ['Aa', '×', '▶', '+'][index % 4]);
      mark.setAttribute('aria-hidden', 'true');
      block.append(mark, el('span', '', project.label), el('small', '', 'Visuels à venir'));
      visual.replaceChildren(block);
    };
    if (image) {
      const img = el('img'); img.src = image; img.alt = project.alt || project.title; img.loading = 'lazy';
      img.addEventListener('error', placeholder, { once: true }); visual.append(img);
    } else { placeholder(); incomplete = true; }
    const heading = el('div', 'project-heading');
    const title = el('h3', '', project.title); title.id = `project-${index}`;
    card.setAttribute('aria-labelledby', title.id);
    heading.append(title, el('span', '', project.label));
    const copy = el('div', 'project-copy');
    copy.append(heading, el('p', 'project-intro', project.intro));
    const details = el('details'); const summary = el('summary', '', 'Voir les détails');
    const detailBody = el('div', 'project-detail');
    let filled = 0;
    fields.forEach(([key, label]) => {
      if (!project[key]?.trim()) return;
      const p = el('p'); p.append(el('strong', '', `${label} — `), document.createTextNode(project[key])); detailBody.append(p); filled++;
    });
    if (!filled) { detailBody.append(el('p', 'muted', 'Fiche à compléter : contexte, objectif, rôle personnel, démarche, outils et livrables.')); incomplete = true; }
    if (project.credits && !project.role) detailBody.append(el('p', 'muted', 'Hakhan_laf figure parmi les auteurs. Le détail de ma contribution sera ajouté à cette fiche.'));
    (project.gallery || []).forEach(shot => {
      const src = safeUrl(shot.image);
      if (!src) return;
      const figure = el('figure', 'game-capture');
      const img = el('img'); img.src = src; img.alt = shot.alt || `Capture de ${project.title}`; img.loading = 'lazy';
      figure.append(img); detailBody.append(figure);
    });
    const url = safeUrl(project.link);
    if (url) { const link = el('a', '', `${project.linkLabel || 'Voir le projet'} ↗`); link.href = url; detailBody.append(link); }
    details.append(summary, detailBody); copy.append(details); card.append(visual, copy); grid.append(card);
    if (project.embed) {
      const embed = project.embed;
      const isGame = embed.type === 'play' && Number.isInteger(embed.upload) && embed.upload > 0;
      const isDownload = embed.type === 'download' && Number.isInteger(embed.game) && embed.game > 0;
      if (!isGame && !isDownload) return;
      const player = el('details', 'game-player');
      const toggle = el('summary', '', isGame ? 'Jouer sur cette page' : 'Télécharger · Windows');
      const body = el('div', 'game-player-body');
      const stage = el('div', isGame ? 'game-stage' : 'itch-widget');
      const controls = el('p', 'game-controls', project.controls);
      const toolbar = el('div', 'game-toolbar');
      toolbar.append(el('span', '', 'Hébergé sur itch.io · Chargé à l’ouverture'));
      if (isGame) {
        const fullscreen = el('button', '', 'Plein écran ↗'); fullscreen.type = 'button';
        fullscreen.addEventListener('click', () => {
          if (stage.requestFullscreen) stage.requestFullscreen().catch(() => { controls.textContent = 'Le plein écran est indisponible. Vous pouvez utiliser la page itch.io.'; });
        });
        toolbar.append(fullscreen);
      }
      body.append(toolbar, stage, controls);
      player.append(toggle, body); card.append(player);
      let observer;
      player.addEventListener('toggle', () => {
        if (!player.open) { observer?.disconnect(); stage.replaceChildren(); return; }
        if (stage.querySelector('iframe')) return;
        const frame = el('iframe'); frame.title = isGame ? `Jouer à ${project.title}` : `Télécharger ${project.title} sur itch.io`;
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.allow = 'autoplay; fullscreen; gamepad'; frame.allowFullscreen = true;
        if (isGame) {
          frame.src = `https://itch.io/embed-upload/${embed.upload}?color=20211e`;
          const width = embed.width || 1280, height = (embed.height || 720) + 35;
          stage.style.aspectRatio = `${width} / ${height}`;
          frame.width = width; frame.height = height;
          const resize = () => {
            const scale = Math.min(stage.clientWidth / width, stage.clientHeight / height);
            frame.style.transform = `translate(-50%, -50%) scale(${scale})`;
          };
          observer = new ResizeObserver(resize);
          stage.append(frame); observer.observe(stage); resize();
        } else {
          frame.src = `https://itch.io/embed/${embed.game}?bg_color=f1efe7&fg_color=20211e&link_color=173cc6&border_color=c8c8bc`;
          frame.width = '552'; frame.height = '167'; stage.append(frame);
        }
      });
    }
  });
  document.querySelector('#draft-note').hidden = !incomplete;
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      let count = 0;
      grid.querySelectorAll('article').forEach(card => {
        card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) count++;
        else { const player = card.querySelector('.game-player'); if (player) player.open = false; }
      });
      document.querySelector('#filter-status').textContent = `${count} projet${count > 1 ? 's' : ''} affiché${count > 1 ? 's' : ''}.`;
    });
  });
})();
