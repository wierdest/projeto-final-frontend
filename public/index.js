// itens vai ser um array de objetos
// {produto, quantidade}
let itensDoCarrinho = [];
// produto vai ser um objeto
// descricao, preco, linkImagem

if(document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", conferirLocalStorage);
} 

function conferirLocalStorage() {
    console.log("CONFERINDO LOCAL STORAGE")
    let carrinho = localStorage.getItem('carrinho-funko');
    if(carrinho != null) {
        itensDoCarrinho =  JSON.parse(carrinho);
        console.table(itensDoCarrinho);
        let tabelaDoCarrinho = document.querySelector(".tabela-carrinho tbody");

        reconstruirCarrinho(tabelaDoCarrinho);
    }
}

function adicionarAoCarrinho(botao) {
    console.log("ADICIONANDO AO CARRINHO!");
    // Primeira coisa é acessar o carrinho
    let tabelaDoCarrinho = document.querySelector(".tabela-carrinho tbody");

    if(tabelaDoCarrinho === null) {
        const modalBody = document.querySelector(".modal-body");
        modalBody.innerHTML = "";
        const htmlDaTabela = 
        `
            <table class="tabela-carrinho table">
                <thead class="sticky-top">
                <tr>
                    <th scope="col"> </th>
                    <th scope="col">Item</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Quantidade</th>
                </tr>
                </thead>
                <tbody id="carrinho-corpo">
                </tbody>
            </table>
        `
        modalBody.innerHTML = htmlDaTabela;

        const modalFooter = document.querySelector(".modal-footer");
        const htmlDoFooter = 
        `
            <div class="modal-footer">
                <p>Total: <strong id="valor-total"></strong></p>
                <div class="flex-group"></div>
                <a href="check-out.html"> <button type="submit" class="btn btn-danger">Finalizar pedido</button> </a>
            </div>
        `
        modalFooter.innerHTML = htmlDoFooter;

        tabelaDoCarrinho = document.querySelector(".tabela-carrinho tbody");
    }

    // query selector retorna o primeiro elemento no grupo que tem o selector (a classe css)
    // passado no argumento
    // cardBody é o parent do botão
    const cardBody = botao.parentElement;

    const h5 = cardBody.querySelector(".card-title");

    const descricao = h5.innerText;

    // testa se o item tá no carrinho
    const itemNoCarrinho = itensDoCarrinho.find(item => item.produto.descricao === descricao);

    if(itemNoCarrinho != undefined) {
        itemNoCarrinho.quantidade++;
        reconstruirCarrinho(tabelaDoCarrinho, itemNoCarrinho)

        return;
    }

     // cardDoFunko é o card externo (precisamos pra pegar a imagem)
    // o avô do botão
    const cardDoFunko = cardBody.parentElement;

    const cardDaImagem = cardDoFunko.querySelector(".card-img-container")

    const p = cardBody.querySelector(".card-text");
 
    const stringPreco = p.innerText.replace("Preço: R$ ", "");

    const img = cardDaImagem.querySelector(".card-img-top");

    const linkImagem = img.getAttribute("src");

    const produtoASerAdicionado = {
        descricao : descricao,
        stringPreco: stringPreco,
        linkImagem: linkImagem
    }

    const quantidade = 1;

    const itemASerAdicionado = {
        produto: produtoASerAdicionado,
        quantidade: quantidade
    }

    itensDoCarrinho.push(itemASerAdicionado);

    console.log("ADICIONANDO O PRODUTO: ")
    console.log(descricao);
    console.log(stringPreco);
    console.log(linkImagem);

    console.log("CONFERINDO O CARRINHO: ")
    console.table(itensDoCarrinho);


    // atualiza o carrinho com todos os itens do array
    const htmlDoItem = `
        <tr>
        <th scope="row"><img style="max-width: 80px;" src="${linkImagem}" alt=""></th>
        <td class="descricaoItem">${descricao}</td>
        <td >R$ ${stringPreco} </td>
        <td>
            <div class="input-group mb-3">
                <input  onchange="atualizarQuantidade(this)" type="number" value="${itemASerAdicionado.quantidade}" min="0" class="form-control product-qtd-button" placeholder="">
                <button onclick="removerProduto(this)" class="btn btn-outline-danger remove-product-button" type="button" id="button-addon2">Remover</button>
            </div>
        </td>
    </tr>
    `
    tabelaDoCarrinho.innerHTML += htmlDoItem;

    atualizarTotal();
    salvarLocalStorage();
}

function calcularTotal() {
    let total = 0;
    itensDoCarrinho.forEach(item => {
        let preco = item.produto.stringPreco.replace(",", ".");
        total += preco * item.quantidade;
    });
    // usa o toFixed para os decimais
    return total.toFixed(2);
}

function reconstruirCarrinho(tabelaDoCarrinho) {
    console.log("RECONSTRUIR O CARRINHO TODO");
    // remove os elementos do carrinho
    tabelaDoCarrinho.innerHTML = "";
    itensDoCarrinho.forEach(item => {

            const htmlDoItem = `
            <tr>
            <th scope="row"><img style="max-width: 80px;" src="${item.produto.linkImagem}" alt=""></th>
            <td class="descricaoItem">${item.produto.descricao}</td>
            <td >R$ ${item.produto.stringPreco} </td>
            <td>
                <div class="input-group mb-3">
                    <input  onchange="atualizarQuantidade(this)" type="number" value="${item.quantidade}" min="0" class="form-control product-qtd-button" placeholder="">
                    <button onclick="removerProduto(this)" class="btn btn-outline-danger remove-product-button" type="button" id="button-addon2">Remover</button>
                </div>
            </td>
        </tr>
        `
        tabelaDoCarrinho.innerHTML += htmlDoItem;
    });
    atualizarTotal();
    salvarLocalStorage();
    return;
    
}

function atualizarQuantidade(quantidadeInput) {
    const tabelaDoCarrinho = document.querySelector(".tabela-carrinho tbody");
    const novaQuantidade = quantidadeInput.value;
    if(novaQuantidade === "0") {
        console.log("REMOVENDO O PRODUTO, QTD É 0");
        removerProduto(quantidadeInput)
        return;
    }
    const item = quantidadeInput.parentElement.parentElement.parentElement;
    const descricao = item.querySelector(".descricaoItem").innerText;
    const itemNoCarrinho = itensDoCarrinho.find(item => item.produto.descricao === descricao);
    itemNoCarrinho.quantidade = novaQuantidade;
    reconstruirCarrinho(tabelaDoCarrinho)
}

function removerProduto(elemento) {
    const item =  elemento.parentElement.parentElement.parentElement;
    const descricaoItem = item.querySelector(".descricaoItem");
    console.log("REMOVENDO PRODUTO")
    console.log(descricaoItem.innerText);
    removerItem(descricaoItem);
    item.remove();

    if(itensDoCarrinho.length === 0) {
        mostrarCarrinhoVazio();
        salvarLocalStorage();
        return;

    }


    atualizarTotal();
    salvarLocalStorage();
}

function removerItem(descricaoItem) {
    itensDoCarrinho = itensDoCarrinho.filter(item => item.produto.descricao != descricaoItem.innerText)
    console.log("ITENS APOS REMOCAO")
    console.table(itensDoCarrinho);
}

function atualizarTotal() {
    let total = calcularTotal();
    console.log("ESSE é o TOTAL DO PEDIDO NO CARRINHO");
    console.log(total);
    const totalCarrinho = document.getElementById("valor-total");
    let totalString = "R$ " + total.replace(".", ",");
    totalCarrinho.innerText = totalString;
}

function mostrarCarrinhoVazio() {
    if(itensDoCarrinho.length === 0) {

        const modalBody = document.querySelector(".modal-body");

        modalBody.innerHTML = "";
        const carrinhoVazioBodyHtml = 
        `
            <div id="corpo-carrinho-vazio" class="modal-body" style="min-height: 300px;">
                <div class="row align-items-center justify-content-center">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Seu carrinho está vazio.</h1>
                    <img style="width: 100px; margin-top: 20%;" src="imagens/icones/carrinho-vazio.png" alt="">
                    <span>Adicione produtos e tenha frete grátis</span>
                </div>
            </div>
        `
        modalBody.innerHTML = carrinhoVazioBodyHtml;

        const modalFooter = document.querySelector(".modal-footer");
        
        const carrinhoVazioFooterHtml = 
        `
            <div class="align-items-center justify-content-center">
                <a id="link-carrinho-vazio" href="#section-funkos" style="display:hidden"></a>
                <button data-bs-dismiss="modal" onclick="esconderCarrinhoVazio()" type="submit" class="btn btn-info">Conferir produtos</button>
            </div>
        `
        modalFooter.innerHTML = carrinhoVazioFooterHtml; 
    }
}

function esconderCarrinhoVazio() {
    setTimeout(function() {
        document.getElementById("link-carrinho-vazio").click();
    }, 399); 
}

function salvarLocalStorage() {
    const carrinho = JSON.stringify(itensDoCarrinho);
    localStorage.setItem('carrinho-funko', carrinho);
}




