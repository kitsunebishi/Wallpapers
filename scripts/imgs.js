(async () => {
    const limit = 389
    const extension = [".png", ".jpg", ".jpeg"];

    const getExt = async (index) => {
        const rp = "0".repeat(5 - `${index}`.length)
        for (const e of extension) {
            try {
                const res = await fetch(`./images/${rp}${index}${e}`)
                if (res.ok) return e
            } catch (_) {}
        }
        return extension[0]
    }

    const addImage = async (line) => {
        const imgs = document.getElementById('imgs')

        for (i = line; i<line+lines; i+=3){
            const rp = p => "0".repeat(5 - `${i+p}`.length)
            
            for (i=line; i<line+lines; i+=3){
                // const rp = p => "0".repeat(5 - `${i+p}`.length)

                const [ext0, ext1, ext2] = await Promise.all([
                    getExt(i),
                    getExt(i+1 < limit ? i+1 : i),
                    getExt(i+2 < limit ? i+2 : i)
                ])

                
                imgs.innerHTML += `
                <div class="row">
                <div class="card">
                <img src="/images/${rp(0)}${i}${ext0}" alt="">
                </div>
                <div class="card">
                <img src="/images/${rp(1)}${i+1 < limit ? i+1 : i}${ext1}" alt="">
                </div>
                <div class="card">
                <img src="/images/${rp(2)}${i+2 < limit ? i+2 : i}${ext2}" alt="">
                </div>
                </div>
                `
            }
        }
    }

    let line = 0, lines = 6

    const load = document.getElementById('unload')
    const unload = document.getElementById('load')

    const loadImgs = async () => {
        document.getElementById('lines').innerHTML = `${line}/${limit}`
        if (line >= limit)
            load.classList.add(['block'])
        else load.classList.remove(['block'])

        if (line <= 0)
            unload.classList.add(['block'])
        else unload.classList.remove(['block'])

        await addImage(line).then(() => {
            const cards = document.getElementsByClassName('card')
            
            for (c = 0; c < cards.length; c++){
                cards[c].addEventListener('click', e => {
                    const current = e.currentTarget
            
                    open(current.lastElementChild.currentSrc, "_blank")
                })
            }
        })
    }

    await loadImgs()

    load.addEventListener('click', async () => {
        if (line < limit) {
            line += lines
            imgs.innerHTML = ``
            await loadImgs()
        }
    })
    
    unload.addEventListener('click', async () => {
        if (line >= 3) {
            line -= lines
            imgs.innerHTML = ``
            await loadImgs()
        }
    })
})()
