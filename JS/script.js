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
        
        // Memória temporária para guardar SÓ a última semana lida
        let ultimaSemana = {
            'dia-1': [],
            'dia-2': [],
            'dia-3': [],
            'dia-4': [],
            'dia-5': []
        };
        
        let idTabelaAtual = '';

        // PASSO 1: LER A PLANILHA E GUARDAR NA MEMÓRIA
        for(let i = 0; i < linhas.length; i++) {
            let linhaLimpa = linhas[i].replace('\r', '');
            if(linhaLimpa.trim() === '') continue;

            const colunas = linhaLimpa.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(texto => {
                let limpo = texto ? texto.replace(/(^"|"$)/g, '').trim() : '';
                return limpo === '' ? '---' : limpo;
            });
            
            const linhaTexto = linhaLimpa.toLowerCase();

            let indexTurno = -1;
            for(let j = 0; j < colunas.length; j++) {
                const txt = colunas[j].toLowerCase();
                if(txt === 'manhã' || txt === 'manha' || txt === 'tarde') {
                    indexTurno = j;
                    break;
                }
            }

            if (indexTurno === -1) {
                // É um título de dia! Limpamos a memória desse dia para receber a nova semana
                if(linhaTexto.includes('segunda')) { idTabelaAtual = 'dia-1'; ultimaSemana['dia-1'] = []; }
                else if(linhaTexto.includes('terça') || linhaTexto.includes('terca')) { idTabelaAtual = 'dia-2'; ultimaSemana['dia-2'] = []; }
                else if(linhaTexto.includes('quarta')) { idTabelaAtual = 'dia-3'; ultimaSemana['dia-3'] = []; }
                else if(linhaTexto.includes('quinta')) { idTabelaAtual = 'dia-4'; ultimaSemana['dia-4'] = []; }
                else if(linhaTexto.includes('sexta')) { idTabelaAtual = 'dia-5'; ultimaSemana['dia-5'] = []; }
            } 
            else if (idTabelaAtual !== '') {
                // Achou a Manhã/Tarde! Guarda as colunas exatas na memória
                ultimaSemana[idTabelaAtual].push(colunas.slice(indexTurno)); 
            }
        }

        // Função para pintar de amarelo se tiver asterisco (*)
        const formatarCelula = (texto) => {
            if(texto && texto.startsWith('*')) {
                const textoLimpo = texto.replace('*', '').trim();
                return `<td style="background-color: #fff200; color: #000;">${textoLimpo}</td>`;
            }
            return `<td>${texto || '---'}</td>`;
        };

        // PASSO 2: INJETAR A ÚLTIMA SEMANA NO HTML
        for(let i = 1; i <= 5; i++) {
            const corpoTabela = document.querySelector(`#dia-${i} table tbody`);
            if(corpoTabela) {
                corpoTabela.innerHTML = ''; // Limpa o que estava no site
                
                const linhasDoDia = ultimaSemana[`dia-${i}`]; // Pega os dados guardados
                
                linhasDoDia.forEach(colunas => {
                    const novaLinha = document.createElement('tr');
                    novaLinha.innerHTML = `
                        <td><b>${colunas[0] || '---'}</b></td>
                        ${formatarCelula(colunas[1])}
                        ${formatarCelula(colunas[2])}
                        ${formatarCelula(colunas[3])}
                        ${formatarCelula(colunas[4])}
                        ${formatarCelula(colunas[5])}
                        ${formatarCelula(colunas[6])}
                        ${formatarCelula(colunas[7])}
                    `;
                    corpoTabela.appendChild(novaLinha);
                });
            }
        }
    } catch (erro) {
        console.error('Erro ao puxar dados da planilha:', erro);
    }
}