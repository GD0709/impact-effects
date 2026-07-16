"use strict";
// https://www.davideaversa.it/blog/simple-event-system-typescript/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncEmitter = exports.Emitter = void 0;
class Emitter {
    constructor() {
        this.handlers = [];
    }
    expose() {
        return this;
    }
    on(handler) {
        this.handlers.push(handler);
    }
    off(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }
    trigger(source, passed) {
        // Duplicate the array to avoid side effects during iteration.
        this.handlers.slice(0).forEach(h => h(source, passed));
    }
}
exports.Emitter = Emitter;
class AsyncEmitter {
    constructor() {
        this.handlers = [];
    }
    on(handler) {
        this.handlers.push(handler);
    }
    off(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }
    async trigger(source, passed) {
        this.handlers.slice(0).map(h => h(source, passed));
    }
    async triggerAwait(source, passed) {
        const promises = this.handlers.slice(0).map(h => h(source, passed));
        await Promise.all(promises);
    }
    expose() {
        return this;
    }
}
exports.AsyncEmitter = AsyncEmitter;
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
