# Social Sparkle
  - [Introdução](#introdução)
  - [Tecnologias](#tecnologias)
  - [Instruções](#instruções)
  - [Variáveis de ambiente](#variáveis-de-ambiente)
    
## Introdução
Social Sparkle é um chat app desenvolvido com Socket.IO para comunicação em tempo real. Utilizei Next.js para criar um frontend dinâmico e responsivo, garantindo uma experiência de usuário fluida e moderna. Para assegurar a qualidade e a robustez do backend, realizei testes exaustivos com Jest, garantindo um código confiável e de alta performance.

## Tecnologias
<div align="center">
<a href="https://www.typescriptlang.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/typescript-original.svg" alt="TypeScript" height="80" /></a>  
<a href="https://expressjs.com/" target="_blank"><img style="margin: 10px" src="https://vectorified.com/images/express-js-icon-20.png" alt="Express.js" height="80" /></a>  
<a href="https://nextjs.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/nextjs.png" alt="NextJS" height="80" /></a>  
<a href="https://socket.io/" target="_blank"><img style="margin: 10px" src="https://socket.io/images/logo-dark.svg" alt="Socket.IO" height="80" /></a>  
<a href="https://www.jestjs.io/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/jest.svg" alt="Jest" height="80" /></a>  
<a href="https://www.docker.com/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/docker-original-wordmark.svg" alt="Docker" height="80" /></a>  
<a href="https://nodejs.org/" target="_blank"><img style="margin: 10px" src="https://profilinator.rishav.dev/skills-assets/nodejs-original-wordmark.svg" alt="Node.js" height="80" /></a>  
</div>

## Instruções
1. Clone o repositório
2. Crie um arquivo `.env` no frontend e no backend e dê um valor válido para as variáveis listadas em `.env.example` de acordo com a [tabela](#variáveis-de-ambiente)
3. Instale as dependências localmente ou construa e rode a imagem do projeto no Docker-compose
   - Caso utilize o Docker para rodar a aplicação, ao executar o build da imagem, passe como argumento o SOCKET_URL, que será usado pelo frontend como variável de ambiente para se conectar ao backend
   
     <strong>Exemplo: `docker-compose build --build-arg SOCKET_URL=localhost:3001`</strong>

## Variáveis de ambiente
### Frontend
| Variável               |  Descrição               |
|------------------------|--------------------------|
|`NEXT_PUBLIC_SOCKET_URL`      |URL do servidor da aplicação, passada como `build-arg` na construção da imagem com Docker ou então colocada no `.env` caso o chat seja inicializado com módulos instalados localmente|
### Backend
| Variável               |  Descrição               |
|------------------------|--------------------------|
|`NODE_ENV`      |Ambiente no qual o projeto é iniciado, podendo ter um valor `development` ou `production`|
|`CORS_URL`  |URL do frontend para permitir acesso via CORS, podendo ter um valor `*` para permitir acesso de qualquer origem, para fins de testagem|
|`PORT`            |Porta na qual o backend é iniciado|
