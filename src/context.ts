import {Scenes, Context} from 'telegraf';
import { SessionContext } from 'telegraf/typings/session'

import BaseScene = Scenes.BaseScene;
import SceneContextScene = Scenes.SceneContextScene;
import SceneSession = Scenes.SceneSession;
import SceneSessionData = Scenes.SceneSessionData;

const noop = () => Promise.resolve();

export interface BetterWizardContext<D extends BetterWizardSessionData = BetterWizardSessionData, D1 extends BetterWizardSession<D> = BetterWizardSession<D>>
	extends Context {
	session: D1;
	scene: SceneContextScene<BetterWizardContext<D>, D>
	wizard: BetterWizardContextWizard<BetterWizardContext<D>>;
}

export interface BetterWizardSessionData extends SceneSessionData {
	cursor: number;
}

export interface BetterWizardSession<S extends BetterWizardSessionData = BetterWizardSessionData>
	extends SceneSession<S> { }

export class BetterWizardContextWizard<
	C extends SessionContext<BetterWizardSession> & {
		scene: SceneContextScene<C, BetterWizardSessionData>
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
			throw new Error("End of BetterWizardScene");
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
