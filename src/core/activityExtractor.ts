export class ActivityExtractor {
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  public extractCommits(gitLog: string): string[] {
    const commits: string[] = [];
    const logLines = gitLog.split("\n");

    for (const line of logLines) {
      if (this.isCommitRelatedToEmail(line)) {
        commits.push(line);
      }
    }

    return commits;
  }

  private isCommitRelatedToEmail(commitLine: string): boolean {
    return commitLine.includes(this.email);
  }

  /**
   * Simulate extracting activity for a given email and time range.
   * In a real implementation, this would run a git log command.
   */
  public async extractActivity(): Promise<any[]> {
    return [{ date: new Date().toISOString(), email: this.email }];
  }
}
