import fs from 'fs';
import path from 'path';
import readline from 'readline';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const WHITELIST_PATH = path.resolve(__dirname, '../../email-whitelist.json');

function loadWhitelist(): string[] {
    if (!fs.existsSync(WHITELIST_PATH)) return [];
    try {
        const data = fs.readFileSync(WHITELIST_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveWhitelist(list: string[]) {
    fs.writeFileSync(WHITELIST_PATH, JSON.stringify(list, null, 2), 'utf-8');
}

export function isEmailWhitelisted(email: string): boolean {
    const whitelist = loadWhitelist();
    return whitelist.includes(email);
}

export function addEmailToWhitelist(email: string) {
    const whitelist = loadWhitelist();
    if (!whitelist.includes(email)) {
        whitelist.push(email);
        saveWhitelist(whitelist);
    }
}

function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationCode(email: string, code: string) {
    // Utilisation des variables d'environnement pour le transporteur
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@gitpulse.local',
        to: email,
        subject: 'Code de vérification GitPulse',
        text: `Votre code de vérification est : ${code}`,
    });
}

export async function promptUser(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, answer => {
        rl.close();
        resolve(answer);
    }));
}

export async function verifyEmailWorkflow(email: string): Promise<boolean> {
    if (isEmailWhitelisted(email)) return true;
    console.log(`L'email détecté n'est pas dans la whitelist : ${email}`);
    const consent = await promptUser('Voulez-vous recevoir un code de vérification par email ? (o/n) ');
    if (consent.trim().toLowerCase() !== 'o') return false;
    const code = generateVerificationCode();
    await sendVerificationCode(email, code);
    for (let attempts = 0; attempts < 3; attempts++) {
        const input = await promptUser('Veuillez saisir le code reçu par email : ');
        if (input.trim() === code) {
            addEmailToWhitelist(email);
            console.log('Email vérifié et ajouté à la whitelist.');
            return true;
        } else {
            console.log('Code incorrect.');
        }
    }
    console.log('Vérification annulée.');
    return false;
}
