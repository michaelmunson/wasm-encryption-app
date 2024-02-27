

function build {
    wasm-pack build --target web
    
    echo -e "\nDouble Press [ctrl]+c to exit.\n"


    if [ "$1" = "serve" ]; then
        python3 -m http.server 1006
    
        build $1
    fi
}

build $1