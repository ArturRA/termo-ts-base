export class HistoricoUsuario {
  jogos: number = 0;
  vitorias: number = 0;
  derrotas: number = 0;
  sequencia: number = 0;
  tentativas: number[] = [0, 0, 0, 0, 0];

  constructor() {
    this.jogos = 0;
    this.vitorias = 0;
    this.derrotas = 0;
    this.sequencia = 0;
    this.tentativas = [0, 0, 0, 0, 0];
  }
}