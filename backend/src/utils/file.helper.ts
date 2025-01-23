import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

export function deleteFileIfExists(filePath: string, baseImageUrl: string) {
    const fileSystemPath = join(
        process.cwd(),
        filePath.replace(baseImageUrl, ''),
    );
    if (existsSync(fileSystemPath)) {
        unlinkSync(fileSystemPath);
    }
}
