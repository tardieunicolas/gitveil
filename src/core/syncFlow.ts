import { ActivityExtractor } from './activityExtractor';
import { MirrorRepo } from './mirrorRepo';
import { CommitGenerator } from './commitGenerator';

export async function executeSyncFlow(email: string, targetRepo: string): Promise<void> {
    // Step 1: Extract activity related to the specified email
    const activityExtractor = new ActivityExtractor(email);
    const activities = await activityExtractor.extractActivity();

    // Step 2: Prepare the mirror repository
    const mirrorRepo = new MirrorRepo(targetRepo, { email });
    await mirrorRepo.initialize();

    // Step 3: Generate discrete commits based on the extracted activities
    const commitGenerator = new CommitGenerator(activities);
    const commits = commitGenerator.generateCommits();

    // Step 4: Push the generated commits to GitHub
    await mirrorRepo.pushCommits(commits);
}