import * as fs from "fs";
import * as path from "path";
import { log } from "../utils/logger";
import { execSync } from "child_process";
import QRCode from "qrcode";

// Options pour la commande push (peut être étendu pour d'autres paramètres)
interface PushOptions {
  target?: string;
}

// Supprime tous les fichiers et dossiers dans records-folder après un push réussi
function clearRecordsFolder(recordsFolderPath: string) {
  if (!fs.existsSync(recordsFolderPath)) return;
  const files = fs.readdirSync(recordsFolderPath);
  for (const file of files) {
    const filePath = path.join(recordsFolderPath, file);
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    } else if (fs.statSync(filePath).isDirectory()) {
      // Suppression récursive des sous-dossiers si besoin
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  }
}

// Fonction principale pour pousser les commits anonymisés
export async function pushCommits(options: PushOptions): Promise<void> {
  // Recherche la racine du projet GitVeil (pour toujours utiliser la bonne config)
  let projectRoot = path.dirname(require.main?.filename || process.argv[1]);
  while (!fs.existsSync(path.join(projectRoot, "gitveil.config.json"))) {
    const parent = path.dirname(projectRoot);
    if (parent === projectRoot) break;
    projectRoot = parent;
  }
  const configPath = path.join(projectRoot, "gitveil.config.json");
  let mirrorRepoPath = "";
  let userName = "GitVeil";
  let userEmail = "gitveil@example.com";
  // Lecture de la config du module (toujours à la racine)
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    mirrorRepoPath = config.mirrorRepoPath;
    userName = config.name || userName;
    userEmail = config.email || userEmail;
  } else {
    log("error", "gitveil.config.json not found.");
    return;
  }

  console.log();
  console.log(`> Mirror repo path: ${mirrorRepoPath}`);
  // Vérifie la présence du README.md (sert de fichier de commit)
  const readmePath = path.join(mirrorRepoPath, "README.md");
  let initialCounter = 0;
  if (fs.existsSync(readmePath)) {
    try {
      const readmeContent = fs.readFileSync(readmePath, "utf-8");
      const counterMatch = readmeContent.match(/Counter: (\d+)/);
      if (counterMatch) initialCounter = parseInt(counterMatch[1], 10);
    } catch (e) {
      log(
        "warn",
        "Impossible de lire la valeur initiale du Counter dans README.md"
      );
    }
  } else {
    // Crée un README.md vide si besoin
    fs.writeFileSync(readmePath, "");
    console.log("📄 README.md created in mirrorRepoPath.");
  }

  // Lecture mémoire optimisée des fichiers JSON (évite de parser plusieurs fois)
  const logsDir = path.join(projectRoot, "records-folder");
  if (!fs.existsSync(logsDir)) {
    log("error", `❌ Logs directory not found: ${logsDir}`);
    return;
  }
  // On ne lit que les fichiers .json
  const files = fs.readdirSync(logsDir).filter((f) => f.endsWith(".json"));
  const allDates = new Set<string>();
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(logsDir, file), "utf-8");
      const json = JSON.parse(content);
      if (Array.isArray(json)) {
        json.forEach((entry: any) => allDates.add(entry));
      }
    } catch (e) {
      log("warn", `⚠️ Error parsing file ${file}`);
    }
  }

  // Initialisation du dépôt git uniquement si besoin
  const gitDir = path.join(mirrorRepoPath, ".git");
  if (!fs.existsSync(gitDir)) {
    // Si le dépôt n'existe pas, on l'initialise et on configure l'utilisateur
    console.log(`🆕 Initializing git repo in ${mirrorRepoPath}`);
    execSync(`git -C "${mirrorRepoPath}" init`);
    execSync(`git -C "${mirrorRepoPath}" config user.name "${userName}"`);
    execSync(`git -C "${mirrorRepoPath}" config user.email "${userEmail}"`);
    if (fs.existsSync(readmePath)) {
      execSync(`git -C "${mirrorRepoPath}" add README.md`);
      const status = execSync(
        `git -C "${mirrorRepoPath}" status --porcelain`
      ).toString();
      if (status.trim()) {
        execSync(`git -C "${mirrorRepoPath}" commit -m "Initial commit"`);
        console.log("✅ Initial commit created.");
      }
    }
  } else {
    // Si le dépôt existe, on vérifie la config utilisateur
    let currentName = "";
    try {
      currentName = execSync(`git -C "${mirrorRepoPath}" config user.name`)
        .toString()
        .trim();
    } catch {}
    let currentEmail = "";
    try {
      currentEmail = execSync(`git -C "${mirrorRepoPath}" config user.email`)
        .toString()
        .trim();
    } catch {}
    if (currentName !== userName)
      execSync(`git -C "${mirrorRepoPath}" config user.name "${userName}"`);
    if (currentEmail !== userEmail)
      execSync(`git -C "${mirrorRepoPath}" config user.email "${userEmail}"`);
  }

  // Vérifie si le repo n'a aucun commit et pousse un commit initial si besoin
  let hasCommit = false;
  try {
    const logResult = execSync(`git -C "${mirrorRepoPath}" log --oneline main`, {
      stdio: "pipe",
    }).toString();
    if (logResult.trim()) hasCommit = true;
  } catch (e) {}
  if (!hasCommit) {
    if (!fs.existsSync(readmePath)) {
      fs.writeFileSync(readmePath, "# GitVeil\n");
    }
    execSync(`git -C "${mirrorRepoPath}" add README.md`);
    execSync(`git -C "${mirrorRepoPath}" commit -m "Initial commit"`);
    execSync(`git -C "${mirrorRepoPath}" push origin main --quiet`);
    execSync(`git -C "${mirrorRepoPath}" config core.autocrlf input`);
    console.log("> Initial commit created and pushed on main.");
  }

  // Récupère les dates déjà présentes dans l'historique git (évite les doublons)
  let existingCommitDates: string[] = [];
  try {
    const gitLogCmd = `git -C "${mirrorRepoPath}" log --pretty=format:%ad --date=iso8601-strict`;
    const stdout = execSync(gitLogCmd).toString();
    existingCommitDates = stdout.split("\n").filter(Boolean);
  } catch (e) {}

  // Le compteur doit refléter le nombre de commits existants pour éviter les erreurs d'incrémentation
  let counter = existingCommitDates.length;

  // Filtre les dates à commiter (uniquement les nouvelles)
  let newCommits = 0;
  const toCommit = Array.from(allDates)
    .sort()
    .filter(
      (date) =>
        !existingCommitDates.includes(String(date).trim().replace(/\r|\n/g, ""))
    );
  const totalToCommit = toCommit.length;
  if (allDates.size > 0) {
    console.log(
      `📦 ${totalToCommit} commit(s) to create (not yet in history) out of ${allDates.size} extracted`
    );
    console.log();
    // Affiche un QR code vers GitHub (format petit)
    const qrAscii = await QRCode.toString("https://coff.ee/nicolastardieu", { type: "terminal", small: true });
    console.log("If GitVeil has been valuable to you, please consider supporting its continued development with a coffee ☕️");
    console.log("Thank you for trusting GitVeil. Support the project here: https://coff.ee/nicolastardieu");
    console.log();
    console.log(qrAscii);
    console.log();
  }
  if (totalToCommit === 0) {
    // Rien à faire, on nettoie et on sort
    console.log();
    console.log("Everything is up to date, nothing to push.");
    clearRecordsFolder(logsDir);
    return;
  }
  const gitCmdBase = `git -C "${mirrorRepoPath}"`;
  let oldUserName = "";
  let oldUserEmail = "";
  try {
    oldUserName = execSync(`${gitCmdBase} config user.name`).toString().trim();
  } catch {}
  try {
    oldUserEmail = execSync(`${gitCmdBase} config user.email`)
      .toString()
      .trim();
  } catch {}

  // Boucle synchrone pour les commits
  const lastCommitIndex = toCommit.length - 1;
  const commitCmds: {
    cmd: string;
    env: any;
    isLast: boolean;
    date: string;
    idx: number;
  }[] = [];
  for (const [idx, dateRaw] of toCommit.entries()) {
    const date = String(dateRaw).trim().replace(/\r|\n/g, "");
    if (existingCommitDates.includes(date)) {
      continue;
    }
    counter++;
    newCommits++;
    const commitEnv = {
      ...process.env,
      GIT_COMMITTER_NAME: userName,
      GIT_COMMITTER_EMAIL: userEmail,
    };
    if (idx !== lastCommitIndex) {
      commitCmds.push({
        cmd: `${gitCmdBase} commit --allow-empty --author="${userName} <${userEmail}>" -m "Commit #${counter} for ${date}" --date="${date}"`,
        env: commitEnv,
        isLast: false,
        date,
        idx,
      });
    } else {
      // Dernier commit : modifie le README.md
      const content = [`Counter: ${counter}`, ""].join("\n");
      fs.writeFileSync(readmePath, content);
      commitCmds.push({
        cmd: `${gitCmdBase} add -A`,
        env: commitEnv,
        isLast: false,
        date,
        idx,
      });
      commitCmds.push({
        cmd: `${gitCmdBase} status --porcelain`,
        env: commitEnv,
        isLast: true,
        date,
        idx,
      });
    }
  }
  for (const commit of commitCmds) {
    if (commit.isLast) {
      const stdout = execSync(commit.cmd, { env: commit.env }).toString();
      if (!stdout.trim()) continue;
      const lastCommitCmd = `${gitCmdBase} commit --author="${userName} <${userEmail}>" -m "Commit #${counter} for ${commit.date}" --date="${commit.date}"`;
      execSync(lastCommitCmd, { env: commit.env });
    } else {
      execSync(commit.cmd, { env: commit.env });
    }

    process.stdout.write(
      `\r> Commit ${commit.idx + 1}/${totalToCommit} (${Math.round(
        ((commit.idx + 1) / totalToCommit) * 100
      )}%)`
    );
  }

  // Restaure la config git locale d'origine
  try {
    if (oldUserName)
      execSync(`${gitCmdBase} config user.name "${oldUserName}"`);
    if (oldUserEmail)
      execSync(`${gitCmdBase} config user.email "${oldUserEmail}"`);
  } catch {}

  process.stdout.write("\n");
  // Push automatique vers le dépôt distant (option --quiet pour accélérer)
  try {
    console.log();
    console.log("> Pushing commits to remote repository... 🚀");
    execSync(`${gitCmdBase} push origin main --quiet`);
    console.log("> Push commits to remote completed ✅");
    // Nettoyage des fichiers temporaires après push
    clearRecordsFolder(logsDir);
  } catch (err: any) {
    log("error", `❌ Git push failed: ${err.message}`);
  }
}
