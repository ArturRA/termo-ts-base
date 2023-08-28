import AvaliacaoLetra from "./avaliacao-letra-enum.js";


export class Termo {
  palavraSecreta: string;
  mensagemFinal: string;
  tentativas: number;

  constructor() {
    this.palavraSecreta = '';
    this.mensagemFinal = '';
    this.tentativas = 0;
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
    this.tentativas++;

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
    return this.palavraSecreta === palavra;
  }

  jogadorPerdeu(): boolean {
    return this.tentativas === 5;
  }

  resetarJogo(): void {
    this.obterPalavraAleatoria();
    this.tentativas = 0;
    this.mensagemFinal = '';
  }
}