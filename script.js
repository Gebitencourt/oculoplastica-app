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
