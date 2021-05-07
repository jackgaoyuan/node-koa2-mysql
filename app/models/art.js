const { Movie, Sentence, Music } = require("./classic")

class Art {
  static async getData(art_id, type) { // 根据Flow表中的arty_id, type查询详细信息

    let art = null
    const finder = {
      where: {
        id: art_id
      }
    }
    switch (type) {
      case 100: // Movie表中查询
        art = await Movie.findOne(finder)
        break
      case 200: // 从Music表中查询
        art = await Music.findOne(finder)
        break
      case 300: // 从Sentence表中查询
        art = await Sentence.findOne(finder)
        break
      case 400: // 从Book表中查询
        break
      default:
        break
    }
    return art
  }
}

module.exports = {
  Art
}