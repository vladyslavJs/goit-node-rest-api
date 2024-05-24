import path from "node:path";
import crypto from "node:crypto";

import multer from "multer";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.resolve("tmp"));
    },
    filename(req, file, cb) {
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        const correctedBaseName = basename.replace(/\s+/g, '-');
        const suffix = crypto.randomUUID();

        cb(null, `${correctedBaseName}-${suffix}${extname}`);
    },
});

export const update = multer({ storage });