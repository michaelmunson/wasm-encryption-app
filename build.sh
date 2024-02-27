function reset-cache {
    rm -rf pkg target
}

if [ $1 = "reset" ]; then 
    reset-cache
fi

wasm-pack build --target web