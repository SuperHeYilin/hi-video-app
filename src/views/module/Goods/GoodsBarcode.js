import React, { Component } from 'react'
import JsBarcode from 'jsbarcode'

class GoodsBarCode extends Component {
  componentDidMount() {
    const { barcode } = this.props
    JsBarcode(this.barcodeSVG, barcode,
      {
        // displayValue: false, //  不显示原始值
        format: "CODE128",
          width: 1.8,
          height: 40,
          background: 'transparent',
      }
    );
  }

  render() {
    return (
      <svg ref={(obj) => this.barcodeSVG = obj} />
    )
  }
}
export default GoodsBarCode