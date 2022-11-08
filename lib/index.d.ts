import { Scenes, MiddlewareObj, Context } from 'telegraf';
import { BetterWizardSessionData, BetterWizardContextWizard } from './context';
import { SceneOptions } from 'telegraf/typings/scenes/base';
import BaseScene = Scenes.BaseScene;
import SceneContextScene = Scenes.SceneContextScene;
export declare class BetterWizardScene<C extends Context & {
    scene: SceneContextScene<C, BetterWizardSessionData>;
    wizard: BetterWizardContextWizard<C>;
}> extends BaseScene<C> implements MiddlewareObj<C> {
    steps: Array<BaseScene<C>>;
    constructor(id: string, ...steps: Array<BaseScene<C>>);
    constructor(id: string, options: SceneOptions<C>, ...steps: Array<BaseScene<C>>);
    middleware(): import("telegraf").MiddlewareFn<C>;
    enterMiddleware(): import("telegraf").MiddlewareFn<C>;
}
