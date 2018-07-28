import React, { Component } from 'react';

const num = Math.floor((Math.random() * 3) + 1);
const defaultS = require('../../../public/imgs/logo.png')
// const defaultS = require("../../../public/imgs/default" + num +".jpg")

// 图片组件
class Img extends Component {
  render() {
    const { src, alt, height = "100%", width, borderRadius = "", defaultSrc = defaultS } = this.props
    return (
      <div style={{ height, textAlign: "center"}}>
        <img src={src ? "http://localhost:8080/images/" + src : defaultSrc}
          ref={img => this.img = img}
          alt={alt}
          // style={{ height, width, borderRadius }}
          style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%" }}
          onError={() => this.img.src = defaultSrc}
        />
      </div>
    );
  }
}
export default Img;
