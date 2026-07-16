"use strict";
// https://www.davideaversa.it/blog/simple-event-system-typescript/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncEmitter = exports.Emitter = void 0;
var Emitter = /** @class */ (function () {
    function Emitter() {
        this.handlers = [];
    }
    Emitter.prototype.expose = function () {
        return this;
    };
    Emitter.prototype.on = function (handler) {
        this.handlers.push(handler);
    };
    Emitter.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    Emitter.prototype.trigger = function (source, passed) {
        // Duplicate the array to avoid side effects during iteration.
        this.handlers.slice(0).forEach(function (h) { return h(source, passed); });
    };
    return Emitter;
}());
exports.Emitter = Emitter;
var AsyncEmitter = /** @class */ (function () {
    function AsyncEmitter() {
        this.handlers = [];
    }
    AsyncEmitter.prototype.on = function (handler) {
        this.handlers.push(handler);
    };
    AsyncEmitter.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    AsyncEmitter.prototype.trigger = function (source, passed) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.handlers.slice(0).map(function (h) { return h(source, passed); });
                return [2 /*return*/];
            });
        });
    };
    AsyncEmitter.prototype.triggerAwait = function (source, passed) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = this.handlers.slice(0).map(function (h) { return h(source, passed); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AsyncEmitter.prototype.expose = function () {
        return this;
    };
    return AsyncEmitter;
}());
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
