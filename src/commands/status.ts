import { MirrorRepo } from '../core/mirrorRepo';
import { log } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

interface StatusOptions {
    target?: string;
}

function findConfigAndMirrorPath(): { mirrorPath: string, configDir: string } {
    // On force la racine du projet GitPulse
    const projectRoot = path.resolve(__dirname, '../../');
    const configPath = path.join(projectRoot, 'gitpulse.config.json');
    if (fs.existsSync(configPath)) {
        try {
            const raw = fs.readFileSync(configPath, 'utf-8');
            const config = JSON.parse(raw);
            const mirrorRepoPath = config.mirrorRepoPath || './gitpulse-logs';
            return { mirrorPath: mirrorRepoPath, configDir: projectRoot };
        } catch {}
    }
    // fallback : racine projet
    return { mirrorPath: './gitpulse-logs', configDir: projectRoot };
}

function resolveTargetPath(target?: string): string {
    if (!target || target === './gitpulse-logs') {
        const { mirrorPath, configDir } = findConfigAndMirrorPath();
        // Si mirrorPath est déjà absolu, on le garde, sinon on le résout depuis le dossier de la config
        return path.isAbsolute(mirrorPath) ? mirrorPath : path.join(configDir, mirrorPath);
    }
    return path.isAbsolute(target) ? target : path.join(process.cwd(), target);
}

export function checkStatus(options: StatusOptions): void {
    const target = resolveTargetPath(options.target);
    const mirrorRepo = new MirrorRepo(target, {});
    const status = mirrorRepo.getStatus();

    let readyCount = 0;
    if (fs.existsSync(target)) {
        const files = fs.readdirSync(target).filter(f => f.startsWith('record') && f.endsWith('.json'));
        readyCount = files.length;
    }
    log('info', 'Synchronization Status ⏳');
    log('info', `- Files ready to record: ${readyCount}`);
    log('info', `- Mirror Path: ${target}`);
}