import { getLyric, getSongUrl, getIntelligence } from '@/api/song'

// param图片宽高
export function normalSong (song, param = '300y300', isFm = false) {
  // if (song.al) {
  //   avatar = song.al.picUrl
  // } else if (song.album) {
  //   avatar = await getAlbum(song.album.id).songs[0].al.picUrl
  // } else {
  //   avatar = 'images/default_album.jpg'
  // }
  let avatar = song.avatar || (song.album && (song.album.picUrl || song.album.artist.img1v1Url)) || (song.al && song.al.picUrl) || 'images/default_album.jpg'
  return {
    id: song.id,
    name: song.name,
    duration: song.duration / 1000 || song.dt / 1000,
    album: song.album || song.al,
    alia: song.alias || song.alia,
    artist: song.artists || song.ar,
    avatar: `${avatar}?param=300y300`,
    lyric: '',
    url: '',
    mvid: song.mvid || song.mv || '',
    hot: 90,
    isFm
  }
}

export async function getUrl (id) {
  try {
    let songUrl = ''
    let res = await getSongUrl(id)
    if (!res.data || !res.data.length) {
      songUrl = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    } else if (res.data[0].url) {
      songUrl = res.data[0].url
    }
    return songUrl
  } catch (error) {
    console.log(error)
    return ''
  }
}

export function generateName (song) {
  let artistStr = song.artist.map(item => item.name).join(',').trim()
  return `${artistStr} - ${song.name}.mp3`
}
