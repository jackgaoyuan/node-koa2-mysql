const { Sequelize , Model, DataTypes } = require('sequelize')
const { sequelize } = require('../core/db')

/**
 * music + sentence + move = classic
 *  classic + book = art
 * 包含music, sentence, movie的model
 * 共有属性：image, title, publicDate, content, fav_nums
 * music独有属性：音乐播放链接url
 */

const classicFields = {
  image: DataTypes.STRING,
  content: DataTypes.STRING,
  pubDate: DataTypes.DATEONLY,
  fav_nums: DataTypes.INTEGER,
  title: DataTypes.STRING,
  type: DataTypes.TINYINT,
}

class Movie extends Model {}

Movie.init(classicFields, { sequelize, tableName: 'movie' })

class Sentence extends Model {}

Sentence.init(classicFields, { sequelize, tableName: 'sentence' })

class Music extends Model {}

Music.init({...classicFields, ...{ url: DataTypes.STRING }}, { sequelize , tableName: 'music' })

module.exports = {
  Movie,
  Sentence,
  Music
}
