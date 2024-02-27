import init, {encrypt, decrypt} from "./pkg/hello_wasm.js";

init().then(() => {
    const getPassword = () => document.querySelector('#password-input input').value;
    const download = (blob, filename) => {
        const downloadAnchor = document.getElementById('download-anchor');
        if (!downloadAnchor) return;
        downloadAnchor.href = URL.createObjectURL(blob);
        downloadAnchor.download = filename;
        downloadAnchor.click();
    } 
    const fileEncryption = {
        init(){
            document.querySelectorAll('#file-encryption input').forEach(element => {
                const dataRole = element.getAttribute('data-role');
                if (dataRole === "encrypt"){
                    element.addEventListener('change', async function(){
                        const file = this.files[0];
                        if (file){
                            const password = getPassword();
                            const name = file.name.slice(0, file.name.indexOf('.'));
                            const text = await file.text();
                            const encrypted = encrypt(password, text);
                            const encryptedBlob = new Blob([encrypted]);
                            download(encryptedBlob, `${name}.encoded`);
                        }
                    })
                }
                else if (dataRole === "decrypt"){
                    element.addEventListener('change', async function(){
                        const file = this.files[0];
                        if (file){
                            console.log(file);
                            const password = getPassword();
                            const name = file.name.slice(0, file.name.indexOf('.'));
                            const arrBuff = new Uint8Array(await file.arrayBuffer()); 
                            const decrypted = decrypt(password, arrBuff);
                            const decryptedBlob = new Blob([decrypted]); 
                            download(decryptedBlob, `${name}.decoded.txt`);
                        }
                    })
                }
            })
        }
    }

    /* INITIALIZE */
    fileEncryption.init();

});

