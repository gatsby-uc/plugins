import chalk from "chalk";
import { pathExists } from "fs-extra/esm";
import { readdir } from "fs/promises";
import { cwd } from "node:process";
import { join } from "node:path";

const ENABLE_DEBUG = false;

let had_error = false;

const log = {
  error: (name, message, ...rest) => {
    had_error = true;
    console.error(chalk.bold.gray(`[${name}]:`), chalk.bold.red(message), ...rest);
  },
  info: (name, message, ...rest) =>
    ENABLE_DEBUG && console.info(chalk.bold.gray(`[${name}]:`), chalk.blue(message), ...rest),
  ok: (name, message, ...rest) =>
    console.log(chalk.bold.gray(`[${name}]:`), chalk.green(message), ...rest),
};

const PACKAGES_PATH = join(cwd(), "packages");

const GATSBY_FILES = ["gatsby-config.js", "gatsby-browser.js", "gatsby-ssr.js", "gatsby-node.js"];

// Get All Packages

const packageFolders = (await readdir(PACKAGES_PATH, { withFileTypes: true }))
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const results_table = {};

// Filter Packages to those using babel exports to dist
for (const name of packageFolders) {
  const packagePath = join(PACKAGES_PATH, name);

  if (!(await pathExists(join(packagePath, "src")))) {
    log.info(name, `does not use builds.`);
    continue;
  }

  if (!(await pathExists(join(packagePath, "dist")))) {
    log.error(
      name,
      `Missing dist folder! Did you run build and is it configured to output to the \`dist\` folder?`
    );
  }

  results_table[name] = {};

  // Check index.js exists in root
  results_table[name]["index.js"] = "❓";

  if (await pathExists(join(packagePath, "index.js"))) {
    results_table[name]["index.js"] = "✅";
  } else {
    log.info(name, `does not have empty 'index.js' in root.`);
    results_table[name]["index.js"] = "❌";
  }

  // Check which Gatsby files exist in dist
  for (const fileName of GATSBY_FILES) {
    const filePath = join(packagePath, "dist", fileName);
    results_table[name][fileName] = "❓";

    if (!(await pathExists(filePath))) {
      log.info(name, `${chalk.bold("NOT")} Found: ${fileName}`);
      results_table[name][fileName] = "❎";
      continue;
    }

    log.info(name, `Found: ${fileName}`);

    // Verify those files are re-exported in root
    if (!(await pathExists(join(packagePath, fileName)))) {
      results_table[name][fileName] = "❌";
      log.error(
        name,
        `${fileName} is in \`dist\` but is not in root.`,
        `Gatsby requires these files in root, please re-export file in \`dist\` from package root by placing the code`,
        `\`${chalk.green("module")}.${chalk.green("exports")} = ${chalk.hex("dcdcaa")(
          "require"
        )}${chalk.hex("ffd700")("(")}${chalk.hex("ce9178")(
          `"./dist/${fileName.split(".")[0]}"`
        )}${chalk.hex("ffd700")(")")};\``,
        "in a file @",
        chalk.underline(`${join("packages", name, fileName)}`)
      );

      continue;
    }

    log.info(name, `${fileName} is correcly exported!`);
    results_table[name][fileName] = "✅";
  }
}

console.table(results_table);
console.log(`❓ = Unknown, ❎ = Not used, ✅ = Correctly re-exported, ❌ = Not re-exported`);

if (had_error) {
  log.error("test", "Exiting with Errors. Did not pass.");
  process.exit(1);
} else {
  log.ok("test", "Passed!");
}
