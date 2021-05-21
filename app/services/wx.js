const axios = require('axios')
const util = require('util')
const { User } = require('../models/user')
const { generateToken } = require('../core/util')
const { SCOPE } = require('../lib/const')
// 小程序登陆传入code，调用微信的api验证code，如果验证成功
// 则返回用户的openid，openid是用户在小程序的唯一标识
// 小程序身份验证参数：code, appid, appsecret

class WXManager { // 微信小程序登陆管理
  static async codeToToken(code) {
    console.log('code', code)
    // 模版替换生成正确的url
    const url = util.format(global.config.wx.loginUrl,
      global.config.wx.appId,
      global.config.wx.appSecret,
      code)
    // 调用微信api验证code，并返回openid
    const result = await axios.get(url)
    if (result.status !== 200) {
      throw new global.errs.AuthFailed('openid获取失败')
    }
    const { errcode } = result.data
    if (errcode) { // 如果请求成功，返回不包含errcode
      throw new global.errs.AuthFailed(`openid获取失败 ${result.data.errmsg}`)
    }
    console.log('openid', result.data.openid)
    // 查询openid
    let user = await User.getUserByOpenid(result.data.openid)
    if (!user) { // 如果没有openid对应的用户，新增用户
      user = await User.registerByOpenid(result.data.openid)
    }
    // 通过id和scope生成token
    const token = generateToken(user.id, SCOPE.USER)
    return token
  }
}

module.exports = {
  WXManager
}
