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
    const headerTop = document.querySelector('.top');
    
    // Se a rolagem vertical for maior que 50 pixels, ativa o modo compacto
    if (window.scrollY > 50) {
        headerTop.classList.add('compacto');
    } else {
        headerTop.classList.remove('compacto');
    }
});