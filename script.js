// ===== BANCO DE QUESTÕES =====
// Cada questão: pergunta, alternativas[5], correta (0-4), explicacao
const bancoQuestoes = {
  1: [
    // (Abaixo você cola as questões do Capítulo 1)
  ],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: []
};

let prova = [];
let idxAtual = 0;
let acertos = 0;

function iniciarProva() {
  const cap = Number(document.getElementById("capitulo").value);
  const base = bancoQuestoes[cap] || [];

  if (base.length < 10) {
    document.getElementById("prova").innerHTML =
      `<p><strong>Este capítulo ainda tem ${base.length} questões.</strong> O app precisa de pelo menos 10 para montar a prova.</p>`;
    return;
  }

  prova = embaralhar([...base]).slice(0, 10);
  idxAtual = 0;
  acertos = 0;
  renderQuestao();
}

function renderQuestao() {
  const q = prova[idxAtual];

  let html = `
    <div class="card">
      <p><strong>Questão ${idxAtual + 1}/10</strong></p>
      <p>${q.pergunta}</p>
      <form id="formQ">
  `;

  q.alternativas.forEach((alt, i) => {
    html += `
      <label class="alt">
        <input type="radio" name="resp" value="${i}">
        ${String.fromCharCode(65 + i)}) ${alt}
      </label><br>
    `;
  });

  html += `
      <button type="submit">Responder</button>
      </form>
      <div id="feedback"></div>
    </div>
  `;

  document.getElementById("prova").innerHTML = html;

  document.getElementById("formQ").addEventListener("submit", (e) => {
    e.preventDefault();
    corrigir();
  });
}

function corrigir() {
  const q = prova[idxAtual];
  const marcado = document.querySelector('input[name="resp"]:checked');

  if (!marcado) {
    document.getElementById("feedback").innerHTML = `<p><em>Selecione uma alternativa.</em></p>`;
    return;
  }

  const resp = Number(marcado.value);
  const letraCorreta = String.fromCharCode(65 + q.correta);

  if (resp === q.correta) {
    acertos++;
    document.getElementById("feedback").innerHTML =
      `<p><strong>Correto.</strong></p><button onclick="proxima()">Próxima</button>`;
  } else {
    document.getElementById("feedback").innerHTML =
      `<p><strong>Incorreto.</strong> Correta: <strong>${letraCorreta}</strong></p>
       <p><em>${q.explicacao}</em></p>
       <button onclick="proxima()">Próxima</button>`;
  }
}

function proxima() {
  idxAtual++;
  if (idxAtual >= 10) {
    document.getElementById("prova").innerHTML =
      `<h2>Resultado</h2><p>Acertos: <strong>${acertos}/10</strong></p>
       <button onclick="iniciarProva()">Refazer (novo sorteio)</button>`;
    return;
  }
  renderQuestao();
}

function embaralhar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
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

