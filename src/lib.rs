use argon2::Argon2;
use flate2::Compression;
use flate2::write::{GzEncoder, GzDecoder};
use wasm_bindgen::prelude::*;
use std::io::Write;
use aes_gcm_siv::{
    aead::{Aead, KeyInit},
    Aes256GcmSiv, Nonce
};

extern crate console_error_panic_hook;

const SALT: &[u8] = b"I'M SO SALTY";
const PWD_KEY_SIZE: usize = 32;
const NONCE: &[u8] = b"NONCYNONCY12";

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn hashme(pwd: &str) {
    match derive_key_from_password(pwd) {
        Ok(s) => alert(&format!("Hashed password: {:x?}!", s)),
        Err(e) => alert(&format!("ERROR: {}", e))
    }
}

#[wasm_bindgen]
pub fn encode_decode_demo(password: &str, plaintext: &str) {
    console_error_panic_hook::set_once();
    let ciphertext = compress_and_encrypt(password, plaintext.as_bytes()).unwrap();
    let decoded = decrypt_and_decompress(password, &ciphertext[..]).unwrap();
    let decoded_string = String::from_utf8(decoded).unwrap();
    alert(&format!("Original: {}\n\nCiphertext: {:x?}\n\nDecoded: {}", plaintext, ciphertext, decoded_string));
}

fn derive_key_from_password(password: &str) -> Result<[u8; PWD_KEY_SIZE], &'static str> {
    let mut output_key_material = [0u8; PWD_KEY_SIZE]; // Can be any desired size
    Argon2::default().hash_password_into(password.as_bytes(),
                                         SALT, 
                                         &mut output_key_material)
                     .expect("Argon2 unable to hash password");
    Ok(output_key_material)
}

pub fn compress_and_encrypt(password: &str, plaintext: &[u8]) -> Result<Vec<u8>, &'static str> {
    // first, compress the data
    let mut encoder = GzEncoder::new(Vec::new(), Compression::best());
    encoder.write_all(plaintext).unwrap();
    let compressed_data = encoder.finish().unwrap();
    // now, encrypt
    let key = derive_key_from_password(password).unwrap();
    let nonce = Nonce::from_slice(NONCE);
    let cipher = Aes256GcmSiv::new_from_slice(&key).unwrap();
    cipher.encrypt(nonce, compressed_data.as_ref()).map_err(|_| "Failed to encrypt")
}

pub fn decrypt_and_decompress(password: &str, ciphertext: &[u8]) -> Result<Vec<u8>, &'static str> {
    // first decrypt the data
    let key = derive_key_from_password(password).unwrap();
    let nonce = Nonce::from_slice(NONCE);
    let cipher = Aes256GcmSiv::new_from_slice(&key).unwrap();
    let data = cipher.decrypt(nonce, ciphertext.as_ref()).expect("Couldn't decrypt data");

    // now, decompress data
    let mut decoder = GzDecoder::new(Vec::new());
    decoder.write_all(&data[..]).unwrap();
    decoder.finish().map_err(|_| "Failed to decompress")
}
