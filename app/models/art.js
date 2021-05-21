const { Movie, Sentence, Music } = require("./classic")

class Art {
  // 获取特定期刊信息，一个期刊由type和id两个属性确定
  static async getData(art_id, type) {
    let art = null
    const finder = {
      where: {
        id: art_id
      }
    }
    switch (type) {
      case 100: // Movie表中查询
        art = await Movie.scope('bh').findOne(finder) // 使用全局的bh scope
        break
      case 200: // 从Music表中查询
        art = await Music.scope('bh').findOne(finder)
        break
      case 300: // 从Sentence表中查询
        art = await Sentence.scope('bh').findOne(finder)
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