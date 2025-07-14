import { execSync } from "child_process";
import { mkdirSync, readdirSync, writeFileSync } from "fs";
import { join, sep } from "path";

import packageJson from '../package.json' with { type: "json" };

const buildDir = "build";
const distDir = "dist";
const manifestFilename = "pkg_manifest.toml";

function main() {
  const version = getVersion();
  console.info(`version: ${version}`);

  const commitShort = getCommitShort();
  if (!commitShort) process.exit(1);
  console.info(`commit: ${commitShort}`);

  try {
    mkdirSync(distDir);
  } catch (err) {
    if (!isEexist(err)) {
      console.error(`could not ensure "dist" directory ${err}`);
      process.exit(2);
    }
  }
  createPackageManifest(version, commitShort);

  const buildFiles = getBuildFiles();
  const distPackagePath = tarPackage(buildFiles, version);
  if (!distPackagePath) {
    console.error(`package has not been created`);
    process.exit(3);
  }

  console.info(`package created at path "${distPackagePath}"`);
}

function getCommitShort(): string | undefined {
  const cmd = ["git", "rev-parse", "--short", "HEAD"];

  try {
    const result = execSync(cmd.join(" "));
    return (new TextDecoder().decode(result)).trim();
  } catch (err) {
    console.error(`could not check git hash: ${err}`);
  }
}

function getVersion(): string {
  return packageJson.version;
}

function getBuildFiles(): string[] {
  const dirents = readdirSync(buildDir, { recursive: true, withFileTypes: true });
  const names: string[] = [];

  for (const entry of dirents) {
    if (!entry.isFile()) continue;

    const fullPath = join(entry.parentPath, entry.name).replace(`${buildDir}${sep}`, '');
    names.push(fullPath);
  }

  return names;
}

function createPackageManifest(version: string, commit: string) {
  const packageManifestLines = [
    "[version_info]",
    `version = "${version}"`,
    `commit = "${commit}"`,
  ];

  const manifest_path = join(buildDir, manifestFilename);
  writeFileSync(manifest_path, packageManifestLines.join('\n'), { flag: 'w'});
}

function tarPackage(files: string[], version: string): string | undefined {
  const distPath = join(distDir, `${version}.tar.gz`);
  const cmd = ["tar", "-czf", distPath, "-C", buildDir, ...files];

  try {
    execSync(cmd.join(" "));
    return distPath;
  } catch (err) {
    console.error(`could not tar files: ${err}`);
  }
}

function isEexist(err: unknown) {
  return isErr(err) && err.code === 'EEXIST'; 
}

function isErr(err: unknown): err is { code: string } {
  return !!(err && err['code']);
}

main();
