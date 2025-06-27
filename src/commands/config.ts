import { Config } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// Toujours utiliser le gitveil.config.json du module (racine projet)
const CONFIG_PATH = path.resolve(__dirname, '../../gitveil.config.json');

export function setConfig(newConfig: Config): void {
    const currentConfig = loadCurrentConfig();
    const updatedConfig = { ...currentConfig, ...newConfig };
    saveConfig(updatedConfig);
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
        mirrorRepoPath: './records-folder',
    };
}

function saveConfig(config: Config): void {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}