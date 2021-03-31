const { Sequelize , Model, DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../core/db')
const { NotFound, AuthFailed } = require('../core/http-exception')

class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw new NotFound('账号不存在')
    }
    const correct = bcrypt.compareSync(plainPassword, user.password)
    if (!correct) {
      throw new AuthFailed('密码不正确')
    }
    return user
  }
  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: { openid }
    })
    return user
  }
  static async registerByOpenid(openid) {
    const user = await User.create({
      openid
    })
    return user
  }
}

// 初始化User表。1.定义User表结构 2.定义User表位于哪个数据库
User.init({ // 定义User表里面的Column属性
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, //设置成主键,不能重复，不能为空
    autoIncrement: true
  },
  nickname: DataTypes.STRING,
  email: {
    type: DataTypes.STRING(128),
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    // 当设置password字段时，调用set函数，该set函数
    // 的作用是将password加盐加密
    set(val) {
      // 生成盐
      const salt = bcrypt.genSaltSync(10)
      // 生成加盐之后的密码
      const pwd = bcrypt.hashSync(val, salt)
      this.setDataValue('password', pwd)
    }
  },
  openid: {
    type: DataTypes.STRING(64),
    unique: true
  }
}, { 
  sequelize, // 定义数据库
  tableName: 'user', // 定义表名
 })

module.exports = {
  User
}
