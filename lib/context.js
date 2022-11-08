"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterWizardContextWizard = void 0;
const noop = () => Promise.resolve();
class BetterWizardContextWizard {
    constructor(ctx, steps) {
        var _a;
        this.ctx = ctx;
        this.steps = steps;
        this.state = ctx.state;
        this.cursor = (_a = this.ctx.scene.session.cursor) !== null && _a !== void 0 ? _a : 0;
    }
    get step() {
        return this.steps[this.cursor];
    }
    get cursor() {
        return this.ctx.scene.session.cursor;
    }
    set cursor(cursor) {
        this.ctx.scene.session.cursor = cursor;
    }
    selectStep(index) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cursor = index;
            let current = this.steps[this.cursor];
            if (current === undefined) {
                this.cursor = 0;
                throw new Error("End of BetterWizardScene");
            }
            const handler = 'enterMiddleware' in current &&
                typeof current.enterMiddleware === 'function'
                ? current.enterMiddleware()
                : current.middleware();
            return handler(this.ctx, noop);
        });
    }
    enter(id) {
        const stepId = this.steps.findIndex(step => step.id == id);
        if (stepId == -1)
            throw new Error(`No step with id: ${id}`);
        return this.selectStep(stepId);
    }
    next() {
        return this.selectStep(this.cursor + 1);
    }
    back() {
        return this.selectStep(this.cursor - 1);
    }
}
exports.BetterWizardContextWizard = BetterWizardContextWizard;
