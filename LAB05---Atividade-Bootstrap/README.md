LABXX - HTML, CSS e JavaScript – Sistema Web de Controle de Cinema (Bootstrap)
📋 Objetivo

Desenvolver uma aplicação web simples para cadastrar, listar e interligar dados de um cinema: Filmes, Salas, Sessões e Vendas de Ingressos, utilizando HTML + CSS + JavaScript (puro) com Bootstrap 5 e armazenamento local via localStorage.

🧠 Conceitos utilizados

Manipulação de DOM (criação/remoção de elementos, querySelector, addEventListener)

localStorage (salvando/recuperando arrays de objetos em JSON)

Criação dinâmica de <option> em <select>

Organização de formulários HTML e validação básica (required, min, step)

Encadeamento de entidades (sessão referencia filme e sala)

Navegação multi-página com links e Navbar do Bootstrap

Estilização responsiva com Bootstrap 5 (CDN)

⚙️ Funcionalidades

Filmes

Cadastro: título, descrição, gênero, classificação, duração, estreia

Listagem em tabela

Salas

Cadastro: nome, capacidade, tipo (2D, 3D, IMAX)

Listagem em tabela

Sessões

Cadastro: seleciona Filme e Sala do localStorage, define data/hora, preço, idioma e formato

Listagem em tabela com dados combinados (filme + sala)

Vendas de Ingressos

Seleção de sessão, dados do cliente (nome, CPF), assento e pagamento (Cartão/Pix/Dinheiro)

Registro em localStorage e confirmação

Listagem de Sessões Disponíveis

Tabela com filme, sala, data/hora e preço

Botão Comprar que leva para “Venda de Ingressos” já com a sessão selecionada

🗂️ Estrutura de Pastas
seu-projeto/
├─ docker-compose.yml
├─ nginx.conf
└─ site/
   ├─ index.html
   ├─ cadastro-filmes.html
   ├─ cadastro-salas.html
   ├─ cadastro-sessoes.html
   ├─ sessoes.html
   ├─ venda-ingressos.html
   └─ js/
      └─ app.js

🚀 Execução (sem Docker)

Basta abrir site/index.html no navegador.

Observação: os dados ficam no localStorage da origem aberta (ex.: file:// ou http://localhost:8084).

🐳 Execução com Docker + Nginx

Certifique-se de que a estrutura acima está exatamente como mostrado.

Suba os serviços:

docker compose up -d


Acesse em: http://localhost:8084

Arquivos de infraestrutura

docker-compose.yml

services:
  web:
    image: nginx:alpine
    container_name: cinema_web
    ports:
      - "8084:80"
    volumes:
      - ./site:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped


nginx.conf

server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / { try_files $uri $uri/ /index.html; }

  location ~* \.(?:css|js|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800";
    try_files $uri =404;
  }

  gzip on;
  gzip_types text/plain text/css application/javascript application/json image/svg+xml;

  location = /healthz { return 200 'ok'; add_header Content-Type text/plain; }
}

🧪 Como testar rapidamente

Cadastre 1 filme e 1 sala.

Cadastre 1 sessão escolhendo o filme e a sala.

Abra Listar Sessões e clique Comprar.

Em Vender Ingresso, confirme a venda.

Verifique no Console:

JSON.parse(localStorage.getItem('ingressos') || '[]')

🧑‍💻 Autor

Wellington Felipe
PUC Goiás – Ciência da Computação