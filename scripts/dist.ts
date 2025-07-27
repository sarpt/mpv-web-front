import { execSync } from "child_process";
import { createReadStream, createWriteStream } from "fs";
import { join, sep } from "path";
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { rm, mkdir, readdir, writeFile } from "fs/promises";

import packageJson from '../package.json' with { type: "json" };

const buildDir = "build";
const distDir = "dist";
const manifestFilename = "pkg_manifest.toml";

async function main() {
  const version = getVersion();
  console.info(`version: ${version}`);

  const commitShort = getCommitShort();
  if (!commitShort) process.exit(1);
  console.info(`commit: ${commitShort}`);

  try {
    await mkdir(distDir);
  } catch (err) {
    if (!isEexist(err)) {
      console.error(`could not ensure "dist" directory ${err}`);
      process.exit(2);
    }
  }
  await createPackageManifest(version, commitShort);
  
  await gzipFiles();
  const buildFiles = await getBuildFiles();
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

async function getBuildFiles(): Promise<string[]> {
  const names: string[] = [];
  for await (const entry of iterateEntries(buildDir)) {
    names.push(join(entry.parentPath, entry.name).replace(`${buildDir}${sep}`, ''));
  }

  return names;
}

const gzippableExtensions = [
  '.js',
  '.html'
];
async function gzipFiles() {
  for await (const entry of iterateEntries(buildDir)) {
    const shouldGzip = gzippableExtensions.some(allowedExt => entry.name.endsWith(allowedExt));
    if (!shouldGzip) continue;

    const gzip = createGzip();
    const source = createReadStream(join(entry.parentPath, entry.name));
    const destination = createWriteStream(join(entry.parentPath, `${entry.name}.gz`));
    await pipeline(source, gzip, destination);
    await rm(join(entry.parentPath, entry.name));
  }
}

async function createPackageManifest(version: string, commit: string) {
  const packageManifestLines = [
    "[version_info]",
    `version = "${version}"`,
    `commit = "${commit}"`,
  ];

  const manifest_path = join(buildDir, manifestFilename);
  await writeFile(manifest_path, packageManifestLines.join('\n'), { flag: 'w'});
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

async function *iterateEntries(dir: string) {
  const dirents = await readdir(dir, { recursive: true, withFileTypes: true });

  for (const entry of dirents) {
    if (!entry.isFile()) continue;

    yield entry;
  }

  return;
}

await main();
