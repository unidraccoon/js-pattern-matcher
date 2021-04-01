import * as fs from "fs";

export interface Patch {
    pattern: string;
    predicate: string;
}

export function parsePatch(file: string): Patch {
    let patchFile = fs.readFileSync(file, "utf8");
    return {
        pattern: patchFile.slice(0, patchFile.indexOf("---") - 1),
        predicate: patchFile.slice(patchFile.indexOf("---") + 4),
    };
}

