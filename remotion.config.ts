import {Config} from '@remotion/cli/config';
import fs from 'fs';

Config.setEntryPoint('./src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(18);

// Utilise le Chromium pré-installé s'il existe (sinon Remotion télécharge le sien).
const localShell = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (fs.existsSync(localShell)) {
  Config.setBrowserExecutable(localShell);
}
