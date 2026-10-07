// Função para atualizar o relógio e a data
function atualizarRelogio() {
    const agora = new Date();
    
    // Formatando a hora (HH:MM:SS)
    const horaFormatada = agora.toLocaleTimeString('pt-BR');
    document.getElementById('hora-atual').textContent = horaFormatada;
    
    // Formatando a data (Ex: Terça-feira, 29 de setembro)
    const opcoesData = { weekday: 'long', day: 'numeric', month: 'long' };
    let dataFormatada = agora.toLocaleDateString('pt-BR', opcoesData);
    
    // Atualizando no HTML
    document.getElementById('data-atual').textContent = dataFormatada;
}

// Função para destacar o dia atual da semana
function destacarDiaAtual() {
    const agora = new Date();
    const diaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda, 2 = Terça... 5 = Sexta
    
    // Verifica se hoje é um dia útil (de Segunda a Sexta)
    if (diaSemana >= 1 && diaSemana <= 5) {
        // Encontra a section correspondente (ex: dia-1, dia-2, etc)
        const cardDoDia = document.getElementById('dia-' + diaSemana);
        
        // Se a section existir, adiciona a classe CSS de destaque
        if (cardDoDia) {
            cardDoDia.classList.add('dia-destaque');
        }
    }
}

// Inicia as funções assim que a página terminar de carregar
document.addEventListener('DOMContentLoaded', () => {
    atualizarRelogio(); // Chama logo de cara para não ficar vazio no primeiro segundo
    setInterval(atualizarRelogio, 1000); // Atualiza a cada 1 segundo (1000 milissegundos)
    
    destacarDiaAtual(); // Verifica qual é o dia de hoje e destaca o card
    carregarPlanilha(); // Carregar a Planilha Base
});
// Função para destacar o dia atual da semana e apagar os anteriores
function destacarDiaAtual() {
    const agora = new Date();
    const diaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda, 2 = Terça... 5 = Sexta, 6 = Sábado
    
    // Passa por todos os dias da semana de trabalho (1 a 5)
    for (let i = 1; i <= 5; i++) {
        const cardDoDia = document.getElementById('dia-' + i);
        
        if (cardDoDia) {
            // Se hoje é dia de semana (segunda a sexta)
            if (diaSemana >= 1 && diaSemana <= 5) {
                if (i < diaSemana) {
                    // Se o dia no HTML for menor que o dia atual, já passou
                    cardDoDia.classList.add('dia-passado');
                } else if (i === diaSemana) {
                    // Se for exatamente o dia de hoje, ganha o destaque principal
                    cardDoDia.classList.add('dia-destaque');
                }
            } 
            // Se hoje for sábado (6), significa que a semana toda já passou
            else if (diaSemana === 6) {
                cardDoDia.classList.add('dia-passado');
            }
            // (No domingo, o código não faz nada, deixando tudo normal para a nova semana)
        }
    }
}
// Efeito de encolher o cabeçalho ao rolar a página (Scroll)
window.addEventListener('scroll', () => {
    const headerTop = document.querySelector('.header-fixo');
    
    // Se a rolagem vertical for maior que 50 pixels, ativa o modo compacto
    if (window.scrollY > 50) {
        headerTop.classList.add('compacto');
    } else {
        headerTop.classList.remove('compacto');
    }
});
// Link da Planilha do Google Sheets
const urlCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQmPJhSfp7NsTlHQqmdwkKHfQfR0QTOk_HbpUo42YdD0Yn_47OCm_vw00pIIpcd_Q/pub?gid=1146262585&single=true&output=csv';

async function carregarPlanilha() {
    try {
        const resposta = await fetch(urlCSV);
        const dadosCsv = await resposta.text();
        
        const linhas = dadosCsv.split('\n');
        let idTabelaAtual = '';

        for(let i = 0; i < linhas.length; i++) {
            let linhaLimpa = linhas[i].replace('\r', '');
            if(linhaLimpa.trim() === '') continue;

            const colunas = linhaLimpa.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(texto => {
                let limpo = texto ? texto.replace(/(^"|"$)/g, '').trim() : '';
                return limpo === '' ? '---' : limpo;
            });
            
            const linhaTexto = linhaLimpa.toLowerCase();

            // 1. Verifica primeiro se esta linha é de Manhã ou Tarde
            let indexTurno = -1;
            for(let j = 0; j < colunas.length; j++) {
                const txt = colunas[j].toLowerCase();
                if(txt === 'manhã' || txt === 'manha' || txt === 'tarde') {
                    indexTurno = j;
                    break;
                }
            }

            // 2. Se NÃO for uma linha de Manhã/Tarde, ele procura se é um título de Dia
            // A mágica: Ao achar o título, ele ZERA a tabela. Assim só sobra a última semana lida!
            if (indexTurno === -1) {
                if(linhaTexto.includes('segunda')) {
                    idTabelaAtual = 'dia-1';
                    document.querySelector('#dia-1 table tbody').innerHTML = '';
                } else if(linhaTexto.includes('terça') || linhaTexto.includes('terca')) {
                    idTabelaAtual = 'dia-2';
                    document.querySelector('#dia-2 table tbody').innerHTML = '';
                } else if(linhaTexto.includes('quarta')) {
                    idTabelaAtual = 'dia-3';
                    document.querySelector('#dia-3 table tbody').innerHTML = '';
                } else if(linhaTexto.includes('quinta')) {
                    idTabelaAtual = 'dia-4';
                    document.querySelector('#dia-4 table tbody').innerHTML = '';
                } else if(linhaTexto.includes('sexta')) {
                    idTabelaAtual = 'dia-5';
                    document.querySelector('#dia-5 table tbody').innerHTML = '';
                }
            } 
            // 3. Se achou Manhã/Tarde e já sabe qual é o dia, cria a linha
            else if (idTabelaAtual !== '') {
                const corpoTabela = document.querySelector(`#${idTabelaAtual} table tbody`);
                
                if(corpoTabela) {
                    const novaLinha = document.createElement('tr');
                    
                    const turno = colunas[indexTurno];
                    const emissao = colunas[indexTurno + 1] || '---';
                    const emailGeral = colunas[indexTurno + 2] || '---';
                    const whatsApp = colunas[indexTurno + 3] || '---';
                    const filas = colunas[indexTurno + 4] || '---';
                    const treinamento = colunas[indexTurno + 5] || '---';
                    const grupos = colunas[indexTurno + 6] || '---';
                    const configPortal = colunas[indexTurno + 7] || '---';

                    novaLinha.innerHTML = `
                        <td><b>${turno}</b></td>
                        <td>${emissao}</td>
                        <td>${emailGeral}</td>
                        <td>${whatsApp}</td>
                        <td>${filas}</td>
                        <td>${treinamento}</td>
                        <td>${grupos}</td>
                        <td>${configPortal}</td>
                    `;
                    
                    corpoTabela.appendChild(novaLinha);
                }
            }
        }
    } catch (erro) {
        console.error('Erro ao puxar dados da planilha:', erro);
    }
}