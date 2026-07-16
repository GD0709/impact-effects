interface IEmitter<S> {
    on(handler: (source: S, passed: string[]) => void): void;
    off(handler: (source: S, passed: string[]) => void): void;
}
interface INotifyChanged<T> {
    readonly changed: IEmitter<T>;
}
interface IAsyncNotifyChanged<T> {
    get changed(): IAsyncEmitter<T>;
}
declare class Emitter<S> implements IEmitter<S> {
    expose(): IEmitter<S>;
    private handlers;
    on(handler: (source: S, passed: string[]) => void): void;
    off(handler: (source: S, passed: string[]) => void): void;
    trigger(source: S, passed: string[]): void;
}
interface IAsyncEmitter<S> {
    on(handler: (source: S) => Promise<void>): void;
    off(handler: (source: S) => Promise<void>): void;
}
declare class AsyncEmitter<S> implements IAsyncEmitter<S> {
    private handlers;
    on(handler: (source: S, passed: string[]) => Promise<void>): void;
    off(handler: (source: S, passed: string[]) => Promise<void>): void;
    trigger(source: S, passed: string[]): Promise<void>;
    triggerAwait(source: S, passed: string[]): Promise<void>;
    expose(): IAsyncEmitter<S>;
}
export { Emitter, AsyncEmitter };
export type { INotifyChanged, IAsyncNotifyChanged, /* ISignal, IAsyncSignal, Signal, AsyncSignal,  */ IEmitter, IAsyncEmitter };
