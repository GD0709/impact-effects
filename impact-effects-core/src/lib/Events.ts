// https://www.davideaversa.it/blog/simple-event-system-typescript/

interface IEmitter<S> {
    on(handler: (source: S, passed: string[]) => void): void;
    off(handler: (source: S, passed: string[]) => void): void;
}
interface INotifyChanged<T>
{
    readonly changed: IEmitter<T>;
}
interface IAsyncNotifyChanged<T>
{
    get changed(): IAsyncEmitter<T>;
} 
class Emitter<S> implements IEmitter<S> {

    public expose(): IEmitter<S> {
        return this
    }

    private handlers: Array<(source: S, passed: string[]) => void> = [];

    public on(handler: (source: S, passed: string[]) => void): void {
        this.handlers.push(handler);
    }

    public off(handler: (source: S, passed: string[]) => void): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(source: S, passed: string[]): void {
        // Duplicate the array to avoid side effects during iteration.
        this.handlers.slice(0).forEach(h => h(source, passed));
    }
}
interface IAsyncEmitter<S> {
    on(handler: (source: S) => Promise<void>): void;
    off(handler: (source: S) => Promise<void>): void;
}

class AsyncEmitter<S> implements IAsyncEmitter<S> {
    private handlers: Array<(source: S, passed: string[]) => Promise<void>> = [];

    public on(handler: (source: S, passed: string[]) => Promise<void>): void {
        this.handlers.push(handler);
    }

    public off(handler: (source: S, passed: string[]) => Promise<void>): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public async trigger(source: S, passed: string[]): Promise<void> {
        this.handlers.slice(0).map(h => h(source, passed));
    }

    public async triggerAwait(source: S, passed: string[]): Promise<void> {
        const promises = this.handlers.slice(0).map(h => h(source, passed));
        await Promise.all(promises);
    }
    
    public expose(): IAsyncEmitter<S> {
        return this
    }
}



/*


interface ISignal<S,T> {
    on(handler: (source: S, data: T) => void): void;
    off(handler: (source: S, data: T) => void): void;
}

class Signal<S, T> implements ISignal<S,T> {

    public expose(): ISignal<S,T> {
        return this
    }

    private handlers: Array<(source: S, data: T) => void> = [];

    public on(handler: (source: S, data: T) => void): void {
        this.handlers.push(handler);
    }

    public off(handler: (source: S, data: T) => void): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(source: S, data: T): void {
        // Duplicate the array to avoid side effects during iteration.
        this.handlers.slice(0).forEach(h => h(source, data));
    }
}


interface IAsyncSignal<S,T> {
    on(handler: (source: S, data: T) => Promise<void>): void;
    off(handler: (source: S, data: T) => Promise<void>): void;
}

class AsyncSignal<S, T> implements IAsyncSignal<S,T> {
    private handlers: Array<(source: S, data: T) => Promise<void>> = [];

    public on(handler: (source: S, data: T) => Promise<void>): void {
        this.handlers.push(handler);
    }

    public off(handler: (source: S, data: T) => Promise<void>): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public async trigger(source: S, data: T): Promise<void> {
        this.handlers.slice(0).map(h => h(source, data));
    }

    public async triggerAwait(source: S, data: T): Promise<void> {
        const promises = this.handlers.slice(0).map(h => h(source, data));
        await Promise.all(promises);
    }
    private delayed: boolean = false;
    public async delay_trigger_await(source: S, data: T, timeout: number): Promise<void>
    {
        if(this.delayed == true) return;
        this.delayed = true;
        await new Promise(f => setTimeout(f, timeout));
        await this.triggerAwait(source, data);
        this.delayed = false;
    }
    
    public expose(): IAsyncSignal<S,T> {
        return this
    }
} */
export { Emitter, AsyncEmitter };
export type { INotifyChanged, IAsyncNotifyChanged, /* ISignal, IAsyncSignal, Signal, AsyncSignal,  */ IEmitter, IAsyncEmitter };


/* class Dog implements INotifyChanged<Dog>{
    
    constructor(readonly name: string) {}

    private readonly onBark = new Signal<Dog, string>();
    public get BarkEvent(): Signal<Dog, string> {
        return this.onBark;
    }

    public sayWoof() {
        this.onBark.trigger(this, "WOOF!");
    }
}

class DogListener {
    constructor(dog: Dog) {
        let dogBarkHandler = (s: Dog, bark: string) => {
            console.log(`Dog ${dog.name} barked: ${bark}`);
        }
        dog.BarkEvent.on(dogBarkHandler);
    }
} */