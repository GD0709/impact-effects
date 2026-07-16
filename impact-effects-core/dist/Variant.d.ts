import { type INotifyChanged, type IEmitter } from './lib/Events';
export default class Variant implements INotifyChanged<Variant> {
    constructor(name: string, density?: number, diameter?: number, angle?: number, velocity?: number);
    clone(): Variant;
    name: string;
    private readonly on_changed;
    get changed(): IEmitter<Variant>;
    fire_changed(passed: string[]): void;
    _velocity: number;
    get velocity(): number;
    set velocity(value: number);
    _angle: number;
    get angle(): number;
    set angle(value: number);
    _density: number;
    get density(): number;
    set density(value: number);
    _diameter: number;
    get diameter(): number;
    set diameter(value: number);
    update_derivatives(): void;
    angle_rad: number;
    kenergy: number;
    kenergy_kttnt: number;
    heff: number;
    kenergy_calc(variant: Variant): number;
    kenergy_kttnt_calc(energy: number): number;
    to_string(): string;
}
