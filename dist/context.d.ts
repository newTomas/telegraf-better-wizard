import { Scenes, Context } from 'telegraf';
import { SessionContext } from 'telegraf/typings/session';
import BaseScene = Scenes.BaseScene;
import SceneContextScene = Scenes.SceneContextScene;
import SceneSession = Scenes.SceneSession;
import SceneSessionData = Scenes.SceneSessionData;
export interface MyWizardContext<D extends MyWizardSessionData = MyWizardSessionData, D1 extends MyWizardSession<D> = MyWizardSession<D>> extends Context {
    session: D1;
    scene: SceneContextScene<MyWizardContext<D>, D>;
    wizard: MyWizardContextWizard<MyWizardContext<D>>;
}
export interface MyWizardSessionData extends SceneSessionData {
    cursor: number;
}
export interface MyWizardSession<S extends MyWizardSessionData = MyWizardSessionData> extends SceneSession<S> {
}
export default class MyWizardContextWizard<C extends SessionContext<MyWizardSession> & {
    scene: SceneContextScene<C, MyWizardSessionData>;
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
