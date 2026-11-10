const CONFIG = {
  pageWidth: 816,
  pageHeight: 1154,
  contentTop: 42,
  footerReserve: 150,
  maxRowsPerPage: 5,
  assetRoot: 'assets/'
};

const SYSTEM_ORDER = ['RuralFinance', 'RuralTransportes', 'SiloVirtual'];

const app = document.getElementById('app');

async function loadData(){
  const response = await fetch('dados/informativo.json', {cache:'no-store'});
  if(!response.ok) throw new Error(`Não foi possível carregar dados/informativo.json (${response.status}).`);
  return response.json();
}

function el(tag, className, text){
  const node = document.createElement(tag);
  if(className) node.className = className;
  if(text !== undefined) node.textContent = text;
  return node;
}

function asset(path){
  if(!path) return '';
  return CONFIG.assetRoot + path.replace(/^assets\//,'');
}

function img(src, className, alt=''){
  const node = document.createElement('img');
  node.src = asset(src);
  node.className = className || '';
  node.alt = alt;
  return node;
}

function dateLabel(value){
  if(!value) return '';
  const [y,m,d] = value.split('-').map(Number);
  const dt = new Date(y,m-1,d || 1);
  return new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(dt).replace(/^./,c=>c.toUpperCase());
}

function makeFooter(pageNumber,totalPages){
  const footer = el('div','internal-footer');
  const brand = el('div','footer-brand');
  brand.appendChild(img('logo.png',''));
  const line = el('div','vline');
  const tag = el('div','tag','GESTÃO COMPLETA\nPARA O SEU AGRO');
  tag.style.whiteSpace='pre-line';
  brand.append(line,tag);
  footer.appendChild(brand);
  const pn = el('div','page-no');
  pn.appendChild(el('div','',`Pág. ${pageNumber} de ${totalPages}`));
  pn.appendChild(el('div','page-line'));
  footer.appendChild(pn);
  return footer;
}

function makeHeader(data){
  const header=el('div','internal-header');
  header.appendChild(el('div','internal-title','Informativo de modificações - ruralhub'));
  const date=el('div','internal-date');
  date.appendChild(img('capa/capa_calendario.png',''));
  date.appendChild(el('span','',dateLabel(data.data)));
  header.appendChild(date);
  header.appendChild(el('div','header-rule'));
  return header;
}

function makePage(data, kind){
  const page=el('section',`page internal ${kind||''}`);
  page.dataset.kind=kind||'';
  page.appendChild(makeHeader(data));
  const body=el('div','internal-body');
  page.appendChild(body);
  
    const footer=el('div','cover-footer');
    const brand=el('div','footer-brand');
    brand.appendChild(img('logo.png',''));
    brand.appendChild(el('div','vline'));
    const tag=el('div','tag','GESTÃO COMPLETA\nPARA O SEU AGRO'); tag.style.whiteSpace='pre-line';
    brand.appendChild(tag);
    footer.appendChild(brand);
    const pn=el('div','page-no'); pn.appendChild(el('div','',`Pág. 1 de TOTAL`)); pn.appendChild(el('div','page-line')); footer.appendChild(pn);
    page.appendChild(footer);

  return {page,body};
}

function makeCover(data){
  const page=el('section','page cover');
  const minhaImagem = img('capa/moldura.png');
  Object.assign(minhaImagem.style, {
    position: 'absolute',
    right: '-10px'
  });

  page.appendChild(minhaImagem);
  // page.appendChild(img('capa/moldura.png'));
  const content=el('div','cover-content');
  const date=el('div','cover-date');
  date.appendChild(img('capa/capa_calendario.png',''));
  date.appendChild(el('span','',dateLabel(data.data)));
  content.appendChild(date);
  content.appendChild(el('h1','',data.capa?.titulo || 'Boletim de Novidades'));
  content.appendChild(img('logo.png','cover-logo','RuralHub'));
  content.appendChild(el('div','cover-rule'));
  content.appendChild(el('p','cover-intro',data.capa?.descricao || ''));
  const list=el('div','cover-highlights');
  for(const item of (data.capa?.destaques||[])){
    const row=el('div','highlight');
    row.appendChild(img(`${item.icone}.png`,'',item.texto));
    row.appendChild(el('span','',item.texto));
    list.appendChild(row);
  }
  content.appendChild(list);
  page.appendChild(content);
  const TextoPersonalizado = img('capa/texto.png');
  Object.assign(TextoPersonalizado.style, {
    position: 'absolute',
    left: '50px',
    top: '800px'
  });
  page.appendChild(TextoPersonalizado);
  // page.appendChild(img('capa/texto.png','cover-tagline','Tecnologia que impulsiona o Agronegócio'));
  const footer=el('div','cover-footer');
  const brand=el('div','footer-brand');
  brand.appendChild(img('logo.png',''));
  brand.appendChild(el('div','vline'));
  const tag=el('div','tag','GESTÃO COMPLETA\nPARA O SEU AGRO'); tag.style.whiteSpace='pre-line';
  brand.appendChild(tag);
  footer.appendChild(brand);
  const pn=el('div','page-no'); pn.appendChild(el('div','',`Pág. 1 de TOTAL`)); pn.appendChild(el('div','page-line')); footer.appendChild(pn);
  page.appendChild(footer);
  return page;
}

function validSpecialHighlights(data){
  return (Array.isArray(data.destaquesEspeciais) ? data.destaquesEspeciais : [])
    .filter(item => item && typeof item === 'object' &&
      [item.titulo,item.fraseImpacto,item.descricao,item.imagem].some(value => typeof value === 'string' && value.trim()))
    .sort((a,b) => (Number(a.ordem)||0) - (Number(b.ordem)||0));
}

function makeSpecialPage(data, item, index, total){
  const {page,body}=makePage(data,'special-page');
  const wrap=el('article','special-content');
  const kicker=el('div','special-kicker');
  kicker.appendChild(el('span','special-kicker-name','DESTAQUE ESPECIAL'));
  kicker.appendChild(el('span','special-kicker-number',`${String(index+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`));
  wrap.appendChild(kicker);
  wrap.appendChild(el('h2','special-title',item.titulo||'Novidade em destaque'));
  const hero=el('div',`special-hero ${index%2===1?'reverse':''}`);
  const media=el('div','special-media');
  if(typeof item.imagem==='string' && item.imagem.trim()){
    const picture=img(item.imagem,'special-image',item.titulo||'Imagem do destaque');
    picture.onerror=()=>{picture.remove();media.classList.add('special-media-empty');media.appendChild(el('span','special-placeholder','Imagem do destaque'));};
    media.appendChild(picture);
  }else{
    media.classList.add('special-media-empty');
    media.appendChild(el('span','special-placeholder','Adicione a imagem deste destaque no JSON'));
  }
  const message=el('div','special-message');
  if(Array.isArray(item.sistemas) && item.sistemas.length){
    message.appendChild(el('div','special-systems',item.sistemas.join('  •  ')));
  }
  message.appendChild(el('h3','special-impact',item.fraseImpacto||item.titulo||''));
  hero.append(media,message);
  wrap.appendChild(hero);
  if(item.descricao) wrap.appendChild(el('p','special-description',item.descricao));
  body.appendChild(wrap);
  return page;
}

function makeMainHeading(){
  const wrap=el('div','main-heading');
  const icon=el('div','icon-box');
  // const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  // svg.setAttribute('viewBox','0 0 100 100'); svg.classList.add('warning-svg');
  // svg.innerHTML='<path d="M50 7 94 86c3 6-2 10-8 10H14c-6 0-9-5-6-10L43 7c2-4 5-4 7 0Z" fill="none" stroke="#00547D" stroke-width="6"/><path d="M50 31v30" stroke="#00547D" stroke-width="7" stroke-linecap="round"/><circle cx="50" cy="73" r="4" fill="#00547D"/>';
  icon.appendChild(img(`icones/icon_warning.png`));
  const title=el('div','title-box','PRINCIPAIS NOVIDADES');
  wrap.append(icon,title); return wrap;
}

function makeMainTable(items){
  const table=el('table','main-table');
  table.innerHTML='<thead><tr><th>Novidade</th><th>Sistema / Plataforma</th></tr></thead>';
  const tbody=document.createElement('tbody');
  for(const item of items){
    const tr=el('tr','main-row');
    const td1=document.createElement('td'); const nov=el('div','main-nov');
    if(item.icone) nov.appendChild(img(`icones/${item.icone}.png`,'',item.novidade));
    nov.appendChild(el('span','',item.novidade)); td1.appendChild(nov);
    const td2=el('td','',item.sistemaPlataforma);
    tr.append(td1,td2); tbody.appendChild(tr);
  }
  table.appendChild(tbody); return table;
}

function buildMainPage(data){
  const {page,body}=makePage(data,'main-page');
  body.appendChild(makeMainHeading());
  body.appendChild(makeMainTable(data.principaisNovidades||[]));
    
  return page;
}

function makeSystemHeading(system){
  const blue=system.cor==='azul';
  const wrap=el('div',`system-heading ${blue?'blue':''}`);
  const ib=el('div','icon-box'); ib.appendChild(img(`${system.icone}.png`,'',system.nome));
  const tb=el('div','title-box'); tb.appendChild(el('h2','',system.titulo)); tb.appendChild(el('p','',system.subtitulo));
  wrap.append(ib,tb); return wrap;
}

function makeDataTableHeader(){
  const table=el('table','data-table');
  table.innerHTML='<thead><tr><th>Tela</th><th>Novidade</th><th>O que mudou?</th></tr></thead><tbody></tbody>';
  return table;
}

function rowFor(item){
  const tr=el('tr','data-row');
  const td1=document.createElement('td'); const screen=el('div','data-screen');
  if(item.icone) screen.appendChild(img(`icones/${item.icone}.png`,'',item.tela));
  screen.appendChild(el('span','',item.tela)); td1.appendChild(screen);
  tr.appendChild(td1);
  tr.appendChild(el('td','novelty',item.novidade));
  tr.appendChild(el('td','description',item.descricao));
  return tr;
}

function makeSystemPage(data,system,items,pageNo,totalPages,closing){
  const {page,body}=makePage(data,'system-page');
  body.appendChild(makeSystemHeading(system));
  const table=makeDataTableHeader();
  const tbody=table.querySelector('tbody');
  items.forEach(i=>tbody.appendChild(rowFor(i)));
  body.appendChild(table);
  
  if(closing) body.appendChild(makeClosing(data));
  return page;
}

function makeClosing(data){
  const box=el('div','closing');
  const copy=el('div','closing-copy');
  copy.appendChild(el('h2','',data.rodape?.titulo || 'Juntos cultivamos o futuro!'));
  copy.appendChild(el('p','',data.rodape?.descricao || ''));
  box.appendChild(copy); box.appendChild(img('capa/muda.png','', 'Muda'));
  
  return box;
}

function allSystemItems(data){
  return SYSTEM_ORDER.flatMap(id => {
    const sys=data.sistemas?.[id];
    return sys?.solicitacoes?.map(x=>({...x,_system:id}))||[];
  });
}

function paginateSystems(data, systemId, items){

  const system = data.sistemas[systemId];
  const pages = [];

  let index = 0;

  while(index < items.length){

    const { page, body } = makePage(data, 'system-page');

    page.style.position = 'absolute';
    page.style.visibility = 'hidden';
    page.style.left = '-10000px';
    page.style.top = '0';

    document.body.appendChild(page);

    // Cabeçalho do sistema
    body.appendChild(makeSystemHeading(system));

    // Tabela
    const table = makeDataTableHeader();
    const tbody = table.querySelector('tbody');

    body.appendChild(table);

    let rowsOnPage = 0;

    // Limite físico da área de conteúdo
    const pageRect = page.getBoundingClientRect();

    const contentBottom =
      pageRect.bottom - CONFIG.footerReserve;

    while(
      index < items.length //&&
      // rowsOnPage < CONFIG.maxRowsPerPage
    ){

      const row = rowFor(items[index]);

      tbody.appendChild(row);

      // Mede a posição real da linha
      const rowRect = row.getBoundingClientRect();

      // -------------------------------------------------
      // A linha ultrapassou a área permitida?
      // -------------------------------------------------
      if(rowRect.bottom > contentBottom){

        // Remove a linha que não coube
        tbody.removeChild(row);

        // Não avançamos o índice.
        // Essa solicitação será colocada na próxima página.
        break;
      }
      
      index++;
      rowsOnPage++;
    }

    // -------------------------------------------------
    // Caso uma única solicitação seja maior que toda
    // a área disponível, evita loop infinito.
    // -------------------------------------------------
    if(rowsOnPage === 0 && index < items.length){

      const row = rowFor(items[index]);

      tbody.appendChild(row);

      console.warn(
        `A solicitação "${items[index].novidade}" ` +
        `não cabe na área disponível da página.`
      );

      index++;
    }

    // Remove da área de medição
    document.body.removeChild(page);

    // Limpa os estilos temporários
    page.style.position = '';
    page.style.visibility = '';
    page.style.left = '';
    page.style.top = '';

    pages.push(page);
  }

  return pages;
}

function buildDocument(data){
  app.innerHTML='';
  const pages=[];
  pages.push(makeCover(data));
  const specials=validSpecialHighlights(data);
  specials.forEach((item,index)=>pages.push(makeSpecialPage(data,item,index,specials.length)));
  if((data.principaisNovidades||[]).length) pages.push(buildMainPage(data));
  for(const id of SYSTEM_ORDER){
    const sys=data.sistemas?.[id];
    if(!sys || !sys.solicitacoes?.length) continue;
    pages.push(...paginateSystems(data,id,sys.solicitacoes));
  }
  // O bloco final tenta ocupar a última página disponível. Se não houver espaço,
  // recebe uma página própria para não repetir artificialmente uma tabela do sistema.
  // const last=pages[pages.length-1];
  // const lastBody=last.querySelector('.internal-body');
  // if(lastBody && last.classList.contains('system-page')){
  //   const closing=makeClosing(data);
  //   lastBody.appendChild(closing);
  //   if(last.scrollHeight > last.clientHeight){
  //     lastBody.removeChild(closing);
  //     const p=makePage(data,'closing-page');
  //     p.body.appendChild(closing);
  //     pages.push(p.page);
  //   }
  // }
  
  const last = pages[pages.length - 1];
  const lastBody = last?.querySelector('.internal-body');

  if (lastBody && last.classList.contains('system-page')) {
    const closing = makeClosing(data);

    // A página precisa estar no DOM para permitir a medição.
    app.appendChild(last);

    // Insere provisoriamente o closing na última página.
    lastBody.appendChild(closing);

    // Mede a posição real dos elementos.
    const pageRect = last.getBoundingClientRect();
    const closingRect = closing.getBoundingClientRect();

    // Procura o rodapé existente na estrutura da página.
    // Ajuste os seletores conforme as classes reais do projeto.
    const footer = last.querySelector(
      '.footer, .page-footer, .internal-footer, footer'
    );

    // Margem mínima entre o closing e o rodapé.
    const margemSeguranca = 12;

    // Se o rodapé não for encontrado, reserva uma faixa
    // de 75px na parte inferior da folha.
    const limiteInferior = footer
      ? footer.getBoundingClientRect().top
      : pageRect.bottom - 75;

    // Detecta sobreposição ou transbordamento.
    const semEspaco =
      closingRect.bottom + margemSeguranca > limiteInferior ||
      closingRect.bottom > pageRect.bottom;

    if (semEspaco) {
      // Retira o closing da página de solicitações.
      closing.remove();

      // Cria outra página apenas quando necessário.
      const novaPagina = makePage(data, 'closing-page');
      novaPagina.body.appendChild(closing);

      pages.push(novaPagina.page);
    }
  }

  // Remove empty trailing page only if no content.
  const total=pages.length;
  pages.forEach((p,i)=>{
    p.querySelectorAll('.page-no').forEach(n=>{
      const first=n.firstElementChild;
      if(first) first.textContent=`Pág. ${i+1} de ${total}`;
    });
    const coverNo=p.querySelector('.cover-footer .page-no');
    if(coverNo && coverNo.firstElementChild) coverNo.firstElementChild.textContent=`Pág. ${i+1} de ${total}`;
    app.appendChild(p);
  });
  const toolbar=el('div','toolbar');
  const btn=el('button','', 'Imprimir / PDF'); btn.onclick=()=>window.print(); toolbar.appendChild(btn); document.body.appendChild(toolbar);
}

loadData().then(buildDocument).catch(err=>{
  console.error(err); app.innerHTML=`<div class="loading"><strong>Erro ao carregar o informativo.</strong><br>${err.message}<br><br>Abra o projeto por um servidor local (por exemplo: <code>python -m http.server</code>).</div>`;
});
