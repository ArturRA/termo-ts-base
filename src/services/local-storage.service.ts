import { HistoricoUsuario } from "../dominio/historico-usuario.js";

export class LocalStorageService {
  private endereco: string = 'termo-ts:historico@1.0.0';

  salvarDados(dados: HistoricoUsuario): void {
    const jsonString = JSON.stringify(dados);

    localStorage.setItem(this.endereco, jsonString);
  }

  carregarDados(): HistoricoUsuario {
    const dadosJson = localStorage.getItem(this.endereco);

    if (dadosJson)
      return JSON.parse(dadosJson) as HistoricoUsuario;

    return new HistoricoUsuario();
  }
}