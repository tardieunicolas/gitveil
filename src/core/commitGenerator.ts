export class CommitGenerator {
    private activity: any[];

    constructor(activity: any[]) {
        this.activity = activity;
    }

    public generateCommits(): string[] {
        const commits: string[] = [];
        this.activity.forEach((entry) => {
            const commitMessage = this.createCommitMessage(entry);
            commits.push(commitMessage);
        });
        return commits;
    }

    private createCommitMessage(entry: any): string {
        const date = new Date(entry.date).toISOString();
        return `sync : activity recorded for ${date}`;
    }
}