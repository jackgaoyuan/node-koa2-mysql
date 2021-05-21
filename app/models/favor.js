const { sequelize } = require('../core/db')
const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const { Art } = require('./art')

// Favor 模型包含用户的点赞信息，表示用户点赞了哪些article
// Favor模型包含的方法： 用户点赞，用户取消点赞
class Favor extends Model {
  // 1 在Favor表中添加一条点赞记录
  // 2 修改相应art的fav_num数字
  // 数据库事务可以保证 1,2两个操作都执行，或者都不执行, 保证数据一致性
  static async like(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    })
    if (favor) { // 如果有favor记录，表示用户已经对改art点过赞了
      throw new global.errs.LikeError()
    }
    // 数据库事务
    return sequelize.transaction(async t => {
      await Favor.create({ // 在Favor表中增加一条点赞记录
        art_id,
        type,
        uid
      }, { transaction: t })
      const art = await Art.getData(art_id, type)
      // art模型的increment方法
      await art.increment('fav_nums', { by: 1, transaction: t })
    })
  }
  // 用户取消点赞
  static async dislike(art_id, type, uid) {
    const favor = await Favor.findOne({ // favor 是找到的一条记录
      where: {
        art_id,
        type,
        uid
      }
    })
    if (!favor) { // 如果没有点赞记录，不需要取消点赞
      throw new global.errs.DislikeError()
    }
    // 数据库事务
    return sequelize.transaction(async t => {
      await favor.destroy({ // 销毁查询到的该条记录
        force: true,
        transaction: t
      })
      const art = await Art.getData(art_id, type)
      // art模型的increment方法
      await art.decrement('fav_nums', { by: 1, transaction: t })
    })
  }

  static async userLikeIt(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: { art_id, type, uid }
    })
    return favor ? true : false
  }

  static async getMyClassicFavors(uid) {
    const arts = await Favor.findAll({
      where: {
        uid,
        type: {
          // MySQL内置操作符，type ！== 400
          // 不查询Book，book不是期刊
          [Op.not]: 400
        }
      }
    })
    if (!arts) {
      throw new global.errs.NotFound()
    }
  }
} 

Favor.init({
  uid: DataTypes.INTEGER, // 用户ID
  art_id: DataTypes.INTEGER, //点过赞的art ID,
  type: DataTypes.INTEGER, // art的类型，art_id + type确定一个art
}, { sequelize , tableName: 'favor' })

module.exports = { Favor }