import { HistoricoUsuario } from "../dominio/historico-usuario.js";
export class LocalStorageService {
    constructor() {
        this.endereco = 'termo-ts:historico@1.0.0';
    }
    salvarDados(dados) {
        const jsonString = JSON.stringify(dados);
        localStorage.setItem(this.endereco, jsonString);
    }
    carregarDados() {
        const dadosJson = localStorage.getItem(this.endereco);
        if (dadosJson)
            return JSON.parse(dadosJson);
        return new HistoricoUsuario();
    }
}
//# sourceMappingURL=local-storage.service.js.map