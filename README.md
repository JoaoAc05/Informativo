# Informativo RuralHub — gerador WEB/ PDF

Base do informativo quinzenal reconstruída a partir do PDF fornecido.

## Estrutura

- `index.html` — página principal.
- `css/informativo.css` — identidade visual, impressão e paginação.
- `js/informativo.js` — leitura do JSON, ordenação dos sistemas e paginação dinâmica.
- `dados/informativo.json` — único arquivo que deve ser atualizado a cada edição.
- `assets/` — imagens e fontes utilizadas no layout.

## Sistemas

A ordem é fixa no JavaScript:

1. RuralFinance
2. RuralTransportes
3. SiloVirtual

Sistemas sem solicitações não são renderizados.

## Como gerar o PDF

A página usa mídia de impressão e `@page` para preservar o formato físico do documento. O navegador deve ser configurado para:

- papel/tamanho: padrão definido pelo documento;
- margens: nenhuma;
- escala: 100%;
- gráficos de fundo: ativados.

Na própria página há o botão **Imprimir / PDF**.

## Executar localmente

Como o JSON é carregado por `fetch`, abra o projeto através de um servidor HTTP local, não diretamente pelo `file://`.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000
```

## JSON

O conteúdo pode ser alterado em `dados/informativo.json`. O layout não precisa ser modificado para trocar data, novidades ou solicitações.
