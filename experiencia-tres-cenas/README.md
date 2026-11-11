# ÉLAN — Ensaio de direção, 3 cenas

**Status: protótipo visual não homologado.** Não substituir o master por esta versão.

## Sequência
1. Hero original: HTML, CSS, JavaScript de abertura e assets copiados sem alteração de `ELAN_MASTER_FINAL`.
2. Filosofia: H12 (revelação no scroll) mantém o `home-approved.js` e `home-approved.css` do master.
3. Tratamentos: **nova proposta isolada**. Uma fotografia da Filosofia expande em direção a tela cheia e faixas fotográficas revelam o primeiro tratamento; na cena final, setas navegam os outros tratamentos.

## Proveniência técnica
- `home-approved.js`, `home-approved.css`, `shared.css` e `assets/` copiados do master.
- `home.js` é uma implementação própria de estudo para H23 e controles. Usa helpers presentes no master e movimentos inspirados na curadoria.
- **Não é port fiel do código do Codrops C09/C14/C21**. Não confundir fidelidade ao repertório com reprodução exata desses demos.
- O protótipo NÃO afirma utilizar todas as sete famílias aprovadas. Essa avaliação fica para a expansão posterior, se a direção visual for aceita.
- Conteúdos de tratamentos e imagens são demonstrativos, como no master.

## QA
- Chrome/Playwright: 1440, 390 e 320 px. Progressão de scroll em oito posições, ausência de erros JavaScript, recursos 4xx e overflow horizontal; botões da terceira cena chegam ao tratamento 02.
- `prefers-reduced-motion:reduce`: 1440 e 390 px sem erros e com três cenas acessíveis em modo linear.
- Capturas de validação em arquivos locais, não incluídas no site público.
- A aprovação visual final depende de navegar no link publicado, verificar motion percebido e comparar direção com referências.

## Fonte intocada
`C:\Users\marco\Documents\ChatGPT\New project 3\ELAN_MASTER_FINAL`.
