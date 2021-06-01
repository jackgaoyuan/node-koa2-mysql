const {  Model, DataTypes, Sequelize, Op } = require('sequelize')
const { sequelize } = require('../core/db')
const { Favor } = require('./favor')

const classicFields = {
  index: DataTypes.INTEGER, // 做排序
  image: DataTypes.STRING,
  author: DataTypes.STRING,
  title: DataTypes.STRING, 
}

class HotBook extends Model {
  static async getAll() {
    const books = await HotBook.findAll({
      order: ['index']
    })
    const ids = []
    books.forEach(book => {
      ids.push(book.id)
    })
    const favors = await Favor.findAll({
      where: {
        art_id: {
          [Op.in]: ids
        }
      },
      group: ['art_id'],
      attributes: ['art_id', [Sequelize.fn('COUNT', '*'), 'count']]
    })
    return favors
  }
}

HotBook.init(classicFields, { sequelize, tableName: 'hot_book' })

module.exports = { HotBook }