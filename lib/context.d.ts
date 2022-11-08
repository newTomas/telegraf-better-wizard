import { Scenes, Context } from 'telegraf';
import { SessionContext } from 'telegraf/typings/session';
import BaseScene = Scenes.BaseScene;
import SceneContextScene = Scenes.SceneContextScene;
import SceneSession = Scenes.SceneSession;
import SceneSessionData = Scenes.SceneSessionData;
export interface BetterWizardContext<D extends BetterWizardSessionData = BetterWizardSessionData, D1 extends BetterWizardSession<D> = BetterWizardSession<D>> extends Context {
    session: D1;
    scene: SceneContextScene<BetterWizardContext<D>, D>;
    wizard: BetterWizardContextWizard<BetterWizardContext<D>>;
}
export interface BetterWizardSessionData extends SceneSessionData {
    cursor: number;
}
export interface BetterWizardSession<S extends BetterWizardSessionData = BetterWizardSessionData> extends SceneSession<S> {
}
export declare class BetterWizardContextWizard<C extends SessionContext<BetterWizardSession> & {
    scene: SceneContextScene<C, BetterWizardSessionData>;
}> {
    private readonly ctx;
    private readonly steps;
    readonly state: object;
    constructor(ctx: C, steps: ReadonlyArray<BaseScene<C>>);
    get step(): Scenes.BaseScene<C>;
    get cursor(): number;
    set cursor(cursor: number);
    selectStep(index: number): Promise<unknown>;
    enter(id: string): Promise<unknown>;
    next(): Promise<unknown>;
    back(): Promise<unknown>;
}
