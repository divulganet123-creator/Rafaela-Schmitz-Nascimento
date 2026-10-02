# Codex — Estudo Textual Bíblico

Versão independente do Lovable e do Anthropic/Claude no navegador.

## IA

O navegador chama `/api/ask`. A função serverless chama a OpenAI Responses API. A chave nunca é enviada ao navegador.

## Variáveis de ambiente

- `OPENAI_API_KEY` — obrigatória
- `OPENAI_MODEL` — opcional; padrão: `gpt-6-sol`

## Publicação

Conecte o repositório à Vercel e configure `OPENAI_API_KEY` em Environment Variables.
