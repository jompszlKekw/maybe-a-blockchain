# Maybe a BlockChain?

<p>( Tenho menos de 1 ano de js, então este projeto é basicamente coisa da minha mente e não nada que foi copiado )</p>

## Table of contents
* [Descrição / Notas](#Descrição)
* [Como o projeto funciona](#Como-o-projeto-funciona)
* [Instalação](#Instalação)
* [Tecnologias](#Tecnologias)
* [Funcionalidades](#Funcionalidades)

## Descrição
 <p>O projeto era para tentar replicar uma "BlockChain", tipo o BitCoin, mas eu fiz meio diferente, adicionando umas coisas e fazendo outras coisas diferentes</p>
 <p>O arquivo "currencyValueUpdate.ts", na pasta config, da branch "attempt-went-that-wrong" foi um experimento tipo o arquivo "autoPaymentOfSalary.ts", mas deu errado, vou refatorar ele a qualquer hora, então esta funcionalidade não está funcionando ainda</p>
 
## Como o projeto funciona
  <p>Pessoas podem criar moedas, essas moedas pode ter um objetivo unico para ser gasta, ex: "comprar comida", e essa moeda pode comprar somente produtos que contem o mesmo objetivo. Usuarios podem comprar moedas tambem. Podem fazer transações com moedas e sem ser com moeda</p>
  <p>Empresas podem contratar, podem fazer tasks para seus funcionarios e pagar com moedas, podem fazer produtos, o pagamento é depositado automaticamente quando a aplicação estiver sendo inicializada e se estiver no dia certo e elas podem fazer moedas tambem</p>
 
## Instalação
1. Clone o repositório
``` 
$ git clone https://github.com/jompszlKekw/maybe-a-blockchain.git
```
2. Instale as dependências
```
yarn ou npm install
```
3. Crie um arquivo .env para guardar a URL do banco MongoDB e a chave do JWT
```
MONGODBURL=SUA-URL
TOKEN_SECRET=SUA-CHAVE
```

## Tecnologias
  - Node.js version - v14.17.4
  - TypesScript version - v4.5.2
  - ExpressJs version - v4.17.1
  - Jest version - v27.4.3

## Funcionalidades
 ##### (Vou adicionando mais funcionalidade quando tiver ideias)
  - Peoples
    - [x] criação de moedas
    - [x] comprar moedas
    - [x] mandar dinheiro seja com moedas ou sem moedas
    - [x] comprar produtos
  - Enterprise
    - [x] criação de moedas
    - [x] criação de produtos
    - [x] contratação de funcionarios
    - [x] pagamento de moedas por tasks feitas
    - [x] pagamento automatico
  - in the future
    - [x] tests (parcialmente)
    - [] mineração de novas moedas
    
 
<h6 align="center" >🚧 projeto ainda em produção... 🚧</h6>
