import fs from "fs";
import path from "path";
import readline from "readline";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const WHITELIST_PATH = path.resolve(__dirname, "../../email-whitelist.json");

// Load the whitelist from the local JSON file
function loadWhitelist(): string[] {
  if (!fs.existsSync(WHITELIST_PATH)) return [];
  try {
    const data = fs.readFileSync(WHITELIST_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save the whitelist to the local JSON file
function saveWhitelist(list: string[]) {
  fs.writeFileSync(WHITELIST_PATH, JSON.stringify(list, null, 2), "utf-8");
}

// Check if an email is in the whitelist
export function isEmailWhitelisted(email: string): boolean {
  const whitelist = loadWhitelist();
  return whitelist.includes(email);
}

// Add an email to the whitelist
export function addEmailToWhitelist(email: string) {
  const whitelist = loadWhitelist();
  if (!whitelist.includes(email)) {
    whitelist.push(email);
    saveWhitelist(whitelist);
  }
}

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send the verification code to the user's email using environment variables for SMTP
export async function sendVerificationCode(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@gitveil.local",
    to: email,
    subject: "GitVeil verification code",
    text: `Your verification code is: ${code}`,
  });
}

// Prompt the user for input in the CLI
export async function promptUser(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

// Complete workflow: check whitelist, ask for consent, send code, verify, and add to whitelist
export async function verifyEmailWorkflow(email: string): Promise<boolean> {
  if (isEmailWhitelisted(email)) return true;
  console.log();
  console.log(`The email address "${email}" is not yet trusted.`);
  console.log(
    "Ensure fair use of this tool, each new email address must be verified only once.\nAfter verification, your address will be trusted for all future uses."
  );
  console.log();
  const consent = await promptUser(
    `Would you like to receive a one-time verification code at this address? (y/n): `
  );
  if (consent.trim().toLowerCase() !== "y") {
    console.log("❌ Verification process cancelled. No data will be recorded for this email.");
    return false;
  }
  const code = generateVerificationCode();
  await sendVerificationCode(email, code);
  for (let attempts = 0; attempts < 3; attempts++) {
    const input = await promptUser(
      "✉️  Please enter the 6-digit code sent to your email: "
    );
    if (input.trim() === code) {
      addEmailToWhitelist(email);
      console.log("Email successfully verified! This address is now trusted and you won't be asked again.");
      console.log()
      return true;
    } else {
      console.log(`❗ The code entered is incorrect. ${2 - attempts} attempt(s) left.`);
    }
  }
  console.log("⏹️  Too many failed attempts. Verification aborted.");
  return false;
}
