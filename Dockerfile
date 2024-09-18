# Etapa 1: Build da aplicação
FROM node:20.15.0 AS build

# Diretório de trabalho
WORKDIR /opt/nei-almoxarifado-web

COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código fonte
COPY . .

# Gera o build de produção
RUN npm run build

# Etapa 2: Configuração para rodar a aplicação em produção
FROM node:20.15.0

# Diretório de trabalho
WORKDIR /opt/nei-almoxarifado-web

# Copia os arquivos do build para o container final
COPY --from=build /opt/nei-almoxarifado-web ./

# Instala as dependências de produção
RUN npm install --omit=dev

# Expõe a porta padrão do Nuxt (3000)
EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3000
# Comando para rodar a aplicação
CMD ["npm", "run", "start"]
