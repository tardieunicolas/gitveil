import { Config } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as readline from 'readline';

// Always use the gitveil.config.json from the module (project root)
const CONFIG_PATH = path.resolve(__dirname, '../../gitveil.config.json');
const VALID_KEYS = ['email', 'name', 'targetRepoPath'] as const;

interface ConfigOptions {
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

function promptUser(question: string, defaultValue?: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer.trim() || defaultValue || '');
        });
    });
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
        // Initialize all values from git and current directory with interactive prompts
        console.log('🔧 GitVeil Configuration Setup');
        console.log('Press Enter to use the default value shown in brackets.\n');
        
        // Detect default values
        const detectedName = getGitConfig('user.name') ?? 'unknown';
        const detectedEmail = getGitConfig('user.email') ?? 'unknown';
        const detectedPath = process.cwd();
        
        // Interactive prompts with detected defaults
        const name = await promptUser('Your name', detectedName || undefined);
        const email = await promptUser('Your email', detectedEmail || undefined);
        const targetRepoPath = await promptUser('Target repository path', detectedPath);
        
        // Update config with user responses
        if (name) configUpdate['name'] = name;
        if (email) configUpdate['email'] = email;
        if (targetRepoPath) configUpdate['targetRepoPath'] = targetRepoPath;
        
        console.log('\n✅ Configuration initialized successfully!');
        
    } else if (options.init && key) {
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

    if (!options.init && !(key && value)) {
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