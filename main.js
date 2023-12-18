let isUsed = false
let lastUrl = window.location.pathname

const addButtonToSongs = async () => {

    if (lastUrl !== window.location.pathname){
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa")
        isUsed = false
    }

    if (isUsed){
        return
    }

    lastUrl = window.location.pathname

    const songs = document.querySelectorAll('.RYR7U')

    for (const song of songs) {
        const titleElement = song.querySelector('[data-testid="title"]')

        if (titleElement) {
            const trackName = titleElement.textContent.trim().replace(/^\d+\.\s*/, '')

            const button = document.createElement('button');

            let trackData
            switch (getType()) {
                case 'playlist':
                     trackData = await getTrackDataByPlaylist(getPlaylistId(), trackName)
                    break
                case 'album':

                    trackData = await getTrackDataByAlbum(getAlbumId(), trackName)
                    break
                    default:
                        console.log("Type not found.")
                        break
            }

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

const getPlaylistId = () => {
    const currentUrl = window.location.href
    const regex = /\/playlist\/(\d+)/
    const match = currentUrl.match(regex);

    if (match && match[1]) {
        return match[1];
    } else {
        alert("Aucun playlistId trouvé dans l'URL.");
    }
}

const getType = () => {
    return window.location.pathname.split('/')[2];
}

const getTrackDataByAlbum = async (albumId, targetName) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch(`https://api.deezer.com/album/${albumId}`, requestOptions)
    const data = await response.json()

    return filterData(data['tracks']['data'], targetName)
}

const getTrackDataByPlaylist = async (playlistId, targetName) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const response = await fetch(`https://api.deezer.com/playlist/${playlistId}`, requestOptions)
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