import React, { Component } from 'react'
import { Ibox } from '../../../components/Ui'
class StoreView extends Component {

		componentDidMount () {
		  var BMap = window.BMap
		  var map = new BMap.Map("allmap"); // 创建Map实例
		  map.centerAndZoom(new BMap.Point(106.57022,29.532927), 14); // 初始化地图,设    置中心点坐标和地图级别
		  map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
		  map.setCurrentCity("重庆"); // 设置地图显示的城市 此项是必须设置的
		  map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
			map.addEventListener("click", (e)=>{
				this.mapClick(e);
			});
			this.setState({
				map:map
			})
			let { item } = this.props
			if(item&&item.longitude){
        	map.clearOverlays();
					var marker = new BMap.Marker(new BMap.Point(item.longitude, item.latitude)); // 创建点
					map.addOverlay(marker);    //增加点
					map.centerAndZoom(new BMap.Point(item.longitude, item.latitude), 14); // 初始化地图,设    置中心点坐标和地图级别
        }
		}
		mapClick=(e)=>{
			  let { form } = this.props
			  this.state.map.clearOverlays();
//				console.info(e.point.lng + ", " + e.point.lat);
				var marker = new window.BMap.Marker(new window.BMap.Point(e.point.lng, e.point.lat)); // 创建点
				this.state.map.addOverlay(marker);    //增加点
//				console.info(form.getFieldValue("latitude"));
				form.setFieldsValue({"longitude":e.point.lng,"latitude":e.point.lat});
		}
		
    constructor(props){
        super(props)
        this.state = {
        	point:{}
        }
        
    }

    render(){
    		
        return (
        	<div>
        		<div id="allmap"  style={{width:'77vw',height:'39vh' }}></div>
        	</div>
        )
    }
}

export default StoreView