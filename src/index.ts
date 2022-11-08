import { Scenes, Middleware, MiddlewareObj, Composer, Context } from 'telegraf';
import { BetterWizardSessionData, BetterWizardContextWizard } from './context';
import { SceneOptions } from 'telegraf/typings/scenes/base';

import BaseScene = Scenes.BaseScene;
import SceneContextScene = Scenes.SceneContextScene;

export class BetterWizardScene<
  C extends Context & {
    scene: SceneContextScene<C, BetterWizardSessionData>
    wizard: BetterWizardContextWizard<C>
  }
>
  extends BaseScene<C>
  implements MiddlewareObj<C>
{
  steps: Array<BaseScene<C>>;

  constructor(id: string, ...steps: Array<BaseScene<C>>)
  constructor(
    id: string,
    options: SceneOptions<C>,
    ...steps: Array<BaseScene<C>>
  )
  constructor(
    id: string,
    options: SceneOptions<C> | BaseScene<C>,
    ...steps: Array<BaseScene<C>>
  ) {
    let opts: SceneOptions<C> | undefined;
    let s: Array<BaseScene<C>>;
    if (typeof options === 'function' || 'middleware' in options) {
      opts = undefined;
      s = [options, ...steps];
    } else {
      opts = options;
      s = steps;
    }
    super(id, opts);
    this.steps = s;
  }

  middleware() {
    return Composer.compose<C>([
      (ctx, next) => {
        ctx.wizard = new BetterWizardContextWizard<C>(ctx, this.steps);
        return next();
      },
      super.middleware(),
      (ctx, next) => {
        if (ctx.wizard.step === undefined) {
          ctx.wizard.selectStep(0)
          return ctx.scene.leave()
        }
        return next();
      },
      Composer.lazy<C>((ctx) => ctx.wizard.step ?? Composer.passThru()),
    ])
  }

  enterMiddleware() {
    return Composer.compose<C>([
      this.enterHandler,
      (ctx, next) => {
        ctx.wizard = new BetterWizardContextWizard<C>(ctx, this.steps);
        const handler =
          'enterMiddleware' in ctx.wizard.step &&
            typeof ctx.wizard.step.enterMiddleware === 'function'
            ? ctx.wizard.step.enterMiddleware()
            : ctx.wizard.step.middleware()
        return handler(ctx, next);
      },
      this.middleware()
    ]);
  }
}
