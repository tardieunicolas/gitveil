export interface Commit {
    id: string;
    author: string;
    email: string;
    date: Date;
    message: string;
}

export interface Config {
    email: string;
    mirrorRepoPath: string;
    since: string;
}

export interface Activity {
    commits: Commit[];
    timestamp: Date;
}