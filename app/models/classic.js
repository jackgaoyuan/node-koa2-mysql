const {  Model, DataTypes } = require('sequelize')
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
  pubdate: DataTypes.DATEONLY,
  fav_nums: DataTypes.INTEGER,
  title: DataTypes.STRING,
  type: DataTypes.TINYINT,
}

class Movie extends Model {} // type = 100

Movie.init(classicFields, { sequelize, tableName: 'movie' })

class Sentence extends Model {} // type = 300

Sentence.init(classicFields, { sequelize, tableName: 'sentence' })

class Music extends Model {} // type = 200

Music.init({...classicFields, ...{ url: DataTypes.STRING }}, { sequelize , tableName: 'music' })

module.exports = {
  Movie,
  Sentence,
  Music
}
