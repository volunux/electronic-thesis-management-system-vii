export interface JobRunner {
	execute() : Promise<void>;
}