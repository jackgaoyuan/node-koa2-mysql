module.exports = {
  // 开发环境；dev 生产环境：prod
  environment: 'dev',
  database: {
    dbName: 'island',
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Gaoyuan123!'
  },
  security: {
    secretKey: 'abcdfefd',
    expiresIn: 60*60*24*30,
  },
  wx: {
    appId: 'wx2bcf9c041e8f886d',
    appSecret: '5a63d244f586e01faf8e966bbc6a32ab',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code',
  }
}