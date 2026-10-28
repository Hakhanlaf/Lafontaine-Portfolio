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
  const fields = [['role', 'Mon rôle'], ['context', 'Contexte'], ['approach', 'Fonctionnement'], ['tools', 'Outils'], ['result', 'Livrable / résultat'], ['credits', 'Crédits']];
  let incomplete = false;
  data.projects.forEach((project, index) => {
    const card = el('article', 'project-card');
    card.dataset.category = project.category;
    card.id = project.id;
    if (project.category === 'jeu') card.classList.add('game-project');
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
    if (project.role?.trim()) {
      const role = el('p', 'project-role-preview');
      role.append(el('strong', '', 'Mon rôle — '), document.createTextNode(project.role));
      copy.append(role);
    }
    const details = el('details'); const summary = el('summary', '', 'Voir les détails');
    const detailBody = el('div', 'project-detail');
    let filled = 0;
    fields.forEach(([key, label]) => {
      if (!project[key]?.trim()) return;
      const p = el('p'); p.append(el('strong', '', `${label} — `), document.createTextNode(project[key])); detailBody.append(p); filled++;
    });
    if (!filled) { detailBody.append(el('p', 'muted', 'Fiche à compléter : contexte, objectif, rôle personnel, démarche, outils et livrables.')); incomplete = true; }
    if (project.credits && !project.role) detailBody.append(el('p', 'muted', 'Hakhan_laf figure parmi les auteurs. Le détail de ma contribution sera ajouté à cette fiche.'));
    (project.presentation ? [] : project.gallery || []).forEach(shot => {
      const src = safeUrl(shot.image);
      if (!src) return;
      const figure = el('figure', 'game-capture');
      const img = el('img'); img.src = src; img.alt = shot.alt || `Capture de ${project.title}`; img.loading = 'lazy';
      figure.append(img); detailBody.append(figure);
    });
    const url = safeUrl(project.link);
    if (url) { const link = el('a', '', `${project.linkLabel || 'Voir le projet'} ↗`); link.href = url; detailBody.append(link); }
    details.append(summary, detailBody); copy.append(details);
    if (project.presentation) {
      const presentation = el('a', 'project-page-link', 'Voir le projet ↗');
      presentation.href = safeUrl(project.presentation);
      const imageLink = el('a'); imageLink.href = presentation.href; imageLink.setAttribute('aria-label', 'Voir le projet ' + project.title);
      imageLink.append(visual);
      copy.append(presentation);
    }
    card.append(visual.parentElement?.tagName === 'A' ? visual.parentElement : visual, copy); grid.append(card);

  });
  document.querySelector('#draft-note').hidden = !incomplete;
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.hidden = button.dataset.filter !== 'all' && !data.projects.some(project => project.category === button.dataset.filter);
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      let count = 0;
      grid.querySelectorAll('article').forEach(card => {
        card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) count++;

      });
      document.querySelector('#filter-status').textContent = `${count} projet${count > 1 ? 's' : ''} affiché${count > 1 ? 's' : ''}.`;
    });
  });
})();
