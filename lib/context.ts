import {Scenes, Context} from 'telegraf';
import { SessionContext } from 'telegraf/typings/session'

import BaseScene = Scenes.BaseScene;
import SceneContextScene = Scenes.SceneContextScene;
import SceneSession = Scenes.SceneSession;
import SceneSessionData = Scenes.SceneSessionData;

const noop = () => Promise.resolve();

export interface MyWizardContext<D extends MyWizardSessionData = MyWizardSessionData, D1 extends MyWizardSession<D> = MyWizardSession<D>>
  extends Context {
  session: D1;
  scene: SceneContextScene<MyWizardContext<D>, D>
  wizard: MyWizardContextWizard<MyWizardContext<D>>;
}

export interface MyWizardSessionData extends SceneSessionData {
  cursor: number;
}

export interface MyWizardSession<S extends MyWizardSessionData = MyWizardSessionData>
  extends SceneSession<S> { }

export default class MyWizardContextWizard<
  C extends SessionContext<MyWizardSession> & {
    scene: SceneContextScene<C, MyWizardSessionData>
  }
> {
  readonly state: object;
  constructor(
    private readonly ctx: C,
    private readonly steps: ReadonlyArray<BaseScene<C>>
  ) {
    this.state = ctx.state;
    this.cursor = this.ctx.scene.session.cursor ?? 0;
  }

  get step() {
    return this.steps[this.cursor];
  }

  get cursor() {
    return this.ctx.scene.session.cursor;
  }

  set cursor(cursor: number) {
    this.ctx.scene.session.cursor = cursor; 
  }

  async selectStep(index: number) {
    this.cursor = index;
    let current = this.steps[this.cursor];
    if (current === undefined) {
      this.cursor = 0;
      throw new Error("End of myWizard");
    }
    const handler =
      'enterMiddleware' in current &&
        typeof current.enterMiddleware === 'function'
        ? current.enterMiddleware()
        : current.middleware();
    return handler(this.ctx, noop);
  }

  enter(id: string){
    const stepId = this.steps.findIndex(step => step.id == id);
    if(stepId == -1) throw new Error(`No step with id: ${id}`);
    return this.selectStep(stepId);
  }

  next() {
    return this.selectStep(this.cursor + 1);
  }

  back() {
    return this.selectStep(this.cursor - 1);
  }
}
