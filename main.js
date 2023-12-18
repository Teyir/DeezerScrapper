let isUsed = false

const addButtonToSongs = async () => {
    if (isUsed){
        return
    }

    const songs = document.querySelectorAll('.RYR7U')

    for (const song of songs) {
        const titleElement = song.querySelector('[data-testid="title"]')

        if (titleElement) {
            const trackName = titleElement.textContent.trim().replace(/^\d+\.\s*/, '')

            const button = document.createElement('button');

            let trackData = await getTrackData(getAlbumId(), trackName)

            if (trackData === undefined) {
                return
            }

            button.textContent = 'Copier TrackID';
            button.addEventListener('click', async () => {
                await navigator.clipboard.writeText(trackData['id'])
                console.log('Bouton cliqué pour la chanson :', trackName);
            });

            const audio = document.createElement('audio')
            audio.preload = "none"
            audio.src = trackData['preview']
            audio.controls = true


            titleElement.parentNode.appendChild(button)
            titleElement.parentNode.appendChild(audio)
        }
    }
    isUsed = true
}

const getAlbumId = () => {
    const currentUrl = window.location.href
    const regex = /\/album\/(\d+)/
    const match = currentUrl.match(regex);

    if (match && match[1]) {
        return match[1];
    } else {
        alert("Aucun albumId trouvé dans l'URL.");
    }
}

const getTrackData = async (albumId, targetName) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch(`https://api.deezer.com/album/${albumId}`, requestOptions)
    const data = await response.json()

    return filterData(data['tracks']['data'], targetName)
}

const filterData = (data, targetName) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i]['title'] === targetName) {
            console.log(data[i])
            return data[i]
        }
    }
    return undefined
}

// Exécuter la fonction lorsque la page est chargée
window.addEventListener("dblclick", addButtonToSongs)