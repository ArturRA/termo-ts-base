import { AvaliacaoLetra } from "./avaliacao-letra-enum.js";
export class Termo {
    get historico() {
        return this._historico;
    }
    set historico(novo) {
        this._historico = novo;
    }
    get tentativas() {
        return this._tentativas;
    }
    constructor(historico) {
        this.palavraSecreta = '';
        this.mensagemFinal = '';
        this._tentativas = 0;
        this._historico = historico;
        this.obterPalavraAleatoria();
    }
    obterPalavraAleatoria() {
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
    avaliar(palavra) {
        this._tentativas++;
        const avaliacoes = [];
        for (let i = 0; i < palavra.length; i++) {
            if (palavra[i] === this.palavraSecreta[i]) {
                avaliacoes[i] = AvaliacaoLetra.Correta;
            }
            else if (this.palavraSecreta.includes(palavra[i])) {
                avaliacoes[i] = AvaliacaoLetra.PosicaoIncorreta;
            }
            else {
                avaliacoes[i] = AvaliacaoLetra.NaoExistente;
            }
        }
        if (this.jogadorPerdeu())
            this.mensagemFinal = `Você perdeu! Tente novamente, a palavra era ${this.palavraSecreta}`;
        return avaliacoes;
    }
    jogadorAcertou(palavra) {
        return this.palavraSecreta === palavra;
    }
    jogadorPerdeu() {
        return this.tentativas === 5;
    }
    registrarTentativa() {
        this._tentativas++;
    }
    registrarVitoria() {
        this._historico.jogos++;
        this._historico.vitorias++;
        this._historico.sequencia++;
        this._historico.tentativas[this._tentativas - 1]++;
    }
    registrarDerrota() {
        this._historico.jogos++;
        this._historico.derrotas++;
        this._historico.sequencia = 0;
    }
    resetarJogo() {
        this.obterPalavraAleatoria();
        this._tentativas = 0;
        this.mensagemFinal = '';
    }
}
//# sourceMappingURL=termo.js.map