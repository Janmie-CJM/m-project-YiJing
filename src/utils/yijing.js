export function findImg(file, name) {
  let img = require('@/assets/mockdata/backup.png')
  try {
    img = require(`@/assets/mockdata/${file}/${name}.png`)
  } catch (e) {
    try {
      img = require(`@/assets/mockdata/${file}/${name}.jpg`)
    } catch (e) {
      console.log(e)
    }
  }
  return img
}
