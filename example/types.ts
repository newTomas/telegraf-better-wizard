import { Context, Scenes } from "telegraf";
import { BetterWizardSessionData, BetterWizardSession, BetterWizardContextWizard } from "telegraf-better-wizard";

export interface SessionData extends BetterWizardSessionData {
	state: Record<string | symbol, any>;

	firstName?: string;
	lastName?: string;
	age?: number;
}

// interface extends ctx.session
export interface Session<S extends BetterWizardSessionData = BetterWizardSessionData> extends BetterWizardSession<S> {
	state: Record<string | symbol, any>;
	registrationComplete?: boolean;
}

export interface MyContext extends Context {
	// declare session type
	session: Session<SessionData>;
	// declare scene type
	scene: Scenes.SceneContextScene<MyContext, SessionData>
	// declare wizard type
	wizard: BetterWizardContextWizard<MyContext>
}