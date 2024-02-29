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
    const pswd = {
        init(){
            document.getElementById('password-input')
                .addEventListener('keypress', function(e){
                    if (e.key === "Enter"){
                        document.querySelectorAll('.password-input-mode')
                            .forEach(element => {
                                element.classList.remove('password-input-mode')
                                element.classList.add('password-input-mode-off'); 
                            });
                    }
                });
            document.querySelector('hgroup span')
                .addEventListener('click', function(){
                    document.querySelectorAll('.password-input-mode-off')
                        .forEach(element => {
                            element.classList.remove('password-input-mode-off')
                            element.classList.add('password-input-mode'); 
                        });
                })
            /*
            function pswdkeydown(e){
                                    if (e.keyCode === 13){
                                        document.querySelectorAll('.password-input-mode')
                                        .forEach(element => element.classList.remove('password-input-mode'))
                                    }
                                }
            */
        }
    }
    const details = {
        init(){
            const detailsElements = [...document.querySelectorAll('details')]; 
            detailsElements.forEach(element => {
                element.addEventListener('click', function(){
                    if (!this.open){
                        detailsElements.filter(e => e !== this).forEach(e => e.open = false); 
                    }
                })
            })
        }
    } 
    const fileInput = {
        init(){
            document.querySelectorAll('#file-encryption input').forEach(element => {
                const dataRole = element.getAttribute('data-role');
                if (dataRole === "encrypt"){
                    element.addEventListener('change', async function(){
                        const file = this.files[0];
                        if (file){
                            const password = getPassword();
                            const name = file.name;
                            const buffer = new Uint8Array(await file.arrayBuffer());
                            const encrypted = encrypt(password, buffer);
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
                            const name = file.name.includes('.encoded') ?
                                            file.name.replace('.encoded', '') :
                                            `${file.name}.decoded`;
                            const arrBuff = new Uint8Array(await file.arrayBuffer()); 
                            const decrypted = decrypt(password, arrBuff);
                            const decryptedBlob = new Blob([decrypted]); 
                            download(decryptedBlob, `${name}`);
                        }
                    })
                }
            })
        }
    }
    const textInput = {
        init(){
            const button = document.getElementById('encrypt-text-input-button')
            button.addEventListener('click', function(){
                const text = document.getElementById('text-input').value;
                const password = getPassword(); 
                const encrypted = encrypt(password, text);
                const encryptedBlob = new Blob([encrypted]);
                download(encryptedBlob, `${Date.now()}.encoded`);
            })
        }
    }

    /* INITIALIZE */
    pswd.init();
    details.init();
    fileInput.init();
    textInput.init();
});

