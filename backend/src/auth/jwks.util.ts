import fs from 'fs';
import jose from 'node-jose';

// This async function reads the RSA public PEM and generates JWKS JSON.
export async function getJwks() {
  const publicKey = fs.readFileSync('jwt-public.pem', 'utf8');
  const key = await jose.JWK.asKey(publicKey, 'pem');
  return { keys: [key.toJSON()] };
}
