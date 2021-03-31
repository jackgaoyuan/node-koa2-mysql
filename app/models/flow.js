const { Sequelize , Model, DataTypes } = require('sequelize')
const { sequelize } = require('../core/db')

class Flow extends Model {}

Flow.init({
  index: DataTypes.INTEGER,
  art_id: DataTypes.INTEGER,
  type: DataTypes.INTEGER // MOVIE: 100, Music: 200, Sentence: 300
}, {
  sequelize,
  tableName: 'flow'
})

module.exports = {
  Flow
}