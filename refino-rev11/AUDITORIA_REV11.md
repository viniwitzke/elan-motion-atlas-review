# ÉLAN — Revisão de qualidade REV11 (11/11/2026)

**Status: estudos experimentais, NÃO homologados.** O master aprovado `ELAN_MASTER_FINAL`, a Landing e a História não foram modificados.

## Fontes e critérios
- Referência de identidade: master ÉLAN, paleta floresta/marfim, tipografia editorial e navegação aprovada.
- Skills locais consultadas: Impeccable 4.7 (context, craft-floor, polish, typeset, critique), humanizer 3.1, copy-editing 2.2 e review-animations.
- Cenários: desktop 1440×850; mobile 390×850 e 320×850.
- Motion original: não reescrito; as provas históricas originais seguem em `/aprovadas-historico/`.

## Diagnóstico
| Experiência | Problema | Intervenção REV11 | Pendente |
|---|---|---|---|
| Layout Formation (master) | Descrições e nomes demonstrativos em cards; links sem WhatsApp configurado | Nenhuma alteração (homologada) | Substituição somente após conteúdo real fornecido |
| Cinematic V3 | Predominância marrom, marca NPE, mensagem interna no fim, transparência e numerais decorativos pesados | Paleta verde/marfim, marca ÉLAN, copy enxutada, painéis mais sóbrios, escala e microtipo | Foto de cliente, aprovação artística, testar interação em Safari |
| Unreveal Circle/Strip | Branding NPE Factory, h1 em clichê, copy genérica, numerais gigantes, micro-rótulos | Identidade ÉLAN, h1 conciso, paleta ajustada, legibilidade e detalhe mais contido | Foto real, catálogo confirmado, revisar performance da máscara Strip |

## Verificação funcional
- Cinematic V3: scroll altera a progressão horizontal, sem erro de JavaScript nas três larguras; sem overflow horizontal.
- Unreveal: abertura e fechamento do detalhe com alteração ARIA correta nas três larguras; sem erro de JavaScript ou overflow.
- Detector Impeccable: encontrou alertas de tamanho de microtexto, aparência editorial e espaçamento. Ajustes adicionais de tipo/padding foram realizados após o scan; o arquivo de diagnóstico local permanece como registro da rodada.
- Fotografias e procedimentos permanecem ilustrativos. Não afirmar que serviços médicos são prestados pelo cliente.
- Não há aprovação artística automática por passar no QA técnico.

## Próximos passos antes da homologação
1. Revisão visual das provas com o usuário, comparando as versões históricas e REV11.
2. Verificar a experiência completa durante o scroll e abertura/fechamento de detalhes no dispositivo real.
3. Fazer ajustes finos de enquadramento, legibilidade e acessibilidade; revalidar em Chrome, Firefox e Safari quando possível.
4. Integrar a escolhida ao clone do master somente após aprovação artística e fornecimento das fotografias e serviços.
