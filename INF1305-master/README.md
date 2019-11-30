# INF1305 - Tópicos em Computação (Blockchain)

## Trabalho 1

Contrato inteligente para a armazenagem de aluguéis pagos. Referente a imóveis e pagadores.
>		uint id;
>		string name;
>		uint value_paid;
>		uint last_payment_month;
>		uint last_payment_year;
>		address last_payment_owner;

Ferramentas utilizadas:
- Sublime Text 3
- Ganache (Windows)
- MetaMask (Extention for Chrome)
- Node.js
- Mocha.js (Framework for testing)
- Chai.js (Framework for testing)
- Truffle

Para a execução do trabalho
> npm install

> npm run dev

Para o deploy em prompt usando Truffle
> truffle migrate --reset

> truffle console

Visualização do deploy via Truffle
> Property.deployed().then(function (instance) { app = instance })

> web3.eth.getAccounts().then(function (account) { acc = account[0] })

> app.payment(id, amount, month, year, { from: acc })
