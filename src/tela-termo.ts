import AvaliacaoLetra from "./avaliacao-letra-enum.js";
import { Termo } from "./termo.js";

class TelaTermo {
  pnlConteudo: HTMLDivElement;
  grid: HTMLDivElement[][] = [];
  linhaAtual: number;
  colunaAtual: number;
  pnlTeclado: HTMLDivElement;
  btnEnter: HTMLButtonElement;
  gameOver: boolean;

  jogoDoTermo: Termo;

  constructor() {
    this.jogoDoTermo = new Termo();
    this.gameOver = false;
    this.linhaAtual = 0;
    this.colunaAtual = 0;

    // Casts
    this.pnlConteudo = document.getElementById('pnlConteudo') as HTMLDivElement;
    this.pnlConteudo.querySelectorAll('.linha').forEach(linha => {
      const colunas: HTMLDivElement[] = Array.from(linha.querySelectorAll('.letra'));
      this.grid.push(colunas);
    });

    this.pnlTeclado = document.getElementById('pnlTeclado') as HTMLDivElement;
    this.btnEnter = document.getElementById('btnEnter') as HTMLButtonElement;

    this.registrarEventos();
  }

  registrarEventos(): void {
    for (let botao of this.pnlTeclado.children)
      botao.addEventListener("click", (sender) => this.digitarLetra(sender));

    this.btnEnter.addEventListener("click", () => this.realizarAcaoDoEnter());
  }

  digitarLetra(sender: Event): void {
    if (this.colunaAtual === 5)
      return;

    const botaoClicado = sender.target as HTMLButtonElement;
    const letra = botaoClicado.textContent![0];

    this.grid[this.linhaAtual][this.colunaAtual].textContent = letra;

    this.colunaAtual++;
  }

  realizarAcaoDoEnter(): void {
    if (this.gameOver) {
      this.resetarJogo();
    } else {
      this.avaliarPalavra();
    }
  }

  avaliarPalavra(): void {
      const palavra = this.grid[this.linhaAtual].map(cell => cell.textContent).join('');
      const avaliacoes = this.jogoDoTermo.avaliar(palavra);

      for (let i = 0; i < this.grid[this.linhaAtual].length; i++) {
        this.atualizarBotoesPainel(this.grid[this.linhaAtual][i], avaliacoes[i]);
      }

      if (this.jogoDoTermo.jogadorAcertou(palavra) || this.jogoDoTermo.jogadorPerdeu()) {
        this.disabilitarBotoes(true);
        this.gameOver = true;
        this.btnEnter.textContent = 'Jogar Novamente';

        return;
      }

      this.colunaAtual = 0;
      this.linhaAtual++;
  }

  resetarJogo(): void {
      // Resetao grid
      this.grid.forEach(linha => linha.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '';
      }));

      // Reseta o teclado
      for (let botao of this.pnlTeclado.children) {
        const botaoClicado = botao as HTMLButtonElement;
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

      // Reseta o a palavra secreta e as tentativas
      this.jogoDoTermo.resetarJogo();
  }

  atualizarBotoesPainel(cell: HTMLDivElement, avaliacao: AvaliacaoLetra): void {
    switch (avaliacao) {
      case AvaliacaoLetra.Correta:
        cell.style.backgroundColor = '#00ff3c';
        this.atualizarBotaoTeclado(cell.textContent!, '#00ff3c');
        break;
      case AvaliacaoLetra.PosicaoIncorreta:
        cell.style.backgroundColor = '#d0ff00';
        this.atualizarBotaoTeclado(cell.textContent!, '#d0ff00');
        break;
      case AvaliacaoLetra.NaoExistente:
        cell.style.backgroundColor = '#d34343';
        this.atualizarBotaoTeclado(cell.textContent!, '#d34343');
        break;
    }
  }

  atualizarBotaoTeclado(textContent: string, backgroundColor: string): void {
    for (let botao of this.pnlTeclado.children) {
      const botaoClicado = botao as HTMLButtonElement;
      if (botaoClicado.textContent === textContent && !this.eCorVerde(botaoClicado.style.backgroundColor)) {
        botaoClicado.style.backgroundColor = backgroundColor;
      }
    }
  }

  eCorVerde(color: string): boolean {
    color = color.toLowerCase();

    return color.includes('rgb(0, 255, 60)') || color.includes('#00ff3c');
  }

  disabilitarBotoes(disabilitarBotoes: boolean): void {
    for (let botao of this.pnlTeclado.children) {
      const botaoClicado = botao as HTMLButtonElement;
      if (botaoClicado.id !== 'btnEnter')
        botaoClicado.disabled = disabilitarBotoes;
    }
  }

}

window.addEventListener('load', () => new TelaTermo());