# ClientCrypt
ClientCrypt is a purely client-side tool for password-protecting
arbitrary files. To reiterate: your files will never leave your device.
Just enter a password and upload a file, and an encrypted version will
be downloaded immediately. To decrypt the file, just re-enter the
password and upload the encrypted file.

## How Does It Work?
1. After entering a password, the Argon2 algorithm converts it to a 256-bit key.
2. When uploading a file for encryption, it is maximally compressed with GZIP and then encrypted with AES256.
3. When uploading a file for decryption, it is decrypted with AES256 and the decompressed.
4. The resulting file is automatically downloaded.

## Developers
### Running
```bash
bash build.sh
```
### Serving
```bash
bash build.sh serve
```
