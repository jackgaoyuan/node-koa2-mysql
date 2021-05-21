const { LinValidator, Rule } = require('../core/lin-validator-v2')
const { User } = require('./../models/user')
const { ParameterException } = require('../core/http-exception')
const { LoginType, ArtType } = require('../lib/const')
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要是正整数', { min: 1 }),
    ]
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [
      new Rule( 'isEmail', '不符合email规范')
    ]
    // 原密码
    this.password1 = [
      new Rule('isLength', '至少6字符，最多32字符', {
        min: 6,
        max: 32
      }),
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ]
    // 确认密码
    this.password2 = this.password1
    this.nickname = [
      new Rule('isLength', '昵称长度最小4，最大32', { min: 4, max: 32 })
    ]
  }

  // 自定义验证，两个密码必须相同
  validatePassword(vals) {
    const pwd1 = vals.body.password1
    const pwd2 = vals.body.password2
    if (pwd1 !== pwd2) {
      throw new Error('两个密码必须相同')
    }
  }

  // 验证email是否已经存在
  async validateEmial(vals) {
    const email = vals.body.email
    const user = await User.findOne({
      where: { email }
    })
    if (user) {
      // 在自定义方法中抛出Error会被linValidator接住
      // 取出error message之后包装成HttpException
      throw new Error('email已存在')
    }
  }
}

class TokenValidator extends LinValidator {
  constructor() {
    super()
    this.account = [ // 验证账号
      new Rule('isLength', '不符合规则', { min: 4, max: 32 })
    ]
    // 验证密码,并不是所有登陆都需要密码
    // 传统登陆：账号 + 密码
    // 微信登陆，只需要账号，不需要密码
    // 手机号登陆
    this.secret = [
      new Rule('isOptional'), // 可以传，也可以不传
      new Rule('isLength', '至少6个字符', { min: 6, max: 128 })
    ]
    const checker = new Checker(LoginType)
    this.validateLoginType = checker.check.bind(checker)
  }
}
class NotEmptyValidator extends LinValidator { // 验证小程序的API请求，token不为空
  constructor() {
    super()
    this.token = [
      new Rule('isLength', '不允许为空', { min: 1 })
    ]
  }
}

function checkType(vals) {
  // 从body或者path取type参数
  let type = vals.body.type || vals.path.type
  if (!type) {
    throw new Error('type是必传参数')
  }
  // 将type从string转型成int通过校验，但是v.get(patg.type)依然是string
  type = parseInt(type)
  if (!LoginType.isThisType(type)) {
    throw new Error('type参数不合法')
  }
}

class Checker { // 根据传入的type，构造不同的check校验器
  constructor(type) {
    this.enumType = type
  }

  check(vals) {
    // 从body或者path取type参数
    let type = vals.body.type || vals.path.type
    if (!type) {
      throw new Error('type是必传参数')
    }
    // 将type从string转型成int通过校验，但是v.get(patg.type)依然是string
    type = parseInt(type)
    if (!this.enumType.isThisType(type)) {
      throw new Error('type参数不合法')
    }
  }
}

// 验证id是否为整数，type是否合法
class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    const checker = new Checker(ArtType)
    this.validateType = checker.check.bind(checker)
  }
}

// ClassicValidator和LikeValidator一摸一样，只是名字不一样
class ClassicValidator extends LikeValidator {}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  ClassicValidator,
}
