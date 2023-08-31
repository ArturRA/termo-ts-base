import { AvaliacaoLetra } from "./avaliacao-letra-enum.js";
import { HistoricoUsuario } from "./historico-usuario.js";


export class Termo {
  palavraSecreta: string;
  mensagemFinal: string;
  private _tentativas: number;

  private _historico: HistoricoUsuario;

  get historico(): HistoricoUsuario {
    return this._historico;
  }

  set historico(novo: HistoricoUsuario) {
    this._historico = novo;
  }

  get tentativas(): number {
    return this._tentativas;
  }
  
  constructor(historico: HistoricoUsuario) {
    this.palavraSecreta = '';
    this.mensagemFinal = '';
    this._tentativas = 0;
    this._historico = historico;
    this.obterPalavraAleatoria();
  }

  obterPalavraAleatoria(): void {
    const palavras = [
      "ABRIR",
      "AMIGO",
      "BEBER",
      "BOLDO",
      "CAIXA",
      "CASAL",
      "CORPO",
      "DEDOS",
      "DENTE",
      "DIZER",
      "ERROS",
      "FALAR",
      "FESTA",
      "FOGAO",
      "GANHO",
      "GIRAR",
      "GRITO",
      "HORAS",
      "JOGOS",
      "JULHO",
      "LIMAO",
      "LOUCO",
      "MACAS",
      "MAIOR",
      "MELAO",
      "MOLHO"
    ];

    const indiceAletorio = Math.floor(Math.random() * palavras.length);
    this.palavraSecreta = palavras[indiceAletorio];

    console.log(this.palavraSecreta);
  }

  avaliar(palavra: string): AvaliacaoLetra[] {
    this._tentativas++;

    const avaliacoes: AvaliacaoLetra[] = [];

    for (let i = 0; i < palavra.length; i++) {
      if (palavra[i] === this.palavraSecreta[i]) {
        avaliacoes[i] = AvaliacaoLetra.Correta;
      } else if (this.palavraSecreta.includes(palavra[i])) {
        avaliacoes[i] = AvaliacaoLetra.PosicaoIncorreta;
      } else {
        avaliacoes[i] = AvaliacaoLetra.NaoExistente;
      }
    }

    if (this.jogadorPerdeu())
      this.mensagemFinal = `Você perdeu! Tente novamente, a palavra era ${this.palavraSecreta}`;

    return avaliacoes;
  }

  jogadorAcertou(palavra: string): boolean {
    const jogadorAcertou: boolean = palavra == this.palavraSecreta;

    if (jogadorAcertou)
      this.registrarVitoria();

    else if (this.jogadorPerdeu())
      this.registrarDerrota();
    
    return jogadorAcertou;
  }

  jogadorPerdeu(): boolean {
    return this.tentativas === 5;
  }

  registrarTentativa(): void {
    this._tentativas++;
  }

  private registrarVitoria(): void {
    this._historico.jogos++;
    this._historico.vitorias++;
    this._historico.sequencia++;

    this._historico.tentativas[this._tentativas - 1]++;
  }

  private registrarDerrota(): void {
    this._historico.jogos++;
    this._historico.derrotas++;
    this._historico.sequencia = 0;
  }

  resetarJogo(): void {
    this.obterPalavraAleatoria();
    this._tentativas = 0;
    this.mensagemFinal = '';
  }
}