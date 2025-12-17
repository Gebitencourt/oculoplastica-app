// ========= MOTOR DO APP (v4 - Prova Final 30/90 sem gabarito imediato) =========
const bancoQuestoes = { 1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[] };

let estado = {
  capitulo: 1,
  tamanho: 10,
  pool: [],
  idx: 0,
  acertos: 0,
  inicio: null,
  timerId: null,
  respostas: [],       // índice marcado por questão (ou null)
  provaFinal: false    // true quando capitulo 9
};

// Configuração da tela inicial (capítulos 1–8)
let config = { tamanho: null };

function $(id){ return document.getElementById(id); }

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatTime(ms){
  const s = Math.floor(ms/1000);
  const mm = String(Math.floor(s/60)).padStart(2,'0');
  const ss = String(s%60).padStart(2,'0');
  return `${mm}:${ss}`;
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// Tema
function setTema(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("tema", theme);
}
function toggleTema(){
  const atual = document.documentElement.getAttribute("data-theme") || "dark";
  setTema(atual === "dark" ? "light" : "dark");
}
function initTema(){
  const salvo = localStorage.getItem("tema") || "dark";
  setTema(salvo);
}

// Modo prova: só questões
function setExamMode(on){
  document.body.classList.toggle("exam-mode", !!on);
}

// Tela inicial: seleção de modo (capítulos 1–8)
function selecionarModo(qtd){
  config.tamanho = qtd;
  $("btn10")?.classList.remove("mode-selected");
  $("btn40")?.classList.remove("mode-selected");
  (qtd === 10 ? $("btn10") : $("btn40"))?.classList.add("mode-selected");
  atualizarResumoConfig();
}

function atualizarResumoConfig(){
  const cap = parseInt($("capitulo")?.value || "1", 10);
  const linhaModos = $("linhaModos");
  const el = $("resumoConfig");

  if(cap === 9){
    // Prova final: fixa 30 questões, sem necessidade de modo 10/40
    if(linhaModos) linhaModos.classList.add("hidden");
    if(el) el.innerHTML = `<b>Selecionado:</b> SIMULADO PROVA FINAL • <b>30 questões</b> (sorteadas de 90) • sem gabarito durante a prova.`;
    return;
  }

  if(linhaModos) linhaModos.classList.remove("hidden");
  const modo = config.tamanho ? `${config.tamanho} questões` : "selecione 10 ou 40";
  if(el) el.innerHTML = `<b>Selecionado:</b> Capítulo ${cap} • <b>Modo:</b> ${modo}`;
}

function confirmarEIniciar(){
  const cap = parseInt($("capitulo")?.value || "1", 10);
  if(cap === 9){
    iniciarProvaFinal();
    return;
  }
  if(!config.tamanho){
    const el = $("resumoConfig");
    if(el) el.innerHTML = `<b>Selecione o modo</b> (10 ou 40) antes de iniciar.`;
    return;
  }
  iniciarProva(config.tamanho);
}

// Prova padrão (capítulos 1–8)
function iniciarProva(qtd){
  const cap = parseInt($("capitulo").value, 10);
  estado.capitulo = cap;
  estado.tamanho = qtd;
  estado.provaFinal = false;

  const questoes = (bancoQuestoes[cap] || []).slice();
  if(questoes.length === 0){
    $("prova").innerHTML = `<p class="small">Sem questões carregadas para este capítulo.</p>`;
    return;
  }

  const n = Math.min(qtd, questoes.length);
  estado.pool = shuffle(questoes).slice(0, n);
  estado.idx = 0;
  estado.acertos = 0;
  estado.inicio = Date.now();
  estado.respostas = new Array(n).fill(null);

  setExamMode(true);
  renderQuestao();
}

// Prova Final (capítulo 9): 30 de 90, sem gabarito imediato
function iniciarProvaFinal(){
  const cap = 9;
  estado.capitulo = cap;
  estado.tamanho = 30;
  estado.provaFinal = true;

  const questoes = (bancoQuestoes[cap] || []).slice();
  if(questoes.length < 90){
    $("prova").innerHTML = `<p class="small">Banco da Prova Final ainda não está completo (precisa de 90 questões).</p>`;
    return;
  }

  estado.pool = shuffle(questoes).slice(0, 30);
  estado.idx = 0;
  estado.acertos = 0;
  estado.inicio = Date.now();
  estado.respostas = new Array(30).fill(null);

  setExamMode(true);
  renderQuestao();
}

function renderQuestao(){
  const q = estado.pool[estado.idx];

  const tag = estado.provaFinal
    ? `<span class="tag">PROVA FINAL</span><span class="tag">${estado.idx+1}/30</span>`
    : `<span class="tag">Cap ${estado.capitulo}</span><span class="tag">${estado.idx+1}/${estado.pool.length}</span>`;

  const html = `
    <div style="margin-bottom:10px;">${tag}</div>
    <h2 class="q-title">Q${estado.idx+1}. ${escapeHtml(q.pergunta)}</h2>
    <form id="formQ">
      ${q.alternativas.map((a, i)=>`
        <label class="alt">
          <input type="radio" name="alt" value="${i}" />
          ${escapeHtml(a)}
        </label>
      `).join("")}

      <div class="actions">
        <button class="btn" type="button" onclick="confirmar()">Confirmar</button>
        <button class="btn ghost" type="button" onclick="pular()">Pular</button>
        <button class="btn secondary" type="button" onclick="finalizar()">Finalizar</button>
      </div>
    </form>
    <div id="fb"></div>
  `;

  $("prova").innerHTML = html;

  // Se já tinha resposta marcada (em caso de navegação futura), re-marcar
  const ja = estado.respostas[estado.idx];
  if(ja !== null){
    const el = document.querySelector(`input[name="alt"][value="${ja}"]`);
    if(el) el.checked = true;
  }
}

function confirmar(){
  const q = estado.pool[estado.idx];
  const form = $("formQ");
  const escolhido = form?.alt?.value;

  if(escolhido === undefined){
    $("fb").innerHTML = `<div class="feedback bad"><div class="t">Selecione uma alternativa.</div></div>`;
    return;
  }

  const sel = parseInt(escolhido, 10);
  estado.respostas[estado.idx] = sel;

  // PROVA FINAL: não exibir gabarito nem explicação agora
  if(estado.provaFinal){
    $("fb").innerHTML = `
      <div class="feedback ok">
        <div class="t">Resposta registrada</div>
        <div class="small">O gabarito e as explicações aparecem apenas no final.</div>
        <div class="actions">
          <button class="btn" type="button" onclick="proxima()">Próxima</button>
        </div>
      </div>
    `;
    [...document.querySelectorAll('input[name="alt"]')].forEach(el => el.disabled = true);
    return;
  }

  // Prova padrão: feedback imediato
  const correta = q.correta;
  const ok = sel === correta;
  if(ok) estado.acertos++;

  const titulo = ok ? "Correto" : "Incorreto";
  const cls = ok ? "ok" : "bad";
  const corretaTxt = q.alternativas[correta];
  const exp = q.explicacao || "Sem explicação cadastrada.";

  $("fb").innerHTML = `
    <div class="feedback ${cls}">
      <div class="t">${titulo}</div>
      ${ok ? "" : `<div class="small"><b>Correta:</b> ${escapeHtml(corretaTxt)}</div>`}
      <div class="hr"></div>
      <div class="small">${escapeHtml(exp)}</div>
      <div class="actions">
        <button class="btn" type="button" onclick="proxima()">Próxima</button>
      </div>
    </div>
  `;

  [...document.querySelectorAll('input[name="alt"]')].forEach(el => el.disabled = true);
}

function proxima(){
  if(estado.idx < estado.pool.length - 1){
    estado.idx++;
    renderQuestao();
  } else {
    finalizar();
  }
}

function pular(){
  if(estado.idx < estado.pool.length - 1){
    estado.idx++;
    renderQuestao();
  } else {
    finalizar();
  }
}

function finalizar(){
  // Corrigir (especialmente na prova final)
  const total = estado.pool.length;
  let acertos = 0;

  for(let i=0;i<total;i++){
    const q = estado.pool[i];
    const sel = estado.respostas[i];
    if(sel !== null && sel === q.correta) acertos++;
  }

  const tempoMs = estado.inicio ? (Date.now() - estado.inicio) : 0;
  const pct = total ? Math.round((acertos/total)*100) : 0;

  salvarHistorico({
    data: new Date().toISOString(),
    capitulo: estado.capitulo,
    total,
    acertos,
    pct,
    tempo: formatTime(tempoMs),
    modo: estado.capitulo === 9 ? "PROVA FINAL (30/90)" : (total === 40 ? "Completo (40)" : "Simulado (10)")
  });

  setExamMode(false);
  atualizarResumoConfig();

  if(estado.capitulo === 9){
    renderResultadoProvaFinal(acertos, total, pct, tempoMs);
  } else {
    renderResultadoPadrao(acertos, total, pct, tempoMs);
  }

  estado.inicio = null;
}

function renderResultadoPadrao(acertos, total, pct, tempoMs){
  $("prova").innerHTML = `
    <h2 class="q-title">Resultado</h2>
    <p class="small"><b>Capítulo:</b> ${estado.capitulo} • <b>Acertos:</b> ${acertos}/${total} (${pct}%) • <b>Tempo:</b> ${formatTime(tempoMs)}</p>
    <div class="actions">
      <button class="btn" type="button" onclick="iniciarProva(${total})">Refazer</button>
      <button class="btn secondary" type="button" onclick="mostrarHistorico()">Ver histórico</button>
    </div>
  `;
}

function renderResultadoProvaFinal(acertos, total, pct, tempoMs){
  // Mostrar explicação detalhada somente das erradas (com revisão por questão)
  const linhas = [];

  for(let i=0;i<total;i++){
    const q = estado.pool[i];
    const sel = estado.respostas[i];
    const ok = (sel !== null && sel === q.correta);

    const sua = (sel === null) ? "Não respondida" : q.alternativas[sel];
    const correta = q.alternativas[q.correta];

    linhas.push(`
      <div class="hr"></div>
      <div class="small">
        <b>Q${i+1}.</b> ${escapeHtml(q.pergunta)}<br/>
        <b>Sua resposta:</b> ${escapeHtml(sua)}<br/>
        <b>Status:</b> ${ok ? "Correta" : "Errada"}<br/>
        ${ok ? "" : `<b>Correta:</b> ${escapeHtml(correta)}<br/>`}
        ${ok ? "" : `<div class="hr"></div><b>Explicação:</b><br/>${escapeHtml(q.explicacao || "Sem explicação cadastrada.")}`}
      </div>
    `);
  }

  $("prova").innerHTML = `
    <h2 class="q-title">PROVA FINAL – Resultado</h2>
    <p class="small">
      <b>Nota:</b> ${acertos}/${total} (${pct}%) • <b>Tempo:</b> ${formatTime(tempoMs)}
    </p>

    <div class="actions">
      <button class="btn" type="button" onclick="iniciarProvaFinal()">Refazer PROVA FINAL (novo sorteio)</button>
      <button class="btn secondary" type="button" onclick="mostrarHistorico()">Ver histórico</button>
    </div>

    <div class="hr"></div>
    <h2 class="q-title">Revisão questão a questão</h2>
    ${linhas.join("")}
  `;
}

// Histórico
function salvarHistorico(item){
  const key = "hist_oculo";
  const atual = JSON.parse(localStorage.getItem(key) || "[]");
  atual.unshift(item);
  localStorage.setItem(key, JSON.stringify(atual.slice(0, 50)));
}

function mostrarHistorico(){
  const key = "hist_oculo";
  const itens = JSON.parse(localStorage.getItem(key) || "[]");
  const box = $("historico");
  box.classList.remove("hidden");

  if(itens.length === 0){
    box.innerHTML = `<h2 class="q-title">Histórico</h2><p class="small">Sem registros ainda.</p>`;
    return;
  }

  box.innerHTML = `
    <h2 class="q-title">Histórico</h2>
    ${itens.map(i => `
      <div class="hr"></div>
      <div class="small">
        <b>${new Date(i.data).toLocaleString()}</b><br/>
        ${i.capitulo === 9 ? "PROVA FINAL" : `Cap ${i.capitulo}`} • ${i.modo} • <b>${i.acertos}/${i.total}</b> (${i.pct}%) • Tempo: ${i.tempo}
      </div>
    `).join("")}
  `;
}

function resetarHistorico(){
  localStorage.removeItem("hist_oculo");
  mostrarHistorico();
}

window.addEventListener("load", () => {
  initTema();
  atualizarResumoConfig();
});

// ======= A PARTIR DAQUI, MANTENHA SUAS QUESTÕES COMO ESTÃO =======


bancoQuestoes[1] = [
  {
    pergunta: "Na porção central da pálpebra inferior, qual é a sequência correta das estruturas da margem palpebral, de anterior para posterior?",
    alternativas: [
      "Pele, cílios, linha cinzenta, orifícios glandulares, conjuntiva",
      "Pele, linha cinzenta, cílios, conjuntiva, orifícios glandulares",
      "Conjuntiva, orifícios glandulares, linha cinzenta, cílios, pele",
      "Pele, cílios, orifícios glandulares, linha cinzenta, conjuntiva",
      "Pele, glândulas de Meibômio, cílios, conjuntiva, linha cinzenta"
    ],
    correta: 0,
    explicacao: "O material descreve a sequência: pele → cílios → linha cinzenta → orifícios glandulares → conjuntiva."
  },
  {
    pergunta: "Qual porção do músculo orbicular é principalmente responsável pelo fechamento palpebral reflexo (piscar)?",
    alternativas: [
      "Porção orbital",
      "Porção palpebral",
      "Porção pré-septal",
      "Porção pré-tarsal",
      "Porção de Riolan"
    ],
    correta: 1,
    explicacao: "O texto diferencia: porção orbital = fechamento voluntário; porção palpebral = piscar/reflexo, com subdivisões pré-septal e pré-tarsal."
  },
  {
    pergunta: "Qual nervo é responsável pela inervação do músculo orbicular dos olhos?",
    alternativas: [
      "Nervo trigêmeo (V)",
      "Nervo oculomotor (III)",
      "Nervo facial (VII)",
      "Nervo abducente (VI)",
      "Nervo troclear (IV)"
    ],
    correta: 2,
    explicacao: "O material destaca que o orbicular é inervado pelo nervo facial (VII)."
  },
  {
    pergunta: "O septo orbitário atua principalmente como:",
    alternativas: [
      "Músculo elevador da pálpebra superior",
      "Barreira entre órbita e pálpebra, dificultando passagem de sangue/fluido/micro-organismos",
      "Ligamento de sustentação do fórnice conjuntival",
      "Estrutura secretora do componente lipídico da lágrima",
      "Fáscia de inserção primária do músculo reto superior"
    ],
    correta: 1,
    explicacao: "O PDF descreve o septo orbitário como barreira fibrosa entre órbita e pálpebra."
  },
  {
    pergunta: "Na pálpebra superior, o septo orbitário se funde principalmente com:",
    alternativas: [
      "Tarso, ao nível da margem palpebral",
      "Músculo de Müller, ao nível do fórnice",
      "Aponeurose do levantador da pálpebra superior",
      "Tendão cantal lateral, próximo ao tubérculo orbital",
      "Conjuntiva tarsal, no lábio posterior"
    ],
    correta: 2,
    explicacao: "O texto descreve fusão do septo orbitário com a aponeurose do levantador na pálpebra superior."
  },
  {
    pergunta: "A prega palpebral superior corresponde principalmente a:",
    alternativas: [
      "Fixação da conjuntiva ao tarso",
      "Adesão do complexo septo/aponeurose à pele por lâminas que atravessam o orbicular",
      "Inserção do orbicular orbital no periósteo",
      "Dobramento do fórnice conjuntival superior",
      "Transição do músculo de Müller para a aponeurose"
    ],
    correta: 1,
    explicacao: "O PDF relaciona a prega palpebral superior à adesão firme do complexo septo/aponeurose à pele, atravessando o orbicular."
  },
  {
    pergunta: "O ligamento de Whitnall (ligamento transverso superior) está associado a qual marco anatômico do levantador da pálpebra superior?",
    alternativas: [
      "Transição entre porção muscular e porção aponeurótica do levantador",
      "Inserção final da aponeurose na margem ciliar",
      "Origem do levantador no tubérculo orbital lateral",
      "Inserção do músculo de Müller no tarso inferior",
      "Formação do canalículo comum"
    ],
    correta: 0,
    explicacao: "O material afirma que ao nível de Whitnall ocorre a transição da porção muscular para a porção aponeurótica do levantador."
  },
  {
    pergunta: "O músculo de Müller é um músculo liso com inervação simpática. Sua ação típica é elevar a pálpebra superior em cerca de:",
    alternativas: [
      "0,5 mm",
      "1,0 mm",
      "2,0 mm",
      "4,0 mm",
      "6,0 mm"
    ],
    correta: 2,
    explicacao: "O texto descreve elevação em torno de 2,0 mm."
  },
  {
    pergunta: "Na margem palpebral, os orifícios das glândulas de Meibômio localizam-se:",
    alternativas: [
      "No lábio anterior, junto aos folículos ciliares",
      "No lábio posterior da porção ciliar, marcando o início da conjuntiva palpebral",
      "No canto lateral, junto ao tendão cantal lateral",
      "No canto medial, na porção lacrimal (sem cílios)",
      "Na pele da pálpebra, no subcutâneo"
    ],
    correta: 1,
    explicacao: "O texto descreve os orifícios das glândulas de Meibômio no lábio posterior da porção ciliar, onde se inicia a conjuntiva palpebral."
  },
  {
    pergunta: "Os pontos lacrimais dividem a margem palpebral em duas porções. Qual alternativa descreve corretamente essa divisão?",
    alternativas: [
      "Porção ciliar medial (sem cílios) e porção lacrimal lateral (com cílios)",
      "Porção canalicular/lacrimal medial (sem cílios) e porção ciliar lateral (com cílios)",
      "Porção tarsal anterior e porção conjuntival posterior",
      "Porção pré-septal e porção pré-tarsal",
      "Porção orbital e porção palpebral"
    ],
    correta: 1,
    explicacao: "O texto descreve: porção canalicular/lacrimal medial sem cílios e porção ciliar lateral com cílios."
  }
];
bancoQuestoes[1] = [
  // ===== 15 ANATOMIA =====
  {
    pergunta: "Na porção central da pálpebra inferior, qual é a sequência correta das estruturas da margem palpebral, de anterior para posterior?",
    alternativas: [
      "Pele, cílios, linha cinzenta, orifícios glandulares, conjuntiva",
      "Pele, linha cinzenta, cílios, conjuntiva, orifícios glandulares",
      "Conjuntiva, orifícios glandulares, linha cinzenta, cílios, pele",
      "Pele, cílios, orifícios glandulares, linha cinzenta, conjuntiva",
      "Pele, glândulas de Meibômio, cílios, conjuntiva, linha cinzenta"
    ],
    correta: 0,
    explicacao: "A apostila descreve: pele → cílios → linha cinzenta → orifícios glandulares → conjuntiva."
  },
  {
    pergunta: "Qual porção do músculo orbicular é principalmente responsável pelo “piscar” (fechamento palpebral reflexo)?",
    alternativas: [
      "Porção orbital",
      "Porção palpebral",
      "Porção pré-septal apenas",
      "Porção de Whitnall",
      "Porção do músculo frontal"
    ],
    correta: 1,
    explicacao: "A porção orbital está relacionada ao fechamento voluntário; a porção palpebral ao piscar, subdividindo-se em pré-septal e pré-tarsal."
  },
  {
    pergunta: "Qual nervo é responsável pela inervação do músculo orbicular dos olhos?",
    alternativas: [
      "Nervo trigêmeo (V)",
      "Nervo oculomotor (III)",
      "Nervo facial (VII)",
      "Nervo abducente (VI)",
      "Nervo troclear (IV)"
    ],
    correta: 2,
    explicacao: "O músculo orbicular é inervado pelo nervo facial (VII)."
  },
  {
    pergunta: "O septo orbitário é melhor descrito como:",
    alternativas: [
      "Estrutura secretora principal da fase lipídica da lágrima",
      "Barreira entre órbita e pálpebra, reduzindo disseminação de micro-organismos/sangue/fluido para o conteúdo orbitário",
      "Ligamento responsável pelo fechamento voluntário palpebral",
      "Camada que forma a linha cinzenta",
      "Estrutura exclusiva do canto lateral"
    ],
    correta: 1,
    explicacao: "O septo orbitário é tecido fibroso que forma barreira entre órbita e pálpebra."
  },
  {
    pergunta: "Na pálpebra superior, o septo orbitário funde-se principalmente com:",
    alternativas: [
      "Tarso superior, na margem livre",
      "Conjuntiva palpebral, no fórnice",
      "Aponeurose do levantador da pálpebra superior",
      "Tendão cantal lateral",
      "Músculo reto superior"
    ],
    correta: 2,
    explicacao: "A apostila descreve fusão do septo orbitário com a aponeurose do levantador na pálpebra superior."
  },
  {
    pergunta: "A prega palpebral superior está relacionada principalmente a:",
    alternativas: [
      "Inserção do orbicular no periósteo lateral",
      "Fusão septo-aponeurose e sua inserção/adesão à pele atravessando o orbicular",
      "Local de saída dos canalículos",
      "União do tarso à conjuntiva",
      "Porção canalicular sem cílios"
    ],
    correta: 1,
    explicacao: "A prega palpebral superior decorre da fusão septo/aponeurose e sua fixação à pele, atravessando o orbicular."
  },
  {
    pergunta: "Ao nível do ligamento de Whitnall, ocorre tipicamente:",
    alternativas: [
      "Transição entre porção muscular e porção aponeurótica do levantador",
      "Origem da glândula lacrimal",
      "Inserção do músculo de Müller no tarso inferior",
      "Formação da arcada marginal",
      "Separação das pálpebras no desenvolvimento fetal"
    ],
    correta: 0,
    explicacao: "A apostila descreve a transição do levantador para aponeurose ao nível de Whitnall."
  },
  {
    pergunta: "A aponeurose do levantador da pálpebra superior, anteriormente, atravessa qual estrutura para inserir-se no subcutâneo e formar a prega palpebral?",
    alternativas: [
      "Orbicular pré-tarsal",
      "Septo orbitário",
      "Tarso",
      "Conjuntiva",
      "Fáscia capsulopalpebral"
    ],
    correta: 0,
    explicacao: "O texto descreve a aponeurose atravessando o orbicular pré-tarsal e inserindo-se no subcutâneo, formando a prega."
  },
  {
    pergunta: "Na margem palpebral, os pontos lacrimais dividem a margem em:",
    alternativas: [
      "Porção ciliar medial sem cílios e porção lacrimal lateral com cílios",
      "Porção canalicular/lacrimal medial sem cílios e porção ciliar lateral com cílios",
      "Porção anterior e posterior do tarso",
      "Porção orbital e palpebral do orbicular",
      "Porção pré-septal e pré-tarsal"
    ],
    correta: 1,
    explicacao: "A apostila define porção canalicular/lacrimal medial (sem cílios) e porção ciliar lateral (com cílios)."
  },
  {
    pergunta: "Os orifícios das glândulas de Meibômio localizam-se tipicamente:",
    alternativas: [
      "No lábio anterior da porção ciliar, junto aos folículos ciliares",
      "No lábio posterior da porção ciliar, marcando o início da conjuntiva palpebral",
      "Na porção canalicular medial, ao redor do ponto lacrimal",
      "No fórnice conjuntival",
      "Na pele palpebral superficial"
    ],
    correta: 1,
    explicacao: "O lábio posterior da porção ciliar contém os orifícios de Meibômio e corresponde ao início da conjuntiva palpebral."
  },
  {
    pergunta: "A linha cinzenta da margem palpebral corresponde principalmente:",
    alternativas: [
      "Ao tarso",
      "À porção superficial do orbicular (músculo de Riolan / orbicular pré-tarsal)",
      "À aponeurose do levantador",
      "Ao septo orbitário",
      "À fáscia capsulopalpebral"
    ],
    correta: 1,
    explicacao: "A apostila relaciona a linha cinzenta ao músculo de Riolan (orbicular pré-tarsal)."
  },
  {
    pergunta: "Qual afirmação sobre a fissura palpebral é compatível com a apostila?",
    alternativas: [
      "O diâmetro vertical é sempre 15 mm em repouso",
      "O diâmetro horizontal típico é 27–30 mm",
      "O diâmetro horizontal típico é 35–40 mm",
      "A ação do músculo frontal reduz o diâmetro vertical",
      "A ação do músculo de Müller reduz o diâmetro vertical"
    ],
    correta: 1,
    explicacao: "O texto descreve diâmetro horizontal típico de 27–30 mm."
  },
  {
    pergunta: "Quais músculos são considerados responsáveis pela abertura da pálpebra superior, segundo a apostila?",
    alternativas: [
      "Orbicular e prócero",
      "Levantador da pálpebra superior, Müller e frontal",
      "Somente levantador e orbicular",
      "Somente Müller",
      "Levantador e zigomático maior"
    ],
    correta: 1,
    explicacao: "A apostila lista: levantador (III), Müller (simpático) e frontal (VII) como contribuidores da abertura."
  },
  {
    pergunta: "Na pálpebra inferior, o septo orbitário funde-se principalmente com:",
    alternativas: [
      "Aponeurose do levantador",
      "Fáscia capsulopalpebral, abaixo da borda inferior do tarso",
      "Ligamento de Whitnall",
      "Conjuntiva bulbar",
      "Músculo reto inferior"
    ],
    correta: 1,
    explicacao: "O texto descreve fusão do septo orbitário com a fáscia capsulopalpebral, abaixo da borda inferior do tarso."
  },
  {
    pergunta: "Com o envelhecimento, a flacidez do septo orbitário favorece principalmente:",
    alternativas: [
      "Redução da fissura palpebral horizontal",
      "Hiperplasia do tarso",
      "Herniação de gordura e formação de “bolsões” aparentes",
      "Aumento do número de cílios",
      "Fechamento palpebral voluntário"
    ],
    correta: 2,
    explicacao: "A apostila menciona que o septo torna-se flácido com a idade, permitindo herniação de gordura e bolsões aparentes."
  },

  // ===== 10 VASCULARIZAÇÃO =====
  {
    pergunta: "A vascularização palpebral é realizada principalmente por anastomoses entre quais sistemas?",
    alternativas: [
      "Carótida interna e vertebral",
      "Carótida externa e vertebral",
      "Carótida externa (facial) e carótida interna (orbitária via artéria oftálmica)",
      "Somente carótida externa",
      "Somente carótida interna"
    ],
    correta: 2,
    explicacao: "A apostila descreve anastomoses entre vascularização facial (carótida externa) e orbitária (carótida interna via artéria oftálmica)."
  },
  {
    pergunta: "Pelo sistema da carótida interna, a artéria oftálmica contribui para as pálpebras através principalmente de quais ramos terminais citados na apostila?",
    alternativas: [
      "Artéria facial e artéria angular",
      "Artéria temporal superficial e artéria lacrimal",
      "Artéria supraorbital e artéria lacrimal",
      "Artéria infraorbital e artéria zigomática",
      "Artéria supratroclear e artéria infraorbital"
    ],
    correta: 2,
    explicacao: "O texto cita artéria supraorbital (medial) e artéria lacrimal (lateral) como ramos terminais relevantes."
  },
  {
    pergunta: "Pelo sistema da carótida externa, a contribuição para a vascularização palpebral ocorre principalmente por:",
    alternativas: [
      "Artéria basilar",
      "Artéria facial (originando artéria angular) e artéria temporal superficial",
      "Artéria central da retina",
      "Artéria etmoidal posterior",
      "Artéria meníngea média"
    ],
    correta: 1,
    explicacao: "A apostila cita artéria facial→artéria angular (medial) e artéria temporal superficial (lateral)."
  },
  {
    pergunta: "As principais anastomoses entre os sistemas carotídeos na pálpebra formam quais estruturas?",
    alternativas: [
      "Canalículos superior e inferior",
      "Arcadas arteriais marginal e periférica",
      "Ductos da glândula lacrimal",
      "Músculos de Müller e frontal",
      "Zônula de Zinn"
    ],
    correta: 1,
    explicacao: "O texto aponta arcadas marginais e periféricas como principais anastomoses."
  },
  {
    pergunta: "A arcada marginal localiza-se tipicamente a cerca de:",
    alternativas: [
      "0,5–1 mm da margem livre",
      "2–3 mm da margem livre",
      "5–6 mm da margem livre",
      "10 mm da margem livre",
      "Ao longo do fórnice conjuntival"
    ],
    correta: 1,
    explicacao: "A apostila descreve a arcada marginal a ~2–3 mm da margem livre."
  },
  {
    pergunta: "A arcada marginal está localizada anatomicamente:",
    alternativas: [
      "Entre tarso e orbicular, ou no interior do tarso",
      "Entre conjuntiva e córnea",
      "Entre levantador e músculo reto superior",
      "Dentro do seio cavernoso",
      "Na porção canalicular medial, exclusivamente"
    ],
    correta: 0,
    explicacao: "O texto descreve a arcada marginal entre tarso e orbicular ou no interior do tarso."
  },
  {
    pergunta: "A arcada periférica localiza-se principalmente:",
    alternativas: [
      "Ao longo da margem superior e inferior do tarso",
      "Na linha cinzenta",
      "No subcutâneo da pálpebra (sem relação com tarso)",
      "Na conjuntiva bulbar temporal",
      "No ligamento de Whitnall"
    ],
    correta: 0,
    explicacao: "A apostila posiciona a arcada periférica ao longo das margens do tarso."
  },
  {
    pergunta: "A arcada periférica superior, segundo a apostila, situa-se entre:",
    alternativas: [
      "Tarso e conjuntiva",
      "Orbicular e pele",
      "Levantador da pálpebra superior e músculo de Müller",
      "Septo orbitário e gordura",
      "Canalículo e saco lacrimal"
    ],
    correta: 2,
    explicacao: "O texto descreve arcada periférica superior entre levantador e músculo de Müller."
  },
  {
    pergunta: "Comparando arcadas periféricas e marginais, a apostila aponta que as periféricas geralmente são:",
    alternativas: [
      "Maiores que as marginais",
      "Sem relevância clínica",
      "Geralmente menores que as marginais",
      "Exclusivas da pálpebra inferior",
      "Exclusivas da pálpebra superior"
    ],
    correta: 2,
    explicacao: "A apostila menciona que as arcadas periféricas geralmente são menores que as marginais."
  },
  {
    pergunta: "Sobre a arcada periférica inferior, a apostila alerta que:",
    alternativas: [
      "Não existe em nenhuma fonte",
      "Existe apenas em orientais",
      "Há divergência na literatura: algumas fontes citam, outras não (ex.: BCSC/AAO não cita)",
      "É a principal arcada da pálpebra inferior",
      "Localiza-se 2–3 mm da margem livre"
    ],
    correta: 2,
    explicacao: "O material comenta a divergência sobre a existência da arcada periférica inferior em diferentes referências."
  },

  // ===== 10 INERVAÇÃO =====
  {
    pergunta: "Qual estrutura é inervada pelo ramo superior do nervo oculomotor (III), conforme a apostila?",
    alternativas: [
      "Músculo orbicular",
      "Músculo levantador da pálpebra superior",
      "Músculo de Müller",
      "Músculo frontal",
      "Músculo zigomático maior"
    ],
    correta: 1,
    explicacao: "Apostila: ramo superior do III inerva o levantador da pálpebra superior."
  },
  {
    pergunta: "As fibras simpáticas inervam qual estrutura palpebral citada?",
    alternativas: [
      "Músculo orbicular",
      "Músculo levantador da pálpebra superior",
      "Músculo tarsal superior (músculo de Müller)",
      "Músculo frontal",
      "Conjuntiva palpebral"
    ],
    correta: 2,
    explicacao: "Apostila: fibras simpáticas inervam o músculo tarsal superior (Müller)."
  },
  {
    pergunta: "A lesão das fibras simpáticas para a pálpebra pode causar ptose associada a qual síndrome?",
    alternativas: [
      "Síndrome de Duane",
      "Síndrome de Horner",
      "Síndrome de Brown",
      "Síndrome de Sturge-Weber",
      "Síndrome de Marfan"
    ],
    correta: 1,
    explicacao: "A apostila menciona que lesão simpática pode causar ptose da síndrome de Horner."
  },
  {
    pergunta: "Qual nervo é responsável pela inervação motora do músculo orbicular?",
    alternativas: [
      "Nervo facial (VII)",
      "Nervo oculomotor (III)",
      "Nervo trigêmeo (V)",
      "Nervo óptico (II)",
      "Nervo abducente (VI)"
    ],
    correta: 0,
    explicacao: "Apostila: nervo facial inerva o orbicular."
  },
  {
    pergunta: "A inervação sensitiva palpebral é realizada por quais ramos principais?",
    alternativas: [
      "III e VII",
      "V1 e V2 (ramos do trigêmeo)",
      "II e III",
      "IX e X",
      "Somente V1"
    ],
    correta: 1,
    explicacao: "Apostila: sensitiva por nervo oftálmico (V1) e nervo maxilar (V2)."
  },
  {
    pergunta: "O nervo lacrimal (ramo de V1) é responsável principalmente pela sensibilidade de:",
    alternativas: [
      "1/3 lateral da pálpebra superior",
      "2/3 medial da pálpebra superior",
      "Toda a pálpebra inferior",
      "Carúncula e canto medial",
      "1/3 lateral da pálpebra inferior"
    ],
    correta: 0,
    explicacao: "Apostila: nervo lacrimal inerva o 1/3 lateral da pálpebra superior."
  },
  {
    pergunta: "Os ramos terminais supraorbitário e supratroclear (do nervo frontal, V1) inervam sensorialmente:",
    alternativas: [
      "A maior parte da pálpebra inferior",
      "O 1/3 lateral da pálpebra superior",
      "O restante da pálpebra superior (além do 1/3 lateral)",
      "Somente o canto medial",
      "Somente a conjuntiva bulbar"
    ],
    correta: 2,
    explicacao: "Apostila: nervo frontal (supraorbitário e supratroclear) inerva o restante da pálpebra superior."
  },
  {
    pergunta: "O nervo nasociliar (V1), por seus ramos terminais, inerva principalmente:",
    alternativas: [
      "Canto medial, saco lacrimal, canalículos e carúncula",
      "1/3 lateral da pálpebra superior",
      "Toda a pálpebra inferior",
      "A margem ciliar lateral",
      "O músculo orbicular"
    ],
    correta: 0,
    explicacao: "Apostila: nasociliar (etmoidal anterior e infratroclear) inerva canto medial, saco lacrimal, canalículos e carúncula."
  },
  {
    pergunta: "O nervo infraorbitário (V2) é responsável principalmente pela sensibilidade de:",
    alternativas: [
      "Maior parte da pálpebra inferior",
      "1/3 lateral da pálpebra superior",
      "Carúncula",
      "Canalículos",
      "Músculo de Müller"
    ],
    correta: 0,
    explicacao: "Apostila: infraorbitário é responsável pela maior parte da inervação sensitiva da pálpebra inferior."
  },
  {
    pergunta: "O nervo zigomático (relacionado ao infraorbitário/V2 no texto) inerva principalmente:",
    alternativas: [
      "1/3 lateral da pálpebra inferior",
      "2/3 medial da pálpebra inferior",
      "Toda a pálpebra superior",
      "Canto medial e saco lacrimal",
      "Músculo levantador"
    ],
    correta: 0,
    explicacao: "Apostila: nervo zigomático inerva o 1/3 lateral da pálpebra inferior."
  },

  // ===== 5 EMBRIOLOGIA / MALFORMAÇÕES =====
  {
    pergunta: "Segundo a embriologia palpebral da apostila, o desenvolvimento inicial da pálpebra superior começa por volta de:",
    alternativas: [
      "2ª semana",
      "4–5 semanas",
      "8–10 semanas",
      "12ª semana",
      "5º mês (25–26 semanas)"
    ],
    correta: 1,
    explicacao: "Apostila: 4–5 semanas — pálpebra superior começa a se desenvolver."
  },
  {
    pergunta: "Em qual período as pregas palpebrais se fundem (iniciando no canto interno e progredindo lateralmente)?",
    alternativas: [
      "4–5 semanas",
      "6–7 semanas",
      "8ª–10ª semanas",
      "12ª semana",
      "5º mês"
    ],
    correta: 2,
    explicacao: "Apostila: 8ª–10ª semanas — ocorre fusão das pregas palpebrais."
  },
  {
    pergunta: "O orbicular torna-se evidente por volta de qual semana, segundo a apostila?",
    alternativas: [
      "6ª semana",
      "8ª semana",
      "10ª semana",
      "12ª semana",
      "20ª semana"
    ],
    correta: 3,
    explicacao: "Apostila: 12ª semana — orbicular torna-se evidente."
  },
  {
    pergunta: "A separação das pálpebras começa a ocorrer em qual período aproximado descrito?",
    alternativas: [
      "8ª semana",
      "12ª semana",
      "5º mês (25ª–26ª semana)",
      "3º mês",
      "No nascimento"
    ],
    correta: 2,
    explicacao: "Apostila: 5º mês (25ª–26ª semana) — inicia separação palpebral."
  },
  {
    pergunta: "Criptoftalmo é descrito como condição em que:",
    alternativas: [
      "Há excesso de cílios por falha na apoptose folicular",
      "Há interrupção do mecanismo de fusão palpebral (6ª–8ª semana), sem diferenciação palpebral esperada",
      "O septo orbitário não se forma e há celulite orbitária inevitável",
      "O levantador não se desenvolve e ocorre anoftalmia sempre",
      "Há separação palpebral precoce na 8ª semana"
    ],
    correta: 1,
    explicacao: "Apostila: criptoftalmo = interrupção do mecanismo de fusão (6ª–8ª semana) e ausência de diferenciação palpebral esperada."
  }
];
bancoQuestoes[2] = [
  {
    pergunta: "Qual alternativa define corretamente TRÍQUIASE?",
    alternativas: [
      "Fileira adicional de cílios originada de ductos das glândulas de Meibômio",
      "Cílios implantados normalmente na lamela anterior, porém encurvados em direção ao globo e tocando-o",
      "Cílios implantados na lamela posterior, emergindo de ductos das glândulas de Meibômio",
      "Ausência congênita de cílios com irritação crônica",
      "Inversão da margem palpebral com toque ciliar na córnea"
    ],
    correta: 1,
    explicacao: "A apostila diferencia: triquíase = cílios em posição habitual, mas direcionados contra o globo; distiquíase = fileira adicional originada de Meibômio."
  },
  {
    pergunta: "Qual alternativa define corretamente DISTIQUÍASE?",
    alternativas: [
      "Cílios implantados normalmente, porém direcionados contra o globo",
      "Ectrópio involucional com lacrimejamento",
      "Fileira adicional de cílios originada de ductos das glândulas de Meibômio",
      "Entrópio senil por frouxidão de retratores",
      "Blefarite anterior com crostas na raiz dos cílios"
    ],
    correta: 2,
    explicacao: "A apostila descreve distiquíase como fileira adicional de cílios originada de ductos das glândulas de Meibômio."
  },
  {
    pergunta: "Sobre TRÍQUIASE adquirida, assinale a alternativa correta:",
    alternativas: [
      "É sempre congênita e autossômica recessiva",
      "É condição cicatricial adquirida por processos inflamatórios da margem palpebral/folículos; tracoma é causa importante",
      "Não causa lesão de superfície ocular",
      "Não tem relação com processos inflamatórios",
      "É sinônimo de epibléfaro"
    ],
    correta: 1,
    explicacao: "A apostila aponta triquíase como condição cicatricial adquirida associada a inflamação; tracoma é causa comum em nosso meio."
  },
  {
    pergunta: "A epilação mecânica no tratamento da triquíase é melhor descrita como:",
    alternativas: [
      "Tratamento definitivo mais eficaz",
      "Tratamento paliativo",
      "Contraindicada em qualquer cenário",
      "Indicada apenas quando há muitos cílios acometidos",
      "Preferível à cirurgia em triquíase extensa"
    ],
    correta: 1,
    explicacao: "A apostila ressalta que a epilação mecânica é paliativa, não definitiva."
  },
  {
    pergunta: "A distiquíase congênita, segundo a apostila, tem padrão de herança:",
    alternativas: [
      "Autossômico recessivo",
      "Ligado ao X dominante",
      "Autossômico dominante",
      "Mitocondrial",
      "Esporádico sem padrão"
    ],
    correta: 2,
    explicacao: "A apostila (questão comentada) traz distiquíase congênita com herança autossômica dominante."
  },
  {
    pergunta: "Eletrólise para cílios aberrantes é mais indicada quando:",
    alternativas: [
      "Há poucos cílios envolvidos",
      "Há grande quantidade de cílios agregados",
      "Há entrópio cicatricial associado severo",
      "Há necessidade de tratar 1/2 pálpebra ou mais",
      "Quando se deseja tratamento em massa com menor tempo"
    ],
    correta: 0,
    explicacao: "A apostila comenta que eletrólise é boa quando há poucos cílios; quando há muitos, costuma-se indicar tratamento cirúrgico."
  },
  {
    pergunta: "Radiofrequência, comparada à eletrólise, apresenta como vantagem descrita:",
    alternativas: [
      "Maior dano tecidual ao redor do cílio",
      "Menor risco de dano tecidual ao redor do cílio tratado",
      "Maior risco de entrópio cicatricial mesmo em uso moderado",
      "É método abandonado por risco maior que eletrólise",
      "Não pode ser usada para cílios isolados"
    ],
    correta: 1,
    explicacao: "Apostila: radiofrequência é semelhante à eletrólise, porém com menor risco de dano tecidual ao redor do cílio."
  },
  {
    pergunta: "A crioterapia para triquíase é descrita na apostila como:",
    alternativas: [
      "Método atual de primeira linha",
      "Método abandonado pelo risco elevado de complicações locais",
      "Método indicado especialmente em triquíase leve",
      "Método sem complicações significativas",
      "Obrigatória em distiquíase congênita"
    ],
    correta: 1,
    explicacao: "A apostila relata que crioterapia foi usada no passado, mas abandonada pelo risco elevado de complicações locais."
  },
  {
    pergunta: "A ressecção da margem palpebral em pentágono é útil principalmente em:",
    alternativas: [
      "Triquíase difusa envolvendo toda a pálpebra",
      "Triquíase localizada envolvendo até 1/4 da pálpebra; comum em triquíase associada a trauma palpebral",
      "Distiquíase congênita extensa bilateral",
      "Blefarite seborreica leve",
      "Hordéolo externo agudo"
    ],
    correta: 1,
    explicacao: "A apostila descreve pentágono como útil em triquíase localizada (até 1/4), sendo principal técnica na triquíase associada a trauma."
  },
  {
    pergunta: "A técnica de Van Milligen (divisão interlamelar com enxerto mucocutâneo) é indicada principalmente em:",
    alternativas: [
      "Triquíase extensa envolvendo grande número de cílios, desde que não haja entrópio cicatricial associado",
      "Triquíase leve com 1 ou 2 cílios",
      "Distiquíase congênita sempre",
      "Entrópio cicatricial grave com múltiplas cirurgias prévias",
      "Blefarite anterior estafilocócica"
    ],
    correta: 0,
    explicacao: "A apostila descreve a técnica: incisão na linha cinzenta, separa lamelas e intercala enxerto; muito eficaz se não houver entrópio cicatricial associado; indicada em triquíase extensa."
  },
  {
    pergunta: "No tratamento com laser de CO₂ para triquíase, a apostila cita como parâmetros típicos:",
    alternativas: [
      "1–2 disparos por cílio, 200 mW, 2 s",
      "20–30 disparos por cílio, mira ~100 µm, potência alta (~1000 mW), duração ~0,5 s",
      "Aplicação contínua sem mira, 50 mW, 5 s",
      "Somente 1 disparo profundo de 10 mm",
      "Sem necessidade de eversão palpebral"
    ],
    correta: 1,
    explicacao: "A apostila descreve 20–30 disparos por cílio, mira ~100 µm, potência alta e 0,5 s; com eversão para cílios perpendiculares."
  },
  {
    pergunta: "As blefarites são divididas anatomicamente em anterior e posterior. A blefarite POSTERIOR acomete principalmente:",
    alternativas: [
      "Pele palpebral e folículos dos cílios",
      "Orifícios das glândulas de Meibômio",
      "Conjuntiva bulbar",
      "Carúncula lacrimal",
      "Canalículos lacrimais"
    ],
    correta: 1,
    explicacao: "A apostila define: blefarite anterior envolve pele/folículos; posterior afeta orifícios das glândulas de Meibômio."
  },
  {
    pergunta: "Achado clínico típico das blefarites anteriores na apostila inclui:",
    alternativas: [
      "Hipertrofia do saco lacrimal",
      "Crostas na raiz dos cílios e hiperemia/descamação da margem palpebral",
      "Ptose neurogênica com anisocoria",
      "Eversão completa da pálpebra superior ao nascimento",
      "Ceratomalácia súbita"
    ],
    correta: 1,
    explicacao: "A apostila lista: hiperemia e descamação da margem palpebral e presença de crostas na raiz dos cílios."
  },
  {
    pergunta: "Blefarite seborreica é descrita como:",
    alternativas: [
      "Forma rara, geralmente associada apenas a trauma",
      "Forma mais comum, associada à oleosidade da pele e seborreia do couro cabeludo",
      "Forma exclusiva de crianças",
      "Sempre causada por clamídia",
      "Sempre evolui para entrópio cicatricial"
    ],
    correta: 1,
    explicacao: "A apostila descreve blefarite seborreica como a forma mais comum e associada à oleosidade/seborreia."
  },
  {
    pergunta: "Na blefarite seborreica, a apostila menciona possível associação com olho seco evaporativo em aproximadamente:",
    alternativas: [
      "1%",
      "5%",
      "15%",
      "50%",
      "80%"
    ],
    correta: 2,
    explicacao: "O texto menciona olho seco evaporativo em cerca de 15% dos pacientes com blefarite seborreica."
  },
  {
    pergunta: "O principal risco de usar radiofrequência de forma exagerada (segundo a apostila) é:",
    alternativas: [
      "Ectrópio paralítico",
      "Entrópio cicatricial",
      "Ptose aponeurótica",
      "Dacriocistite aguda",
      "Melanoma palpebral"
    ],
    correta: 1,
    explicacao: "A apostila alerta que uso exagerado pode causar entrópio cicatricial."
  },
  {
    pergunta: "A margem palpebral deve ser evertida durante laser de CO₂ para triquíase porque:",
    alternativas: [
      "Aumenta a produção de lágrima e reduz dor",
      "Permite que os cílios fiquem perpendiculares ao laser, melhorando a mira e vaporização do folículo",
      "Evita oclusão do ponto lacrimal",
      "Impede formação de crostas na blefarite",
      "Reduz risco de síndrome de Horner"
    ],
    correta: 1,
    explicacao: "A apostila cita eversão para que cílios fiquem perpendiculares ao laser."
  },
  {
    pergunta: "Em triquíase extensa com grande número de cílios, a apostila sugere que:",
    alternativas: [
      "Eletrólise é sempre a melhor escolha",
      "Epilação mecânica é definitiva",
      "Tratamento cirúrgico é preferível; Van Milligen é opção se não houver entrópio cicatricial",
      "Crioterapia é método atual de preferência",
      "Nenhuma intervenção deve ser feita"
    ],
    correta: 2,
    explicacao: "A apostila comenta que eletrólise é melhor para poucos cílios; grande quantidade costuma demandar abordagem cirúrgica, como Van Milligen quando aplicável."
  },
  {
    pergunta: "Qual alternativa está correta sobre a relação blefarite posterior e disfunção do filme lacrimal (segundo a apostila)?",
    alternativas: [
      "Blefarite posterior não se relaciona a disfunção do filme lacrimal",
      "Blefarite posterior tem relação mais direta com disfunção do filme lacrimal e será discutida no capítulo de olho seco",
      "Blefarite anterior é a única relevante para olho seco",
      "Apostila afirma que não há sobreposição entre os temas",
      "Blefarite posterior não envolve glândulas de Meibômio"
    ],
    correta: 1,
    explicacao: "A apostila indica que blefarite posterior, por envolver Meibômio, relaciona-se diretamente ao filme lacrimal e ao capítulo de olho seco."
  }
];
bancoQuestoes[2].push(
  {
    pergunta: "Na blefarite estafilocócica (anterior), é comum encontrar:",
    alternativas: [
      "Escamas oleosas amareladas sem hiperemia",
      "Úlceras profundas do tarso",
      "Crostas duras aderidas à base dos cílios e possível madarose",
      "Ectrópio paralítico",
      "Epífora funcional isolada"
    ],
    correta: 2,
    explicacao: "Blefarite estafilocócica cursa com crostas duras na base dos cílios, hiperemia e pode levar à madarose."
  },
  {
    pergunta: "Qual medida é considerada base do tratamento de TODAS as formas de blefarite, segundo a apostila?",
    alternativas: [
      "Antibiótico sistêmico prolongado",
      "Corticoide tópico contínuo",
      "Higiene palpebral regular",
      "Cirurgia da margem palpebral",
      "Crioterapia da margem"
    ],
    correta: 2,
    explicacao: "A higiene palpebral é o pilar do tratamento, independentemente do subtipo de blefarite."
  },
  {
    pergunta: "Na blefarite posterior, a principal alteração fisiopatológica envolve:",
    alternativas: [
      "Folículos ciliares",
      "Septo orbitário",
      "Glândulas de Meibômio",
      "Canalículos lacrimais",
      "Saco lacrimal"
    ],
    correta: 2,
    explicacao: "Blefarite posterior está relacionada à disfunção das glândulas de Meibômio."
  },
  {
    pergunta: "A blefarite por Demodex pode ser suspeitada clinicamente quando há:",
    alternativas: [
      "Escamas oleosas difusas",
      "Crostas duras hemorrágicas",
      "Cílios em colarete (cuffing) na base",
      "Ptose neurogênica associada",
      "Epífora constante sem hiperemia"
    ],
    correta: 2,
    explicacao: "O colarete na base dos cílios é achado clássico associado à infestação por Demodex."
  },
  {
    pergunta: "O uso prolongado de corticoide tópico na blefarite deve ser cauteloso principalmente pelo risco de:",
    alternativas: [
      "Entrópio involucional",
      "Aumento da pressão intraocular e catarata",
      "Dacriocistite",
      "Ptose congênita",
      "Melanoma palpebral"
    ],
    correta: 1,
    explicacao: "A apostila alerta para risco de aumento da PIO e catarata com uso prolongado de corticoides."
  },
  {
    pergunta: "Na triquíase, a radiofrequência é considerada:",
    alternativas: [
      "Tratamento cirúrgico de grande porte",
      "Método destrutivo com menor dano térmico que eletrólise",
      "Método abandonado",
      "Contraindicado para cílios isolados",
      "Método exclusivo para distiquíase congênita"
    ],
    correta: 1,
    explicacao: "Radiofrequência é similar à eletrólise, porém com menor dano térmico aos tecidos adjacentes."
  },
  {
    pergunta: "A principal vantagem da técnica de Van Milligen em relação à ressecção em pentágono é:",
    alternativas: [
      "Menor tempo cirúrgico",
      "Possibilidade de tratar grandes áreas sem ressecar margem",
      "Indicação exclusiva para trauma",
      "Ausência de necessidade de enxerto",
      "Uso preferencial em crianças"
    ],
    correta: 1,
    explicacao: "Van Milligen permite tratar triquíase extensa sem ressecar margem palpebral."
  },
  {
    pergunta: "A ressecção em pentágono é limitada, segundo a apostila, a aproximadamente:",
    alternativas: [
      "Até 10% da pálpebra",
      "Até 1/4 da pálpebra",
      "Até metade da pálpebra",
      "Toda a pálpebra inferior",
      "Somente ao canto medial"
    ],
    correta: 1,
    explicacao: "A técnica é indicada para áreas localizadas, geralmente até 1/4 da pálpebra."
  },
  {
    pergunta: "Na blefarite seborreica, as escamas são descritas como:",
    alternativas: [
      "Duras e hemorrágicas",
      "Oleosas e facilmente removíveis",
      "Acompanhadas sempre de ulceração",
      "Restritas ao canto medial",
      "Exclusivas da pálpebra inferior"
    ],
    correta: 1,
    explicacao: "Blefarite seborreica cursa com escamas oleosas, de fácil remoção."
  },
  {
    pergunta: "Qual achado NÃO é típico de blefarite crônica, segundo a apostila?",
    alternativas: [
      "Hiperemia da margem palpebral",
      "Descamação",
      "Espessamento da margem",
      "Dor ocular intensa súbita",
      "Alterações do filme lacrimal"
    ],
    correta: 3,
    explicacao: "Blefarite crônica raramente cursa com dor intensa súbita; é quadro crônico e irritativo."
  },
  {
    pergunta: "A epilação mecânica deve ser evitada como tratamento único porque:",
    alternativas: [
      "Provoca entrópio imediato",
      "Leva à destruição permanente do folículo",
      "Os cílios voltam a crescer",
      "É tecnicamente complexa",
      "Causa necrose palpebral"
    ],
    correta: 2,
    explicacao: "A epilação é paliativa; o cílio volta a crescer."
  },
  {
    pergunta: "Em relação à crioterapia para triquíase, a apostila destaca como complicações:",
    alternativas: [
      "Hipertricose e ptose congênita",
      "Cicatriz, necrose, despigmentação e entrópio",
      "Apenas edema transitório",
      "Somente falha terapêutica",
      "Nenhuma complicação relevante"
    ],
    correta: 1,
    explicacao: "Essas complicações levaram ao abandono progressivo da técnica."
  },
  {
    pergunta: "O laser de CO₂ na triquíase atua principalmente por:",
    alternativas: [
      "Fotoestimulação do crescimento ciliar",
      "Vaporização térmica do folículo piloso",
      "Congelamento do folículo",
      "Inibição neural do crescimento",
      "Estimulação simpática"
    ],
    correta: 1,
    explicacao: "O laser promove vaporização térmica do folículo piloso."
  },
  {
    pergunta: "Na blefarite posterior, a compressa morna auxilia principalmente por:",
    alternativas: [
      "Reduzir crescimento bacteriano diretamente",
      "Estimular produção lacrimal aquosa",
      "Fluidificar a secreção das glândulas de Meibômio",
      "Destruir ácaros Demodex",
      "Diminuir pressão intraocular"
    ],
    correta: 2,
    explicacao: "O calor fluidifica a secreção meibomiana, facilitando sua expressão."
  },
  {
    pergunta: "A expressão manual das glândulas de Meibômio é indicada principalmente em:",
    alternativas: [
      "Blefarite anterior estafilocócica",
      "Blefarite posterior",
      "Distiquíase congênita",
      "Triquíase traumática",
      "Epibléfaro"
    ],
    correta: 1,
    explicacao: "É medida típica no manejo da blefarite posterior."
  },
  {
    pergunta: "A blefarite é classificada, quanto à evolução, como:",
    alternativas: [
      "Doença aguda autolimitada",
      "Doença crônica recorrente",
      "Doença exclusivamente congênita",
      "Doença exclusivamente infecciosa",
      "Doença tumoral"
    ],
    correta: 1,
    explicacao: "A apostila caracteriza blefarite como condição crônica e recorrente."
  },
  {
    pergunta: "Qual associação sistêmica é frequentemente citada com blefarite seborreica?",
    alternativas: [
      "Hipertireoidismo",
      "Dermatite seborreica",
      "Artrite reumatoide",
      "Lúpus eritematoso sistêmico",
      "Diabetes tipo 1"
    ],
    correta: 1,
    explicacao: "A blefarite seborreica está associada à dermatite seborreica."
  },
  {
    pergunta: "Em pacientes com blefarite crônica, a adesão ao tratamento é difícil principalmente porque:",
    alternativas: [
      "O tratamento é cirúrgico",
      "Os sintomas desaparecem rapidamente",
      "O tratamento exige cuidados contínuos e prolongados",
      "Sempre há efeitos colaterais graves",
      "O diagnóstico é incerto"
    ],
    correta: 2,
    explicacao: "A necessidade de higiene e cuidados contínuos dificulta adesão."
  },
  {
    pergunta: "Qual opção descreve corretamente o papel da blefarite posterior na superfície ocular?",
    alternativas: [
      "Não interfere no filme lacrimal",
      "Aumenta apenas a produção lacrimal aquosa",
      "Contribui para instabilidade do filme lacrimal",
      "Protege contra olho seco",
      "Atua apenas na margem sem impacto ocular"
    ],
    correta: 2,
    explicacao: "A disfunção meibomiana leva à instabilidade do filme lacrimal."
  },
  {
    pergunta: "Segundo a apostila, o manejo da blefarite deve ser entendido como:",
    alternativas: [
      "Tratamento único e definitivo",
      "Tratamento apenas medicamentoso",
      "Controle de doença crônica",
      "Condição autolimitada",
      "Situação cirúrgica obrigatória"
    ],
    correta: 2,
    explicacao: "Blefarite é doença crônica que exige controle contínuo."
  }
);
bancoQuestoes[3] = [
  {
    pergunta: "Ectrópio é definido como:",
    alternativas: [
      "Inversão da margem palpebral em direção ao globo",
      "Eversão da margem palpebral, afastando-a do globo ocular",
      "Queda da pálpebra superior por disfunção muscular",
      "Retração exagerada da pálpebra superior",
      "Aumento congênito da fenda palpebral"
    ],
    correta: 1,
    explicacao: "Ectrópio corresponde à eversão da margem palpebral, com afastamento do globo ocular."
  },
  {
    pergunta: "A causa MAIS comum de ectrópio adquirida é:",
    alternativas: [
      "Congênita",
      "Cicatricial",
      "Paralítica",
      "Involucional (senil)",
      "Mecânica tumoral"
    ],
    correta: 3,
    explicacao: "O ectrópio involucional (senil), por frouxidão tecidual relacionada à idade, é o mais comum."
  },
  {
    pergunta: "No ectrópio paralítico, o mecanismo fisiopatológico principal é:",
    alternativas: [
      "Cicatriz retraindo a lamela anterior",
      "Frouxidão do tarso por envelhecimento",
      "Perda do tônus do músculo orbicular por lesão do nervo facial",
      "Excesso de peso palpebral por tumores",
      "Falha congênita da formação do tarso"
    ],
    correta: 2,
    explicacao: "A paralisia do nervo facial leva à perda do tônus do orbicular, favorecendo eversão palpebral."
  },
  {
    pergunta: "O ectrópio cicatricial decorre principalmente de:",
    alternativas: [
      "Frouxidão ligamentar involucional",
      "Paralisia facial",
      "Tração da lamela anterior por cicatriz cutânea",
      "Aumento do globo ocular",
      "Disfunção do músculo de Müller"
    ],
    correta: 2,
    explicacao: "Cicatrizes da pele retraem a lamela anterior, tracionando a margem palpebral."
  },
  {
    pergunta: "Uma consequência clínica frequente do ectrópio é:",
    alternativas: [
      "Ptose completa",
      "Exposição da conjuntiva com epífora e ceratite de exposição",
      "Redução da produção lacrimal",
      "Glaucoma secundário",
      "Diplopia vertical"
    ],
    correta: 1,
    explicacao: "O afastamento da margem causa exposição conjuntival, lacrimejamento e risco de ceratite."
  },
  {
    pergunta: "Entrópio é definido como:",
    alternativas: [
      "Eversão da margem palpebral",
      "Inversão da margem palpebral em direção ao globo",
      "Queda da pálpebra superior",
      "Retração palpebral superior",
      "Ausência congênita de cílios"
    ],
    correta: 1,
    explicacao: "Entrópio corresponde à inversão da margem palpebral, fazendo os cílios tocarem o globo."
  },
  {
    pergunta: "O tipo MAIS comum de entrópio adquirido é:",
    alternativas: [
      "Congênito",
      "Cicatricial",
      "Espástico",
      "Involucional (senil)",
      "Mecânico"
    ],
    correta: 3,
    explicacao: "O entrópio involucional é o mais frequente, associado ao envelhecimento."
  },
  {
    pergunta: "No entrópio involucional, qual fator NÃO participa da fisiopatologia?",
    alternativas: [
      "Frouxidão horizontal palpebral",
      "Desinserção dos retratores inferiores",
      "Hiperatividade do orbicular pré-septal",
      "Cicatriz da conjuntiva tarsal",
      "Envelhecimento tecidual"
    ],
    correta: 3,
    explicacao: "Cicatriz conjuntival está relacionada ao entrópio cicatricial, não ao involucional."
  },
  {
    pergunta: "O entrópio cicatricial está mais associado a:",
    alternativas: [
      "Envelhecimento",
      "Paralisia facial",
      "Processos inflamatórios crônicos da conjuntiva (ex.: tracoma)",
      "Trauma agudo isolado",
      "Hipertireoidismo"
    ],
    correta: 2,
    explicacao: "Processos inflamatórios crônicos da conjuntiva levam à retração cicatricial."
  },
  {
    pergunta: "O entrópio espástico geralmente ocorre:",
    alternativas: [
      "Em crianças com malformações congênitas",
      "Em idosos, associado a blefarospasmo ou irritação ocular",
      "Somente após cirurgia palpebral",
      "Por retração cicatricial severa",
      "Como manifestação de síndrome de Horner"
    ],
    correta: 1,
    explicacao: "O entrópio espástico é funcional, associado à contração excessiva do orbicular."
  },
  {
    pergunta: "Ptose palpebral é definida como:",
    alternativas: [
      "Eversão da margem palpebral inferior",
      "Inversão da margem palpebral superior",
      "Posição anormalmente baixa da pálpebra superior",
      "Abertura excessiva da fenda palpebral",
      "Ausência congênita da pálpebra"
    ],
    correta: 2,
    explicacao: "Ptose corresponde à posição anormalmente baixa da pálpebra superior."
  },
  {
    pergunta: "A causa MAIS comum de ptose adquirida no adulto é:",
    alternativas: [
      "Miogênica",
      "Neurogênica",
      "Aponeurótica (involucional)",
      "Congênita",
      "Traumática"
    ],
    correta: 2,
    explicacao: "A ptose aponeurótica, por desinserção do levantador, é a mais comum no adulto."
  },
  {
    pergunta: "Na ptose aponeurótica, um achado clínico típico é:",
    alternativas: [
      "Função pobre do levantador",
      "Prega palpebral ausente",
      "Prega palpebral alta",
      "Anisocoria associada",
      "Restrição da motilidade ocular"
    ],
    correta: 2,
    explicacao: "A ptose aponeurótica cursa com função preservada do levantador e prega palpebral alta."
  },
  {
    pergunta: "A ptose congênita geralmente está associada a:",
    alternativas: [
      "Desinserção aponeurótica",
      "Degeneração gordurosa do músculo levantador",
      "Lesão do nervo facial",
      "Hiperatividade do músculo frontal",
      "Paralisia simpática"
    ],
    correta: 1,
    explicacao: "Na ptose congênita há alteração estrutural do músculo levantador."
  },
  {
    pergunta: "Retração palpebral superior é caracterizada por:",
    alternativas: [
      "Cobertura excessiva da córnea",
      "Exposição excessiva da esclera acima do limbo",
      "Inversão da margem palpebral",
      "Eversão do ponto lacrimal",
      "Queda da pálpebra inferior"
    ],
    correta: 1,
    explicacao: "A retração palpebral superior causa exposição escleral acima do limbo."
  },
  {
    pergunta: "A causa MAIS comum de retração palpebral superior é:",
    alternativas: [
      "Trauma palpebral",
      "Ptose congênita",
      "Doença de Graves (orbitopatia tireoidiana)",
      "Paralisia facial",
      "Blefarite crônica"
    ],
    correta: 2,
    explicacao: "A orbitopatia da doença de Graves é a causa mais frequente."
  },
  {
    pergunta: "No Floppy Eyelid Syndrome (FES), é típico encontrar:",
    alternativas: [
      "Pálpebras rígidas e pouco móveis",
      "Pálpebras extremamente flácidas e facilmente evertidas",
      "Entrópio cicatricial bilateral",
      "Ptose congênita severa",
      "Retração palpebral inferior"
    ],
    correta: 1,
    explicacao: "O FES caracteriza-se por pálpebras superiores muito flácidas e facilmente evertidas."
  },
  {
    pergunta: "O Floppy Eyelid Syndrome está frequentemente associado a:",
    alternativas: [
      "Miastenia gravis",
      "Apneia obstrutiva do sono",
      "Hipertireoidismo",
      "Síndrome de Horner",
      "Dermatite atópica"
    ],
    correta: 1,
    explicacao: "Há forte associação entre FES e apneia obstrutiva do sono."
  },
  {
    pergunta: "No FES, a queixa ocular MAIS comum é:",
    alternativas: [
      "Dor ocular súbita intensa",
      "Visão dupla constante",
      "Irritação ocular crônica e secreção mucosa",
      "Perda visual súbita",
      "Hemorragia subconjuntival recorrente"
    ],
    correta: 2,
    explicacao: "Irritação crônica, hiperemia e secreção são comuns no FES."
  },
  {
    pergunta: "O tratamento definitivo do Floppy Eyelid Syndrome é principalmente:",
    alternativas: [
      "Lubrificação isolada",
      "Corticoide tópico prolongado",
      "Cirurgia de encurtamento/tensionamento palpebral associada ao controle da apneia",
      "Crioterapia palpebral",
      "Epilação mecânica"
    ],
    correta: 2,
    explicacao: "O manejo envolve correção cirúrgica da flacidez e tratamento da apneia do sono."
  }
];
bancoQuestoes[3].push(
  {
    pergunta: "No entrópio involucional da pálpebra inferior, qual estrutura costuma estar desinserida ou enfraquecida?",
    alternativas: [
      "Tarso",
      "Septo orbitário",
      "Retratores da pálpebra inferior",
      "Músculo de Müller",
      "Ligamento de Whitnall"
    ],
    correta: 2,
    explicacao: "A desinserção/enfraquecimento dos retratores inferiores é um dos principais mecanismos do entrópio involucional."
  },
  {
    pergunta: "O teste de distração palpebral (snap-back test) é utilizado principalmente para avaliar:",
    alternativas: [
      "Função do músculo levantador",
      "Frouxidão horizontal palpebral",
      "Integridade da conjuntiva tarsal",
      "Função lacrimal",
      "Força do músculo frontal"
    ],
    correta: 1,
    explicacao: "O snap-back test avalia a frouxidão horizontal da pálpebra, importante em entrópio e ectrópio involucionais."
  },
  {
    pergunta: "No ectrópio involucional, o achado anatômico predominante é:",
    alternativas: [
      "Retração cicatricial da conjuntiva",
      "Paralisia do nervo trigêmeo",
      "Frouxidão horizontal da pálpebra inferior",
      "Hiperatividade do orbicular",
      "Hipertrofia do músculo levantador"
    ],
    correta: 2,
    explicacao: "A frouxidão horizontal palpebral é o principal fator no ectrópio involucional."
  },
  {
    pergunta: "A presença de lagoftalmo é mais frequentemente observada em qual condição?",
    alternativas: [
      "Ptose aponeurótica",
      "Entrópio involucional",
      "Ectrópio cicatricial",
      "Paralisia facial",
      "Epibléfaro congênito"
    ],
    correta: 3,
    explicacao: "A paralisia facial leva a lagoftalmo por falha no fechamento palpebral."
  },
  {
    pergunta: "No ectrópio cicatricial, a correção cirúrgica geralmente exige:",
    alternativas: [
      "Somente encurtamento horizontal",
      "Reinserção dos retratores inferiores",
      "Liberação cicatricial e enxerto cutâneo",
      "Apenas lubrificação ocular",
      "Uso de toxina botulínica"
    ],
    correta: 2,
    explicacao: "O ectrópio cicatricial requer liberação da cicatriz e, frequentemente, enxerto de pele."
  },
  {
    pergunta: "Qual sinal clínico sugere ptose neurogênica por lesão do III par craniano?",
    alternativas: [
      "Prega palpebral alta com boa função",
      "Ptose leve isolada",
      "Ptose associada a limitação de movimentos oculares",
      "Ptose apenas no olhar para baixo",
      "Ptose bilateral simétrica desde o nascimento"
    ],
    correta: 2,
    explicacao: "Lesões do III par cursam com ptose associada a alterações da motilidade ocular."
  },
  {
    pergunta: "Na síndrome de Horner, a ptose ocorre principalmente devido à disfunção de:",
    alternativas: [
      "Músculo levantador",
      "Músculo orbicular",
      "Músculo frontal",
      "Músculo de Müller",
      "Tarso superior"
    ],
    correta: 3,
    explicacao: "A ptose na síndrome de Horner decorre da perda da inervação simpática do músculo de Müller."
  },
  {
    pergunta: "Qual achado diferencia ptose miogênica de ptose aponeurótica?",
    alternativas: [
      "Altura da fenda palpebral",
      "Presença de lagoftalmo",
      "Função reduzida do músculo levantador",
      "Prega palpebral alta",
      "Associação com idade avançada"
    ],
    correta: 2,
    explicacao: "Na ptose miogênica, a função do levantador é reduzida."
  },
  {
    pergunta: "Na avaliação da ptose, a medida da função do levantador corresponde à:",
    alternativas: [
      "Distância entre a margem palpebral e a sobrancelha",
      "Excursão da pálpebra do olhar para baixo ao olhar para cima",
      "Altura da fenda palpebral em repouso",
      "Distância entre as pupilas",
      "Amplitude do piscar"
    ],
    correta: 1,
    explicacao: "A função do levantador é medida pela excursão da pálpebra entre olhar inferior e superior."
  },
  {
    pergunta: "A retração palpebral inferior é mais comumente associada a:",
    alternativas: [
      "Doença de Graves",
      "Paralisia facial",
      "Entrópio involucional",
      "Ptose congênita",
      "Floppy eyelid syndrome"
    ],
    correta: 0,
    explicacao: "A retração palpebral inferior também é comum na orbitopatia de Graves."
  },
  {
    pergunta: "No tratamento da retração palpebral associada à orbitopatia tireoidiana, deve-se priorizar:",
    alternativas: [
      "Cirurgia imediata na fase inflamatória",
      "Aguardar estabilização da doença antes da cirurgia",
      "Crioterapia palpebral",
      "Epilação ciliar",
      "Toxina botulínica isolada em todos os casos"
    ],
    correta: 1,
    explicacao: "A correção cirúrgica deve ser feita preferencialmente após estabilização da orbitopatia."
  },
  {
    pergunta: "No Floppy Eyelid Syndrome, a flacidez palpebral ocorre principalmente devido a:",
    alternativas: [
      "Hipertrofia do tarso",
      "Alterações elásticas do tarso e tecidos de suporte",
      "Paralisia do nervo facial",
      "Retração cicatricial conjuntival",
      "Desinserção do levantador"
    ],
    correta: 1,
    explicacao: "O FES envolve alterações do tecido elástico do tarso e estruturas de suporte."
  },
  {
    pergunta: "A ceratopatia associada ao Floppy Eyelid Syndrome ocorre principalmente por:",
    alternativas: [
      "Deficiência aquosa lacrimal",
      "Trauma mecânico repetido durante o sono",
      "Infecção bacteriana primária",
      "Elevação excessiva da PIO",
      "Hipersecreção meibomiana"
    ],
    correta: 1,
    explicacao: "A eversão palpebral noturna causa trauma mecânico crônico da superfície ocular."
  },
  {
    pergunta: "Uma medida inicial importante no manejo do FES inclui:",
    alternativas: [
      "Uso de colírio antibiótico contínuo",
      "Proteção ocular noturna e lubrificação",
      "Crioterapia palpebral",
      "Ressecção em pentágono",
      "Toxina botulínica de rotina"
    ],
    correta: 1,
    explicacao: "Lubrificação e proteção noturna são medidas iniciais fundamentais."
  },
  {
    pergunta: "O epibléfaro diferencia-se do entrópio porque:",
    alternativas: [
      "É adquirido e ocorre apenas em idosos",
      "Há inversão verdadeira da margem palpebral",
      "Os cílios tocam o globo sem inversão da margem",
      "Sempre exige cirurgia urgente",
      "Está associado à paralisia facial"
    ],
    correta: 2,
    explicacao: "No epibléfaro, os cílios tocam o globo sem inversão real da margem palpebral."
  },
  {
    pergunta: "O epibléfaro é mais comum em:",
    alternativas: [
      "Idosos caucasianos",
      "Pacientes com paralisia facial",
      "Crianças, especialmente de etnia asiática",
      "Pacientes com doença de Graves",
      "Adultos com blefarite crônica"
    ],
    correta: 2,
    explicacao: "O epibléfaro é mais frequente em crianças, especialmente asiáticas."
  },
  {
    pergunta: "Qual condição pode simular entrópio, mas melhora com o crescimento facial?",
    alternativas: [
      "Entrópio cicatricial",
      "Entrópio involucional",
      "Epibléfaro",
      "Ectrópio paralítico",
      "FES"
    ],
    correta: 2,
    explicacao: "O epibléfaro pode melhorar espontaneamente com o crescimento facial."
  },
  {
    pergunta: "Na escolha da técnica cirúrgica para ptose, o fator MAIS importante é:",
    alternativas: [
      "Idade do paciente",
      "Etiologia da ptose",
      "Função do músculo levantador",
      "Altura da sobrancelha",
      "Presença de blefarite"
    ],
    correta: 2,
    explicacao: "A função do levantador é o principal critério para definir a técnica cirúrgica."
  },
  {
    pergunta: "Quando a função do levantador é muito pobre (<4 mm), a técnica mais indicada costuma ser:",
    alternativas: [
      "Ressecção aponeurótica",
      "Avanço do levantador",
      "Suspensão frontal",
      "Blefaroplastia isolada",
      "Cantoplastia lateral"
    ],
    correta: 2,
    explicacao: "Com função muito pobre, indica-se suspensão frontal."
  },
  {
    pergunta: "No contexto das malposições palpebrais, qual afirmação está correta?",
    alternativas: [
      "Entrópio e ectrópio são sempre congênitos",
      "Ptose nunca interfere no eixo visual",
      "Retração palpebral pode causar ceratite de exposição",
      "FES não tem repercussão ocular",
      "Epibléfaro é sempre cirúrgico"
    ],
    correta: 2,
    explicacao: "A retração palpebral pode levar à exposição corneana e ceratite."
  }
);
bancoQuestoes[4] = [
  {
    pergunta: "Qual é o tumor palpebral MALIGNO mais comum?",
    alternativas: [
      "Melanoma",
      "Carcinoma espinocelular",
      "Carcinoma basocelular",
      "Carcinoma sebáceo",
      "Linfoma palpebral"
    ],
    correta: 2,
    explicacao: "O carcinoma basocelular é o tumor maligno palpebral mais frequente."
  },
  {
    pergunta: "O carcinoma basocelular ocorre mais frequentemente em qual região da pálpebra?",
    alternativas: [
      "Pálpebra superior",
      "Pálpebra inferior e canto medial",
      "Canto lateral",
      "Carúncula",
      "Conjuntiva palpebral"
    ],
    correta: 1,
    explicacao: "A pálpebra inferior e o canto medial são os locais mais comuns."
  },
  {
    pergunta: "Qual característica clínica é mais sugestiva de carcinoma basocelular?",
    alternativas: [
      "Lesão pigmentada homogênea",
      "Nódulo perolado com telangiectasias",
      "Placa eritematosa descamativa difusa",
      "Lesão ulcerada dolorosa de crescimento rápido",
      "Nódulo subcutâneo móvel"
    ],
    correta: 1,
    explicacao: "O aspecto perolado com telangiectasias é típico do carcinoma basocelular."
  },
  {
    pergunta: "Em relação ao carcinoma basocelular, é correto afirmar:",
    alternativas: [
      "Apresenta alta taxa de metástase",
      "É altamente agressivo sistêmico",
      "Raramente metastatiza, mas pode ser localmente invasivo",
      "Não invade estruturas adjacentes",
      "Não recidiva após excisão simples"
    ],
    correta: 2,
    explicacao: "O carcinoma basocelular raramente metastatiza, mas pode causar grande destruição local."
  },
  {
    pergunta: "Qual tumor palpebral está mais associado à exposição solar crônica e pode metastatizar com maior frequência?",
    alternativas: [
      "Carcinoma basocelular",
      "Carcinoma espinocelular",
      "Nevus",
      "Xantelasma",
      "Hidrocistoma"
    ],
    correta: 1,
    explicacao: "O carcinoma espinocelular tem maior potencial metastático que o basocelular."
  },
  {
    pergunta: "O carcinoma espinocelular diferencia-se do basocelular principalmente por:",
    alternativas: [
      "Ser sempre pigmentado",
      "Apresentar maior potencial metastático",
      "Nunca ulcerar",
      "Ocorrer apenas na pálpebra superior",
      "Não estar relacionado ao sol"
    ],
    correta: 1,
    explicacao: "O carcinoma espinocelular apresenta maior risco de metástase."
  },
  {
    pergunta: "Qual tumor maligno palpebral pode simular blefarite crônica ou calázio recorrente?",
    alternativas: [
      "Carcinoma basocelular",
      "Carcinoma espinocelular",
      "Melanoma",
      "Carcinoma sebáceo",
      "Sarcoma de Kaposi"
    ],
    correta: 3,
    explicacao: "O carcinoma sebáceo pode simular blefarite ou calázio recorrente, sendo diagnóstico frequentemente tardio."
  },
  {
    pergunta: "O carcinoma sebáceo origina-se mais frequentemente de:",
    alternativas: [
      "Folículos ciliares",
      "Glândulas sudoríparas écrinas",
      "Glândulas de Meibômio",
      "Conjuntiva bulbar",
      "Tarso"
    ],
    correta: 2,
    explicacao: "O carcinoma sebáceo origina-se das glândulas sebáceas, especialmente as de Meibômio."
  },
  {
    pergunta: "Qual característica sugere carcinoma sebáceo palpebral?",
    alternativas: [
      "Lesão perolada com telangiectasia",
      "Nódulo indolor de crescimento lento",
      "Conjuntivite unilateral crônica e calázios múltiplos",
      "Lesão pigmentada homogênea",
      "Placa xantelasmática bilateral"
    ],
    correta: 2,
    explicacao: "Conjuntivite crônica unilateral e calázios recorrentes são sinais de alerta para carcinoma sebáceo."
  },
  {
    pergunta: "O melanoma palpebral é caracterizado principalmente por:",
    alternativas: [
      "Baixa mortalidade",
      "Ausência de pigmentação",
      "Alta agressividade e potencial metastático",
      "Crescimento exclusivamente superficial",
      "Origem exclusiva da conjuntiva"
    ],
    correta: 2,
    explicacao: "O melanoma apresenta alto potencial metastático e elevada mortalidade."
  },
  {
    pergunta: "Qual sinal clínico é mais sugestivo de melanoma palpebral?",
    alternativas: [
      "Nódulo perolado",
      "Placa amarelada",
      "Lesão pigmentada assimétrica com bordas irregulares",
      "Lesão ulcerada com crostas",
      "Lesão móvel subcutânea"
    ],
    correta: 2,
    explicacao: "Assimetria, bordas irregulares e variação de cor sugerem melanoma."
  },
  {
    pergunta: "Qual tumor palpebral benigno é caracterizado por placas amareladas, geralmente bilaterais?",
    alternativas: [
      "Nevus",
      "Papiloma",
      "Xantelasma",
      "Hidrocistoma",
      "Hemangioma"
    ],
    correta: 2,
    explicacao: "Xantelasma manifesta-se como placas amareladas, frequentemente bilaterais."
  },
  {
    pergunta: "O xantelasma está frequentemente associado a:",
    alternativas: [
      "Diabetes tipo 1",
      "Hipertireoidismo",
      "Dislipidemia",
      "Hipertensão arterial",
      "Glaucoma"
    ],
    correta: 2,
    explicacao: "O xantelasma pode estar associado a alterações do perfil lipídico."
  },
  {
    pergunta: "Qual tumor benigno palpebral é mais comum e se apresenta como lesão exofítica?",
    alternativas: [
      "Papiloma",
      "Melanoma",
      "Carcinoma basocelular",
      "Linfoma",
      "Carcinoma sebáceo"
    ],
    correta: 0,
    explicacao: "O papiloma é um tumor benigno comum, geralmente exofítico."
  },
  {
    pergunta: "O nevo palpebral geralmente apresenta qual comportamento?",
    alternativas: [
      "Sempre maligno",
      "Crescimento rápido e invasivo",
      "Lesão benigna estável, podendo pigmentar-se",
      "Alta taxa de metástase",
      "Associação obrigatória com melanoma"
    ],
    correta: 2,
    explicacao: "Nevos são lesões benignas, geralmente estáveis ao longo do tempo."
  },
  {
    pergunta: "Qual conduta é mais adequada diante de suspeita de tumor maligno palpebral?",
    alternativas: [
      "Observação clínica prolongada",
      "Tratamento empírico com antibiótico",
      "Biópsia para confirmação diagnóstica",
      "Crioterapia imediata",
      "Epilação da margem palpebral"
    ],
    correta: 2,
    explicacao: "A biópsia é fundamental para diagnóstico e planejamento terapêutico."
  },
  {
    pergunta: "Em tumores malignos palpebrais, a excisão cirúrgica adequada deve incluir:",
    alternativas: [
      "Apenas a lesão visível",
      "Margens cirúrgicas de segurança",
      "Somente tratamento clínico",
      "Exclusivamente crioterapia",
      "Radioterapia isolada em todos os casos"
    ],
    correta: 1,
    explicacao: "A excisão deve ser realizada com margens de segurança adequadas."
  },
  {
    pergunta: "Qual tumor palpebral pode estar associado à imunossupressão e apresentar coloração violácea?",
    alternativas: [
      "Sarcoma de Kaposi",
      "Papiloma",
      "Nevus",
      "Hidrocistoma",
      "Xantelasma"
    ],
    correta: 0,
    explicacao: "O sarcoma de Kaposi associa-se à imunossupressão e tem aspecto violáceo."
  },
  {
    pergunta: "O linfoma palpebral geralmente se apresenta como:",
    alternativas: [
      "Lesão ulcerada dolorosa",
      "Nódulo perolado com telangiectasias",
      "Massa indolor de crescimento lento",
      "Placa amarelada superficial",
      "Lesão pigmentada irregular"
    ],
    correta: 2,
    explicacao: "O linfoma palpebral costuma ser indolor e de crescimento lento."
  },
  {
    pergunta: "Qual afirmação sobre tumores palpebrais é correta?",
    alternativas: [
      "Todos os tumores palpebrais são benignos",
      "Lesões de crescimento lento nunca são malignas",
      "Tumores malignos podem simular doenças inflamatórias benignas",
      "A biópsia raramente é necessária",
      "Exposição solar não influencia tumores palpebrais"
    ],
    correta: 2,
    explicacao: "Alguns tumores malignos, como o carcinoma sebáceo, podem simular inflamações benignas."
  }
];
bancoQuestoes[4].push(
  {
    pergunta: "Qual fator clínico aumenta a suspeita de malignidade em uma lesão palpebral?",
    alternativas: [
      "Crescimento lento e estável",
      "Presença de cílios preservados sobre a lesão",
      "Perda de cílios (madarose) na área da lesão",
      "Coloração amarelada bilateral",
      "Lesão móvel e indolor"
    ],
    correta: 2,
    explicacao: "A perda de cílios sobre a lesão (madarose) é sinal de alerta para malignidade."
  },
  {
    pergunta: "A ulceração com bordas elevadas e endurecidas sugere principalmente:",
    alternativas: [
      "Papiloma",
      "Xantelasma",
      "Carcinoma basocelular",
      "Hidrocistoma",
      "Nevus intradérmico"
    ],
    correta: 2,
    explicacao: "O carcinoma basocelular pode ulcerar, formando a chamada “úlcera roedora”."
  },
  {
    pergunta: "Qual tumor palpebral benigno é formado por dilatação cística de glândulas sudoríparas?",
    alternativas: [
      "Papiloma",
      "Hidrocistoma",
      "Xantelasma",
      "Nevus",
      "Hemangioma"
    ],
    correta: 1,
    explicacao: "O hidrocistoma é uma lesão cística benigna de origem sudorípara."
  },
  {
    pergunta: "O hemangioma capilar palpebral ocorre mais frequentemente em:",
    alternativas: [
      "Idosos",
      "Adultos jovens",
      "Recém-nascidos e lactentes",
      "Pacientes imunossuprimidos",
      "Pacientes com doença tireoidiana"
    ],
    correta: 2,
    explicacao: "O hemangioma capilar é comum em recém-nascidos e lactentes."
  },
  {
    pergunta: "Qual complicação ocular pode ocorrer em hemangiomas palpebrais extensos na infância?",
    alternativas: [
      "Glaucoma de ângulo fechado",
      "Ambliopia por privação visual",
      "Ceratite infecciosa",
      "Descolamento de retina",
      "Uveíte anterior"
    ],
    correta: 1,
    explicacao: "Hemangiomas extensos podem ocluir o eixo visual e causar ambliopia."
  },
  {
    pergunta: "Em relação ao carcinoma espinocelular palpebral, é correto afirmar:",
    alternativas: [
      "Nunca metastatiza",
      "Apresenta crescimento sempre lento",
      "Pode invadir tecidos profundos e metastatizar",
      "É mais comum que o basocelular",
      "Não está relacionado à radiação solar"
    ],
    correta: 2,
    explicacao: "O carcinoma espinocelular tem maior agressividade local e potencial metastático."
  },
  {
    pergunta: "Qual exame é essencial para o diagnóstico definitivo dos tumores palpebrais?",
    alternativas: [
      "Ultrassonografia",
      "Tomografia computadorizada",
      "Biópsia histopatológica",
      "Ressonância magnética",
      "Angiografia"
    ],
    correta: 2,
    explicacao: "O diagnóstico definitivo depende da análise histopatológica."
  },
  {
    pergunta: "A técnica de Mohs é especialmente útil em tumores palpebrais porque:",
    alternativas: [
      "Evita qualquer necessidade de reconstrução",
      "Permite controle preciso das margens com preservação de tecido",
      "É indicada apenas para tumores benignos",
      "Dispensa exame histológico",
      "É método exclusivamente clínico"
    ],
    correta: 1,
    explicacao: "A cirurgia de Mohs permite controle das margens com máxima preservação tecidual."
  },
  {
    pergunta: "Qual tumor palpebral maligno apresenta maior taxa de mortalidade?",
    alternativas: [
      "Carcinoma basocelular",
      "Carcinoma espinocelular",
      "Carcinoma sebáceo",
      "Melanoma",
      "Linfoma"
    ],
    correta: 3,
    explicacao: "O melanoma é o tumor palpebral com maior potencial metastático e mortalidade."
  },
  {
    pergunta: "A presença de pigmentação variável, crescimento recente e sangramento sugere:",
    alternativas: [
      "Nevus benigno",
      "Papiloma",
      "Melanoma",
      "Xantelasma",
      "Hidrocistoma"
    ],
    correta: 2,
    explicacao: "Mudanças de cor, crescimento e sangramento são sinais de melanoma."
  },
  {
    pergunta: "O carcinoma sebáceo palpebral apresenta pior prognóstico principalmente porque:",
    alternativas: [
      "É sempre bilateral",
      "Costuma ser diagnosticado tardiamente",
      "Nunca responde à cirurgia",
      "Não pode ser biopsiado",
      "Não invade conjuntiva"
    ],
    correta: 1,
    explicacao: "O diagnóstico tardio, por simular doenças benignas, piora o prognóstico."
  },
  {
    pergunta: "Em tumores palpebrais malignos, a reconstrução palpebral deve ser realizada:",
    alternativas: [
      "Antes da confirmação histológica",
      "Somente após garantia de margens livres",
      "Sempre em um segundo tempo cirúrgico",
      "Apenas com enxerto conjuntival",
      "Sem considerar função palpebral"
    ],
    correta: 1,
    explicacao: "A reconstrução deve ocorrer após confirmação de margens livres de tumor."
  },
  {
    pergunta: "Qual tumor palpebral benigno é composto por proliferação vascular e pode regredir espontaneamente?",
    alternativas: [
      "Hemangioma capilar",
      "Papiloma",
      "Xantelasma",
      "Nevus azul",
      "Hidrocistoma"
    ],
    correta: 0,
    explicacao: "Hemangiomas capilares podem involuir espontaneamente ao longo do tempo."
  },
  {
    pergunta: "Qual sinal clínico diferencia linfoma palpebral de processos inflamatórios?",
    alternativas: [
      "Dor intensa",
      "Resposta rápida a antibióticos",
      "Massa indolor, firme e de crescimento lento",
      "Hiperemia intensa com secreção purulenta",
      "Ulceração precoce"
    ],
    correta: 2,
    explicacao: "Linfomas costumam ser indolores e de crescimento lento."
  },
  {
    pergunta: "Em suspeita de linfoma palpebral, a investigação sistêmica é importante porque:",
    alternativas: [
      "É sempre primário da pálpebra",
      "Nunca se associa a doença sistêmica",
      "Pode estar associado a linfoma sistêmico",
      "Não há tratamento específico",
      "Não requer acompanhamento"
    ],
    correta: 2,
    explicacao: "O linfoma palpebral pode estar associado a doença linfoproliferativa sistêmica."
  },
  {
    pergunta: "O carcinoma basocelular é mais comum em indivíduos com:",
    alternativas: [
      "Pele escura e pouca exposição solar",
      "Pele clara e exposição solar crônica",
      "História de trauma ocular",
      "Doença autoimune",
      "Infecção viral prévia"
    ],
    correta: 1,
    explicacao: "Pele clara e exposição solar crônica aumentam o risco."
  },
  {
    pergunta: "A radioterapia pode ser considerada em tumores palpebrais:",
    alternativas: [
      "Como primeira linha em todos os casos",
      "Somente em tumores benignos",
      "Quando cirurgia é contraindicada ou como adjuvante",
      "Nunca deve ser utilizada",
      "Apenas em crianças"
    ],
    correta: 2,
    explicacao: "A radioterapia pode ser opção quando a cirurgia não é possível ou como adjuvante."
  },
  {
    pergunta: "Qual tumor palpebral benigno pode apresentar coloração azulada?",
    alternativas: [
      "Nevus azul",
      "Xantelasma",
      "Papiloma",
      "Hidrocistoma",
      "Hemangioma capilar"
    ],
    correta: 0,
    explicacao: "O nevo azul apresenta coloração azulada característica."
  },
  {
    pergunta: "Em lesões palpebrais suspeitas, a regra prática mais segura é:",
    alternativas: [
      "Tratar clinicamente por longo período",
      "Ignorar se não houver dor",
      "Realizar biópsia precoce",
      "Aguardar regressão espontânea",
      "Aplicar corticoide tópico"
    ],
    correta: 2,
    explicacao: "A biópsia precoce evita atraso diagnóstico em tumores malignos."
  },
  {
    pergunta: "Qual afirmação final sobre tumores palpebrais está correta?",
    alternativas: [
      "Tumores benignos nunca exigem acompanhamento",
      "A maioria dos tumores palpebrais é maligna",
      "Diagnóstico precoce melhora prognóstico funcional e vital",
      "Reconstrução é mais importante que excisão completa",
      "Exposição solar não influencia risco tumoral"
    ],
    correta: 2,
    explicacao: "O diagnóstico precoce melhora o prognóstico e preserva função e estética."
  }
);
bancoQuestoes[5] = [
  {
    pergunta: "Em um trauma palpebral, qual é a prioridade inicial na avaliação do paciente?",
    alternativas: [
      "Avaliar apenas a ferida palpebral",
      "Avaliar acuidade visual e possível lesão ocular associada",
      "Suturar imediatamente a pele",
      "Solicitar tomografia em todos os casos",
      "Prescrever antibiótico tópico"
    ],
    correta: 1,
    explicacao: "Em traumas palpebrais, a prioridade é excluir lesão ocular associada e avaliar a acuidade visual."
  },
  {
    pergunta: "Uma laceração palpebral que envolve a margem livre deve ser:",
    alternativas: [
      "Suturada de forma simples pela pele",
      "Deixada cicatrizar por segunda intenção",
      "Reparada cuidadosamente com alinhamento preciso da margem",
      "Sempre tratada apenas com cola cirúrgica",
      "Ignorada se não houver sangramento"
    ],
    correta: 2,
    explicacao: "O alinhamento preciso da margem palpebral é fundamental para evitar entalhes e triquíase secundária."
  },
  {
    pergunta: "Qual estrutura deve ser suspeitada de lesão quando o trauma ocorre próximo ao canto medial?",
    alternativas: [
      "Músculo frontal",
      "Ligamento de Whitnall",
      "Sistema de drenagem lacrimal",
      "Músculo levantador",
      "Glândula lacrimal"
    ],
    correta: 2,
    explicacao: "Traumas no canto medial levantam suspeita de lesão dos canalículos lacrimais."
  },
  {
    pergunta: "A principal complicação de uma laceração palpebral mal reparada é:",
    alternativas: [
      "Hipertensão ocular",
      "Ptose congênita",
      "Deformidade funcional e estética da pálpebra",
      "Glaucoma secundário",
      "Descolamento de retina"
    ],
    correta: 2,
    explicacao: "Reparos inadequados podem causar deformidades funcionais e estéticas permanentes."
  },
  {
    pergunta: "Em lacerações que envolvem o tarso, é correto afirmar:",
    alternativas: [
      "O tarso não deve ser suturado",
      "Apenas a pele deve ser aproximada",
      "O tarso deve ser suturado para restaurar a estrutura palpebral",
      "O tarso deve ser removido",
      "A sutura tarsal não influencia o resultado"
    ],
    correta: 2,
    explicacao: "A sutura adequada do tarso é essencial para restaurar a rigidez e a forma da pálpebra."
  },
  {
    pergunta: "Qual material de sutura é geralmente preferido para a margem palpebral?",
    alternativas: [
      "Fio absorvível grosso (2-0)",
      "Fio não absorvível fino (ex.: nylon 6-0)",
      "Fio metálico",
      "Apenas cola cirúrgica",
      "Qualquer fio disponível"
    ],
    correta: 1,
    explicacao: "Fios não absorvíveis finos permitem melhor alinhamento e menor reação inflamatória."
  },
  {
    pergunta: "Em ferimentos contaminados por mordedura animal, a conduta adequada inclui:",
    alternativas: [
      "Sutura imediata sem limpeza",
      "Apenas observação clínica",
      "Limpeza rigorosa, profilaxia antibiótica e avaliação para sutura",
      "Crioterapia local",
      "Radioterapia"
    ],
    correta: 2,
    explicacao: "Feridas por mordedura exigem limpeza cuidadosa e antibiótico profilático."
  },
  {
    pergunta: "Uma laceração palpebral de espessura total é aquela que:",
    alternativas: [
      "Envolve apenas a pele",
      "Envolve pele e músculo orbicular",
      "Atinge todas as camadas, incluindo tarso e conjuntiva",
      "Acomete somente a conjuntiva",
      "Não sangra"
    ],
    correta: 2,
    explicacao: "Lacerações de espessura total envolvem todas as camadas da pálpebra."
  },
  {
    pergunta: "Qual achado sugere fortemente lesão canalicular em um trauma palpebral?",
    alternativas: [
      "Edema palpebral isolado",
      "Hematoma subconjuntival",
      "Laceração próxima ao ponto lacrimal",
      "Equimose periorbitária",
      "Hiperemia conjuntival difusa"
    ],
    correta: 2,
    explicacao: "Lacerações próximas ao ponto lacrimal sugerem lesão do sistema canalicular."
  },
  {
    pergunta: "O reparo de lesões canaliculares deve ser realizado:",
    alternativas: [
      "Somente após 30 dias",
      "Preferencialmente de forma precoce",
      "Apenas se houver epífora tardia",
      "Nunca cirurgicamente",
      "Somente com cola biológica"
    ],
    correta: 1,
    explicacao: "O reparo precoce aumenta as chances de sucesso funcional."
  },
  {
    pergunta: "Em perdas teciduais palpebrais pequenas (<25% da pálpebra), a reconstrução pode ser feita geralmente por:",
    alternativas: [
      "Retalho complexo obrigatório",
      "Enxerto livre de pele",
      "Fechamento direto",
      "Suspensão frontal",
      "Retalho de Cutler-Beard"
    ],
    correta: 2,
    explicacao: "Perdas pequenas permitem fechamento direto sem tensão excessiva."
  },
  {
    pergunta: "Perdas palpebrais de 25–50% geralmente exigem:",
    alternativas: [
      "Apenas observação",
      "Fechamento direto simples",
      "Retalhos locais para reconstrução",
      "Exenteração orbitária",
      "Radioterapia"
    ],
    correta: 2,
    explicacao: "Defeitos intermediários costumam necessitar de retalhos locais."
  },
  {
    pergunta: "Perdas extensas (>50%) da pálpebra superior podem exigir:",
    alternativas: [
      "Apenas sutura simples",
      "Retalho de Cutler-Beard",
      "Retalho de Hughes",
      "Blefaroplastia estética",
      "Suspensão frontal isolada"
    ],
    correta: 1,
    explicacao: "O retalho de Cutler-Beard é clássico para grandes defeitos da pálpebra superior."
  },
  {
    pergunta: "O retalho de Hughes é mais indicado para reconstrução de:",
    alternativas: [
      "Pálpebra superior",
      "Canto lateral",
      "Pálpebra inferior",
      "Sobrancelha",
      "Conjuntiva bulbar isolada"
    ],
    correta: 2,
    explicacao: "O retalho de Hughes é utilizado para defeitos extensos da pálpebra inferior."
  },
  {
    pergunta: "Na reconstrução palpebral, o princípio fundamental é:",
    alternativas: [
      "Priorizar apenas a estética",
      "Reconstruir lamela anterior e posterior adequadamente",
      "Usar sempre enxertos livres",
      "Evitar suturas profundas",
      "Ignorar a função palpebral"
    ],
    correta: 1,
    explicacao: "A reconstrução deve restaurar adequadamente as lamelas anterior e posterior."
  },
  {
    pergunta: "Qual camada compõe a lamela POSTERIOR da pálpebra?",
    alternativas: [
      "Pele e músculo orbicular",
      "Pele e tarso",
      "Tarso e conjuntiva",
      "Orbicular e pele",
      "Septo orbitário e gordura"
    ],
    correta: 2,
    explicacao: "A lamela posterior é composta por tarso e conjuntiva."
  },
  {
    pergunta: "Qual camada compõe a lamela ANTERIOR da pálpebra?",
    alternativas: [
      "Tarso e conjuntiva",
      "Pele e músculo orbicular",
      "Septo orbitário e gordura",
      "Conjuntiva e músculo de Müller",
      "Tarso e músculo levantador"
    ],
    correta: 1,
    explicacao: "A lamela anterior é formada por pele e músculo orbicular."
  },
  {
    pergunta: "Em reconstrução palpebral, enxertos livres de pele devem ser preferencialmente obtidos de:",
    alternativas: [
      "Coxa",
      "Abdome",
      "Pálpebra contralateral ou região retroauricular",
      "Planta do pé",
      "Região lombar"
    ],
    correta: 2,
    explicacao: "Pele palpebral ou retroauricular tem textura e espessura mais adequadas."
  },
  {
    pergunta: "Qual complicação pode ocorrer após reconstrução palpebral inadequada?",
    alternativas: [
      "Entrópio ou ectrópio secundário",
      "Hipertensão arterial",
      "Catarata",
      "Uveíte",
      "Descolamento de retina"
    ],
    correta: 0,
    explicacao: "Reconstruções inadequadas podem resultar em malposições palpebrais."
  },
  {
    pergunta: "Em traumas palpebrais, o acompanhamento pós-operatório é importante principalmente para:",
    alternativas: [
      "Evitar crescimento tumoral",
      "Detectar infecção, deiscência e malposições",
      "Aumentar produção lacrimal",
      "Controlar pressão intraocular",
      "Avaliar motilidade ocular"
    ],
    correta: 1,
    explicacao: "O seguimento permite identificar precocemente complicações locais e funcionais."
  }
];
bancoQuestoes[5].push(
  {
    pergunta: "Em lacerações palpebrais, a identificação do plano correto de sutura é importante para:",
    alternativas: [
      "Aumentar a velocidade do procedimento",
      "Reduzir sangramento apenas",
      "Restaurar função e evitar deformidades tardias",
      "Evitar uso de antibióticos",
      "Eliminar necessidade de acompanhamento"
    ],
    correta: 2,
    explicacao: "A sutura em planos corretos restaura anatomia e função, prevenindo deformidades."
  },
  {
    pergunta: "Qual situação contraindica o fechamento primário imediato de uma ferida palpebral?",
    alternativas: [
      "Ferida limpa recente",
      "Laceração pequena",
      "Ferida extensamente contaminada ou com infecção ativa",
      "Trauma fechado",
      "Ausência de sangramento"
    ],
    correta: 2,
    explicacao: "Feridas muito contaminadas ou infectadas podem exigir tratamento inicial antes do fechamento."
  },
  {
    pergunta: "Em traumas com suspeita de fratura orbitária associada, o exame de escolha é:",
    alternativas: [
      "Ultrassonografia",
      "Radiografia simples",
      "Tomografia computadorizada de órbita",
      "Ressonância magnética de rotina",
      "Angiografia"
    ],
    correta: 2,
    explicacao: "A tomografia é o exame padrão para avaliação de fraturas orbitárias."
  },
  {
    pergunta: "A perda do ponto lacrimal inferior isoladamente costuma resultar em:",
    alternativas: [
      "Anidrose palpebral",
      "Ptose severa",
      "Pouca ou nenhuma repercussão clínica",
      "Necessidade imediata de cirurgia complexa",
      "Lagoftalmo permanente"
    ],
    correta: 2,
    explicacao: "A perda isolada de um ponto lacrimal geralmente tem pouca repercussão clínica."
  },
  {
    pergunta: "Em lesões canaliculares, a intubação com silicone tem como principal objetivo:",
    alternativas: [
      "Aumentar a produção lacrimal",
      "Manter a permeabilidade do sistema lacrimal durante cicatrização",
      "Reduzir inflamação palpebral",
      "Evitar necessidade de sutura",
      "Corrigir ectrópio"
    ],
    correta: 1,
    explicacao: "A intubação mantém a luz canalicular aberta durante o processo de cicatrização."
  },
  {
    pergunta: "O tempo ideal para reparo de laceração canalicular, quando possível, é:",
    alternativas: [
      "Imediatamente após o trauma ou nas primeiras 24–48 horas",
      "Após 30 dias",
      "Somente se houver epífora tardia",
      "Apenas em ambiente ambulatorial",
      "Nunca cirúrgico"
    ],
    correta: 0,
    explicacao: "O reparo precoce aumenta a taxa de sucesso funcional."
  },
  {
    pergunta: "Em reconstruções palpebrais, a tensão excessiva no fechamento pode resultar em:",
    alternativas: [
      "Melhor resultado estético",
      "Entrópio ou ectrópio secundário",
      "Redução do edema",
      "Menor risco de infecção",
      "Hipertrofia do tarso"
    ],
    correta: 1,
    explicacao: "Tensão excessiva favorece malposições palpebrais secundárias."
  },
  {
    pergunta: "O princípio de que ‘uma lamela deve ser reconstruída por tecido vascularizado’ refere-se a:",
    alternativas: [
      "Reconstrução estética apenas",
      "Uso obrigatório de enxertos livres em ambas as lamelas",
      "Evitar enxerto livre simultâneo em ambas as lamelas",
      "Suturar apenas a pele",
      "Evitar qualquer tipo de retalho"
    ],
    correta: 2,
    explicacao: "Uma das lamelas deve ser vascularizada para garantir viabilidade tecidual."
  },
  {
    pergunta: "Qual estrutura fornece suporte estrutural essencial à pálpebra reconstruída?",
    alternativas: [
      "Conjuntiva",
      "Tarso ou substituto rígido",
      "Pele apenas",
      "Músculo frontal",
      "Septo orbitário"
    ],
    correta: 1,
    explicacao: "O tarso (ou substituto rígido) é fundamental para estabilidade palpebral."
  },
  {
    pergunta: "Na ausência de tarso, qual estrutura pode ser utilizada como substituto rígido?",
    alternativas: [
      "Gordura orbital",
      "Fáscia temporal",
      "Cartilagem auricular",
      "Pele retroauricular",
      "Músculo orbicular"
    ],
    correta: 2,
    explicacao: "A cartilagem auricular é frequentemente utilizada como substituto do tarso."
  },
  {
    pergunta: "O alinhamento correto da linha cinzenta durante o reparo da margem palpebral é importante para evitar:",
    alternativas: [
      "Hipertensão ocular",
      "Entrópio, ectrópio e irregularidades da margem",
      "Ptose neurogênica",
      "Ambliopia",
      "Aumento da produção lacrimal"
    ],
    correta: 1,
    explicacao: "O desalinhamento da linha cinzenta causa irregularidades e malposições."
  },
  {
    pergunta: "Em trauma palpebral com perda de cílios, o prognóstico funcional depende principalmente de:",
    alternativas: [
      "Quantidade de cílios remanescentes",
      "Integridade do tarso e margem palpebral",
      "Uso de antibiótico sistêmico",
      "Idade do paciente",
      "Tempo de hospitalização"
    ],
    correta: 1,
    explicacao: "A integridade estrutural da margem e do tarso é mais relevante que a perda de cílios."
  },
  {
    pergunta: "A cantotomia lateral pode ser necessária em trauma para:",
    alternativas: [
      "Melhorar estética",
      "Reduzir pressão orbital aguda",
      "Corrigir ptose",
      "Reconstruir tarso",
      "Evitar infecção"
    ],
    correta: 1,
    explicacao: "Cantotomia/cantólise são medidas de emergência para descompressão orbitária."
  },
  {
    pergunta: "Qual achado sugere síndrome compartimental orbitária em trauma?",
    alternativas: [
      "Epífora isolada",
      "Ptose leve",
      "Proptose dolorosa com perda visual",
      "Hematoma palpebral discreto",
      "Conjuntivite"
    ],
    correta: 2,
    explicacao: "Proptose dolorosa com queda visual sugere síndrome compartimental orbitária."
  },
  {
    pergunta: "Em reconstrução palpebral, o retalho de avanço local tem como principal vantagem:",
    alternativas: [
      "Ausência de cicatriz",
      "Textura e cor semelhantes ao tecido original",
      "Não requer planejamento",
      "É sempre bilateral",
      "Substitui o tarso"
    ],
    correta: 1,
    explicacao: "Retalhos locais oferecem melhor correspondência de cor e textura."
  },
  {
    pergunta: "Após reconstrução palpebral extensa, o uso de lubrificação ocular é importante para:",
    alternativas: [
      "Evitar recidiva tumoral",
      "Proteger a superfície ocular durante adaptação funcional",
      "Reduzir pressão arterial",
      "Aumentar cicatrização cutânea apenas",
      "Evitar ptose"
    ],
    correta: 1,
    explicacao: "A lubrificação protege a córnea durante o período de adaptação."
  },
  {
    pergunta: "Qual complicação tardia pode ocorrer após trauma palpebral mesmo com reparo inicial adequado?",
    alternativas: [
      "Glaucoma primário",
      "Malposição palpebral tardia",
      "Catarata nuclear",
      "Degeneração macular",
      "Uveíte crônica"
    ],
    correta: 1,
    explicacao: "Malposições tardias podem surgir com cicatrização e retração."
  },
  {
    pergunta: "A reconstrução do canto medial exige atenção especial principalmente devido à:",
    alternativas: [
      "Presença do músculo frontal",
      "Proximidade do sistema lacrimal",
      "Ausência de tarso",
      "Baixa vascularização",
      "Espessura da pele"
    ],
    correta: 1,
    explicacao: "A proximidade dos canalículos e saco lacrimal exige cuidado no canto medial."
  },
  {
    pergunta: "Em feridas palpebrais, a antibioticoterapia sistêmica é indicada principalmente quando:",
    alternativas: [
      "Feridas limpas",
      "Feridas pequenas",
      "Feridas contaminadas, mordeduras ou infecção associada",
      "Em todos os casos",
      "Nunca indicada"
    ],
    correta: 2,
    explicacao: "Antibiótico sistêmico é reservado para feridas contaminadas ou mordeduras."
  },
  {
    pergunta: "Qual afirmação final sobre trauma palpebral é correta?",
    alternativas: [
      "Traumas palpebrais são sempre simples",
      "A avaliação ocular completa é dispensável",
      "O reparo adequado previne sequelas funcionais e estéticas",
      "Reconstrução é apenas estética",
      "Seguimento não é necessário"
    ],
    correta: 2,
    explicacao: "O reparo correto e seguimento adequado previnem sequelas."
  }
);
bancoQuestoes[6] = [
  {
    pergunta: "A principal glândula responsável pela produção da porção aquosa da lágrima é:",
    alternativas: [
      "Glândulas de Meibômio",
      "Glândula lacrimal principal",
      "Glândulas de Zeiss",
      "Glândulas de Moll",
      "Células caliciformes"
    ],
    correta: 1,
    explicacao: "A glândula lacrimal principal é a principal responsável pela produção da fase aquosa da lágrima."
  },
  {
    pergunta: "As glândulas lacrimais acessórias de Krause e Wolfring são responsáveis principalmente por:",
    alternativas: [
      "Produção reflexa da lágrima",
      "Produção basal da lágrima",
      "Produção da fase lipídica",
      "Drenagem da lágrima",
      "Estabilidade da margem palpebral"
    ],
    correta: 1,
    explicacao: "As glândulas acessórias contribuem principalmente para a produção basal da lágrima."
  },
  {
    pergunta: "Qual camada do filme lacrimal é responsável por reduzir a evaporação?",
    alternativas: [
      "Camada aquosa",
      "Camada mucínica",
      "Camada lipídica",
      "Camada proteica",
      "Camada conjuntival"
    ],
    correta: 2,
    explicacao: "A camada lipídica, produzida pelas glândulas de Meibômio, reduz a evaporação da lágrima."
  },
  {
    pergunta: "A camada mucínica do filme lacrimal tem como principal função:",
    alternativas: [
      "Nutrir a córnea",
      "Reduzir a evaporação",
      "Tornar a superfície corneana hidrofílica",
      "Drenar a lágrima",
      "Produzir imunoglobulinas"
    ],
    correta: 2,
    explicacao: "A mucina torna a superfície epitelial hidrofílica, permitindo melhor espalhamento da lágrima."
  },
  {
    pergunta: "As células caliciformes conjuntivais são responsáveis pela produção de:",
    alternativas: [
      "Lipídios",
      "Proteínas séricas",
      "Mucina",
      "Eletrólitos",
      "Lisozima"
    ],
    correta: 2,
    explicacao: "As células caliciformes produzem mucina, componente essencial da camada mucínica."
  },
  {
    pergunta: "A inervação parassimpática da glândula lacrimal é responsável principalmente por:",
    alternativas: [
      "Produção basal contínua",
      "Produção reflexa da lágrima",
      "Produção da fase lipídica",
      "Drenagem lacrimal",
      "Contração do saco lacrimal"
    ],
    correta: 1,
    explicacao: "A inervação parassimpática estimula a secreção reflexa da lágrima."
  },
  {
    pergunta: "Qual nervo conduz as fibras parassimpáticas secretomotoras para a glândula lacrimal?",
    alternativas: [
      "Nervo trigêmeo (V)",
      "Nervo facial (VII)",
      "Nervo oculomotor (III)",
      "Nervo óptico (II)",
      "Nervo abducente (VI)"
    ],
    correta: 1,
    explicacao: "As fibras secretomotoras parassimpáticas originam-se do nervo facial (VII)."
  },
  {
    pergunta: "O gânglio pterigopalatino está envolvido principalmente em:",
    alternativas: [
      "Drenagem lacrimal",
      "Inervação sensitiva da córnea",
      "Via parassimpática para a glândula lacrimal",
      "Produção de mucina",
      "Controle do piscar"
    ],
    correta: 2,
    explicacao: "O gânglio pterigopalatino participa da via parassimpática para secreção lacrimal."
  },
  {
    pergunta: "A fase aquosa da lágrima contém todas as substâncias abaixo, EXCETO:",
    alternativas: [
      "Lisozima",
      "Lactoferrina",
      "Imunoglobulina A",
      "Lipídios",
      "Eletrólitos"
    ],
    correta: 3,
    explicacao: "Os lipídios pertencem à camada lipídica, não à fase aquosa."
  },
  {
    pergunta: "Qual componente do filme lacrimal tem papel importante na defesa imunológica?",
    alternativas: [
      "Mucina apenas",
      "Lipídios apenas",
      "Imunoglobulina A",
      "Ácido hialurônico",
      "Colágeno"
    ],
    correta: 2,
    explicacao: "A IgA secretora tem papel fundamental na defesa imunológica ocular."
  },
  {
    pergunta: "A produção lacrimal reflexa é estimulada principalmente por:",
    alternativas: [
      "Luz intensa",
      "Piscar voluntário",
      "Irritação da superfície ocular",
      "Sono profundo",
      "Pressão intraocular elevada"
    ],
    correta: 2,
    explicacao: "A irritação da superfície ocular desencadeia produção lacrimal reflexa."
  },
  {
    pergunta: "A glândula lacrimal principal localiza-se principalmente:",
    alternativas: [
      "No canto medial",
      "No fórnice inferior",
      "Na fossa lacrimal do osso frontal, no quadrante superolateral da órbita",
      "Dentro do saco lacrimal",
      "No tarso superior"
    ],
    correta: 2,
    explicacao: "A glândula lacrimal principal situa-se no quadrante superolateral da órbita."
  },
  {
    pergunta: "Qual músculo auxilia a secreção lacrimal por compressão da glândula durante o piscar?",
    alternativas: [
      "Músculo frontal",
      "Músculo orbicular",
      "Músculo levantador",
      "Músculo de Müller",
      "Músculo reto superior"
    ],
    correta: 1,
    explicacao: "A contração do músculo orbicular auxilia a expressão da secreção lacrimal."
  },
  {
    pergunta: "A estabilidade do filme lacrimal depende principalmente de:",
    alternativas: [
      "Produção aquosa excessiva",
      "Equilíbrio entre as três camadas do filme lacrimal",
      "Drenagem lacrimal aumentada",
      "Tamanho do saco lacrimal",
      "Quantidade de cílios"
    ],
    correta: 1,
    explicacao: "A estabilidade depende do equilíbrio entre camadas lipídica, aquosa e mucínica."
  },
  {
    pergunta: "A deficiência da camada lipídica está mais relacionada a:",
    alternativas: [
      "Síndrome de Sjögren",
      "Disfunção das glândulas de Meibômio",
      "Hipossecreção da glândula lacrimal principal",
      "Obstrução do canalículo",
      "Lacrimejamento reflexo"
    ],
    correta: 1,
    explicacao: "A disfunção das glândulas de Meibômio compromete a camada lipídica."
  },
  {
    pergunta: "A deficiência da camada mucínica pode ocorrer principalmente em:",
    alternativas: [
      "Blefarite posterior isolada",
      "Conjuntivites cicatriciais",
      "Entrópio involucional",
      "Ectrópio paralítico",
      "Trauma palpebral"
    ],
    correta: 1,
    explicacao: "Conjuntivites cicatriciais reduzem células caliciformes e a produção de mucina."
  },
  {
    pergunta: "O principal papel do piscar na fisiologia lacrimal é:",
    alternativas: [
      "Produzir lágrima aquosa",
      "Distribuir uniformemente o filme lacrimal",
      "Aumentar evaporação",
      "Bloquear drenagem",
      "Estimular secreção lipídica direta"
    ],
    correta: 1,
    explicacao: "O piscar distribui e renova o filme lacrimal sobre a superfície ocular."
  },
  {
    pergunta: "A hipolacrimia pode resultar em:",
    alternativas: [
      "Epífora constante",
      "Instabilidade do filme lacrimal e sintomas de olho seco",
      "Melhor proteção corneana",
      "Aumento da drenagem lacrimal",
      "Redução do piscar"
    ],
    correta: 1,
    explicacao: "A redução da produção lacrimal leva à instabilidade do filme e sintomas de olho seco."
  },
  {
    pergunta: "Qual alteração é mais compatível com aumento da evaporação lacrimal?",
    alternativas: [
      "Deficiência aquosa pura",
      "Disfunção meibomiana",
      "Obstrução do canalículo",
      "Hipersecreção reflexa",
      "Aumento de células caliciformes"
    ],
    correta: 1,
    explicacao: "A disfunção meibomiana compromete a camada lipídica, aumentando evaporação."
  },
  {
    pergunta: "Em condições normais, a maior parte da lágrima é produzida por:",
    alternativas: [
      "Glândula lacrimal principal",
      "Glândulas acessórias",
      "Glândulas de Meibômio",
      "Células caliciformes",
      "Saco lacrimal"
    ],
    correta: 1,
    explicacao: "A produção basal contínua é predominantemente realizada pelas glândulas acessórias."
  }
];
bancoQuestoes[6].push(
  {
    pergunta: "A produção lacrimal basal tem como principal finalidade:",
    alternativas: [
      "Resposta a estímulos dolorosos",
      "Manter hidratação e nutrição contínua da superfície ocular",
      "Promover drenagem rápida da lágrima",
      "Eliminar completamente microrganismos",
      "Produzir visão noturna"
    ],
    correta: 1,
    explicacao: "A produção basal mantém a superfície ocular hidratada e funcional continuamente."
  },
  {
    pergunta: "Qual camada do filme lacrimal é a primeira a entrar em contato com o epitélio corneano?",
    alternativas: [
      "Lipídica",
      "Aquosa",
      "Mucínica",
      "Proteica",
      "Serosa"
    ],
    correta: 2,
    explicacao: "A camada mucínica é a mais interna, em contato direto com o epitélio."
  },
  {
    pergunta: "A principal fonte da camada lipídica do filme lacrimal é:",
    alternativas: [
      "Glândula lacrimal principal",
      "Glândulas acessórias",
      "Glândulas de Meibômio",
      "Células caliciformes",
      "Glândulas sudoríparas"
    ],
    correta: 2,
    explicacao: "As glândulas de Meibômio produzem a camada lipídica."
  },
  {
    pergunta: "Qual achado está mais associado à instabilidade do filme lacrimal?",
    alternativas: [
      "Aumento da produção basal",
      "Tempo de ruptura do filme lacrimal reduzido (BUT baixo)",
      "Aumento do volume lacrimal",
      "Obstrução do saco lacrimal",
      "Hipertrofia do tarso"
    ],
    correta: 1,
    explicacao: "O BUT reduzido indica instabilidade do filme lacrimal."
  },
  {
    pergunta: "O reflexo lacrimal depende principalmente de qual tipo de inervação?",
    alternativas: [
      "Simpática",
      "Motora somática",
      "Parassimpática",
      "Sensitiva exclusiva",
      "Autonômica simpática e parassimpática em igual proporção"
    ],
    correta: 2,
    explicacao: "A produção reflexa é mediada predominantemente pela via parassimpática."
  },
  {
    pergunta: "A estimulação sensitiva da córnea que desencadeia lacrimejamento reflexo ocorre via:",
    alternativas: [
      "Nervo facial (VII)",
      "Nervo óptico (II)",
      "Nervo trigêmeo (V)",
      "Nervo oculomotor (III)",
      "Nervo abducente (VI)"
    ],
    correta: 2,
    explicacao: "A aferência sensitiva corneana ocorre pelo trigêmeo (V)."
  },
  {
    pergunta: "Qual estrutura NÃO participa diretamente da produção da lágrima?",
    alternativas: [
      "Glândula lacrimal principal",
      "Glândulas acessórias",
      "Células caliciformes",
      "Saco lacrimal",
      "Glândulas de Meibômio"
    ],
    correta: 3,
    explicacao: "O saco lacrimal participa da drenagem, não da produção."
  },
  {
    pergunta: "A deficiência aquosa da lágrima está classicamente associada a:",
    alternativas: [
      "Disfunção meibomiana",
      "Síndrome de Sjögren",
      "Blefarite posterior",
      "Entrópio involucional",
      "Obstrução canalicular"
    ],
    correta: 1,
    explicacao: "A síndrome de Sjögren cursa com deficiência aquosa lacrimal."
  },
  {
    pergunta: "Qual teste avalia principalmente a produção lacrimal?",
    alternativas: [
      "Teste de Jones",
      "Teste de Schirmer",
      "Tempo de ruptura do filme lacrimal (BUT)",
      "Dacriocistografia",
      "Teste do fluoresceína"
    ],
    correta: 1,
    explicacao: "O teste de Schirmer mede a produção lacrimal."
  },
  {
    pergunta: "O teste de Schirmer sem anestesia avalia:",
    alternativas: [
      "Produção basal apenas",
      "Produção reflexa apenas",
      "Produção basal + reflexa",
      "Drenagem lacrimal",
      "Estabilidade do filme"
    ],
    correta: 2,
    explicacao: "Sem anestesia, o Schirmer avalia produção basal e reflexa."
  },
  {
    pergunta: "O tempo de ruptura do filme lacrimal (BUT) avalia principalmente:",
    alternativas: [
      "Volume lacrimal",
      "Produção reflexa",
      "Estabilidade do filme lacrimal",
      "Drenagem lacrimal",
      "Integridade do saco lacrimal"
    ],
    correta: 2,
    explicacao: "O BUT avalia a estabilidade do filme lacrimal."
  },
  {
    pergunta: "Um BUT reduzido está mais frequentemente relacionado a:",
    alternativas: [
      "Deficiência aquosa pura",
      "Disfunção da camada lipídica",
      "Obstrução canalicular",
      "Hipersecreção reflexa",
      "Aumento do piscar"
    ],
    correta: 1,
    explicacao: "A deficiência da camada lipídica reduz a estabilidade do filme."
  },
  {
    pergunta: "Qual fator fisiológico pode aumentar a evaporação da lágrima?",
    alternativas: [
      "Piscar frequente",
      "Ambiente seco e ventilado",
      "Aumento da mucina",
      "Produção aquosa elevada",
      "Drenagem lacrimal reduzida"
    ],
    correta: 1,
    explicacao: "Ambientes secos e ventilados aumentam a evaporação."
  },
  {
    pergunta: "A principal função da lisozima presente na lágrima é:",
    alternativas: [
      "Lubrificação",
      "Ação antibacteriana",
      "Redução da evaporação",
      "Nutrição da córnea",
      "Produção de mucina"
    ],
    correta: 1,
    explicacao: "A lisozima possui ação antibacteriana."
  },
  {
    pergunta: "Qual componente lacrimal tem papel importante na cicatrização epitelial?",
    alternativas: [
      "Lipídios",
      "Mucina",
      "Fatores de crescimento",
      "Colesterol",
      "Albumina sérica"
    ],
    correta: 2,
    explicacao: "Fatores de crescimento presentes na lágrima auxiliam a cicatrização."
  },
  {
    pergunta: "A redução do piscar, como ocorre em uso prolongado de telas, pode levar a:",
    alternativas: [
      "Aumento da produção lacrimal",
      "Instabilidade do filme lacrimal",
      "Melhora da camada lipídica",
      "Redução da evaporação",
      "Hipersecreção reflexa"
    ],
    correta: 1,
    explicacao: "Menor frequência de piscar prejudica a distribuição do filme."
  },
  {
    pergunta: "Qual situação aumenta a produção lacrimal reflexa?",
    alternativas: [
      "Sono profundo",
      "Anestesia tópica",
      "Corpo estranho na superfície ocular",
      "Uso de óculos escuros",
      "Ambiente úmido"
    ],
    correta: 2,
    explicacao: "Irritação da superfície ocular aumenta a produção reflexa."
  },
  {
    pergunta: "O equilíbrio do filme lacrimal depende também de:",
    alternativas: [
      "Função palpebral e piscamento adequados",
      "Apenas da produção aquosa",
      "Somente da drenagem",
      "Exclusivamente da mucina",
      "Tamanho do saco lacrimal"
    ],
    correta: 0,
    explicacao: "Piscamento e função palpebral adequados são fundamentais."
  },
  {
    pergunta: "Qual alteração pode levar a epífora paradoxal?",
    alternativas: [
      "Hipersecreção aquosa pura",
      "Deficiência aquosa com instabilidade do filme",
      "Obstrução total do canalículo",
      "Aumento da camada lipídica",
      "Produção excessiva de mucina"
    ],
    correta: 1,
    explicacao: "Deficiência aquosa pode causar irritação e lacrimejamento reflexo."
  },
  {
    pergunta: "Qual afirmação final sobre a fisiologia lacrimal está correta?",
    alternativas: [
      "A lágrima é composta por uma única camada homogênea",
      "A produção lacrimal depende apenas da glândula principal",
      "O filme lacrimal é essencial para proteção, nutrição e qualidade visual",
      "A mucina não tem papel funcional",
      "A camada lipídica não influencia evaporação"
    ],
    correta: 2,
    explicacao: "O filme lacrimal é essencial para proteção ocular e qualidade visual."
  }
);
bancoQuestoes[7] = [
  {
    pergunta: "A drenagem da lágrima inicia-se principalmente por qual estrutura?",
    alternativas: [
      "Saco lacrimal",
      "Canalículo comum",
      "Pontos lacrimais",
      "Ducto nasolacrimal",
      "Meato inferior"
    ],
    correta: 2,
    explicacao: "A drenagem lacrimal inicia-se pelos pontos lacrimais superior e inferior."
  },
  {
    pergunta: "Os canalículos lacrimais superior e inferior geralmente:",
    alternativas: [
      "Drenam separadamente para o saco lacrimal",
      "Formam um canalículo comum antes de entrar no saco lacrimal",
      "Drenam diretamente no ducto nasolacrimal",
      "Não se comunicam",
      "Desembocam no meato médio"
    ],
    correta: 1,
    explicacao: "Na maioria dos indivíduos, os canalículos formam um canalículo comum."
  },
  {
    pergunta: "O saco lacrimal localiza-se anatomicamente:",
    alternativas: [
      "Na fossa lacrimal do osso frontal",
      "No interior da órbita",
      "Na fossa lacrimal formada pelo osso lacrimal e maxila",
      "No meato inferior",
      "No seio etmoidal"
    ],
    correta: 2,
    explicacao: "O saco lacrimal situa-se na fossa lacrimal, formada pelo osso lacrimal e maxila."
  },
  {
    pergunta: "O ducto nasolacrimal drena a lágrima principalmente para:",
    alternativas: [
      "Meato médio",
      "Meato superior",
      "Seio maxilar",
      "Meato inferior",
      "Cavidade etmoidal"
    ],
    correta: 3,
    explicacao: "O ducto nasolacrimal desemboca no meato inferior."
  },
  {
    pergunta: "A válvula de Hasner localiza-se:",
    alternativas: [
      "Na junção canalículo–saco",
      "Na entrada do saco lacrimal",
      "Na saída do ducto nasolacrimal no meato inferior",
      "No ponto lacrimal",
      "No canalículo comum"
    ],
    correta: 2,
    explicacao: "A válvula de Hasner localiza-se na porção distal do ducto nasolacrimal."
  },
  {
    pergunta: "A epífora pode ser causada por todas as condições abaixo, EXCETO:",
    alternativas: [
      "Obstrução das vias lacrimais",
      "Disfunção do filme lacrimal",
      "Hipersecreção reflexa",
      "Aumento da drenagem lacrimal",
      "Malposições palpebrais"
    ],
    correta: 3,
    explicacao: "O aumento da drenagem não causa epífora; ela ocorre por produção excessiva ou drenagem inadequada."
  },
  {
    pergunta: "Qual exame clínico simples avalia a permeabilidade das vias lacrimais?",
    alternativas: [
      "Teste de Schirmer",
      "Teste de Jones",
      "Tempo de ruptura do filme lacrimal",
      "Biomicroscopia apenas",
      "Paquimetria"
    ],
    correta: 1,
    explicacao: "Os testes de Jones avaliam a permeabilidade das vias lacrimais."
  },
  {
    pergunta: "O teste de Jones I avalia principalmente:",
    alternativas: [
      "Produção lacrimal",
      "Drenagem funcional sem obstrução anatômica evidente",
      "Presença de tumor lacrimal",
      "Integridade do saco lacrimal",
      "Estabilidade do filme lacrimal"
    ],
    correta: 1,
    explicacao: "O Jones I avalia drenagem funcional com fluoresceína."
  },
  {
    pergunta: "O teste de Jones II é indicado quando:",
    alternativas: [
      "O Jones I é positivo",
      "O Jones I é negativo",
      "Há suspeita de olho seco",
      "Há suspeita de blefarite",
      "O paciente é criança"
    ],
    correta: 1,
    explicacao: "O Jones II é realizado quando o Jones I é negativo."
  },
  {
    pergunta: "A obstrução congênita do ducto nasolacrimal ocorre mais frequentemente ao nível de:",
    alternativas: [
      "Pontos lacrimais",
      "Canalículos",
      "Saco lacrimal",
      "Válvula de Hasner",
      "Canalículo comum"
    ],
    correta: 3,
    explicacao: "A obstrução congênita geralmente ocorre por imperfuração da válvula de Hasner."
  },
  {
    pergunta: "Na obstrução congênita do ducto nasolacrimal, o tratamento inicial recomendado é:",
    alternativas: [
      "Cirurgia imediata",
      "Antibiótico sistêmico prolongado",
      "Massagem do saco lacrimal",
      "Radioterapia",
      "Intubação com silicone imediata"
    ],
    correta: 2,
    explicacao: "A massagem do saco lacrimal é o tratamento inicial na maioria dos casos."
  },
  {
    pergunta: "A dacriocistite aguda caracteriza-se principalmente por:",
    alternativas: [
      "Epífora indolor crônica",
      "Dor, edema e hiperemia na região do saco lacrimal",
      "Secreção mucosa apenas ao piscar",
      "Ausência de sinais inflamatórios",
      "Obstrução assintomática"
    ],
    correta: 1,
    explicacao: "A dacriocistite aguda cursa com sinais inflamatórios locais importantes."
  },
  {
    pergunta: "A principal causa de dacriocistite aguda é:",
    alternativas: [
      "Hipersecreção lacrimal",
      "Obstrução das vias lacrimais com infecção secundária",
      "Trauma palpebral",
      "Blefarite",
      "Tumor palpebral"
    ],
    correta: 1,
    explicacao: "A obstrução favorece estase e infecção do saco lacrimal."
  },
  {
    pergunta: "Na dacriocistite aguda, a conduta inicial inclui:",
    alternativas: [
      "Cirurgia imediata de DCR",
      "Antibiótico sistêmico e controle da infecção",
      "Apenas colírio lubrificante",
      "Massagem vigorosa do saco",
      "Radioterapia"
    ],
    correta: 1,
    explicacao: "O controle da infecção com antibióticos é prioritário."
  },
  {
    pergunta: "A dacriocistite crônica geralmente manifesta-se como:",
    alternativas: [
      "Dor intensa súbita",
      "Epífora crônica com secreção à compressão do saco",
      "Perda visual súbita",
      "Proptose dolorosa",
      "Hiperemia conjuntival difusa"
    ],
    correta: 1,
    explicacao: "A dacriocistite crônica cursa com epífora e refluxo de secreção."
  },
  {
    pergunta: "O tratamento definitivo da obstrução baixa das vias lacrimais em adultos é:",
    alternativas: [
      "Massagem contínua",
      "Antibiótico prolongado",
      "Dacriocistorrinostomia (DCR)",
      "Intubação canalicular isolada",
      "Crioterapia"
    ],
    correta: 2,
    explicacao: "A DCR cria uma nova via de drenagem entre o saco lacrimal e a cavidade nasal."
  },
  {
    pergunta: "A dacriocistorrinostomia externa consiste basicamente em:",
    alternativas: [
      "Remoção do saco lacrimal",
      "Criação de comunicação entre saco lacrimal e cavidade nasal",
      "Intubação simples dos canalículos",
      "Fechamento do ducto nasolacrimal",
      "Abertura do ponto lacrimal"
    ],
    correta: 1,
    explicacao: "A DCR cria uma nova comunicação para drenagem da lágrima."
  },
  {
    pergunta: "A dacriocistorrinostomia endoscópica diferencia-se da externa principalmente por:",
    alternativas: [
      "Maior taxa de falha",
      "Ausência de incisão cutânea",
      "Não permitir intubação",
      "Ser exclusiva para crianças",
      "Não tratar dacriocistite"
    ],
    correta: 1,
    explicacao: "A DCR endoscópica evita incisão cutânea externa."
  },
  {
    pergunta: "A intubação com silicone nas vias lacrimais tem como principal objetivo:",
    alternativas: [
      "Aumentar produção lacrimal",
      "Manter patência durante cicatrização",
      "Eliminar necessidade de cirurgia",
      "Estimular drenagem ativa",
      "Reduzir inflamação conjuntival"
    ],
    correta: 1,
    explicacao: "A intubação mantém a via aberta durante cicatrização."
  },
  {
    pergunta: "Qual afirmação sobre epífora é correta?",
    alternativas: [
      "Sempre indica obstrução anatômica",
      "Nunca está relacionada ao olho seco",
      "Pode ser paradoxal em deficiência aquosa",
      "Não ocorre em malposições palpebrais",
      "É exclusiva de crianças"
    ],
    correta: 2,
    explicacao: "Deficiência aquosa pode causar epífora reflexa (paradoxal)."
  }
];
bancoQuestoes[7].push(
  {
    pergunta: "Qual achado sugere obstrução alta das vias lacrimais?",
    alternativas: [
      "Refluxo de secreção ao comprimir o saco lacrimal",
      "Epífora sem refluxo à compressão",
      "Dor intensa no canto medial",
      "Hiperemia conjuntival difusa",
      "Proptose dolorosa"
    ],
    correta: 1,
    explicacao: "Na obstrução alta (canalicular), geralmente há epífora sem refluxo à compressão do saco."
  },
  {
    pergunta: "A obstrução baixa das vias lacrimais ocorre distalmente a qual estrutura?",
    alternativas: [
      "Pontos lacrimais",
      "Canalículos",
      "Canalículo comum",
      "Saco lacrimal",
      "Ducto nasolacrimal"
    ],
    correta: 3,
    explicacao: "A obstrução baixa ocorre distalmente ao saco lacrimal, geralmente no ducto nasolacrimal."
  },
  {
    pergunta: "Qual exame radiológico avalia a anatomia das vias lacrimais com contraste?",
    alternativas: [
      "Tomografia de órbita sem contraste",
      "Ultrassonografia",
      "Dacriocistografia",
      "Ressonância magnética funcional",
      "Paquimetria"
    ],
    correta: 2,
    explicacao: "A dacriocistografia avalia a anatomia das vias lacrimais com contraste."
  },
  {
    pergunta: "A epífora funcional caracteriza-se por:",
    alternativas: [
      "Obstrução anatômica evidente",
      "Produção lacrimal ausente",
      "Vias lacrimais pérvias com drenagem ineficiente",
      "Inflamação aguda do saco lacrimal",
      "Imperforação congênita da válvula de Hasner"
    ],
    correta: 2,
    explicacao: "Na epífora funcional, as vias são pérvias, mas a drenagem é ineficiente."
  },
  {
    pergunta: "Qual condição palpebral contribui frequentemente para epífora funcional?",
    alternativas: [
      "Entrópio",
      "Ptose",
      "Ectrópio",
      "Blefarocalásio",
      "Xantelasma"
    ],
    correta: 2,
    explicacao: "O ectrópio afasta o ponto lacrimal do lago lacrimal, prejudicando a drenagem."
  },
  {
    pergunta: "A irrigação das vias lacrimais é utilizada principalmente para:",
    alternativas: [
      "Estimular produção lacrimal",
      "Avaliar permeabilidade e localizar nível de obstrução",
      "Tratar dacriocistite aguda",
      "Avaliar filme lacrimal",
      "Substituir a DCR"
    ],
    correta: 1,
    explicacao: "A irrigação permite avaliar patência e localizar o nível da obstrução."
  },
  {
    pergunta: "Durante a irrigação, o refluxo pelo ponto oposto sugere:",
    alternativas: [
      "Vias pérvias",
      "Obstrução distal",
      "Obstrução canalicular comum",
      "Produção lacrimal excessiva",
      "Erro técnico"
    ],
    correta: 2,
    explicacao: "O refluxo pelo ponto oposto sugere obstrução ao nível do canalículo comum."
  },
  {
    pergunta: "Na obstrução congênita persistente após 1 ano de idade, a conduta mais indicada é:",
    alternativas: [
      "Manter apenas massagem",
      "Realizar sondagem das vias lacrimais",
      "Antibiótico sistêmico contínuo",
      "DCR imediata",
      "Crioterapia do ducto"
    ],
    correta: 1,
    explicacao: "A sondagem é indicada quando a obstrução congênita persiste após o primeiro ano."
  },
  {
    pergunta: "Qual é a principal complicação da dacriocistite aguda não tratada?",
    alternativas: [
      "Epífora funcional",
      "Celulite orbitária",
      "Ptose aponeurótica",
      "Entrópio cicatricial",
      "Olho seco evaporativo"
    ],
    correta: 1,
    explicacao: "A infecção pode se disseminar, causando celulite orbitária."
  },
  {
    pergunta: "A presença de muco ou pus à compressão do saco lacrimal indica:",
    alternativas: [
      "Epífora funcional",
      "Obstrução canalicular isolada",
      "Dacriocistite crônica",
      "Produção reflexa aumentada",
      "Olho seco"
    ],
    correta: 2,
    explicacao: "Secreção à compressão é típica da dacriocistite crônica."
  },
  {
    pergunta: "Qual procedimento cria uma nova via de drenagem lacrimal para a cavidade nasal?",
    alternativas: [
      "Sondagem",
      "Intubação com silicone",
      "Dacriocistorrinostomia",
      "Cantoplastia",
      "Canaliculotomia"
    ],
    correta: 2,
    explicacao: "A DCR cria comunicação direta entre saco lacrimal e cavidade nasal."
  },
  {
    pergunta: "A principal indicação de DCR em crianças é:",
    alternativas: [
      "Epífora funcional leve",
      "Obstrução congênita refratária a sondagens repetidas",
      "Blefarite posterior",
      "Olho seco severo",
      "Ptose congênita"
    ],
    correta: 1,
    explicacao: "DCR é reservada para casos refratários após sondagens."
  },
  {
    pergunta: "A DCR endoscópica apresenta como vantagem em relação à externa:",
    alternativas: [
      "Maior agressividade cirúrgica",
      "Menor taxa de sucesso",
      "Ausência de cicatriz cutânea",
      "Impossibilidade de intubação",
      "Maior tempo cirúrgico"
    ],
    correta: 2,
    explicacao: "A principal vantagem é evitar cicatriz cutânea."
  },
  {
    pergunta: "A falha de uma DCR pode estar relacionada principalmente a:",
    alternativas: [
      "Hipersecreção lacrimal",
      "Cicatrização excessiva do óstio",
      "Ausência de válvula de Hasner",
      "Blefarite anterior",
      "Xantelasma"
    ],
    correta: 1,
    explicacao: "A reestenose por cicatrização é causa comum de falha."
  },
  {
    pergunta: "Em obstruções canaliculares proximais extensas, uma opção cirúrgica possível é:",
    alternativas: [
      "DCR simples",
      "Sondagem repetida",
      "DCR com tubo de Jones (CDCR)",
      "Massagem do saco",
      "Intubação simples"
    ],
    correta: 2,
    explicacao: "A CDCR com tubo de Jones é opção quando canalículos não são funcionais."
  },
  {
    pergunta: "O tubo de Jones é utilizado para:",
    alternativas: [
      "Substituir a glândula lacrimal",
      "Manter patência do ducto nasolacrimal",
      "Criar drenagem direta da lágrima para a cavidade nasal",
      "Estimular produção lacrimal",
      "Corrigir epífora funcional"
    ],
    correta: 2,
    explicacao: "O tubo de Jones cria uma drenagem direta da lágrima para o nariz."
  },
  {
    pergunta: "Qual achado sugere tumor das vias lacrimais?",
    alternativas: [
      "Epífora bilateral desde a infância",
      "Epífora crônica com aumento endurecido do saco lacrimal",
      "Melhora da epífora com massagem",
      "Secreção apenas mucosa",
      "Epífora paradoxal"
    ],
    correta: 1,
    explicacao: "Massa endurecida e epífora levantam suspeita de tumor lacrimal."
  },
  {
    pergunta: "Em suspeita de tumor do saco lacrimal, a conduta inicial adequada é:",
    alternativas: [
      "Massagem vigorosa",
      "Sondagem imediata",
      "Exame de imagem e biópsia",
      "DCR de rotina",
      "Antibiótico tópico isolado"
    ],
    correta: 2,
    explicacao: "Imagem e biópsia são fundamentais antes de qualquer cirurgia."
  },
  {
    pergunta: "A epífora unilateral de início recente em adulto deve sempre levantar suspeita de:",
    alternativas: [
      "Olho seco",
      "Blefarite",
      "Obstrução das vias lacrimais ou tumor",
      "Hipersecreção reflexa benigna",
      "Conjuntivite viral"
    ],
    correta: 2,
    explicacao: "Epífora unilateral recente em adulto exige investigação de obstrução ou tumor."
  },
  {
    pergunta: "Qual afirmação final sobre as vias lacrimais está correta?",
    alternativas: [
      "Epífora sempre indica obstrução anatômica",
      "DCR é indicada em todos os casos de epífora",
      "A avaliação deve distinguir produção excessiva de falha de drenagem",
      "Massagem resolve obstruções adquiridas em adultos",
      "A irrigação não tem valor diagnóstico"
    ],
    correta: 2,
    explicacao: "Diferenciar produção excessiva de falha de drenagem é essencial na avaliação."
  }
);
bancoQuestoes[8] = [
  {
    pergunta: "A síndrome do olho seco é definida principalmente como:",
    alternativas: [
      "Doença infecciosa da superfície ocular",
      "Distúrbio multifatorial do filme lacrimal e da superfície ocular",
      "Produção excessiva de lágrima",
      "Obstrução primária das vias lacrimais",
      "Doença exclusivamente inflamatória palpebral"
    ],
    correta: 1,
    explicacao: "O olho seco é um distúrbio multifatorial que envolve filme lacrimal e superfície ocular."
  },
  {
    pergunta: "Segundo a classificação atual, o olho seco pode ser dividido principalmente em:",
    alternativas: [
      "Agudo e crônico",
      "Infeccioso e não infeccioso",
      "Deficiência aquosa e evaporativo",
      "Congênito e adquirido",
      "Leve e grave apenas"
    ],
    correta: 2,
    explicacao: "A classificação principal divide em deficiência aquosa e olho seco evaporativo."
  },
  {
    pergunta: "A principal causa de olho seco evaporativo é:",
    alternativas: [
      "Síndrome de Sjögren",
      "Hipossecreção da glândula lacrimal principal",
      "Disfunção das glândulas de Meibômio",
      "Obstrução do canalículo",
      "Conjuntivite cicatricial"
    ],
    correta: 2,
    explicacao: "A disfunção meibomiana é a principal causa do olho seco evaporativo."
  },
  {
    pergunta: "A deficiência aquosa da lágrima está mais frequentemente associada a:",
    alternativas: [
      "Blefarite posterior",
      "Disfunção meibomiana",
      "Síndrome de Sjögren",
      "Entrópio involucional",
      "Ectrópio paralítico"
    ],
    correta: 2,
    explicacao: "A síndrome de Sjögren é causa clássica de deficiência aquosa."
  },
  {
    pergunta: "Qual sintoma é típico da síndrome do olho seco?",
    alternativas: [
      "Dor ocular intensa súbita",
      "Sensação de areia ou corpo estranho",
      "Secreção purulenta abundante",
      "Perda visual súbita",
      "Fotopsias"
    ],
    correta: 1,
    explicacao: "Sensação de areia ou corpo estranho é sintoma clássico."
  },
  {
    pergunta: "A instabilidade do filme lacrimal está mais diretamente relacionada a:",
    alternativas: [
      "Aumento da produção aquosa",
      "Redução da camada lipídica",
      "Obstrução das vias lacrimais",
      "Hipersecreção reflexa",
      "Aumento de células caliciformes"
    ],
    correta: 1,
    explicacao: "A deficiência lipídica reduz a estabilidade do filme."
  },
  {
    pergunta: "Qual teste avalia principalmente a estabilidade do filme lacrimal?",
    alternativas: [
      "Teste de Schirmer",
      "Teste de Jones",
      "Tempo de ruptura do filme lacrimal (BUT)",
      "Dacriocistografia",
      "Paquimetria"
    ],
    correta: 2,
    explicacao: "O BUT avalia a estabilidade do filme lacrimal."
  },
  {
    pergunta: "Um BUT reduzido sugere principalmente:",
    alternativas: [
      "Produção lacrimal excessiva",
      "Olho seco evaporativo",
      "Obstrução do ducto nasolacrimal",
      "Dacriocistite crônica",
      "Epífora funcional"
    ],
    correta: 1,
    explicacao: "O BUT baixo está associado ao olho seco evaporativo."
  },
  {
    pergunta: "Qual teste avalia a produção lacrimal?",
    alternativas: [
      "Tempo de ruptura do filme lacrimal",
      "Teste de Schirmer",
      "Teste de Jones I",
      "Teste do rosa bengala",
      "Biomicroscopia isolada"
    ],
    correta: 1,
    explicacao: "O teste de Schirmer avalia a produção lacrimal."
  },
  {
    pergunta: "O teste de Schirmer com anestesia tópica avalia:",
    alternativas: [
      "Produção reflexa",
      "Produção basal",
      "Drenagem lacrimal",
      "Estabilidade do filme",
      "Inflamação conjuntival"
    ],
    correta: 1,
    explicacao: "Com anestesia, o Schirmer avalia predominantemente a produção basal."
  },
  {
    pergunta: "A coloração com fluoresceína evidencia principalmente:",
    alternativas: [
      "Produção lacrimal",
      "Drenagem lacrimal",
      "Defeitos epiteliais corneanos",
      "Produção de mucina",
      "Camada lipídica"
    ],
    correta: 2,
    explicacao: "A fluoresceína marca áreas de defeito epitelial."
  },
  {
    pergunta: "O rosa bengala e o verde de lisamina são úteis para avaliar:",
    alternativas: [
      "Produção lacrimal",
      "Drenagem lacrimal",
      "Células epiteliais desvitalizadas",
      "Camada lipídica",
      "Pressão intraocular"
    ],
    correta: 2,
    explicacao: "Esses corantes evidenciam células epiteliais alteradas."
  },
  {
    pergunta: "Qual condição sistêmica está fortemente associada ao olho seco?",
    alternativas: [
      "Hipertensão arterial",
      "Diabetes mellitus",
      "Síndrome de Sjögren",
      "Hipotireoidismo",
      "Asma"
    ],
    correta: 2,
    explicacao: "A síndrome de Sjögren está classicamente associada ao olho seco."
  },
  {
    pergunta: "O uso prolongado de telas contribui para olho seco principalmente por:",
    alternativas: [
      "Aumentar produção aquosa",
      "Reduzir frequência do piscar",
      "Aumentar drenagem lacrimal",
      "Estimular secreção lipídica",
      "Aumentar mucina"
    ],
    correta: 1,
    explicacao: "A redução do piscar compromete a distribuição do filme lacrimal."
  },
  {
    pergunta: "A inflamação desempenha papel importante no olho seco porque:",
    alternativas: [
      "É sempre causa primária",
      "Não interfere nos sintomas",
      "Cria um ciclo vicioso de dano à superfície ocular",
      "Ocorre apenas em casos graves",
      "Não altera o filme lacrimal"
    ],
    correta: 2,
    explicacao: "A inflamação perpetua a instabilidade do filme e os sintomas."
  },
  {
    pergunta: "Qual achado clínico é comum em olho seco moderado a grave?",
    alternativas: [
      "Hipersecreção purulenta",
      "Ceratite punctata superficial",
      "Proptose",
      "Ulceração palpebral",
      "Entrópio cicatricial"
    ],
    correta: 1,
    explicacao: "A ceratite punctata superficial é achado frequente."
  },
  {
    pergunta: "O olho seco pode causar epífora paradoxal porque:",
    alternativas: [
      "Aumenta drenagem lacrimal",
      "Estimula lacrimejamento reflexo",
      "Bloqueia o ducto nasolacrimal",
      "Produz excesso de mucina",
      "Aumenta camada lipídica"
    ],
    correta: 1,
    explicacao: "A irritação da superfície ocular estimula produção reflexa."
  },
  {
    pergunta: "Qual fator ambiental piora sintomas de olho seco?",
    alternativas: [
      "Alta umidade",
      "Ambiente ventilado e ar-condicionado",
      "Piscar frequente",
      "Uso de óculos",
      "Ambiente escuro"
    ],
    correta: 1,
    explicacao: "Ar-condicionado e vento aumentam evaporação."
  },
  {
    pergunta: "A redução de células caliciformes está mais associada a:",
    alternativas: [
      "Disfunção meibomiana isolada",
      "Conjuntivites cicatriciais",
      "Obstrução das vias lacrimais",
      "Blefarocalásio",
      "Ptose aponeurótica"
    ],
    correta: 1,
    explicacao: "Conjuntivites cicatriciais reduzem células produtoras de mucina."
  },
  {
    pergunta: "Qual afirmação geral sobre o olho seco está correta?",
    alternativas: [
      "É uma condição simples e autolimitada",
      "Não interfere na qualidade visual",
      "Pode causar desconforto significativo e dano à superfície ocular",
      "O tratamento é sempre cirúrgico",
      "Não tem relação com idade"
    ],
    correta: 2,
    explicacao: "O olho seco pode causar sintomas importantes e dano ocular."
  }
];
bancoQuestoes[8].push(
  {
    pergunta: "O tratamento inicial do olho seco leve geralmente inclui:",
    alternativas: [
      "Cirurgia imediata",
      "Antibiótico sistêmico",
      "Lubrificantes oculares",
      "Corticoide tópico prolongado",
      "DCR"
    ],
    correta: 2,
    explicacao: "Lubrificantes oculares são a base do tratamento inicial."
  },
  {
    pergunta: "Os colírios lubrificantes sem conservantes são preferidos porque:",
    alternativas: [
      "São mais baratos",
      "Têm maior ação antibiótica",
      "Reduzem toxicidade à superfície ocular",
      "Aumentam produção aquosa",
      "Substituem tratamento sistêmico"
    ],
    correta: 2,
    explicacao: "Conservantes podem agravar a inflamação da superfície ocular."
  },
  {
    pergunta: "No olho seco evaporativo, uma medida terapêutica fundamental é:",
    alternativas: [
      "Aumentar produção aquosa",
      "Tratar disfunção das glândulas de Meibômio",
      "Obstruir vias lacrimais",
      "Suspender o piscar",
      "Usar antibiótico sistêmico contínuo"
    ],
    correta: 1,
    explicacao: "O tratamento da disfunção meibomiana é central no olho seco evaporativo."
  },
  {
    pergunta: "Compressas mornas são indicadas no olho seco principalmente para:",
    alternativas: [
      "Estimular produção aquosa",
      "Reduzir inflamação conjuntival aguda",
      "Fluidificar secreção meibomiana",
      "Aumentar mucina",
      "Tratar deficiência aquosa"
    ],
    correta: 2,
    explicacao: "O calor fluidifica a secreção das glândulas de Meibômio."
  },
  {
    pergunta: "O uso de antibióticos tópicos no olho seco está indicado principalmente quando há:",
    alternativas: [
      "Deficiência aquosa isolada",
      "Infecção bacteriana associada",
      "Instabilidade do filme lacrimal",
      "Uso excessivo de telas",
      "Ambiente seco"
    ],
    correta: 1,
    explicacao: "Antibióticos são reservados para infecção associada."
  },
  {
    pergunta: "Os anti-inflamatórios tópicos no olho seco são utilizados para:",
    alternativas: [
      "Aumentar drenagem lacrimal",
      "Quebrar o ciclo inflamatório da doença",
      "Estimular produção lipídica direta",
      "Substituir lubrificantes",
      "Tratar obstrução canalicular"
    ],
    correta: 1,
    explicacao: "A inflamação perpetua o olho seco; controlá-la melhora sintomas."
  },
  {
    pergunta: "A ciclosporina tópica é utilizada no olho seco principalmente para:",
    alternativas: [
      "Efeito antibiótico",
      "Efeito vasoconstritor",
      "Modulação imunológica e redução da inflamação",
      "Aumento imediato da lágrima",
      "Tratamento de dacriocistite"
    ],
    correta: 2,
    explicacao: "A ciclosporina atua modulando a resposta inflamatória."
  },
  {
    pergunta: "O efeito da ciclosporina tópica geralmente ocorre:",
    alternativas: [
      "Imediatamente",
      "Em 24 horas",
      "Após algumas semanas de uso",
      "Somente após 1 ano",
      "Apenas em uso sistêmico"
    ],
    correta: 2,
    explicacao: "O efeito é gradual, após semanas de tratamento."
  },
  {
    pergunta: "Os plugues de ponto lacrimal são indicados principalmente em:",
    alternativas: [
      "Olho seco evaporativo puro",
      "Deficiência aquosa moderada a grave",
      "Infecção ativa",
      "Blefarite aguda",
      "Epífora funcional"
    ],
    correta: 1,
    explicacao: "Os plugues reduzem a drenagem em deficiência aquosa."
  },
  {
    pergunta: "Antes da colocação de plugues lacrimais, é importante:",
    alternativas: [
      "Aumentar drenagem",
      "Excluir inflamação significativa da superfície ocular",
      "Suspender lubrificantes",
      "Realizar DCR",
      "Iniciar antibiótico sistêmico"
    ],
    correta: 1,
    explicacao: "Inflamação ativa pode piorar com oclusão dos pontos."
  },
  {
    pergunta: "Qual efeito adverso pode ocorrer com o uso de plugues lacrimais?",
    alternativas: [
      "Hipolacrimia",
      "Epífora",
      "Catarata",
      "Glaucoma",
      "Descolamento de retina"
    ],
    correta: 1,
    explicacao: "A retenção excessiva de lágrima pode causar epífora."
  },
  {
    pergunta: "No olho seco grave, uma opção terapêutica possível é:",
    alternativas: [
      "Apenas lubrificação",
      "Soro autólogo",
      "Radioterapia",
      "Cirurgia palpebral estética",
      "Antibiótico sistêmico contínuo"
    ],
    correta: 1,
    explicacao: "O soro autólogo fornece fatores de crescimento e proteínas benéficas."
  },
  {
    pergunta: "O soro autólogo é benéfico no olho seco porque:",
    alternativas: [
      "É antibiótico natural",
      "Aumenta drenagem",
      "Contém fatores de crescimento semelhantes à lágrima",
      "Substitui cirurgia",
      "Estimula produção lipídica"
    ],
    correta: 2,
    explicacao: "Ele mimetiza componentes naturais da lágrima."
  },
  {
    pergunta: "Em pacientes com olho seco associado à doença sistêmica, o manejo deve:",
    alternativas: [
      "Ser apenas tópico",
      "Ignorar a doença sistêmica",
      "Ser multidisciplinar",
      "Ser sempre cirúrgico",
      "Não envolver oftalmologista"
    ],
    correta: 2,
    explicacao: "O controle sistêmico é fundamental para sucesso terapêutico."
  },
  {
    pergunta: "Qual medida comportamental auxilia no controle do olho seco?",
    alternativas: [
      "Reduzir ingestão hídrica",
      "Diminuir frequência do piscar",
      "Pausas regulares durante uso de telas",
      "Aumentar exposição ao vento",
      "Dormir menos horas"
    ],
    correta: 2,
    explicacao: "Pausas e piscamento consciente reduzem evaporação."
  },
  {
    pergunta: "O olho seco pode impactar a qualidade visual porque:",
    alternativas: [
      "Altera o cristalino",
      "Causa catarata",
      "Compromete a regularidade da superfície óptica",
      "Aumenta pressão intraocular",
      "Afeta apenas a conjuntiva"
    ],
    correta: 2,
    explicacao: "O filme lacrimal é a primeira superfície refrativa do olho."
  },
  {
    pergunta: "Qual condição palpebral pode agravar o olho seco?",
    alternativas: [
      "Ptose leve",
      "Blefarite",
      "Xantelasma",
      "Nevus",
      "Papiloma"
    ],
    correta: 1,
    explicacao: "Blefarite e disfunção meibomiana agravam o olho seco."
  },
  {
    pergunta: "O olho seco é mais prevalente:",
    alternativas: [
      "Em crianças",
      "Em adultos jovens apenas",
      "Em idosos",
      "Exclusivamente em mulheres",
      "Somente em usuários de lentes"
    ],
    correta: 2,
    explicacao: "A prevalência aumenta com a idade."
  },
  {
    pergunta: "Qual afirmação sobre o tratamento do olho seco é correta?",
    alternativas: [
      "Há tratamento único e definitivo",
      "O tratamento é sempre cirúrgico",
      "O tratamento é escalonado e individualizado",
      "Lubrificantes não têm papel",
      "Anti-inflamatórios nunca são usados"
    ],
    correta: 2,
    explicacao: "O manejo é progressivo e individualizado conforme gravidade."
  },
  {
    pergunta: "Qual afirmação final sobre a síndrome do olho seco está correta?",
    alternativas: [
      "É condição rara",
      "Não necessita acompanhamento",
      "Exige abordagem contínua e personalizada",
      "Não interfere na qualidade de vida",
      "Não se associa a doenças sistêmicas"
    ],
    correta: 2,
    explicacao: "O olho seco é crônico e requer acompanhamento contínuo."
  }
);
bancoQuestoes[9] = [
  {
    pergunta: "Paciente com epífora unilateral recente e massa endurecida na região do saco lacrimal. A conduta mais adequada antes de qualquer DCR é:",
    alternativas: [
      "Iniciar massagem do saco e observar por 4 semanas",
      "Realizar DCR endoscópica imediatamente",
      "Solicitar imagem (TC/RM) e planejar biópsia/avaliação oncológica",
      "Realizar irrigação e, se pérvio, tratar como epífora funcional",
      "Prescrever lubrificante e reavaliar"
    ],
    correta: 2,
    explicacao: "Epífora unilateral recente associada a massa endurecida na topografia do saco lacrimal é red flag para tumor. A DCR sem investigação pode atrasar diagnóstico e favorecer disseminação. O correto é imagem e confirmação histopatológica/avaliação oncológica."
  },
  {
    pergunta: "No entrópio involucional da pálpebra inferior, o conjunto fisiopatológico mais típico inclui:",
    alternativas: [
      "Retração cicatricial da conjuntiva tarsal e simbléfaro",
      "Frouxidão horizontal + desinserção dos retratores inferiores + override do orbicular pré-septal",
      "Paralisia do VII par + lagoftalmo + ectrópio",
      "Hipertrofia do tarso e excesso de pele isolados",
      "Falência congênita do tarso e hipoplasia palpebral"
    ],
    correta: 1,
    explicacao: "Entrópio involucional é multifatorial: frouxidão horizontal, enfraquecimento/desinserção de retratores e override do orbicular pré-septal sobre o pré-tarsal, invertendo a margem e causando triquíase/ceratopatia."
  },
  {
    pergunta: "No ectrópio cicatricial, o mecanismo predominante é:",
    alternativas: [
      "Frouxidão horizontal exclusivamente senil",
      "Tração da lamela anterior por cicatriz cutânea e encurtamento vertical",
      "Hiperatividade do orbicular pré-tarsal",
      "Desinserção dos retratores inferiores sem cicatriz",
      "Falha congênita do levantador"
    ],
    correta: 1,
    explicacao: "O ectrópio cicatricial decorre de encurtamento vertical e retração da lamela anterior (pele/orbicular). Em geral exige liberação cicatricial e enxerto de pele, além de correção de suporte se houver laxidez."
  },
  {
    pergunta: "Idoso com lesão perolada, telangiectasias e ulceração central na pálpebra inferior. Diagnóstico mais provável:",
    alternativas: [
      "Carcinoma espinocelular",
      "Carcinoma basocelular",
      "Carcinoma sebáceo",
      "Papiloma escamoso",
      "Nevus intradérmico"
    ],
    correta: 1,
    explicacao: "Carcinoma basocelular é o maligno palpebral mais comum, típico nódulo perolado com telangiectasias e possível ulceração, sobretudo em pálpebra inferior/canto medial."
  },
  {
    pergunta: "Carcinoma sebáceo palpebral deve ser suspeitado especialmente quando há:",
    alternativas: [
      "Lesão pigmentada assimétrica com variação de cor",
      "Nódulo perolado com telangiectasias",
      "Conjuntivite unilateral crônica e calázio recorrente/atípico",
      "Placa amarelada bilateral (xantelasma)",
      "Lesão vascular violácea em imunossuprimido"
    ],
    correta: 2,
    explicacao: "Carcinoma sebáceo pode mimetizar blefarite/conjuntivite unilateral crônica e calázio recorrente. Persistência/atipia exige biópsia por risco de atraso diagnóstico e disseminação pagetoide."
  },
  {
    pergunta: "Na orbitopatia tireoidiana, a sequência cirúrgica clássica (quando indicada) é:",
    alternativas: [
      "Cirurgia palpebral → estrabismo → descompressão",
      "Estrabismo → palpebral → descompressão",
      "Descompressão → estrabismo → cirurgia palpebral",
      "Palpebral isolada é suficiente na maioria",
      "Descompressão só após palpebral"
    ],
    correta: 2,
    explicacao: "A sequência recomendada é descompressão (se indicada), depois estrabismo (se necessário) e por último cirurgia palpebral, idealmente após estabilização, reduzindo recidiva e assimetria."
  },
  {
    pergunta: "O principal determinante para escolha de técnica na ptose é:",
    alternativas: [
      "Idade do paciente",
      "Altura da sobrancelha",
      "Função do músculo levantador",
      "Presença de blefarite",
      "Cor da íris"
    ],
    correta: 2,
    explicacao: "A função do levantador (excursão) é o dado mais importante para definir técnica (avanço aponeurótico, ressecção do levantador ou suspensão frontal) e para estimar risco de lagoftalmo."
  },
  {
    pergunta: "Ptose leve associada a miose e anidrose ipsilateral sugere:",
    alternativas: [
      "Paralisia do III par",
      "Síndrome de Horner",
      "Miastenia gravis",
      "Ptose aponeurótica",
      "Blefarocalásio"
    ],
    correta: 1,
    explicacao: "Horner cursa com ptose discreta (músculo de Müller), miose e anidrose. Paralisia do III costuma ter ptose maior e alterações de motilidade/pupila variável."
  },
  {
    pergunta: "Laceração palpebral no canto medial exige atenção especial por risco de lesão:",
    alternativas: [
      "Da glândula lacrimal principal",
      "Do sistema canalicular lacrimal",
      "Do músculo frontal",
      "Do nervo óptico",
      "Do ligamento de Whitnall"
    ],
    correta: 1,
    explicacao: "Traumas no canto medial frequentemente lesam canalículos. Identificação e reparo precoce com intubação de silicone aumentam patência e reduzem epífora."
  },
  {
    pergunta: "Regra-chave na reconstrução palpebral lamelar é:",
    alternativas: [
      "Reconstruir ambas as lamelas sempre com enxerto livre",
      "Evitar retalhos na pálpebra inferior",
      "Evitar enxerto livre simultâneo nas duas lamelas; ao menos uma deve ser vascularizada",
      "A lamela posterior pode ser omitida se a pele for boa",
      "A lamela anterior deve ser sempre cartilagem"
    ],
    correta: 2,
    explicacao: "Não se deve reconstruir simultaneamente lamela anterior e posterior apenas com enxertos livres, pois aumenta necrose. Pelo menos uma lamela deve ser vascularizada (retalho)."
  },
  {
    pergunta: "No olho seco evaporativo, o achado mais esperado é:",
    alternativas: [
      "Schirmer muito baixo com anestesia sempre",
      "BUT reduzido por disfunção meibomiana",
      "Refluxo ao comprimir saco lacrimal",
      "Jones II positivo",
      "Epífora por obstrução do ducto"
    ],
    correta: 1,
    explicacao: "Evaporativo é típico de disfunção das glândulas de Meibômio: instabilidade do filme e BUT reduzido. Schirmer pode ser normal."
  },
  {
    pergunta: "Epífora paradoxal no olho seco ocorre porque:",
    alternativas: [
      "A drenagem está aumentada",
      "Há lacrimejamento reflexo por irritação da superfície ocular",
      "Imperfuração congênita da válvula de Hasner",
      "Saco lacrimal infectado",
      "Camada lipídica aumentada"
    ],
    correta: 1,
    explicacao: "A superfície ocular irritada desencadeia lacrimejamento reflexo, causando epífora apesar de hipolacrimia basal."
  },
  {
    pergunta: "Na dacriocistite aguda, a conduta inicial correta é:",
    alternativas: [
      "DCR imediata na fase aguda",
      "Antibiótico sistêmico e controle da infecção antes do tratamento definitivo",
      "Massagem vigorosa do saco",
      "Plugues de ponto lacrimal",
      "Apenas lubrificante"
    ],
    correta: 1,
    explicacao: "Prioriza-se antibiótico sistêmico e controle inflamatório. A DCR é planejada após resolução para reduzir complicações."
  },
  {
    pergunta: "A obstrução congênita do ducto nasolacrimal ocorre mais frequentemente ao nível de:",
    alternativas: [
      "Canalículo comum",
      "Saco lacrimal",
      "Válvula de Hasner",
      "Ponto lacrimal superior",
      "Meato médio"
    ],
    correta: 2,
    explicacao: "A causa mais comum é imperfuração distal na válvula de Hasner. Tratamento inicial: massagem; persistente: sondagem."
  },
  {
    pergunta: "O exame que avalia principalmente produção lacrimal é:",
    alternativas: [
      "Tempo de ruptura (BUT)",
      "Teste de Schirmer",
      "Teste de Jones I",
      "Dacriocistografia",
      "Paquimetria"
    ],
    correta: 1,
    explicacao: "Schirmer mede produção lacrimal. BUT avalia estabilidade. Jones avalia drenagem."
  },
  {
    pergunta: "Schirmer com anestesia tópica avalia predominantemente:",
    alternativas: [
      "Produção reflexa",
      "Produção basal",
      "Drenagem lacrimal",
      "Estabilidade do filme",
      "Inflamação conjuntival"
    ],
    correta: 1,
    explicacao: "Com anestesia reduz-se reflexo; o teste reflete produção basal."
  },
  {
    pergunta: "BUT reduzido com Schirmer normal sugere:",
    alternativas: [
      "Deficiência aquosa pura",
      "Olho seco evaporativo",
      "Obstrução do ducto nasolacrimal",
      "Dacriocistite crônica",
      "Tumor do saco lacrimal"
    ],
    correta: 1,
    explicacao: "Produção aquosa preservada (Schirmer normal) com instabilidade do filme (BUT baixo) é típico do evaporativo/disfunção meibomiana."
  },
  {
    pergunta: "Floppy Eyelid Syndrome (FES) tem associação sistêmica importante com:",
    alternativas: [
      "Doença de Graves",
      "Apneia obstrutiva do sono",
      "Miastenia gravis",
      "Sarcoidose",
      "Artrite reumatoide isolada"
    ],
    correta: 1,
    explicacao: "FES associa-se fortemente à apneia obstrutiva do sono. Manejo inclui tratar apneia e, se necessário, cirurgia de tensionamento palpebral."
  },
  {
    pergunta: "Função do levantador muito pobre (<4 mm) favorece qual técnica para ptose?",
    alternativas: [
      "Avanço aponeurótico do levantador",
      "Ressecção mínima do levantador",
      "Suspensão frontal",
      "Cantoplastia lateral",
      "Blefaroplastia isolada"
    ],
    correta: 2,
    explicacao: "Com função muito baixa, a força do levantador é insuficiente; suspensão frontal transfere força do músculo frontal."
  },
  {
    pergunta: "Em trauma com suspeita de síndrome compartimental orbitária, a medida emergencial é:",
    alternativas: [
      "Radiografia e observação",
      "TC e aguardar laudo",
      "Cantotomia lateral e cantólise se necessário",
      "Lubrificação e curativo oclusivo",
      "Sondagem lacrimal"
    ],
    correta: 2,
    explicacao: "Quando há risco de perda visual por aumento agudo de pressão orbital, a descompressão imediata (cantotomia/cantólise) é tempo-dependente e pode salvar visão."
  },
  {
    pergunta: "Retalho de Hughes é mais indicado para grandes defeitos de:",
    alternativas: [
      "Pálpebra superior",
      "Pálpebra inferior",
      "Canto medial",
      "Sobrancelha",
      "Conjuntiva bulbar isolada"
    ],
    correta: 1,
    explicacao: "Hughes (tarsoconjuntival) reconstrói lamela posterior da pálpebra inferior em defeitos extensos, geralmente em dois tempos."
  },
  {
    pergunta: "Retalho de Cutler-Beard é clássico para reconstrução de:",
    alternativas: [
      "Pálpebra inferior extensa",
      "Pálpebra superior extensa",
      "Apenas canto lateral",
      "Canalículos lacrimais",
      "Ducto nasolacrimal"
    ],
    correta: 1,
    explicacao: "Cutler-Beard usa retalho de pálpebra inferior para reconstrução de defeitos extensos da pálpebra superior; requer divisão posterior."
  },
  {
    pergunta: "Qual achado aumenta suspeita de malignidade em lesão de margem palpebral?",
    alternativas: [
      "Lesão macia, simétrica e estável há anos",
      "Madarose e irregularidade da margem",
      "Prurido isolado",
      "Melhora espontânea rápida",
      "Lesão pediculada homogênea"
    ],
    correta: 1,
    explicacao: "Madarose e distorção da margem sugerem infiltração/destruição folicular e arquitetura, sinais de alerta para neoplasia maligna."
  },
  {
    pergunta: "Paciente com obstrução baixa adquirida (suspeita de ducto nasolacrimal) e epífora crônica. Tratamento definitivo mais comum:",
    alternativas: [
      "Plugues de ponto lacrimal",
      "Massagem do saco lacrimal",
      "Dacriocistorrinostomia (DCR)",
      "Blefaroplastia",
      "Cauterização do ponto lacrimal"
    ],
    correta: 2,
    explicacao: "Na obstrução baixa adquirida, a DCR cria uma nova via entre saco lacrimal e cavidade nasal, tratando a causa anatômica."
  },
  {
    pergunta: "Refluxo pelo ponto oposto durante irrigação sugere obstrução em:",
    alternativas: [
      "Válvula de Hasner",
      "Ducto nasolacrimal distal",
      "Canalículo comum/porção medial",
      "Meato inferior",
      "Glândula lacrimal"
    ],
    correta: 2,
    explicacao: "Se irrigação reflui pelo ponto contralateral, a obstrução costuma ser antes da entrada no saco (canalículo comum) ou na sua porção."
  },
  {
    pergunta: "Uma DCR pode falhar principalmente por:",
    alternativas: [
      "Hipersecreção lacrimal",
      "Cicatrização/estenose do óstio criado",
      "Ausência de válvula de Hasner",
      "Blefarite anterior leve",
      "Xantelasma"
    ],
    correta: 1,
    explicacao: "A reestenose do óstio por cicatrização é causa comum de falha. Técnica, tamanho do óstio e controle de fatores nasais influenciam."
  },
  {
    pergunta: "Em obstrução canalicular proximal extensa, alternativa cirúrgica apropriada pode ser:",
    alternativas: [
      "DCR simples sempre resolve",
      "Sondagem repetida indefinidamente",
      "CDCR com tubo de Jones",
      "Massagem do saco",
      "Plugues de ponto lacrimal"
    ],
    correta: 2,
    explicacao: "Quando canalículos não são funcionais, CDCR com tubo de Jones cria drenagem direta para cavidade nasal."
  },
  {
    pergunta: "Na suspeita de carcinoma sebáceo, uma estratégia diagnóstica correta inclui:",
    alternativas: [
      "Evitar biópsia por risco de sangramento",
      "Biópsia e, se conjuntiva suspeita, mapeamento conjuntival",
      "Apenas antibiótico tópico e observar",
      "Somente dermatoscopia",
      "Ressecção sem anatomopatológico"
    ],
    correta: 1,
    explicacao: "Carcinoma sebáceo pode ter disseminação pagetoide. Biópsia é essencial e, havendo suspeita conjuntival, mapeamento ajuda estadiamento e planejamento."
  },
  {
    pergunta: "Paciente com ptose variável ao longo do dia e fatigabilidade. Diagnóstico provável:",
    alternativas: [
      "Ptose aponeurótica",
      "Miastenia gravis",
      "Horner",
      "Orbitopatia de Graves",
      "Blefarocalásio"
    ],
    correta: 1,
    explicacao: "Variabilidade e fatigabilidade são típicas de miastenia. Deve-se investigar com testes clínicos e laboratoriais e avaliar risco de miastenia generalizada."
  },
  {
    pergunta: "Na ptose aponeurótica típica, o achado mais sugestivo é:",
    alternativas: [
      "Dobra palpebral alta e boa função do levantador",
      "Miose e anidrose",
      "Elevação palpebral piora com esforço",
      "Proptose e restrição de motilidade",
      "Cicatrização conjuntival"
    ],
    correta: 0,
    explicacao: "Ptose aponeurótica costuma ter boa função do levantador, sulco palpebral alto e desinserção/deiscência aponeurótica, comum em idosos e usuários de lentes."
  },
  {
    pergunta: "No olho seco, o papel da inflamação é relevante porque:",
    alternativas: [
      "A inflamação é sempre a causa única",
      "Não influencia sintomas",
      "Cria ciclo vicioso de dano da superfície ocular e instabilidade do filme",
      "Ocorre apenas em casos leves",
      "Somente antibiótico resolve"
    ],
    correta: 2,
    explicacao: "A inflamação perpetua instabilidade do filme, dano epitelial e sintomas. Por isso, terapias anti-inflamatórias (p.ex., ciclosporina) podem ser necessárias em casos selecionados."
  },
  {
    pergunta: "Antes de colocar plugues lacrimais, deve-se:",
    alternativas: [
      "Evitar lubrificantes",
      "Excluir inflamação significativa/blefarite ativa",
      "Realizar DCR",
      "Interromper higiene palpebral",
      "Indicar em qualquer olho seco evaporativo puro"
    ],
    correta: 1,
    explicacao: "Oclusão pode reter mediadores inflamatórios e piorar sintomas se inflamação estiver ativa. Primeiro controla-se inflamação e disfunção meibomiana."
  },
  {
    pergunta: "Em DGM (disfunção de glândulas de Meibômio), medida de primeira linha é:",
    alternativas: [
      "Corticoide tópico contínuo por meses",
      "Compressas mornas + higiene/expressão",
      "DCR endoscópica",
      "Plugues como primeira escolha",
      "Antibiótico sistêmico sempre"
    ],
    correta: 1,
    explicacao: "Terapia conservadora (compressas mornas e higiene) melhora qualidade do meibum e a camada lipídica, reduzindo evaporação e instabilidade do filme."
  },
  {
    pergunta: "Um paciente com ectrópio paralítico do VII par tem risco aumentado de:",
    alternativas: [
      "Epífora apenas por obstrução do ducto",
      "Ceratopatia de exposição",
      "Hipertensão ocular",
      "Tumores palpebrais",
      "Aumento de mucina"
    ],
    correta: 1,
    explicacao: "Paralisia do VII reduz o fechamento palpebral e a bomba lacrimal, levando a exposição corneana e risco de ceratite/ulceração."
  },
  {
    pergunta: "Em blefarite anterior estafilocócica, achado típico é:",
    alternativas: [
      "Meibum espesso no orifício glandular",
      "Crosta/colarettes na base dos cílios",
      "Simbléfaro",
      "Massa no saco lacrimal",
      "Miose e anidrose"
    ],
    correta: 1,
    explicacao: "Blefarite anterior costuma formar crostas e “colarettes” na base dos cílios. DGM é mais posterior (orifícios meibomianos e meibum alterado)."
  },
  {
    pergunta: "Em suspeita de melanoma palpebral, a característica clínica mais preocupante é:",
    alternativas: [
      "Lesão homogênea e simétrica",
      "Mudança recente, assimetria, bordas irregulares e variação de cor",
      "Lesão pediculada uniforme",
      "Placa amarelada superficial",
      "Lesão que desaparece em 48h"
    ],
    correta: 1,
    explicacao: "Critérios ABCDE (assimetria, bordas, cor, diâmetro, evolução) sugerem malignidade melanocítica. Exige avaliação e biópsia adequada."
  },
  {
    pergunta: "Em cirurgia de margem palpebral após laceração, o ponto mais crítico para evitar entalhe é:",
    alternativas: [
      "Suturar apenas a pele rapidamente",
      "Alinhar precisamente a margem (linha cinzenta) e tarsos",
      "Evitar suturas profundas no tarso",
      "Deixar cicatrizar por segunda intenção",
      "Usar apenas cola cirúrgica"
    ],
    correta: 1,
    explicacao: "A precisão do alinhamento da margem (linha cinzenta) e reparo do tarso é essencial para evitar notch, triquíase e irregularidade funcional/estética."
  },
  {
    pergunta: "Defeito palpebral pequeno (<25% do comprimento) costuma permitir:",
    alternativas: [
      "Exenteração",
      "Fechamento direto",
      "Hughes obrigatório",
      "Cutler-Beard obrigatório",
      "CDCR com tubo"
    ],
    correta: 1,
    explicacao: "Defeitos pequenos geralmente permitem fechamento direto com pouca tensão. Defeitos maiores exigem retalhos/estratégias lamelares."
  },
  {
    pergunta: "Defeito palpebral de 25–50% do comprimento costuma exigir:",
    alternativas: [
      "Apenas observação",
      "Fechamento direto sempre",
      "Retalhos locais (ex.: Tenzel) conforme caso",
      "Exenteração",
      "Apenas enxerto livre de pele em ambas lamelas"
    ],
    correta: 2,
    explicacao: "Defeitos intermediários frequentemente necessitam retalhos locais (p.ex., Tenzel) e reconstrução adequada de lamelas para manter função."
  },
  {
    pergunta: "Em suspeita de olho seco por deficiência aquosa (ex.: Sjögren), espera-se com mais frequência:",
    alternativas: [
      "BUT baixo com Schirmer normal",
      "Schirmer baixo e sintomas importantes",
      "Jones I negativo",
      "Refluxo de pus do saco",
      "Madarose"
    ],
    correta: 1,
    explicacao: "Deficiência aquosa cursa com redução de produção lacrimal, refletida por Schirmer baixo (especialmente com anestesia)."
  },
  {
    pergunta: "A melhor explicação para a camada lipídica do filme lacrimal é:",
    alternativas: [
      "Produzida por células caliciformes",
      "Produzida por glândula lacrimal principal",
      "Produzida por glândulas de Meibômio e reduz evaporação",
      "Responsável por tornar a córnea hidrofílica",
      "Sem papel em evaporação"
    ],
    correta: 2,
    explicacao: "A camada lipídica é de Meibômio e reduz evaporação, estabilizando o filme. Mucina é das células caliciformes e torna superfície hidrofílica."
  },
  {
    pergunta: "A camada mucínica do filme lacrimal tem como função principal:",
    alternativas: [
      "Reduzir evaporação",
      "Nutrir a córnea por si só",
      "Tornar a superfície epitelial hidrofílica e melhorar espalhamento do filme",
      "Drenar lágrima para o nariz",
      "Aumentar pressão intraocular"
    ],
    correta: 2,
    explicacao: "Mucina (células caliciformes) facilita aderência/espalhamento do filme sobre epitélio, reduzindo áreas de ruptura."
  },
  {
    pergunta: "Em retração palpebral por Graves, um objetivo clínico primordial é:",
    alternativas: [
      "Aumentar a produção de lágrima com plugue",
      "Reduzir proptose apenas",
      "Proteger córnea (exposição) e restaurar fechamento palpebral",
      "Tratar obstrução do ducto nasolacrimal",
      "Eliminar blefarite anterior"
    ],
    correta: 2,
    explicacao: "Retração causa exposição e ceratopatia. Medidas clínicas e cirúrgicas visam proteção corneana e restauração de fechamento/posição palpebral."
  },
  {
    pergunta: "Em DCR externa, o princípio cirúrgico fundamental é:",
    alternativas: [
      "Remover o saco lacrimal",
      "Criar comunicação entre saco lacrimal e cavidade nasal (óstio) de bom calibre",
      "Fechar ducto nasolacrimal",
      "Ocluir pontos lacrimais",
      "Criar comunicação com seio maxilar"
    ],
    correta: 1,
    explicacao: "A DCR cria uma nova via de drenagem, conectando saco à cavidade nasal. Tamanho/posição do óstio e patência são essenciais."
  },
  {
    pergunta: "Um resultado típico de epífora funcional é:",
    alternativas: [
      "Obstrução total na irrigação",
      "Vias pérvias, mas drenagem ineficiente (bomba lacrimal/pálpebra)",
      "Sempre dacriocistite aguda",
      "Imperforação de Hasner em adulto",
      "Tumor do saco lacrimal invariavelmente"
    ],
    correta: 1,
    explicacao: "Epífora funcional ocorre com vias anatomicamente pérvias, mas falha de bomba lacrimal, malposição palpebral (ectrópio), ou disfunções dinâmicas."
  },
  {
    pergunta: "Em ectropion involucional do idoso, a alteração dominante costuma ser:",
    alternativas: [
      "Encurtamento vertical da lamela anterior por cicatriz",
      "Frouxidão horizontal e falha do canto lateral",
      "Simbléfaro e retração conjuntival",
      "Paralisia do III par",
      "Desinserção do levantador"
    ],
    correta: 1,
    explicacao: "Ectrópio involucional é dominado por laxidez horizontal (tendões cantais) e falha de suporte, afastando o ponto lacrimal do lago lacrimal."
  },
  {
    pergunta: "Em entrópio cicatricial, é esperado:",
    alternativas: [
      "Override do orbicular pré-septal sem cicatriz",
      "Retração conjuntival/tarsal, frequentemente com doença cicatricial ocular",
      "Frouxidão horizontal isolada",
      "Anidrose e miose",
      "Massa endurecida no saco lacrimal"
    ],
    correta: 1,
    explicacao: "Entrópio cicatricial resulta de retração da lamela posterior (conjuntiva/tarso), comum em tracoma, penfigoide, queimaduras e outras conjuntivites cicatriciais."
  },
  {
    pergunta: "Paciente com suspeita de penfigoide ocular cicatricial e olho seco importante. Um risco relevante é:",
    alternativas: [
      "Apenas epífora por obstrução",
      "Progressão para cicatrização conjuntival, simbléfaro e comprometimento corneano",
      "Somente blefarite anterior benigna",
      "Tumor do saco lacrimal",
      "Ptose neurogênica"
    ],
    correta: 1,
    explicacao: "Doenças cicatriciais podem reduzir células caliciformes, induzir simbléfaro e ceratopatia grave. Exigem abordagem especializada, muitas vezes sistêmica."
  },
  {
    pergunta: "Em um paciente com suspeita de miastenia ocular, um achado clássico é:",
    alternativas: [
      "Ptose fixa sem variação",
      "Variabilidade da ptose e fatigabilidade",
      "Madarose e ulceração",
      "Refluxo de secreção do saco",
      "BUT invariavelmente alto"
    ],
    correta: 1,
    explicacao: "Miastenia é caracterizada por variabilidade, fatigabilidade e pode cursar com diplopia. Exige investigação e cuidado com risco sistêmico."
  },
  {
    pergunta: "Qual achado sugere síndrome de Horner em comparação com ptose aponeurótica?",
    alternativas: [
      "Dobra palpebral alta",
      "Boa função do levantador",
      "Miose ipsilateral",
      "Presença de dermatocálase",
      "História de trauma palpebral"
    ],
    correta: 2,
    explicacao: "Horner: ptose leve + miose (e anidrose). Ptose aponeurótica não cursa com miose e tende a apresentar sulco alto."
  },
  {
    pergunta: "Na ptose por paralisia do III par, é mais provável encontrar:",
    alternativas: [
      "Ptose discreta apenas",
      "Ptose importante e alterações de motilidade ocular",
      "Miose com anidrose",
      "Variabilidade diária marcada",
      "Refluxo de pus do saco lacrimal"
    ],
    correta: 1,
    explicacao: "Paralisia do III costuma produzir ptose significativa e restrição de motilidade; pupila pode estar envolvida dependendo da etiologia."
  },
  {
    pergunta: "Em reconstrução palpebral, um substituto rígido do tarso comumente usado é:",
    alternativas: [
      "Gordura orbital",
      "Cartilagem auricular",
      "Pele retroauricular",
      "Músculo orbicular",
      "Conjuntiva bulbar isolada"
    ],
    correta: 1,
    explicacao: "Cartilagem conchal pode substituir suporte tarsal quando necessário, fornecendo rigidez e forma."
  },
  {
    pergunta: "Na avaliação de lesão palpebral suspeita, um erro crítico é:",
    alternativas: [
      "Fotodocumentar",
      "Considerar biópsia quando há sinais de alerta",
      "Tratar como blefarite por meses sem reavaliar lesão persistente",
      "Avaliar margem e cílios",
      "Considerar localização canto medial"
    ],
    correta: 2,
    explicacao: "Lesões persistentes/atípicas exigem reavaliação e frequentemente biópsia. Atraso diagnóstico é particularmente grave em carcinoma sebáceo e espinocelular."
  },
  {
    pergunta: "Uma indicação clássica de biópsia em calázio é:",
    alternativas: [
      "Primeiro episódio em jovem",
      "Calázio típico com boa resposta ao tratamento",
      "Calázio recorrente ou atípico, especialmente em idoso",
      "Blefarite anterior leve",
      "Olho seco evaporativo"
    ],
    correta: 2,
    explicacao: "Calázio recorrente/atípico (sobretudo em idosos) pode mascarar carcinoma sebáceo. Biópsia deve ser considerada."
  },
  {
    pergunta: "Em suspeita de carcinoma espinocelular palpebral, uma preocupação adicional em relação ao basocelular é:",
    alternativas: [
      "Menor crescimento",
      "Menor potencial metastático",
      "Maior potencial de metástase regional",
      "Sempre localização em pálpebra superior",
      "Nunca ulcera"
    ],
    correta: 2,
    explicacao: "Carcinoma espinocelular tem maior potencial metastático que basocelular e pode evoluir mais agressivamente."
  },
  {
    pergunta: "Em blefarite posterior/DGM, a alteração típica do meibum é:",
    alternativas: [
      "Secreção aquosa abundante",
      "Secreção espessa/turbida com obstrução do óstio glandular",
      "Produção exclusiva de mucina",
      "Ausência completa de secreção lacrimal aquosa",
      "Refluxo pelo ponto oposto"
    ],
    correta: 1,
    explicacao: "DGM cursa com espessamento/alteração do meibum e obstrução dos orifícios, reduzindo qualidade da camada lipídica e aumentando evaporação."
  },
  {
    pergunta: "Qual teste é mais diretamente relacionado à estabilidade do filme lacrimal?",
    alternativas: [
      "Schirmer",
      "BUT",
      "Jones I",
      "Irrigação lacrimal",
      "Dacriocistografia"
    ],
    correta: 1,
    explicacao: "BUT (tempo de ruptura) mede estabilidade do filme lacrimal, refletindo qualidade (especialmente lipídica/mucínica)."
  },
  {
    pergunta: "Na obstrução congênita do ducto nasolacrimal, a conduta inicial mais indicada é:",
    alternativas: [
      "DCR imediatamente",
      "Massagem do saco lacrimal (Crigler) e observação",
      "CDCR com tubo de Jones",
      "Plugues lacrimais",
      "Radioterapia"
    ],
    correta: 1,
    explicacao: "A maioria resolve com manejo conservador (massagem). Persistente após idade apropriada → sondagem."
  },
  {
    pergunta: "Na epífora por ectrópio, o mecanismo principal é:",
    alternativas: [
      "Produção aquosa excessiva",
      "Obstrução distal do ducto",
      "Afastamento do ponto lacrimal do lago lacrimal e falha da bomba",
      "Válvula de Hasner imperfurada",
      "Cicatrização conjuntival"
    ],
    correta: 2,
    explicacao: "No ectrópio, ponto lacrimal não fica em contato com o lago lacrimal; além disso, bomba lacrimal (orbicular) pode falhar, resultando em epífora."
  },
  {
    pergunta: "Em suspeita de tumor do saco lacrimal, um sinal clínico particularmente sugestivo é:",
    alternativas: [
      "Epífora bilateral desde infância",
      "Epífora unilateral recente com massa dura e pouca secreção ao refluxo",
      "Dacriocistite aguda sempre com pus",
      "Melhora completa com massagem",
      "Schirmer baixo"
    ],
    correta: 1,
    explicacao: "Massa endurecida e epífora unilateral recente sugerem tumor. A presença de refluxo purulento típico favorece dacriocistite crônica por obstrução benigna, mas não exclui tumor."
  },
  {
    pergunta: "Em olho seco, os colírios sem conservantes são preferidos principalmente porque:",
    alternativas: [
      "São sempre mais baratos",
      "Têm ação antibiótica superior",
      "Reduzem toxicidade/inflamação da superfície ocular em uso frequente",
      "Aumentam produção aquosa",
      "Substituem anti-inflamatórios"
    ],
    correta: 2,
    explicacao: "Conservantes podem lesar epitélio e agravar inflamação, especialmente em uso frequente e em olho seco moderado a grave."
  },
  {
    pergunta: "O tratamento anti-inflamatório com ciclosporina tópica no olho seco tem como característica:",
    alternativas: [
      "Efeito imediato em minutos",
      "Efeito gradual ao longo de semanas",
      "Uso apenas em infecção bacteriana",
      "Contraindicação absoluta em todos os casos",
      "Substitui a higiene palpebral na DGM"
    ],
    correta: 1,
    explicacao: "Ciclosporina atua modulando inflamação e aumenta função secretória ao longo de semanas; não é medicação de efeito imediato."
  },
  {
    pergunta: "Qual achado é mais típico de ceratopatia de exposição em paralisia facial?",
    alternativas: [
      "Ulceração inferior e ceratite punctata por lagoftalmo",
      "Apenas epífora por obstrução",
      "Schirmer alto",
      "Miose e anidrose",
      "Tumor perolado com telangiectasias"
    ],
    correta: 0,
    explicacao: "Lagoftalmo → exposição corneana, frequentemente inferior, com ceratite punctata e risco de ulceração. Manejo: lubrificação, proteção e correções palpebrais se necessário."
  },
  {
    pergunta: "Em blefarocalásio, uma característica clínica típica é:",
    alternativas: [
      "Pele palpebral superior frouxa com episódios de edema recorrente",
      "Madarose e ulceração",
      "Miose e anidrose",
      "Refluxo purulento do saco",
      "Proptose dolorosa"
    ],
    correta: 0,
    explicacao: "Blefarocalásio envolve episódios recorrentes de edema palpebral levando a pele redundante e alterações estruturais ao longo do tempo."
  },
  {
    pergunta: "Em um paciente com epífora e testes sugerindo obstrução baixa, o local anatômico mais provável é:",
    alternativas: [
      "Ponto lacrimal",
      "Canalículo proximal",
      "Canalículo comum",
      "Ducto nasolacrimal",
      "Glândulas de Meibômio"
    ],
    correta: 3,
    explicacao: "Obstrução baixa geralmente é distal ao saco lacrimal, frequentemente no ducto nasolacrimal, indicando DCR como tratamento definitivo mais comum."
  },
  {
    pergunta: "A principal função do piscar na fisiologia lacrimal é:",
    alternativas: [
      "Produzir lágrima aquosa",
      "Distribuir uniformemente o filme lacrimal e acionar a bomba lacrimal",
      "Aumentar evaporação",
      "Bloquear drenagem",
      "Produzir mucina"
    ],
    correta: 1,
    explicacao: "O piscar distribui e renova o filme lacrimal e ajuda a drenagem por ação do orbicular (bomba lacrimal)."
  },
  {
    pergunta: "Em suspeita de tumor palpebral com invasão profunda, a conduta mais apropriada é:",
    alternativas: [
      "Ressecção superficial sem margens",
      "Observação prolongada",
      "Biópsia/estadiamento e ressecção oncológica com controle de margens (conforme protocolo)",
      "Apenas antibiótico tópico",
      "Plugues lacrimais"
    ],
    correta: 2,
    explicacao: "Lesões com suspeita de invasão exigem planejamento oncológico, estadiamento e ressecção com controle de margens (p.ex., Mohs em casos selecionados), seguida de reconstrução adequada."
  },
  {
    pergunta: "A localização mais associada a recidiva e morbidade em carcinoma basocelular palpebral é:",
    alternativas: [
      "Canto medial",
      "Pálpebra superior lateral",
      "Sobrancelha",
      "Fórnice inferior",
      "Canto lateral somente"
    ],
    correta: 0,
    explicacao: "Canto medial tem anatomia complexa, planos profundos e proximidade de vias lacrimais, favorecendo extensão subclínica e recidiva."
  },
  {
    pergunta: "Em olho seco grave, uma opção terapêutica adjuvante baseada em componentes da lágrima é:",
    alternativas: [
      "Soro autólogo",
      "Dacriocistografia",
      "CDCR com tubo",
      "Cantotomia",
      "Crioterapia"
    ],
    correta: 0,
    explicacao: "Soro autólogo fornece fatores de crescimento e componentes semelhantes à lágrima, útil em casos graves e defeitos epiteliais persistentes."
  },
  {
    pergunta: "Quando a epífora é causada por irritação ocular (corpo estranho/corneopatia), ela é melhor descrita como:",
    alternativas: [
      "Epífora por obstrução alta",
      "Epífora por obstrução baixa",
      "Epífora por hipersecreção reflexa",
      "Epífora por tumor do saco",
      "Epífora por CDCR"
    ],
    correta: 2,
    explicacao: "Irritação da superfície ocular desencadeia lacrimejamento reflexo, causando epífora sem obstrução anatômica primária."
  },
  {
    pergunta: "Um paciente com olho seco evaporativo e blefarite posterior terá benefício com:",
    alternativas: [
      "Massagem do saco lacrimal",
      "Higiene palpebral e compressas mornas",
      "DCR endoscópica",
      "Plugues como primeira medida",
      "Apenas antibiótico sistêmico por meses"
    ],
    correta: 1,
    explicacao: "Higiene e compressas são base do tratamento da blefarite posterior/DGM, melhorando camada lipídica e estabilidade do filme."
  },
  {
    pergunta: "Em reconstrução palpebral, qual é a composição da lamela posterior?",
    alternativas: [
      "Pele e orbicular",
      "Pele e tarso",
      "Tarso e conjuntiva",
      "Septo e gordura",
      "Músculo frontal e pele"
    ],
    correta: 2,
    explicacao: "Lamela posterior = tarso + conjuntiva. Lamela anterior = pele + orbicular."
  },
  {
    pergunta: "Em reconstrução palpebral, qual é a composição da lamela anterior?",
    alternativas: [
      "Tarso e conjuntiva",
      "Pele e músculo orbicular",
      "Septo e gordura",
      "Conjuntiva e Müller",
      "Tarso e levantador"
    ],
    correta: 1,
    explicacao: "Lamela anterior é pele + orbicular; essencial para cobertura e estética."
  },
  {
    pergunta: "A intubação com silicone em lesão canalicular tem como principal objetivo:",
    alternativas: [
      "Aumentar produção lacrimal",
      "Manter patência durante cicatrização",
      "Eliminar necessidade de sutura",
      "Reduzir PIO",
      "Tratar olho seco evaporativo"
    ],
    correta: 1,
    explicacao: "O stent de silicone mantém o lúmen canalicular aberto enquanto ocorre cicatrização, reduzindo estenose e epífora."
  },
  {
    pergunta: "Ao reparar uma laceração de margem palpebral, a estrutura que não deve ser negligenciada é:",
    alternativas: [
      "Somente a pele",
      "Tarso e alinhamento da margem",
      "Somente conjuntiva",
      "Somente cílios",
      "Somente o septo"
    ],
    correta: 1,
    explicacao: "Reparo correto do tarso e alinhamento preciso da margem são críticos para evitar notch e malposições."
  },
  {
    pergunta: "Em obstrução congênita persistente após aproximadamente 1 ano, uma conduta frequentemente indicada é:",
    alternativas: [
      "Continuar massagem indefinidamente sem reavaliar",
      "Sondagem das vias lacrimais",
      "DCR imediata em todos",
      "CDCR",
      "Plugues"
    ],
    correta: 1,
    explicacao: "Sondagem é indicada em obstrução persistente após idade apropriada, especialmente se sintomática e refratária ao conservador."
  },
  {
    pergunta: "Uma característica que diferencia epífora por obstrução baixa de obstrução alta é:",
    alternativas: [
      "Na baixa, frequentemente há refluxo com secreção ao comprimir o saco (em crônica)",
      "Na baixa, a irrigação sempre reflui pelo ponto oposto",
      "Na alta, sempre existe massa endurecida",
      "Na alta, sempre há dacriocistite aguda",
      "Na baixa, nunca há secreção"
    ],
    correta: 0,
    explicacao: "Obstrução baixa pode causar estase no saco, com refluxo à compressão e dacriocistite crônica. Obstrução alta tende a não ter refluxo do saco porque a via até ele está comprometida."
  },
  {
    pergunta: "Em carcinoma basocelular, a cirurgia com controle de margens é importante porque:",
    alternativas: [
      "Não há extensão subclínica",
      "Há possibilidade de extensão subclínica e recidiva, sobretudo em áreas de risco",
      "Não invade localmente",
      "Não necessita reconstrução",
      "Não existe risco no canto medial"
    ],
    correta: 1,
    explicacao: "CBC pode ter extensão subclínica. Controle de margens reduz recidiva, especialmente em canto medial e lesões agressivas."
  },
  {
    pergunta: "Uma massa violácea vascular em imunossuprimido, envolvendo pálpebra, sugere:",
    alternativas: [
      "Papiloma escamoso",
      "Sarcoma de Kaposi",
      "Xantelasma",
      "Calázio",
      "Cisto de Moll"
    ],
    correta: 1,
    explicacao: "Sarcoma de Kaposi é lesão vascular violácea associada a imunossupressão (p.ex., HIV), podendo envolver pálpebras."
  },
  {
    pergunta: "No manejo do olho seco, uma intervenção comportamental efetiva para quem usa telas é:",
    alternativas: [
      "Reduzir ingestão hídrica",
      "Pausas regulares e piscamento consciente",
      "Aumentar ventilação direta no rosto",
      "Diminuir o piscar",
      "Dormir menos"
    ],
    correta: 1,
    explicacao: "Uso prolongado de telas reduz frequência do piscar, aumentando evaporação. Pausas e piscamento consciente melhoram distribuição do filme."
  },
  {
    pergunta: "Um achado típico em olho seco moderado/grave na biomicroscopia corneana é:",
    alternativas: [
      "Ceratite punctata superficial",
      "Proptose dolorosa",
      "Uveíte intensa",
      "Edema de papila",
      "Hemorragia vítrea"
    ],
    correta: 0,
    explicacao: "Ceratite punctata superficial é comum em olho seco e exposição, evidenciável com fluoresceína."
  },
  {
    pergunta: "A coloração com fluoresceína é mais útil para evidenciar:",
    alternativas: [
      "Produção lacrimal",
      "Defeitos epiteliais corneanos",
      "Drenagem lacrimal",
      "Camada lipídica",
      "Pressão intraocular"
    ],
    correta: 1,
    explicacao: "Fluoresceína marca defeitos epiteliais, permitindo avaliar ceratopatia."
  },
  {
    pergunta: "Rosa bengala/verde de lisamina são úteis principalmente para:",
    alternativas: [
      "Avaliar camada lipídica",
      "Marcar células epiteliais desvitalizadas e dano da superfície",
      "Medir pressão intraocular",
      "Avaliar ducto nasolacrimal distal",
      "Substituir histopatologia"
    ],
    correta: 1,
    explicacao: "Esses corantes evidenciam dano e células alteradas na superfície ocular, úteis no olho seco."
  },
  {
    pergunta: "Em ptose, o parâmetro MRD1 representa:",
    alternativas: [
      "Distância do reflexo corneano até margem palpebral superior",
      "Distância do reflexo até margem inferior",
      "Altura da fenda palpebral apenas",
      "Excursão do levantador",
      "Comprimento do tarso"
    ],
    correta: 0,
    explicacao: "MRD1 é a distância entre reflexo corneano e margem superior. Ajuda a quantificar ptose e planejar correção."
  },
  {
    pergunta: "A excisão de lesão palpebral suspeita sem anatomopatológico é inadequada porque:",
    alternativas: [
      "Sempre causa sangramento",
      "Impossibilita confirmação diagnóstica e planejamento oncológico",
      "Elimina necessidade de reconstrução",
      "Impede cicatrização",
      "Reduz recidiva"
    ],
    correta: 1,
    explicacao: "Sem anatomopatológico não há diagnóstico/estadiamento adequados; margens podem estar comprometidas e recidiva ocorrer."
  },
  {
    pergunta: "Uma estratégia para minimizar cicatriz visível em enxerto de pele palpebral é preferir área doadora:",
    alternativas: [
      "Coxa",
      "Abdome",
      "Pálpebra contralateral ou retroauricular",
      "Planta do pé",
      "Região lombar"
    ],
    correta: 2,
    explicacao: "Pele palpebral/retroauricular tem textura e espessura mais semelhantes, melhor resultado estético."
  },
  {
    pergunta: "Uma contraindicação relativa ao fechamento primário de ferida palpebral é:",
    alternativas: [
      "Ferida limpa recente",
      "Laceração pequena",
      "Ferida extensamente contaminada/infecção ativa",
      "Trauma fechado",
      "Ausência de sangramento"
    ],
    correta: 2,
    explicacao: "Feridas contaminadas/infectadas podem exigir limpeza agressiva, antibiótico e estratégia de fechamento conforme risco de infecção."
  },
  {
    pergunta: "Em mordedura animal na pálpebra, conduta correta inclui:",
    alternativas: [
      "Suturar sem limpeza",
      "Apenas observação",
      "Irrigação/lavagem rigorosa + profilaxia antibiótica e avaliação do fechamento",
      "Crioterapia",
      "Radioterapia"
    ],
    correta: 2,
    explicacao: "Mordeduras têm alta carga bacteriana. Limpeza e antibiótico são essenciais; decisão de sutura depende de local/tempo/contaminação."
  },
  {
    pergunta: "Na avaliação inicial de trauma palpebral, a prioridade é:",
    alternativas: [
      "Suturar imediatamente a pele",
      "Avaliar apenas a ferida palpebral",
      "Avaliar acuidade visual e lesões oculares associadas",
      "Tomografia para todos",
      "Antibiótico tópico para todos"
    ],
    correta: 2,
    explicacao: "Trauma palpebral pode coexistir com lesão ocular grave. Avaliação ocular completa e acuidade visual são prioritárias."
  },
  {
    pergunta: "Uma medida que reduz evaporação e melhora conforto em olho seco é:",
    alternativas: [
      "Vento direto no rosto",
      "Ar-condicionado contínuo",
      "Umidificação ambiental/evitar correntes de ar",
      "Suspender lubrificantes",
      "Reduzir piscar"
    ],
    correta: 2,
    explicacao: "Ambiente seco/ventilado aumenta evaporação. Umidificação e evitar correntes de ar ajudam sintomas."
  },
  {
    pergunta: "Em epífora unilateral, uma etapa diagnóstica útil para localizar obstrução é:",
    alternativas: [
      "Schirmer",
      "BUT",
      "Irrigação e sondagem das vias lacrimais",
      "Paquimetria",
      "Topografia corneana"
    ],
    correta: 2,
    explicacao: "Irrigação/sondagem ajudam a localizar nível de obstrução (alta vs baixa) e orientar tratamento."
  },
  {
    pergunta: "Qual achado sugere mais fortemente obstrução canalicular (alta)?",
    alternativas: [
      "Refluxo purulento ao comprimir saco",
      "Epífora com vias distais obstruídas na irrigação, mas sem refluxo do saco à compressão",
      "Massa endurecida do saco",
      "Febre e dor intensa sempre",
      "Schirmer baixo"
    ],
    correta: 1,
    explicacao: "Em obstrução alta, a lágrima não chega adequadamente ao saco, e compressão do saco não produz refluxo típico. Irrigação pode mostrar bloqueio proximal."
  },
  {
    pergunta: "No teste de Jones I, o princípio é:",
    alternativas: [
      "Medir produção lacrimal com papel",
      "Avaliar estabilidade do filme",
      "Verificar passagem de fluoresceína para cavidade nasal sem irrigação",
      "Avaliar pressão intraocular",
      "Avaliar motilidade ocular"
    ],
    correta: 2,
    explicacao: "Jones I avalia drenagem funcional: fluoresceína instilada deve aparecer no nariz/algodão se drenagem estiver adequada."
  },
  {
    pergunta: "Jones II é mais indicado quando:",
    alternativas: [
      "Jones I é positivo",
      "Jones I é negativo",
      "Schirmer é baixo",
      "BUT é alto",
      "Há blefarite anterior"
    ],
    correta: 1,
    explicacao: "Jones II é sequência após Jones I negativo para diferenciar obstrução parcial e localizar o nível com irrigação."
  },
  {
    pergunta: "Na síndrome do olho seco, um ponto fundamental para abordagem é:",
    alternativas: [
      "Tratar sempre apenas com antibiótico",
      "Terapia escalonada e individualizada conforme tipo e gravidade",
      "Cirurgia como primeira linha",
      "Ignorar fatores ambientais",
      "Não acompanhar"
    ],
    correta: 1,
    explicacao: "Olho seco é crônico e multifatorial; manejo é escalonado (lubrificantes → controle inflamatório → adjuvantes) e individualizado."
  },

  // ====== A partir daqui (para completar 90), questões de nível prova cobrindo: anatomia, tumores, trauma, vias lacrimais, olho seco, malposições, ptose/retração, reconstrução ======

  {
    pergunta: "A glândula lacrimal principal localiza-se predominantemente:",
    alternativas: [
      "Canto medial",
      "No tarso superior",
      "Quadrante superolateral da órbita (fossa do osso frontal)",
      "Dentro do saco lacrimal",
      "No meato inferior"
    ],
    correta: 2,
    explicacao: "A glândula lacrimal principal está no quadrante superolateral, na fossa lacrimal do osso frontal. Contribui mais para secreção reflexa."
  },
  {
    pergunta: "As glândulas lacrimais acessórias (Krause/Wolfring) contribuem principalmente para:",
    alternativas: [
      "Secreção lipídica",
      "Secreção basal aquosa",
      "Drenagem lacrimal",
      "Secreção mucínica",
      "Produção de cílios"
    ],
    correta: 1,
    explicacao: "As glândulas acessórias são importantes para a secreção basal aquosa (manutenção contínua do filme)."
  },
  {
    pergunta: "A aferência sensitiva corneana que desencadeia lacrimejamento reflexo ocorre via:",
    alternativas: [
      "Nervo facial (VII)",
      "Nervo trigêmeo (V)",
      "Nervo óptico (II)",
      "Nervo oculomotor (III)",
      "Nervo abducente (VI)"
    ],
    correta: 1,
    explicacao: "A sensibilidade corneana é do trigêmeo (V). A via eferente secretomotora para glândula lacrimal envolve fibras parassimpáticas via VII."
  },
  {
    pergunta: "Qual camada do filme lacrimal é mais diretamente responsável por reduzir evaporação?",
    alternativas: [
      "Mucínica",
      "Aquosa",
      "Lipídica",
      "Conjuntival",
      "Proteica"
    ],
    correta: 2,
    explicacao: "Camada lipídica, produzida por Meibômio, reduz evaporação e melhora estabilidade do filme."
  },
  {
    pergunta: "As células caliciformes conjuntivais produzem principalmente:",
    alternativas: [
      "Lipídios",
      "Mucina",
      "Eletrólitos",
      "Colágeno",
      "Hemoglobina"
    ],
    correta: 1,
    explicacao: "Células caliciformes produzem mucina, essencial para espalhamento do filme e estabilidade."
  },
  {
    pergunta: "Uma causa comum de redução de células caliciformes e deficiência mucínica é:",
    alternativas: [
      "DGM isolada",
      "Conjuntivite cicatricial (ex.: penfigoide)",
      "Obstrução do ducto nasolacrimal",
      "Ptose aponeurótica",
      "Xantelasma"
    ],
    correta: 1,
    explicacao: "Conjuntivites cicatriciais podem destruir células caliciformes, reduzindo mucina e piorando olho seco."
  },
  {
    pergunta: "Em entropion involucional, um componente cirúrgico frequente é:",
    alternativas: [
      "Enxerto de pele para lamela anterior",
      "Correção da frouxidão horizontal e reinserção/fortalecimento de retratores",
      "DCR endoscópica",
      "CDCR com tubo de Jones",
      "Ressecção do tarso superior"
    ],
    correta: 1,
    explicacao: "Correções típicas: encurtamento horizontal (tarsal strip) + reinserção de retratores e controle do override orbicular, reduzindo inversão da margem."
  },
  {
    pergunta: "Em ectrópio cicatricial, uma intervenção frequentemente necessária é:",
    alternativas: [
      "Apenas tarsal strip",
      "Liberação cicatricial + enxerto de pele (aumentar lamela anterior)",
      "DCR",
      "Ressecção do tarso",
      "Tratamento apenas clínico"
    ],
    correta: 1,
    explicacao: "Como há encurtamento vertical da lamela anterior, costuma ser necessário enxerto de pele após liberação."
  },
  {
    pergunta: "Em ectrópio involucional com epífora importante, a correção do canto lateral (tarsal strip) visa:",
    alternativas: [
      "Aumentar produção de lágrima",
      "Restaurar suporte horizontal e posicionar ponto lacrimal",
      "Tratar tumor do saco lacrimal",
      "Reduzir mucina",
      "Diminuir piscar"
    ],
    correta: 1,
    explicacao: "O tarsal strip corrige laxidez horizontal e ajuda a reposicionar a margem/ponto lacrimal, melhorando drenagem."
  },
  {
    pergunta: "Em suspeita de lesão canalicular, o melhor momento para reparo quando possível é:",
    alternativas: [
      "Após 30 dias",
      "Preferencialmente precoce (primeiras 24–48h)",
      "Somente se houver epífora tardia",
      "Nunca reparar",
      "Apenas com cola"
    ],
    correta: 1,
    explicacao: "Reparo precoce facilita identificação de cotos e aumenta taxa de sucesso com intubação."
  },
  {
    pergunta: "Qual afirmação sobre DCR endoscópica em relação à externa é correta?",
    alternativas: [
      "Não permite intubação",
      "Sempre tem sucesso inferior",
      "Evita incisão cutânea externa e cicatriz",
      "Não trata dacriocistite crônica",
      "É contraindicada em obstrução do ducto"
    ],
    correta: 2,
    explicacao: "A endoscópica evita cicatriz cutânea e pode ter taxas comparáveis em mãos experientes, com avaliação nasal concomitante."
  },
  {
    pergunta: "Um sinal clínico que sugere doença maligna palpebral em vez de benigna é:",
    alternativas: [
      "Lesão pediculada homogênea",
      "Crescimento muito lento e estável",
      "Ulceração e sangramento fácil, com bordas infiltradas",
      "Lesão mole e móvel",
      "Lesão simétrica bilateral"
    ],
    correta: 2,
    explicacao: "Ulceração, sangramento fácil, infiltração, madarose e distorção da margem sugerem malignidade."
  },
  {
    pergunta: "Entre as neoplasias palpebrais, a que mais frequentemente metastatiza para linfonodos regionais é:",
    alternativas: [
      "Carcinoma basocelular",
      "Carcinoma espinocelular",
      "Xantelasma",
      "Papiloma",
      "Nevus"
    ],
    correta: 1,
    explicacao: "Carcinoma espinocelular tem maior potencial metastático regional que basocelular."
  },
  {
    pergunta: "Uma apresentação de carcinoma sebáceo que frequentemente leva a atraso diagnóstico é:",
    alternativas: [
      "Nódulo perolado típico",
      "Calázio recorrente e blefaroconjuntivite unilateral crônica",
      "Lesão pigmentada ABCDE",
      "Lesão vascular violácea",
      "Placa xantelasmática"
    ],
    correta: 1,
    explicacao: "Carcinoma sebáceo pode se apresentar como calázio recorrente/atípico e conjuntivite unilateral crônica, devendo-se biopsiar casos persistentes."
  },
  {
    pergunta: "Na ceratopatia por exposição, a prioridade terapêutica inicial é:",
    alternativas: [
      "DCR",
      "Lubrificação intensiva e proteção corneana (taping/óculos/umidificação)",
      "Antibiótico sistêmico sempre",
      "Cauterização do ponto",
      "Suspender piscamento"
    ],
    correta: 1,
    explicacao: "Proteção e lubrificação são imediatas para reduzir dano corneano. Correções cirúrgicas (tarsorrafia, peso palpebral, etc.) conforme gravidade."
  },
  {
    pergunta: "Em paciente com suspeita de retinopatia ou problema intraocular, uma falha comum ao avaliar trauma palpebral é:",
    alternativas: [
      "Avaliar acuidade visual",
      "Checar pupilas e motilidade",
      "Ignorar exame ocular e focar apenas na sutura palpebral",
      "Investigar corpo estranho",
      "Solicitar TC quando indicado"
    ],
    correta: 2,
    explicacao: "Sempre deve-se excluir lesão ocular associada antes de focar somente na pálpebra."
  },

  // ==== Completar até 90 com questões integradoras e de prova ====

  {
    pergunta: "Paciente com ptose moderada e boa função do levantador. A técnica mais frequentemente indicada é:",
    alternativas: [
      "Suspensão frontal",
      "Avanço/aponeurose do levantador",
      "Exenteração orbitária",
      "DCR",
      "Hughes"
    ],
    correta: 1,
    explicacao: "Boa função do levantador favorece correção aponeurótica (avanço/encurtamento), especialmente em ptose aponeurótica."
  },
  {
    pergunta: "Em ptose congênita, um risco pós-operatório importante, sobretudo em ressecções maiores, é:",
    alternativas: [
      "Dacriocistite aguda",
      "Lagoftalmo e exposição corneana",
      "Obstrução do ducto",
      "Tumor do saco",
      "Aumento da mucina"
    ],
    correta: 1,
    explicacao: "Ptose congênita pode exigir ressecções/suspensão e aumentar risco de lagoftalmo; proteção corneana e acompanhamento são essenciais."
  },
  {
    pergunta: "O canto medial é área crítica em tumores palpebrais porque:",
    alternativas: [
      "Não há estruturas importantes",
      "Há risco de extensão subclínica e proximidade do sistema lacrimal e planos profundos",
      "É região de pouca vascularização e não cicatriza",
      "Sempre é benigno",
      "Nunca recidiva"
    ],
    correta: 1,
    explicacao: "Complexidade anatômica e vias lacrimais elevam risco de extensão e recidiva, exigindo planejamento e controle de margens."
  },
  {
    pergunta: "A epífora por obstrução baixa em adulto frequentemente se apresenta como:",
    alternativas: [
      "Epífora com secreção à compressão do saco (em crônica)",
      "Miose e anidrose",
      "Ptose variável",
      "Ceratite de exposição",
      "Madarose"
    ],
    correta: 0,
    explicacao: "Obstrução baixa causa estase e pode evoluir para dacriocistite crônica, com refluxo mucopurulento à compressão."
  },
  {
    pergunta: "Em suspeita de obstrução do ducto nasolacrimal, o local de drenagem final normal do ducto é:",
    alternativas: [
      "Meato médio",
      "Meato superior",
      "Meato inferior",
      "Seio maxilar",
      "Conjuntiva bulbar"
    ],
    correta: 2,
    explicacao: "Ducto nasolacrimal desemboca no meato inferior, protegido pela válvula de Hasner."
  },
  {
    pergunta: "A válvula de Hasner está localizada:",
    alternativas: [
      "Na junção canalículo-saco",
      "Na entrada do saco lacrimal",
      "Na saída do ducto nasolacrimal no meato inferior",
      "No ponto lacrimal",
      "Na glândula lacrimal"
    ],
    correta: 2,
    explicacao: "Hasner é a válvula distal no meato inferior; imperfuração é causa comum de obstrução congênita."
  },
  {
    pergunta: "Em olho seco com DGM importante, colocar plugues sem tratar blefarite pode:",
    alternativas: [
      "Melhorar sempre e rapidamente",
      "Piorar sintomas por reter mediadores inflamatórios e secreções alteradas",
      "Curar DGM",
      "Eliminar necessidade de higiene",
      "Substituir compressas"
    ],
    correta: 1,
    explicacao: "Oclusão pode agravar quadro inflamatório quando blefarite/DGM ativa não está controlada."
  },
  {
    pergunta: "A principal vantagem de retalhos locais em reconstrução palpebral é:",
    alternativas: [
      "Ausência total de cicatriz",
      "Melhor correspondência de cor/textura e vascularização",
      "Dispensar reconstrução de lamelas",
      "Substituir tarso sempre",
      "Serem sempre de um único tempo"
    ],
    correta: 1,
    explicacao: "Retalhos locais são vascularizados e combinam melhor cor/textura, favorecendo viabilidade e resultado estético/funcional."
  },
  {
    pergunta: "Um objetivo funcional essencial da pálpebra reconstruída é:",
    alternativas: [
      "Apenas estética",
      "Permitir fechamento e proteção da superfície ocular",
      "Aumentar drenagem lacrimal",
      "Reduzir PIO",
      "Aumentar proptose"
    ],
    correta: 1,
    explicacao: "A pálpebra protege a córnea, distribui filme lacrimal e participa do bombeamento lacrimal; reconstrução deve restaurar função."
  },
  {
    pergunta: "A bomba lacrimal depende principalmente de:",
    alternativas: [
      "Glândula lacrimal principal",
      "Músculo orbicular e integridade palpebral/cantal",
      "Células caliciformes",
      "Meibômio apenas",
      "Septo orbitário"
    ],
    correta: 1,
    explicacao: "Contração do orbicular durante o piscar, com posicionamento adequado de pontos e saco, promove drenagem (bomba lacrimal)."
  },
  {
    pergunta: "Em uma lesão pigmentada suspeita (ABCDE), a abordagem adequada é:",
    alternativas: [
      "Observar por 12 meses",
      "Aplicar corticoide tópico",
      "Avaliar e biopsiar conforme indicação (planejamento para margens/diagnóstico)",
      "Fazer DCR",
      "Plugar pontos lacrimais"
    ],
    correta: 2,
    explicacao: "Lesões pigmentadas suspeitas requerem avaliação e biópsia apropriada para diagnóstico e conduta oncológica."
  },
  {
    pergunta: "Em carcinoma basocelular infiltrativo, um risco maior é:",
    alternativas: [
      "Recidiva menor que nodular",
      "Extensão subclínica e margens difíceis, necessitando controle rigoroso",
      "Não invadir localmente",
      "Metástase frequente para pulmão",
      "Cura espontânea"
    ],
    correta: 1,
    explicacao: "Subtipos infiltrativos/morfeiformes têm margens mal definidas e maior recidiva, exigindo controle de margens (p.ex., Mohs em selecionados)."
  },

  // ==== Para fechar 90: questões integradoras de prova (sem “pegadinhas” ruins, mas exigindo raciocínio) ====

  {
    pergunta: "Paciente com epífora e teste de irrigação mostrando passagem para nariz com refluxo mínimo. Ainda assim, lacrimeja e tem blefarite/DGM. Diagnóstico mais provável:",
    alternativas: [
      "Obstrução baixa completa",
      "Epífora funcional/hipersecreção reflexa associada a superfície ocular",
      "Tumor do saco lacrimal",
      "Obstrução congênita de Hasner",
      "CDCR necessária"
    ],
    correta: 1,
    explicacao: "Vias pérvias com sintomas podem indicar epífora funcional e/ou hipersecreção reflexa por irritação da superfície (blefarite/olho seco). Tratar superfície antes de cirurgias."
  },
  {
    pergunta: "Um paciente com pálpebra inferior retraída e esclera exposta inferiormente após cirurgia/trauma apresenta principalmente:",
    alternativas: [
      "Entrópio involucional",
      "Retração palpebral inferior com risco de exposição",
      "Horner",
      "Dacriocistite aguda",
      "Ptose aponeurótica"
    ],
    correta: 1,
    explicacao: "Retração inferior expõe esclera e córnea, causando exposição e epífora funcional. Manejo envolve lubrificação e correções reconstrutivas conforme etiologia."
  },
  {
    pergunta: "Na blefarite posterior, um antibiótico oral usado em casos selecionados (efeito anti-inflamatório e sobre meibum) é:",
    alternativas: [
      "Penicilina benzatina",
      "Doxiciclina",
      "Acyclovir",
      "Amoxicilina em dose única",
      "Cefalexina sempre"
    ],
    correta: 1,
    explicacao: "Tetraciclinas (ex.: doxiciclina) podem ser usadas em DGM/rosácea por efeito anti-inflamatório e modulação do meibum, em casos selecionados e com cautelas."
  },
  {
    pergunta: "Em suspeita de rosácea ocular, um achado compatível é:",
    alternativas: [
      "Miose e anidrose",
      "Telangiectasias de margem e DGM associada",
      "Massa endurecida do saco lacrimal",
      "Calázio sempre maligno",
      "Schirmer sempre elevado"
    ],
    correta: 1,
    explicacao: "Rosácea ocular associa-se a telangiectasias, blefarite posterior e DGM, contribuindo para olho seco evaporativo."
  },
  {
    pergunta: "No câncer palpebral, a reconstrução deve ser planejada após:",
    alternativas: [
      "Fechar primeiro e biopsiar depois",
      "Confirmar margens adequadas e diagnóstico (anatomopatológico)",
      "Aplicar colírio lubrificante",
      "Massagear a lesão",
      "Colocar plugues"
    ],
    correta: 1,
    explicacao: "Reconstrução idealmente ocorre após confirmação de margens livres (ou estratégia de controle), garantindo ressecção oncológica adequada."
  },
  {
    pergunta: "Paciente com calázio no tarso superior há meses, recidivante e com perda de cílios focal. Conduta mais adequada:",
    alternativas: [
      "Drenagem repetida sem biópsia",
      "Antibiótico tópico por 6 meses",
      "Biópsia para excluir carcinoma sebáceo",
      "Apenas compressa morna",
      "DCR"
    ],
    correta: 2,
    explicacao: "Recorrência, persistência e sinais de alerta (madarose) exigem biópsia para excluir malignidade, especialmente carcinoma sebáceo."
  },
  {
    pergunta: "Em suspeita de lesão canalicular, um erro comum é:",
    alternativas: [
      "Explorar canto medial",
      "Realizar intubação quando indicado",
      "Suturar pele sem avaliar sistema lacrimal",
      "Avaliar acuidade visual",
      "Fotodocumentar"
    ],
    correta: 2,
    explicacao: "Suturar apenas pele sem reconhecer lesão canalicular leva a estenose e epífora crônica, muitas vezes de correção mais complexa."
  },
  {
    pergunta: "Uma pista clínica para diferenciar obstrução nasolacrimal de hipersecreção reflexa é:",
    alternativas: [
      "Obstrução sempre bilateral",
      "Hipersecreção reflexa costuma vir com sintomas de irritação (ardor, areia) e testes de vias pérvias",
      "Obstrução não causa secreção",
      "Reflexa sempre causa massa endurecida",
      "Reflexa não melhora com tratar superfície"
    ],
    correta: 1,
    explicacao: "Irritação da superfície (olho seco/blefarite/corpo estranho) → lacrimejamento reflexo com vias pérvias. Obstrução tende a sinais de falha de drenagem e/ou estase."
  },
  {
    pergunta: "Na suspeita de olho seco, uma queixa paradoxal comum do paciente é:",
    alternativas: [
      "‘Meu olho lacrimeja demais’",
      "‘Nunca sinto areia’",
      "‘Tenho dor súbita intensa com perda visual’",
      "‘Tenho febre e massa no canto medial’",
      "‘Tenho diplopia constante’"
    ],
    correta: 0,
    explicacao: "Epífora paradoxal é comum no olho seco por lacrimejamento reflexo, apesar de deficiência basal."
  },
  {
    pergunta: "Ao escolher técnica de reconstrução, um princípio de segurança para viabilidade é:",
    alternativas: [
      "Reconstruir ambas lamelas com enxertos avasculares",
      "Garantir pelo menos uma lamela vascularizada (retalho)",
      "Remover tarso sempre",
      "Evitar qualquer enxerto",
      "Evitar suturar tarso"
    ],
    correta: 1,
    explicacao: "Uma lamela vascularizada reduz necrose e deiscência. A outra pode ser enxerto, conforme necessidade."
  },

  // ====== CONTAGEM: para fechar exatamente 90, adiciono 20 questões finais objetivas e abrangentes ======

  {
    pergunta: "O músculo de Müller contribui para elevação palpebral superior em aproximadamente:",
    alternativas: ["0–1 mm", "1–2 mm", "4–5 mm", "6–8 mm", "10 mm"],
    correta: 1,
    explicacao: "O músculo de Müller (simpático) contribui cerca de 1–2 mm na elevação. Por isso Horner causa ptose discreta."
  },
  {
    pergunta: "A principal camada que fornece rigidez estrutural à pálpebra é:",
    alternativas: ["Pele", "Orbicular", "Tarso", "Conjuntiva", "Septo"],
    correta: 2,
    explicacao: "O tarso fornece rigidez e suporte estrutural, essencial para o contorno e função palpebral."
  },
  {
    pergunta: "Na blefarite anterior, a abordagem básica inclui:",
    alternativas: [
      "Apenas DCR",
      "Higiene palpebral e controle de crostas; tratar fatores associados",
      "Plugues como primeira linha",
      "Somente antibiótico sistêmico",
      "Evitar limpeza"
    ],
    correta: 1,
    explicacao: "Higiene palpebral (remoção de crostas) e tratamento conforme etiologia (estafilocócica/seborreica/Demodex) são pilares."
  },
  {
    pergunta: "Em obstrução canalicular traumática, um tratamento que pode ser necessário quando canalículos são irrecuperáveis é:",
    alternativas: ["DCR simples", "CDCR com tubo de Jones", "Plugues", "Massagem", "Cauterização do ponto"],
    correta: 1,
    explicacao: "Se canalículos não funcionam, CDCR com tubo de Jones cria drenagem alternativa."
  },
  {
    pergunta: "Uma característica típica do carcinoma basocelular é:",
    alternativas: [
      "Metástase frequente precoce",
      "Alta agressividade sistêmica",
      "Crescimento local invasivo com baixa taxa de metástase",
      "Sempre pigmentado",
      "Sempre doloroso"
    ],
    correta: 2,
    explicacao: "CBC é predominantemente localmente invasivo e destrutivo, com metástase rara, mas pode causar grande morbidade local."
  },
  {
    pergunta: "Uma complicação tardia após reconstrução palpebral inadequada é:",
    alternativas: ["Entrópio/ectrópio secundário", "Hipertensão arterial", "Catarata nuclear", "Retinopatia diabética", "Otite"],
    correta: 0,
    explicacao: "Reconstrução inadequada pode alterar vetores e suporte, causando malposições tardias (ectrópio/entrópio) e exposição."
  },
  {
    pergunta: "Em olho seco evaporativo, uma meta terapêutica é:",
    alternativas: [
      "Aumentar obstrução lacrimal",
      "Melhorar camada lipídica e estabilidade do filme",
      "Reduzir mucina",
      "Aumentar vento",
      "Eliminar piscar"
    ],
    correta: 1,
    explicacao: "Melhorar Meibômio e camada lipídica reduz evaporação e aumenta estabilidade (BUT)."
  },
  {
    pergunta: "Em dacriocistite crônica, o achado típico é:",
    alternativas: [
      "Proptose dolorosa e perda visual",
      "Epífora crônica com secreção à compressão do saco",
      "Miose e anidrose",
      "Ptose variável",
      "Ceratite dendrítica"
    ],
    correta: 1,
    explicacao: "Dacriocistite crônica frequentemente causa epífora e refluxo mucopurulento ao comprimir saco."
  },
  {
    pergunta: "Em paciente com lacrimejamento e irritação, mas irrigação totalmente pérvia, a conduta inicial mais razoável é:",
    alternativas: [
      "DCR imediata",
      "Tratar superfície ocular (olho seco/blefarite) e reavaliar",
      "CDCR com tubo",
      "Cauterizar ponto lacrimal",
      "Exenteração"
    ],
    correta: 1,
    explicacao: "Se vias são pérvias, tratar causa de hipersecreção reflexa/superfície ocular antes de cirurgia lacrimal."
  },
  {
    pergunta: "A melhor explicação para o risco de ceratopatia em retração palpebral superior é:",
    alternativas: [
      "Aumento de mucina",
      "Exposição aumentada e pior distribuição do filme lacrimal",
      "Drenagem aumentada",
      "Redução de Meibômio",
      "Obstrução do ducto"
    ],
    correta: 1,
    explicacao: "Retração aumenta exposição e reduz proteção palpebral, piorando evaporação e instabilidade do filme."
  }
];
