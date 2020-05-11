import { Negociacao, NegociacaoParcial } from '../models/index';

export class NegociacaoService {

    // recebe a função isOK utilizada para verificar se a requisição foi bem sucedida
    // faz-se o fetch dos dados, passa-se a função isOk para verificar se deu certo
    // dps converte os dados da resposta para json
    // dps mapeia os dados do json para uma lista de negociacoes
    obterNegociacoes (handler: Function): Promise<Negociacao[]>  {

        return fetch('http://localhost:8080/dados')
            .then(res => handler(res))
            .then(res => res.json())
            .then((dados: NegociacaoParcial[]) => 
                dados.map(dado => new Negociacao(new Date(), dado.vezes, dado.montante))
            )
            .catch(err => {
                console.log(err);
                throw new Error('Não foi possível importar as negociações');
            });
    }
}

export interface HandlerFunction {

    (res: Response): Response;
}
