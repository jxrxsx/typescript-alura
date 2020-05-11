import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacao, Negociacoes } from '../models/index';
import { domInject, throttle } from '../helpers/decorators/index';
import { LOG } from '../helpers/index';
import { NegociacaoService } from '../services/index';

enum diaDaSemana {
    DOMINGO,
    SEGUNDA,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO
}

let timer = 0;

export class NegociacaoController {
    
    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;

    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');

    private _negociacaoService = new NegociacaoService();

    constructor() {

        this._negociacoesView.update(this._negociacoes);
    }

    // @logarTempoDeExecucao(true) // true = segundos  |  false = ms
    @throttle()
    adiciona(): void {

        var date = new Date(this._inputData.val().replace(/-/g, ','));

        if (!this._ehDiaUtil(date)) {
            return this._mensagemView.update('Não é possível efetuar negociações em finais de semana.', 'danger');
        }

        const negociacao = new Negociacao(date, parseInt(this._inputQuantidade.val()), parseFloat(this._inputValor.val()));

        this._negociacoes.adiciona(negociacao);
        
        // utiliza a função LOG para impirimir diversas instâncias de negociação ao mesmo tempo
        LOG(negociacao, this._negociacoes);

        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!', 'success');
    }


    // @logarTempoDeExecucao(true) // true = segundos  |  false = ms
    private _ehDiaUtil (date: Date): boolean {

        if (date.getDay() === diaDaSemana.SABADO || date.getDay() === diaDaSemana.DOMINGO){
            
            return false;
        }

        return true;
    }

    @throttle()
    async importaDados () {

        try {

            // método que importa os dados das negociações trazidas pela service diretamente da API
            const negociacoesParaImportar = await this._negociacaoService
                .obterNegociacoes((res: Response) => {
                
                    //Se a requisição for bem sucedida, reotorno a resposta e passo adiante para o outro bloco .then()
                    if (res.ok) {
                        return res;
                    }
                    else {
                        throw new Error(res.statusText);
                    }
                });

                const negociacoesJaImportadas = this._negociacoes.paraArray();

                negociacoesParaImportar
                    // filtra todas as negociacoes que já foram importadas e retorna um array com as não importadas
                    .filter(negociacao => !negociacoesJaImportadas.some(jaImportada => negociacao.ehIgual(jaImportada)))
                    // pega o array filtrado de negociacoes e adiciona somente as que não foram adicionada ainda
                    .forEach(negociacao => this._negociacoes.adiciona(negociacao));

                // atualiza a view de negociacoes renderizando as negociacoes em formato de tabela
                this._negociacoesView.update(this._negociacoes);
                
        } catch (error) {
            this._mensagemView.update(error.message, 'danger');
        }
        
    }

}