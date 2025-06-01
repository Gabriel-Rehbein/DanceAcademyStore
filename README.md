Trabalho de API'S - Análise e Desenvolvimento de Sistemas 
Integrantes: Bruna Azevedo e Gabriel Rehbein

TEMA: Sistema de Registro de Vendas Dance Academy Store

Introdução: 

Esse sistema vai conter o registro dos produtos e vendas da loja de ballet.

2 CRUD’s: 

1 - Produtos
2 - Vendas
 

Problema:

Atualmente uma escola de dança inaugurou uma lojinha em sua sede e não possui um sistema para registrar seus produtos causando um grande desgaste aos seus funcionários, por isso houve a necessidade de criar um sistema para sua nova loja.
	
Objetivos:

Esse sistema tem como objetivo registrar os produtos e vendas da loja de dança.

Solução:

	A solução encontrada é criar um sistema que administre melhor as demandas da loja da Dance Academy.
	Funcionalidade do CRUD de Produto: Registrar o produto, atualizar os dados do produto, apagar produto e buscar os produtos no sistema da loja.
	
Funcionalidade do CRUD dos venda: Registrar os dados das vendas, buscar as vendas no sistema, atualizar dados das vendas (idvenda), deletar venda (cancelando) do sistema.


--------------------------------------------------------------------------------------------------------------------------

--> Instalar Modulos

npm install express

--> Rodar o Servidor (no terminal):

node app.js

----> Servidor rodando em: http://localhost:3000



--------------------------------------------------------------------------------------------------------------------------
npm install --save-dev jest supertest

"scripts": {
  "test": "jest"
}

Rodar testes:

npm test

