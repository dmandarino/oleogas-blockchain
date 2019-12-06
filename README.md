# Trabalho 2 de INF1305 (Tópicos em Computação II - Blockchain)

## Alunos

- Barbara Herrera **[@barbara-herrera](https://github.com/barbara-herrera)**
- Daniela Brazão Maksoud **[@danielamaksoud](https://github.com/danielamaksoud)**
- Douglas Mandarino **[@dmandarino](https://github.com/dmandarino)**
- Stephanie Fay **[@stephaniefay](https://github.com/stephaniefay)**

## Professores

- Gustavo Robichez de Carvalho
- Rafael Nasser

## Arquivos

| Nome do Arquivo | Descrição |
| ------------- | ------------- |
| Upstream.sol  | Smart contract. |
| index.html | Dashboard.  |
| investments.html | Investments page.  |
| spendings.html | Investment allocation page.  |
| app_index.js | Dashboard JS.  |
| app_investments.js | Investments JS.  |
| app_spendings.js | Allocations JS.  |

## Recursos Utilizados

- **[Remix Ethereum IDE](https://remix.ethereum.org/)**
- **[web3.js](https://web3js.readthedocs.io/)**
- **[How To Build Ethereum Dapp (Decentralized Application Development Tutorial)](https://www.youtube.com/watch?v=3681ZYbDSSk&feature=youtu.be)**
- **[Homebrew](https://brew.sh/index_pt-br)**
- **[Node.js](https://nodejs.org/en/)**
- **[Truffle Suite](https://www.trufflesuite.com/)**
- **[Google Chrome](https://www.google.com/intl/pt-BR/chrome/)**
- **[MetaMask](https://metamask.io/)**
- **[Sublime Text](https://www.sublimetext.com/)**

## Instalação de dependências
> npm install

## Rebuild do Contrato e Testes
> truffle migrate --reset

> truffle test

## Execução das páginas
> npm run dev

## Console truffle e funções convenientes
> truffle console

> Upstream.deployed().then(function (instance) { app = instance })

> web3.eth.getAccounts().then(function (account) { acc = account[0] })

> app.function(parameters, { from: acc })
