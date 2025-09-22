import fs from 'fs';

export const jwtConstants = {
  privateKey: fs.readFileSync(process.cwd() + '/jwt-private.pem', 'utf8'),
  publicKey: fs.readFileSync(process.cwd() + '/jwt-public.pem', 'utf8'),
  algorithm: 'RS256'
};
