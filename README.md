# Sistema de Busca e Oferta de Empregos - Frontend

Projeto desenvolvido para a disciplina **Tecnologias Cliente Servidor** do curso **Análise e Desenvolvimento de Sistemas - UTFPR**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ShadcnUI](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff&style=for-the-badge)

## 📋 Sumário

- [📋 Sumário](#-sumário)
- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [📦 Pré-requisitos](#-pré-requisitos)
- [🚀 Executando o Projeto](#-executando-o-projeto)
- [📱 Configuração do Servidor](#-configuração-do-servidor)
- [📝 Licença](#-licença)

---

## 🎯 Sobre o Projeto

Frontend desenvolvido com **Next.js** e **React** para gerenciamento de autenticação e perfil de usuários. O sistema consome a API de backend desenvolvida em Express/Node.js e fornece uma interface intuitiva para cadastro, login, edição de perfil e gerenciamento de conta.

---

## 🚀 Tecnologias Utilizadas

- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- Shadcn/ui
- Zustand
- Zod

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 20 ou superior)
- **npm**, **yarn**, **pnpm**
- **Git**

---

## 🚀 Executando o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/pereirathiago/projeto-empregos-frontend.git

cd projeto-empregos-frontend
```

### 2. Instale as dependências

Escolha seu gerenciador de pacotes:

```bash
# Usando npm
npm install

# Usando yarn
yarn install

# Usando pnpm
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

**Nota:** Substitua `http://localhost:3333` pela URL do seu servidor backend.

### 4. Execute o projeto em desenvolvimento

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev
```

### 5. Acesse a aplicação

Abra seu navegador e acesse:

```
http://localhost:3000
```

---

## 📱 Configuração do Servidor

Ao acessar o aplicativo, você pode configurar o endereço do servidor através do botão **"Servidor"**:

1. Clique no botão **"Servidor"**
2. Digite o endereço do seu backend (ex: `http://localhost:3000`)
3. Clique em **"Salvar alterações"**

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Desenvolvido com 💙 por Thiago Pereira

</div>
