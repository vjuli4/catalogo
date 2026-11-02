/* =====================================================
   LÓGICA DO CATÁLOGO
   1) CONFIGURAÇÃO  → seu número de WhatsApp
   2) PRODUTOS      → a lista que você edita
   3) CARRINHO      → adicionar, remover, totais
   4) TELA          → desenha cartões e gaveta
   5) WHATSAPP      → monta a mensagem e abre o app
   ===================================================== */


/* ---------- 1) CONFIGURAÇÃO ---------- */
// Número com código do país + DDD, só dígitos. Ex.: Brasil (55) + RN (84) + número.
const WHATSAPP = "5584996842395";  


/* ---------- 2) PRODUTOS ----------
   Para adicionar um produto, copie um bloco { ... } e mude os campos:
   id        → número único (não repita)
   nome      → nome exibido
   marca     → opcional
   detalhe   → texto curto (tamanho, tipo)
   categoria → "Corpo", "Banho", "Perfumaria" ou "Solar" (pode criar outras)
   preco     → em reais (ex.: 29.9). Os valores abaixo são EXEMPLOS: ajuste!
   foto      → caminho da imagem dentro da pasta img/
   variantes → opcional: lista de opções (fragrâncias) que o cliente escolhe */
const PRODUTOS = [
  { id: 2, nome: "Body Splash Tododia", marca: "Natura", detalhe: "200 ml", categoria: "Perfumaria", preco: 59.9, foto: "img/body-splash.png",
    variantes: ["Flor de Pera e Melissa", "Maçã Caramelada e Baunilha", "Algodão", "Caramelo Salgado", "Ameixa e Flor de Baunilha"] },
  { id: 1, nome: "Creme para o corpo Flor de Pera e Melissa", marca: "Natura Tododia", detalhe: "100 ml", categoria: "Corpo", preco: 24.9, foto: "img/creme-flor-de-pera-100.png" },
  { id: 3, nome: "Creme para o corpo Algodão", marca: "Natura Tododia", detalhe: "400 ml", categoria: "Corpo", preco: 49.9, foto: "img/creme-algodao-400.png" },
  { id: 4, nome: "Creme para o corpo Ameixa e Flor de Baunilha", marca: "Natura Tododia", detalhe: "400 ml", categoria: "Corpo", preco: 49.9, foto: "img/creme-ameixa-400.png" },
  { id: 5, nome: "Esfoliante acetinado Lily", marca: "O Boticário", detalhe: "200 g", categoria: "Corpo", preco: 54.9, foto: "img/lily-esfoliante.png" },
  { id: 6, nome: "Desodorante roll-on On Duty Care Clareador", marca: "Avon", detalhe: "50 ml · 48h", categoria: "Perfumaria", preco: 12.9, foto: "img/avon-on-duty.png" },
  { id: 7, nome: "Kaiak Deo Corporal Masculino", marca: "Natura", detalhe: "100 ml", categoria: "Perfumaria", preco: 69.9, foto: "img/kaiak.png" },
  { id: 8, nome: "Paradise Fun", marca: "Mahogany", detalhe: "100 ml", categoria: "Perfumaria", preco: 79.9, foto: "img/paradise-fun.png" },
  { id: 9, nome: "Orion Desodorante Corporal", marca: "Mahogany", detalhe: "350 ml", categoria: "Perfumaria", preco: 89.9, foto: "img/orion.png" },
  { id: 10, nome: "Sabonete líquido Cereja e Avelã", marca: "Natura Tododia", detalhe: "300 ml", categoria: "Banho", preco: 22.9, foto: "img/sabonete-cereja.png" },
  { id: 11, nome: "Refil sabonete líquido Alecrim e Sálvia", marca: "Natura Tododia", detalhe: "300 ml", categoria: "Banho", preco: 17.9, foto: "img/refil-alecrim.png" },
  { id: 12, nome: "Sabonete líquido esfoliante Capim Limão e Hortelã", marca: "Natura Tododia", detalhe: "190 g", categoria: "Banho", preco: 24.9, foto: "img/esfoliante-capim-limao.png" },
  { id: 13, nome: "Sabonete em barra Flor de Pera e Melissa", marca: "Natura Tododia", detalhe: "2 unidades de 90 g", categoria: "Banho", preco:14.9, foto:"img/sabonete-flor-de-pera.png" },
  { id: 14, nome: "Sabonete em barra Lily", marca:"O Boticário", detalhe:"2 unidades de 90 g", categoria:"Banho", preco:19.9, foto:"img/lily-sabonete.png" },
  { id: 15, nome: "Sabonetes Much Love", marca:"", detalhe:"Sabonetes em formato de coração", categoria:"Banho", preco: 29.9, foto:"img/much-love.png" },
  { id: 16, nome: "Protetor solar facial FPS 50", marca: "Natura Solar", detalhe: "50 ml · pele mista a oleosa", categoria: "Solar", preco: 54.9, foto: "img/solar-facial.png" },
];


/* ---------- 3) CARRINHO ----------
   O carrinho é uma lista de itens: { chave, nome, variante, preco, qtd }.
   "chave" = id + variante, assim o mesmo produto em fragrâncias
   diferentes vira linhas separadas. Fica salvo no navegador (localStorage),
   então o cliente não perde o pedido se recarregar a página. */
let carrinho = carregar();

function carregar() {
  try { return JSON.parse(localStorage.getItem("carrinho")) || []; }
  catch { return []; }                       // se o navegador bloquear, começa vazio
}
function salvar() {
  try { localStorage.setItem("carrinho", JSON.stringify(carrinho)); } catch {}
}

function adicionar(produto, variante) {
  const chave = produto.id + "|" + (variante || "");
  const existente = carrinho.find(i => i.chave === chave);
  if (existente) existente.qtd++;            // já está no carrinho: só soma 1
  else carrinho.push({ chave, nome: produto.nome, variante, preco: produto.preco, qtd: 1 });
  atualizar();
}

function mudarQtd(chave, delta) {
  const item = carrinho.find(i => i.chave === chave);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) carrinho = carrinho.filter(i => i.chave !== chave);  // zerou: remove
  atualizar();
}

const total = () => carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
const qtdTotal = () => carrinho.reduce((s, i) => s + i.qtd, 0);
const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });


/* ---------- 4) TELA ---------- */
const $ = id => document.getElementById(id);   // atalho para achar elementos
let categoriaAtiva = "Todos";

// Cria os botões de categoria a partir da lista de produtos
function desenharFiltros() {
  const categorias = ["Todos", ...new Set(PRODUTOS.map(p => p.categoria))];
  $("filtros").innerHTML = "";
  categorias.forEach(cat => {
    const b = document.createElement("button");
    b.textContent = cat;
    b.setAttribute("aria-pressed", cat === categoriaAtiva);
    b.onclick = () => { categoriaAtiva = cat; desenharFiltros(); desenharProdutos(); };
    $("filtros").appendChild(b);
  });
}

// Cria um cartão para cada produto (respeitando a categoria escolhida)
function desenharProdutos() {
  const lista = $("lista");
  lista.innerHTML = "";
  PRODUTOS.filter(p => categoriaAtiva === "Todos" || p.categoria === categoriaAtiva)
    .forEach(p => {
      const card = document.createElement("article");
      card.className = "cartao";
      card.dataset.id = p.id;
      card.innerHTML = `
        <img src="${p.foto}" alt="${p.nome}" loading="lazy" data-id="${p.id}">
        <div class="cartao-corpo">
          ${p.marca ? `<span class="marca">${p.marca}</span>` : ""}
          <h3>${p.nome}</h3>
          <span class="detalhe">${p.detalhe}</span>
          ${p.variantes ? `<div class="variantes" role="group" aria-label="Escolha a fragrância">
              ${p.variantes.map((v, i) => `<button type="button" class="opcao-variante" aria-pressed="${i === 0}">${v}</button>`).join("")}</div>` : ""}
          <span class="preco">${brl(p.preco)}</span>
          <button class="btn-add">Adicionar</button>
        </div>`;

      // Clique em "Adicionar": pega a fragrância escolhida (se houver) e põe no carrinho
      const botao = card.querySelector(".btn-add");
      card.querySelectorAll(".opcao-variante").forEach(opcao => {
        opcao.onclick = () => {
          card.querySelectorAll(".opcao-variante").forEach(item => item.setAttribute("aria-pressed", "false"));
          opcao.setAttribute("aria-pressed", "true");
        };
      });
      botao.onclick = () => {
        const opcaoSelecionada = card.querySelector('.opcao-variante[aria-pressed="true"]');
        adicionar(p, opcaoSelecionada ? opcaoSelecionada.textContent : "");
        botao.textContent = "Adicionado ✓";           // feedback rápido
        botao.classList.add("ok");
        setTimeout(() => { botao.textContent = "Adicionar"; botao.classList.remove("ok"); }, 1000);
      };
      lista.appendChild(card);
    });
}

// Atualiza barra fixa, gaveta e salva. Chamada sempre que o carrinho muda.
function atualizar() {
  salvar();

  // Barra fixa: só aparece se houver itens
  $("btn-carrinho").hidden = carrinho.length === 0;
  $("qtd-total").textContent = qtdTotal() + (qtdTotal() === 1 ? " item" : " itens");
  $("valor-barra").textContent = brl(total());

  // Lista dentro da gaveta
  const ul = $("itens");
  ul.innerHTML = carrinho.length ? "" : `<li class="vazio">Seu pedido está vazio. Adicione produtos do catálogo.</li>`;
  carrinho.forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="nome-item">${i.nome}</span>
      <div class="qtd">
        <button aria-label="Diminuir">−</button><span>${i.qtd}</span><button aria-label="Aumentar">+</button>
      </div>
      <span class="sub">${i.variante ? i.variante + " · " : ""}${brl(i.preco * i.qtd)}</span>`;
    const [menos, mais] = li.querySelectorAll(".qtd button");
    menos.onclick = () => mudarQtd(i.chave, -1);
    mais.onclick = () => mudarQtd(i.chave, +1);
    ul.appendChild(li);
  });

  $("valor-total").textContent = brl(total());
  $("enviar").disabled = carrinho.length === 0;       // sem itens, não envia
  if (carrinho.length === 0) abrirGaveta(false);      // esvaziou: fecha a gaveta
}

// Abre/fecha a gaveta lateral
function abrirGaveta(abrir) {
  $("gaveta").hidden = !abrir;
  $("fundo").hidden = !abrir;
}
$("btn-carrinho").onclick = () => abrirGaveta(true);
$("fechar").onclick = $("fundo").onclick = () => abrirGaveta(false);
$("limpar").onclick = () => { carrinho = []; atualizar(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") abrirGaveta(false); });


/* ---------- 5) WHATSAPP ----------
   Monta um texto com todos os itens e abre:
   https://wa.me/NUMERO?text=MENSAGEM
   O cliente só precisa apertar "enviar" no WhatsApp. */
$("enviar").onclick = () => {
  const nome = $("nome").value.trim();
  const linhas = carrinho.map(i =>
    `• ${i.qtd}x ${i.nome}${i.variante ? " (" + i.variante + ")" : ""} — ${brl(i.preco * i.qtd)}`);

  const mensagem =
    `Olá! ${nome ? "Meu nome é " + nome + ". " : ""}Quero fazer este pedido:\n\n` +
    linhas.join("\n") +
    `\n\n*Total: ${brl(total())}*`;

  // encodeURIComponent troca espaços e quebras de linha por códigos aceitos na URL
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`, "_blank");
};


/* ---------- INÍCIO ---------- */
desenharFiltros();
desenharProdutos();
atualizar();
