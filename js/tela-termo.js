import AvaliacaoLetra from "./avaliacao-letra-enum.js";
import { Termo } from "./termo.js";
class TelaTermo {
    constructor() {
        this.grid = [];
        this.jogoDoTermo = new Termo();
        this.gameOver = false;
        this.linhaAtual = 0;
        this.colunaAtual = 0;
        // Casts
        this.pnlConteudo = document.getElementById('pnlConteudo');
        this.pnlConteudo.querySelectorAll('.linha').forEach(linha => {
            const colunas = Array.from(linha.querySelectorAll('.letra'));
            this.grid.push(colunas);
        });
        this.pnlTeclado = document.getElementById('pnlTeclado');
        this.btnEnter = document.getElementById('btnEnter');
        this.registrarEventos();
    }
    registrarEventos() {
        for (let botao of this.pnlTeclado.children)
            if (botao.id !== 'btnEnter')
                botao.addEventListener("click", (sender) => this.digitarLetra(sender));
        this.btnEnter.addEventListener("click", () => this.realizarAcaoDoEnter());
    }
    digitarLetra(sender) {
        if (this.colunaAtual === 5)
            return;
        const botaoClicado = sender.target;
        const letra = botaoClicado.textContent[0];
        this.grid[this.linhaAtual][this.colunaAtual].textContent = letra;
        this.colunaAtual++;
    }
    realizarAcaoDoEnter() {
        if (this.gameOver) {
            this.resetarJogo();
        }
        else {
            this.avaliarPalavra();
        }
    }
    avaliarPalavra() {
        const palavra = this.grid[this.linhaAtual].map(cell => cell.textContent).join('').trim();
        if (palavra.length === 5) {
            const avaliacoes = this.jogoDoTermo.avaliar(palavra);
            for (let i = 0; i < this.grid[this.linhaAtual].length; i++) {
                this.atualizarBotoesPainel(this.grid[this.linhaAtual][i], avaliacoes[i]);
            }
            if (this.jogoDoTermo.jogadorAcertou(palavra) || this.jogoDoTermo.jogadorPerdeu()) {
                this.finalizarJogo();
                return;
            }
            this.colunaAtual = 0;
            this.linhaAtual++;
        }
    }
    finalizarJogo() {
        this.disabilitarBotoes(true);
        this.gameOver = true;
        this.btnEnter.textContent = 'Jogar Novamente';
        if (this.jogoDoTermo.jogadorPerdeu()) {
            const lblMensagemFinal = document.createElement('p');
            lblMensagemFinal.classList.add('notificacao');
            lblMensagemFinal.classList.add('notificacao-erro');
            lblMensagemFinal.textContent = this.jogoDoTermo.mensagemFinal;
            this.pnlConteudo.appendChild(lblMensagemFinal);
        }
    }
    resetarJogo() {
        var _a;
        // Resetao grid
        this.grid.forEach(linha => linha.forEach(cell => {
            cell.textContent = '';
            cell.style.backgroundColor = '';
        }));
        // Reseta o teclado
        for (let botao of this.pnlTeclado.children) {
            const botaoClicado = botao;
            if (botaoClicado.id !== 'btnEnter')
                botaoClicado.style.backgroundColor = '';
        }
        this.btnEnter.textContent = 'Enter';
        // Habilita o teclado de novo
        this.disabilitarBotoes(false);
        // Reseta as variaveis do jogo
        this.linhaAtual = 0;
        this.colunaAtual = 0;
        this.gameOver = false;
        (_a = this.pnlConteudo.querySelector('.notificacao')) === null || _a === void 0 ? void 0 : _a.remove();
        // Reseta o a palavra secreta e as tentativas
        this.jogoDoTermo.resetarJogo();
    }
    atualizarBotoesPainel(cell, avaliacao) {
        switch (avaliacao) {
            case AvaliacaoLetra.Correta:
                cell.style.backgroundColor = '#00ff3c';
                this.atualizarBotaoTeclado(cell.textContent, '#00ff3c');
                break;
            case AvaliacaoLetra.PosicaoIncorreta:
                cell.style.backgroundColor = '#d0ff00';
                this.atualizarBotaoTeclado(cell.textContent, '#d0ff00');
                break;
            case AvaliacaoLetra.NaoExistente:
                cell.style.backgroundColor = '#d34343';
                this.atualizarBotaoTeclado(cell.textContent, '#d34343');
                break;
        }
    }
    atualizarBotaoTeclado(textContent, backgroundColor) {
        for (let botao of this.pnlTeclado.children) {
            const botaoClicado = botao;
            if (botaoClicado.textContent === textContent && !this.eCorVerde(botaoClicado.style.backgroundColor)) {
                botaoClicado.style.backgroundColor = backgroundColor;
            }
        }
    }
    eCorVerde(color) {
        color = color.toLowerCase();
        return color.includes('rgb(0, 255, 60)') || color.includes('#00ff3c');
    }
    disabilitarBotoes(disabilitarBotoes) {
        for (let botao of this.pnlTeclado.children) {
            const botaoClicado = botao;
            if (botaoClicado.id !== 'btnEnter')
                botaoClicado.disabled = disabilitarBotoes;
        }
    }
}
window.addEventListener('load', () => new TelaTermo());
//# sourceMappingURL=tela-termo.js.map