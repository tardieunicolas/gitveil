import { Config } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Toujours utiliser le gitveil.config.json du module (racine projet)
const CONFIG_PATH = path.resolve(__dirname, '../../gitveil.config.json');
const VALID_KEYS = ['email', 'name', 'targetRepoPath'] as const;

interface ConfigOptions {
    here?: boolean;
    init?: boolean;
}

function getGitConfig(field: 'user.name' | 'user.email'): string | null {
    try {
        return execSync(`git config ${field}`).toString().trim();
    } catch {
        try {
            return execSync(`git config --global ${field}`).toString().trim();
        } catch {
            return null;
        }
    }
}

export function setConfig(newConfig: Partial<Config>): void {
    const currentConfig = loadCurrentConfig();
    const updatedConfig = { ...currentConfig, ...newConfig };
    saveConfig(updatedConfig);
}

export async function handleConfigCommand(
    key?: string,
    value?: string,
    options: ConfigOptions = {}
): Promise<void> {
    let configUpdate: Record<string, string> = {};
    
    if (fs.existsSync(CONFIG_PATH)) {
        configUpdate = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }

    if (options.init) {
        // Initialize all values from git and current directory
        configUpdate['targetRepoPath'] = process.cwd();
        
        const name = getGitConfig('user.name');
        const email = getGitConfig('user.email');
        
        if (name) configUpdate['name'] = name;
        else console.log('Could not get git user.name');
        
        if (email) configUpdate['email'] = email;
        else console.log('Could not get git user.email');
        
    } else if (options.here && key) {
        if (key === 'targetRepoPath') {
            configUpdate['targetRepoPath'] = process.cwd();
        } else if (key === 'name') {
            const name = getGitConfig('user.name');
            if (name) configUpdate['name'] = name;
            else console.log('Could not get git user.name');
        } else if (key === 'email') {
            const email = getGitConfig('user.email');
            if (email) configUpdate['email'] = email;
            else console.log('Could not get git user.email');
        } else {
            console.log(`Unknown config key: ${key}`);
            return;
        }
    } else if (key && value) {
        if (VALID_KEYS.includes(key as any)) {
            configUpdate[key] = value;
        } else {
            console.log(`Unknown config key: ${key}`);
            return;
        }
    }

    if (!options.here && !options.init && !(key && value)) {
        // Display all content if no arguments
        if (fs.existsSync(CONFIG_PATH)) {
            const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
            console.log(raw);
        } else {
            console.log('gitveil.config.json not found');
        }
        return;
    }

    setConfig(configUpdate);
    console.log('Config updated:', configUpdate);
}

function loadCurrentConfig(): Config {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
            return JSON.parse(raw);
        }
    } catch (e) {
        // ignore and use defaults
    }
    return {
        email: '',
        name: '',
        targetRepoPath: './records-folder',
    };
}

function saveConfig(config: Config): void {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}