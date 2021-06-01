const { Movie, Sentence, Music } = require("./classic")
const { Favor } = require('@models/favor') // 使用别名改写
const { Op } = require('sequelize')
// 相对于
class Art {
  constructor(art_id, type) {
    this.art_id = art_id
    this.type = type
  }

  async getDetail(uid) {
    const art = await Art.getData(this.art_id, this.type)
    if (!art) { // 如果art不存在抛出异常
      throw new global.errs.NotFound()
    }
    const like_status = await Favor.userLikeIt(this.art_id, this.type, uid)
    return { art, like_status }
  }

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
  /**
   * 
   * @param {*} artInfoList : favor表的记录数组
   */
  static async getFavorList(artInfoList) {
    
    const artInfoObj = {
      100: [],
      200: [],
      300: []
    }
    // 将artInfoList中不同类型的期刊分类存到artInfoObj
    for(let artInfo of artInfoList) {
      if (artInfo.type in artInfoObj) {
        artInfoObj[artInfo.type].push(artInfo.art_id)
      }
    }
    const artList = []
    for(let key in artInfoObj) {
      const ids = artInfoObj[key]
      if (ids.length === 0) {
        continue
      }
      const arts = await Art._getListByType(ids, parseInt(key, 10))
      artList.push(...arts)
    }
    return artList
  }

  static async _getListByType(ids, type) {
    let arts = []
    const finder = {
      where: {
        id: {
          [Op.in]: ids //数据库内置in查询
        }
      }
    }
    switch (type) {
      case 100: // Movie表中查询
        arts = await Movie.scope('bh').findAll(finder) // 使用全局的bh scope
        break
      case 200: // 从Music表中查询
        arts = await Music.scope('bh').findAll(finder)
        break
      case 300: // 从Sentence表中查询
        arts = await Sentence.scope('bh').findAll(finder)
        break
      case 400: // 从Book表中查询
        break
      default:
        break
    }
    return arts
  }
}

module.exports = {
  Art
}