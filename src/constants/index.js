/**
 * 项目信息
 */
export const project = {
  name: 'Admin',
  prefix: 'DIFFPI-ADMIN',
  footerText: 'DIFFPI-ADMIN 版权所有 © 2018 由 DIFFPI 支持',
  logo: require('../public/imgs/cbt-logo.png'),
  logoTxt: require('../public/imgs/cbt-logo-text.jpg'),
  iconFontUrl: '',
  YQL: ['http://www.ldfine.com'],
  CORS: ['http://localhost:8080'],
}

/**
 * api请求信息
 */
const devHost = "http://localhost:8080"
const prodHost = "http://kuaigou.cbtbuy.com"
const devBaseURL = devHost + '/api/b/v1.0/'
const prodBaseURL = prodHost + "/diffpi/api/b/v1.0/"
const goodsViewURL = prodHost + "/#/goodsview/preview/"
const imgURL = prodHost + "/diffpi/upload/"
export const api = {
  devBaseURL,
  prodBaseURL,
  devHost,
  prodHost,
  goodsViewURL,
  imgURL,
}

export const publicPath = process.env.NODE_ENV === 'production' ? "/kjb-admin/" : "/"