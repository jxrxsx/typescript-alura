export function logarTempoDeExecucao (emSegundos: boolean = false) {

    //target = instância no qual o decorator no método foi colocado
    //key = nome do método no qual o decorator está sendo colocado
    //descriptor = sabe tudo sobre o método que tá sendo executado (assinatura, params, retorno, etc)
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) { 

        //salvanod uma cópia da lógica do método original
        const metodoOriginal = descriptor.value;

        //sobresceve o método original passando todos os parametros
        descriptor.value = function (...args: any[]) {
            
            let unidade = 'ms';
            let divisor = 1;

            if (emSegundos) {
                unidade = 's';
                divisor = 1000;
            }


            console.log('---------------------------------------------');
            console.log(`Parâmetros do método ${propertyKey}: ${JSON.stringify(args)}`);

            const t_inicio = performance.now();
            //chama o métodoOriginal no contexto this passando os parâmetros e salvando o retorno
            const resultado = metodoOriginal.apply(this, args);
            const t_fim = performance.now();
            
            console.log(`Resultado do método: ${JSON.stringify(resultado)}` )

            console.log(`${propertyKey} demorou ${(t_fim - t_inicio) / divisor} ${unidade}`);
            console.log('---------------------------------------------');

            return resultado;
        }

        return descriptor;
    }
}