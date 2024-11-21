import { Emitter, IEmitter } from "../lib/Events";

export default class Target
{
   
    private readonly on_changed = new Emitter<Target>();
    get changed(): IEmitter<Target> {
        return this.on_changed;
    }

    public fire_changed(): void {
        this.on_changed.trigger(this, []);
    }

    _target_density: number = 2650;
    get target_density() : number { return this._target_density; } set target_density(value: number) { this._target_density = value; this.fire_changed(); }
}