"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyWizardScene = void 0;
const telegraf_1 = require("telegraf");
const context_1 = __importDefault(require("./context"));
var BaseScene = telegraf_1.Scenes.BaseScene;
class MyWizardScene extends BaseScene {
    constructor(id, options, ...steps) {
        let opts;
        let s;
        if (typeof options === 'function' || 'middleware' in options) {
            opts = undefined;
            s = [options, ...steps];
        }
        else {
            opts = options;
            s = steps;
        }
        super(id, opts);
        this.steps = s;
    }
    middleware() {
        return telegraf_1.Composer.compose([
            (ctx, next) => {
                ctx.wizard = new context_1.default(ctx, this.steps);
                return next();
            },
            super.middleware(),
            (ctx, next) => {
                if (ctx.wizard.step === undefined) {
                    ctx.wizard.selectStep(0);
                    return ctx.scene.leave();
                }
                return next();
            },
            telegraf_1.Composer.lazy((ctx) => { var _a; return (_a = ctx.wizard.step) !== null && _a !== void 0 ? _a : telegraf_1.Composer.passThru(); }),
        ]);
    }
    enterMiddleware() {
        return telegraf_1.Composer.compose([
            this.enterHandler,
            (ctx, next) => {
                ctx.wizard = new context_1.default(ctx, this.steps);
                const handler = 'enterMiddleware' in ctx.wizard.step &&
                    typeof ctx.wizard.step.enterMiddleware === 'function'
                    ? ctx.wizard.step.enterMiddleware()
                    : ctx.wizard.step.middleware();
                return handler(ctx, next);
            },
            this.middleware()
        ]);
    }
}
exports.MyWizardScene = MyWizardScene;
