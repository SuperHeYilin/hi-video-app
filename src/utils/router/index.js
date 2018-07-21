/**
 * 得到开发环境
 */
const getNodeEnv = () => {
  return process.env.NODE_ENV
}

/**
 * 验证开发环境
 * @param {string} nodeEnv
 */
const valiNodeEnv = (nodeEnv) => {
  return process.env.NODE_ENV === nodeEnv
}

export {
  getNodeEnv,
  valiNodeEnv,
}