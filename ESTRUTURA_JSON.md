# Estrutura do JSON

O arquivo `dados/informativo.json` é a fonte de conteúdo do informativo.

## 1. `data`

Data da edição. O sistema transforma `2026-09-01` em `Setembro de 2026` nos pontos em que a data aparece.

## 2. `capa`

Conteúdo da capa. O layout da capa é fixo; os textos desta seção são os campos que podem ser alterados sem editar o HTML.

## 3. `principaisNovidades`

Array das novidades gerais. Cada objeto contém:

- `icone`: nome do arquivo dentro de `assets/icones/`;
- `novidade`: texto da primeira coluna;
- `sistemaPlataforma`: texto da segunda coluna.

## 4. `sistemas`

Os três IDs são fixos e a ordem de apresentação também é fixa:

`RuralFinance` → `RuralTransportes` → `SiloVirtual`.

A propriedade `solicitacoes` determina se o sistema aparece. Array vazio = sistema não aparece.

Cada solicitação possui:

- `icone` — arquivo dentro de `assets/icones/`;
- `tela` — nome da tela/módulo;
- `novidade` — resumo da alteração;
- `descricao` — explicação do que foi implementado.

## 5. `rodape`

Texto final. É renderizado uma única vez depois da última solicitação.

## Exemplo mínimo

```json
{
  "data": "2026-10-01",
  "capa": {
    "titulo": "Informativo de modificações",
    "descricao": "...",
    "destaques": []
  },
  "principaisNovidades": [],
  "sistemas": {
    "RuralFinance": {"titulo":"FINANÇAS","subtitulo":"...","icone":"icones/financas_section.png","cor":"verde","solicitacoes":[]},
    "RuralTransportes": {"titulo":"TRANSPORTES","subtitulo":"...","icone":"icones/transportes_section.png","cor":"azul","solicitacoes":[]},
    "SiloVirtual": {"titulo":"ARMAZÉM","subtitulo":"...","icone":"icones/armazem_section.png","cor":"azul","solicitacoes":[]}
  },
  "rodape": {"titulo":"Juntos cultivamos o futuro!","descricao":"..."}
}
```
