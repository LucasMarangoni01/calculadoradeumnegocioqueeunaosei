
let numeros = [];
let media = 0
let desvio = 0
let variancia = 0
let coef_var = 0
let nome_do_analista = ""
let titulo_analise_teste = ""
const btnPDF = document.getElementById("btnPDF")
btnPDF.addEventListener("click",gerarPDF)


// NAVEGAÇÃO
function irPara(tela) {
  document.getElementById("menu").style.display = "none";
  document.getElementById("dados").style.display = "none";
  document.getElementById("resultado").style.display = "none";
  
  document.getElementById(tela).style.display = "block";
}

//MONTAR / ATUALIZAR LISTA DE VALORES
function atualizarLista() {
  let lista = document.getElementById("lista");

  // limpa tudo
  lista.innerHTML = "";

  // recria baseado no array
  numeros.forEach((num, index) => {
    let li = document.createElement("li");
    
    li.textContent = num;
    li.id = `item-${index}`;
    
    // opcional: clicar remove
    li.onclick = () => removerItem(index);
    
    lista.appendChild(li);
  });
}
function apagarValor(index){
  numeros.splice(index, 1); // remove do array
  atualizarLista(); // redesenha tudo
  
}

// ADICIONAR VALORES
function adicionarNumero() {
  let input = document.getElementById("numero");
  let numero = parseFloat(input.value);

  // validação
  if (isNaN(numero)) {
    alert("Digite um número válido!");
    return;
  }
  numeros.push(numero);
  input.value = "";
  input.focus();

  console.log(numeros);

  atualizarLista();
}
// CALCULAR TUDO
function calcularTudo() {
  if(numeros.length > 0){
    const inputNome = document.getElementById("nome_do_analista").value
    nome_do_analista = inputNome
    titulo_analise_teste = document.getElementById("titulo_analise_teste").value
    //VALOR DE REFERÊNCIA
    let valor_ref_input = document.getElementById("valor_ref").value;
  
        var valor_ref = parseFloat(valor_ref_input).toFixed(2);
    
    let resposta = document.getElementById("resposta");
  
    // MÉDIA
    let soma = numeros.reduce((a, b) => a + b, 0);
    media = soma / numeros.length ;
    media = media.toFixed(2)
  
  
    // DESVIO PADRÃO
      variancia =
      numeros.reduce((acc, num) => acc + Math.pow(num - media, 2), 0) /
      (numeros.length -1);
  
    desvio = Math.sqrt(variancia);
    desvio = desvio.toFixed(2)
    coef_var = (desvio/media)*100
    coef_var = coef_var.toFixed(2)
  
    //ERRO
     let erro_abs = media-valor_ref_input
     erro_abs = parseFloat(erro_abs).toFixed(2) 
  
  
    //ERRO RELATIVO
    let erro_relat = (erro_abs/media)*100
    erro_relat = parseFloat(erro_relat).toFixed(2)
    
    // RESULTADo 
    if(valor_ref != ""&& valor_ref_input !=""){
      resposta.innerHTML = `
      Valor de Referência: ${valor_ref.replace('.',',')}<br><br>
      Média: ${media.replace('.',',')} <br>
      Desvio Padrão: ${desvio.replace('.',',')}<br>
      Coeficiente de Variância: ${coef_var.replace('.',',')}%<br>
      Variancia: ${variancia}<br>
      Erro Absoluto: ${erro_abs}<br>
      Erro Relativo: ${erro_relat}%
    
      `
      }else
        resposta.innerHTML = `
      Valor de Referência: Não há valor de referência. <br><br>
      Média: ${media.replace('.',',')}. <br>
      Desvio Padrão: ${desvio.replace('.',',')}.<br>
      Variancia: ${variancia}<br>
      Coeficiente de Variância: ${coef_var.replace('.',',')}%.<br>
      
      `
    irPara("resultado");
  }else alert("Insira os valores")
}

// LIMPAR
function limparTudo() {
  numeros = [];
  document.getElementById("lista").innerHTML = "";
  document.getElementById("resposta").innerHTML = "";
  erro_abs = ""
  erro_relat = ""
  valor_ref = ""
  valor_ref_input = ""
  irPara("menu");
}

 function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  
  let lista = numeros.join(", "); 
  let mediaCalc = media;
  let coef_Varian = coef_var;
  let desvioCalc = desvio;

  // Título
  // Título
doc.setFont("helvetica", "bold");
doc.setFontSize(18);
doc.text("Relatório de Cálculos", 20, 20);

// Linha separadora (horizontal correta)
doc.setLineWidth(0.5);
doc.line(20, 25, 190, 25);

// Informações iniciais
doc.setFontSize(12);
doc.setFont("helvetica", "normal");

doc.text("Título da Análise: " + titulo_analise_teste, 20, 35);
doc.text("Data: " + new Date().toLocaleString(), 20, 42);
doc.text("Analista: " + nome_do_analista, 20, 49);

// Números
doc.setFont("helvetica", "bold");
doc.text("Números inseridos:", 20, 60);

doc.setFont("helvetica", "normal");

// Quebra automática de linha pra lista
const listaFormatada = doc.splitTextToSize(lista, 170);
doc.text(listaFormatada, 20, 68);

// Calcula próxima posição dinâmica
let y = 68 + (listaFormatada.length * 7);

// Resultados
doc.setFont("helvetica", "bold");
doc.text("Resultados:", 20, y + 10);

doc.setFont("helvetica", "normal");
doc.text("Média: " + mediaCalc, 20, y + 20);
doc.text("Coeficiente de Variação: " + coef_Varian + "%", 20, y + 30);
doc.text("Desvio Padrão: " + desvioCalc, 20, y + 40);

// Salvar
doc.save("relatorio.pdf");
}