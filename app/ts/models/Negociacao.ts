import { MeuObjeto } from './MeuObjeto';

export class Negociacao implements MeuObjeto<Negociacao> {
    
    constructor(readonly data: Date, readonly quantidade: number, readonly valor: number) { }

    get volume() {

        return this.quantidade * this.valor;
    }

    toText (): void {

        console.log('************** logging negociacao **************');
        console.log(
            `
                Data: ${this.data} 
                Quantidade: ${this.quantidade}
                Valor: ${this.valor}
                Volume: ${this.volume}
            `
        );
    }

    ehIgual (negociacao: Negociacao): boolean {

        // o método deve retornar true somente se a data completa for igual para ambas as instâncias
        return this.data.getDate() === negociacao.data.getDate() &&
               this.data.getMonth() === negociacao.data.getMonth() &&
               this.data.getFullYear() === negociacao.data.getFullYear();  

    }
}
