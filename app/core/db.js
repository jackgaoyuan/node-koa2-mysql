const { Model } = require('sequelize')
const { Sequelize } = require('sequelize')
const {
  dbName,
  host,
  port,
  user,
  password
} = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: true, // 打印sql语句
  timezone: '+08:00',
  define: {
    timestamps: true, // Table内是否自动生成createAt, updateAt,
    paranoid: true, // 增加deletaAt字段，实现软删除,
    underscored: true, // column名都使用下划线
  }
})

// 将modol中定义的Table同步到数据库中
sequelize.sync({
  force: false
})

module.exports = {
  sequelize
}