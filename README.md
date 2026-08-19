# Brasa Burger Co. — Homologação Vercel + Supabase

Esta pasta combina o protótipo visual com uma camada funcional de homologação.

## O que passa a funcionar após conectar o Supabase
- Auth de clientes
- Login da equipe
- RBAC: admin, manager, attendant
- Catálogo vindo do PostgreSQL
- Áreas de entrega
- Pedido criado por Edge Function com recálculo server-side
- RLS de clientes e painel
- Kanban lendo pedidos reais
- Status de pedido atualizado pelo admin
- Storage preparado para imagens
- DM Champ preparado para consultar catálogo, entrega, cupom, pedidos e criar pedidos
- Rate limiting básico no banco
- Idempotência na criação de pedido
- Histórico de status e auditoria mínima

## Segurança
A publishable key do Supabase pode ser entregue ao browser porque as tabelas estão protegidas por RLS.
A service role não aparece no frontend.
A criação do pedido não confia em preços enviados pelo cliente.
`create_order_from_server()` recalcula preço, adicionais, cupom, taxa e total dentro do PostgreSQL.

## Modo sem configuração
Se `/api/config` não encontrar variáveis Vercel, o site mantém os dados demonstrativos locais para visualização.

Leia `DEPLOY.md` antes de publicar.
