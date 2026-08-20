# Atualização Brasa Burger — como commitar

Branch: `codex/sincronizar-site-2026-08-20`

## 1. Adicionar arquivos na RAIZ do repo
- `logo.png`  (baixado do chat)
- `menu-mobile.css`  (deste pacote)

## 2. index.html — 2 edições

### a) Carregar o novo CSS (no <head>, DEPOIS do hero-refresh.css)
Logo abaixo desta linha:
```html
<link rel="stylesheet" href="hero-refresh.css?v=15">
```
adicione:
```html
<link rel="stylesheet" href="menu-mobile.css">
```

### b) Trocar a logo do header
Troque este bloco:
```html
<a class="brand" href="#inicio"><span class="brand-mark"><span>🍔</span></span><span class="brand-text"><strong><em>BRASA</em> BURGER</strong><small>FOGO. SABOR. REPETE.</small></span></a>
```
por:
```html
<a class="brand" href="#inicio"><img src="/logo.png" alt="Brasa Burger — Fogo. Sabor. Repete." style="height:52px;width:auto;display:block"></a>
```
> Obs.: existe um segundo `<a class="brand">` no rodapé — NÃO precisa trocar (a menos que queira a logo lá também).

## 3. Commit
```
git add logo.png menu-mobile.css index.html
git commit -m "Loja mobile: logo, cardapio 2 colunas, CTA pulsante"
git push
```

## Não incluso
- Fumaça em GIF: seu repo já tem fumaça própria no hero (smoke-motion). O smoke.gif foi só teste no preview. Peça se quiser trocar.
