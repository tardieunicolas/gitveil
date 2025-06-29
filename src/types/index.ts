export interface Commit {
  id: string;
  author: string;
  email: string;
  date: Date;
  message: string;
}

export interface Config {
  name: string;
  email: string;
  targetRepoPath: string;
}
export interface Activity {
  commits: Commit[];
  timestamp: Date;
}
