import AvaliacaoLetra from "./avaliacao-letra-enum.js";
export class Termo {
    constructor() {
        this.palavraSecreta = '';
        this.tentativas = 0;
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
        this.tentativas++;
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
        return avaliacoes;
    }
    jogadorAcertou(palavra) {
        return this.palavraSecreta === palavra;
    }
    jogadorPerdeu() {
        return this.tentativas === 5;
    }
    resetarJogo() {
        this.obterPalavraAleatoria();
        this.tentativas = 0;
    }
}
//# sourceMappingURL=termo.js.map