export function throttle (ms = 500) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const metodoOriginal = descriptor.value;
        let timer = 0;

        descriptor.value = function(...args: any[]) {
            if (event) event.preventDefault();

            clearInterval(timer);
            //aplicando o méotod original e salvando o delay em timer
            timer = setTimeout( () => metodoOriginal.apply(this, args), ms);
            
        }

        return descriptor;
    }
}