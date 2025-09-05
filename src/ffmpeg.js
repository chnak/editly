import fsExtra from 'fs-extra';
import { execa } from 'execa';
import assert from 'assert';
import { compareVersions } from 'compare-versions';
export function getFfmpegCommonArgs({ enableFfmpegLog }) {
    return enableFfmpegLog ? [] : ['-hide_banner', '-loglevel', 'error'];
}
export function getCutFromArgs({ cutFrom }) {
    return cutFrom ? ['-ss', cutFrom.toString()] : [];
}
export function getCutToArgs({ cutTo, cutFrom, speedFactor }) {
    return cutFrom && cutTo ? ['-t', (cutTo - cutFrom) * speedFactor] : [];
}
export async function createConcatFile(segments, concatFilePath) {
    // https://superuser.com/questions/787064/filename-quoting-in-ffmpeg-concat
    await fsExtra.writeFile(concatFilePath, segments.map((seg) => `file '${seg.replace(/'/g, "'\\''")}'`).join('\n'));
}
export async function testFf(exePath, name) {
    try {
        const { stdout } = await execa(exePath, ['-version']);
        
        // 简单检查是否能正常运行，不严格检查版本
        if (stdout.includes('ffmpeg') || stdout.includes('version')) {
            console.log(`✅ ${name} 检测通过`);
            return true;
        }
        
        throw new Error('无法识别 ffmpeg 输出');
        
    } catch (err) {
        console.warn(`⚠️  ${name} 检测警告:`, err.message);
        return false;
    }
}