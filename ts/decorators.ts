export * from 'reflect-metadata';


export var Injectable : Function = () => (token) => token;
export var Bootstrap : Function = Injectable;
export var Component : Function = (config?: any) =>  {
    return (token: any) : any => {
        // Reflect.defineMetadata('annotations', config, token);
        return token;
    };
};