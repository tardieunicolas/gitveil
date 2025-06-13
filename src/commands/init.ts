import { MirrorRepo } from '../core/mirrorRepo';
import { log } from '../utils/logger';

export const initializeMirror = async (email: string, mirrorPath: string) => {
    try {
        const mirrorRepo = new MirrorRepo(mirrorPath, email);
        await mirrorRepo.initialize();
        log('info', `Mirror repository initialized at ${mirrorPath} for email ${email}.`);
    } catch (error) {
        if (error instanceof Error) {
            log('info', `Error initializing mirror repository: ${error.message}`);
        } else {
            log('info', `Error initializing mirror repository: ${String(error)}`);
        }
    }
};