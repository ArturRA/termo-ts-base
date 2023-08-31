import { AvaliacaoLetra } from "./dominio/avaliacao-letra-enum.js";
import { Termo } from "./dominio/termo.js";
import { LocalStorageService } from "./services/local-storage.service.js";

class TelaTermo {
  private pnlConteudo: HTMLDivElement;
  private grid: HTMLDivElement[][] = [];
  private linhaAtual: number;
  private colunaAtual: number;
  private pnlTeclado: HTMLDivElement;
  private btnEnter: HTMLButtonElement;
  private gameOver: boolean;
  private pnlNotificacao: HTMLDivElement;


  private jogoDoTermo: Termo;

  private localStorageService: LocalStorageService;
  private pnlHistorico: HTMLDivElement;
  private btnExibirHistorico: HTMLButtonElement;

  constructor() {
    this.localStorageService = new LocalStorageService();
    this.jogoDoTermo = new Termo(this.localStorageService.carregarDados());
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

    this.pnlNotificacao = document.getElementById('pnlNotificacao') as HTMLDivElement;
    this.pnlHistorico = document.getElementById('pnlHistorico') as HTMLDivElement;

    this.btnExibirHistorico = document.getElementById('btnExibirHistorico') as HTMLButtonElement;


    this.registrarEventos();
    this.popularEstatisticas();
    this.desenharGridTentativas();
  }

  registrarEventos(): void {
    for (let botao of this.pnlTeclado.children)
      if (botao.id !== 'btnEnter')
        botao.addEventListener("click", (sender) => this.digitarLetra(sender));

    this.btnEnter.addEventListener("click", () => this.realizarAcaoDoEnter());





    this.btnExibirHistorico.addEventListener('click', () => {
      this.pnlHistorico.style.display = 'grid';
    });

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (!this.pnlHistorico.contains(target) && event.target != this.btnExibirHistorico)
        this.pnlHistorico.style.display = 'none';
    });
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

  finalizarJogo(): void {
    this.disabilitarBotoes(true);
    this.gameOver = true;
    this.btnEnter.textContent = 'Jogar Novamente';

    if (this.jogoDoTermo.jogadorPerdeu()) {
      const lblMensagemFinal: HTMLParagraphElement = document.createElement('p');

      lblMensagemFinal.classList.add('notificacao');
      lblMensagemFinal.classList.add('notificacao-erro');
      lblMensagemFinal.textContent = this.jogoDoTermo.mensagemFinal;

      this.pnlConteudo.appendChild(lblMensagemFinal);
    }

    this.atualizarHistorico();
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
    this.pnlConteudo.querySelector('.notificacao')?.remove();

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

  private desenharGridTentativas(): void {
    const elementos =
      Array.from(document.querySelectorAll('.valor-tentativa')) as HTMLParagraphElement[];
    
    const tentativas = this.jogoDoTermo.historico.tentativas;

    for (let i = 0; i < tentativas.length; i++) {
      const label = elementos[i];
      const qtdTentativas = tentativas[i];

      label.textContent = qtdTentativas.toString();

      let tamanho: number = 0;

      if (qtdTentativas > 0 && this.jogoDoTermo.historico.vitorias > 0)
        tamanho = qtdTentativas / this.jogoDoTermo.historico.vitorias;
      else
        tamanho = 0.05;

      const novoTamanho = tamanho * 100;      
      label.style.width = `${(novoTamanho).toString()}%`;
    }
  }

  private popularEstatisticas(): void {
    const lblJogos = document.getElementById('lblJogos') as HTMLParagraphElement;
    const lblVitorias = document.getElementById('lblVitorias') as HTMLParagraphElement;
    const lblDerrotas = document.getElementById('lblDerrotas') as HTMLParagraphElement;
    const lblSequencia = document.getElementById('lblSequencia') as HTMLParagraphElement;

    lblJogos.textContent = this.jogoDoTermo.historico.jogos.toString();
    lblVitorias.textContent = this.jogoDoTermo.historico.vitorias.toString();
    lblDerrotas.textContent = this.jogoDoTermo.historico.derrotas.toString();
    lblSequencia.textContent = this.jogoDoTermo.historico.sequencia.toString();
  }

  private atualizarHistorico(): void {
    this.localStorageService.salvarDados(this.jogoDoTermo.historico);
    
    this.popularEstatisticas();
    this.desenharGridTentativas();
  }

}

window.addEventListener('load', () => new TelaTermo());