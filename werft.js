// @ts-check
const cp = require("child_process");

/**
 * @param {string} command
 * @param {{cwd?: string, quiet?: boolean, ghtoken?: boolean}} [options]
 * @returns {Promise<{ stdout: string, stderr: string }>}
 * @license EPL-2.0
 * @source https://github.com/open-vsx/publish-extensions/blob/master/lib/exec.js
 */
const exec = async (command, options) => {
    if (!options?.quiet) {
        console.log(`Running: ${command}`);
    }
    return new Promise((resolve, reject) => {
        const child = cp.exec(
            command,
            {
                cwd: options?.cwd,
                maxBuffer: 10 * 1024 * 1024, // 10MB
                env: {
                    ...process.env,
                },
                shell: "/bin/bash",
            },
            (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }
                resolve({ stdout, stderr });
            },
        );
        if (!options?.quiet) {
            child.stdout.pipe(process.stdout);
        }
        child.stderr.pipe(process.stderr);
    });
};

const jobName = process.argv[2];

(async () => {
    const jobData = await exec(`werft job list -o json --limit 5 --order created:desc  name~=${jobName}`, {quiet: true});
    const firstDone = JSON.parse(jobData.stdout).result.find((job) => job.phase === "PHASE_DONE");

    if (!firstDone) {
        console.error("No last job found");
        process.exit(0);
    }

    console.log(!firstDone.conditions.success ? "failed" : "succeeded");
    process.exit(0);
})();
