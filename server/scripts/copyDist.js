import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDist = path.join(__dirname, '../../client/dist');
const serverPublic = path.join(__dirname, '../public');

try {
  if (fs.existsSync(clientDist)) {
    if (fs.existsSync(serverPublic)) {
      fs.rmSync(serverPublic, { recursive: true, force: true });
    }
    fs.cpSync(clientDist, serverPublic, { recursive: true });
    console.log(`[Build Success] Cleanly copied ${clientDist} -> ${serverPublic}`);
  } else {
    console.error(`[Build Warning] client/dist not found at ${clientDist}`);
  }
} catch (err) {
  console.error(`[Build Error] Failed to copy static assets: ${err.message}`);
}
