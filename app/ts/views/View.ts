import { logarTempoDeExecucao } from "../helpers/decorators/index";

export abstract class View<T> {

    protected _elemento: JQuery;
    private _escape: boolean;

    constructor(seletor: string, escape: boolean = false) {

        this._elemento = $(seletor);
        this._escape = escape;
    }

    // @logarTempoDeExecucao(true) // true = segundos  |  false = ms
    update(model: T, type?: string) {
        
        let template = this.template(model, type);
        if (this._escape){
            template = template.replace(/<script>[\s\S]*?<\/script>/, '');
        }

        this._elemento.html(template);
    }

    abstract template(model: T, type?: string): string;     // abstract para tornar a implementação do método obrigatório em todos os filhos da classe View

}

