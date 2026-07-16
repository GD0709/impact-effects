import { type IEmitter } from "./lib/Events";
export default class Target {
    private readonly on_changed;
    get changed(): IEmitter<Target>;
    fire_changed(): void;
    _target_density: number;
    get target_density(): number;
    set target_density(value: number);
}
