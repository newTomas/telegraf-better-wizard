import { Scenes, MiddlewareObj, Context } from 'telegraf';
import MyWizardContextWizard, { MyWizardSessionData } from './context';
import { SceneOptions } from 'telegraf/typings/scenes/base';
import BaseScene = Scenes.BaseScene;
import SceneContextScene = Scenes.SceneContextScene;
export declare class MyWizardScene<C extends Context & {
    scene: SceneContextScene<C, MyWizardSessionData>;
    wizard: MyWizardContextWizard<C>;
}> extends BaseScene<C> implements MiddlewareObj<C> {
    steps: Array<BaseScene<C>>;
    constructor(id: string, ...steps: Array<BaseScene<C>>);
    constructor(id: string, options: SceneOptions<C>, ...steps: Array<BaseScene<C>>);
    middleware(): import("telegraf").MiddlewareFn<C>;
    enterMiddleware(): import("telegraf").MiddlewareFn<C>;
}
