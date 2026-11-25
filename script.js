'use strict';

const USUARIO = 'Johnn5527';

const PROJETOS = [
  { repo: 'radar-pi', emoji: '📡', descricao: 'Avisador de radares offline para Raspberry Pi e Android, com map matching e voz em pt-BR.', tags: ['Python', 'SQLite', 'OSM'] },
  { repo: 'calculadora-maluca', emoji: '🍄', descricao: 'Calculadora web em que cada "=" vira um minijogo retrô, com ranking e back-end seguro.', tags: ['JavaScript', 'Node.js', 'Java'] },
  { repo: 'gerador-senhas-seguro', emoji: '🔐', descricao: 'Senhas e frases-senha com secrets e hash Argon2id.', tags: ['Python', 'Argon2id'] },
  { repo: 'analisador-logs', emoji: '🕵️', descricao: 'Detecta força bruta, varreduras e injeções em logs, com resumo por IA opcional.', tags: ['Python', 'Segurança', 'IA'] },
  { repo: 'CALCULADORA', emoji: '🧮', descricao: 'Calculadora científica inspirada no Android.', tags: ['React', 'TypeScript', 'Vite'] },
];

const FRASES = [
  'ESTUDANTE DE CIÊNCIA DA COMPUTAÇÃO',
  'PYTHON | JAVASCRIPT | NODE.JS',
  'AUTOMAÇÃO | SEGURANÇA | IA',
  'TRANSFORMANDO PROBLEMAS EM SOLUÇÕES',
];

function digitar(alvo, frases) {
  let frase = 0;
  let letra = 0;
  let apagando = false;
  const passo = () => {
    const texto = frases[frase];
    letra += apagando ? -1 : 1;
    alvo.textContent = texto.slice(0, letra);
    let espera = apagando ? 35 : 70;
    if (!apagando && letra === texto.length) { apagando = true; espera = 1600; }
    else if (apagando && letra === 0) { apagando = false; frase = (frase + 1) % frases.length; espera = 300; }
    setTimeout(passo, espera);
  };
  passo();
}

// Monta os cards com textContent (sem innerHTML), evitando XSS.
function criarCard(p) {
  const card = document.createElement('article');
  card.className = 'card';

  const titulo = document.createElement('h3');
  titulo.textContent = `${p.emoji} ${p.repo}`;

  const desc = document.createElement('p');
  desc.textContent = p.descricao;

  const tags = document.createElement('div');
  tags.className = 'tags';
  p.tags.forEach((t) => {
    const s = document.createElement('span');
    s.className = 'tag';
    s.textContent = t;
    tags.appendChild(s);
  });

  const estrelas = document.createElement('span');
  estrelas.className = 'estrelas';
  estrelas.dataset.repo = p.repo;

  const link = document.createElement('a');
  link.href = `https://github.com/${USUARIO}/${encodeURIComponent(p.repo)}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Ver no GitHub →';

  card.append(titulo, desc, tags, estrelas, link);
  return card;
}

async function carregarEstrelas() {
  try {
    const resp = await fetch(`https://api.github.com/users/${USUARIO}/repos?per_page=100`);
    if (!resp.ok) return; // sem rede ou limite da API: os cards continuam funcionando
    const repos = await resp.json();
    const porNome = new Map(repos.map((r) => [r.name, r]));
    document.querySelectorAll('.estrelas').forEach((el) => {
      const r = porNome.get(el.dataset.repo);
      if (r) el.textContent = `⭐ ${r.stargazers_count} · atualizado em ${new Date(r.pushed_at).toLocaleDateString('pt-BR')}`;
    });
  } catch {
    /* falha silenciosa: dados extras são opcionais */
  }
}

function revelarAoRolar() {
  const itens = document.querySelectorAll('.revelar');
  if (!('IntersectionObserver' in window)) { itens.forEach((i) => i.classList.add('visivel')); return; }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  itens.forEach((i) => obs.observe(i));
}

document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista-projetos');
  PROJETOS.forEach((p) => lista.appendChild(criarCard(p)));
  document.getElementById('ano').textContent = new Date().getFullYear();
  digitar(document.getElementById('digitando'), FRASES);
  revelarAoRolar();
  carregarEstrelas();
});
