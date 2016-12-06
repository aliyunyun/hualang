require('normalize.css/normalize.css');
require('styles/App.css');
require('../styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom'
import {ImageFigure} from './ImageFigure';
import {ControllerUnit} from './ControllerUnit';

let imageDatas = require('../data/imageDatas.json');


// 获取图片相关的信息，讲图片名字信息装换成URL信息
imageDatas = (function getImagrURL(imageDatas){
	for (var i = 0, j = imageDatas.length ; i < j  ; i++) {
		let signalImageData = imageDatas[i];
		signalImageData.imageURL = require('../images/' + signalImageData.fileName);
		imageDatas[i] = signalImageData;
	};
	return imageDatas;
})(imageDatas);

/*
 * 获取区间内的一个随机值
 */
function getRangeRandow(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/*
 * 获取 0~30° 之间的一个任意正负值
 */
function get30DegRandow(){
  return (Math.random() > 0.5 ? '' : '-' + Math.ceil(Math.random() * 30));
}

class AppComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      imgsArrangeArr: [],
    };

    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {
        leftSecX:[0,0],
        rightSecX:[0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topY:[0, 0]
      }
    };


  }

  // 妙用block 来retain index
  centerAction(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  }

  inverse(index){
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr:imgsArrangeArr
      })
    }.bind(this);
  }

  // 组件加载以后，为每张图片计算位置
  componentDidMount() {

    // 计算舞台大小
    let dom = this.refs.stage ;

    let stageW = dom.scrollWidth,
      stageH = dom.scrollHeight,
      halfStageW = Math.ceil(stageW/2) ,
      halfStageH = Math.ceil(stageH/2) ;

    // 拿到第一个figure 计算大小
    let imageFigureDOM =  ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imageFigureDOM.scrollWidth,
        imgH = imageFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top:  halfStageH - halfImgH
    }

    //计算左右图片排布取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;

    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上图片排布取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] =  halfStageH - halfImgH*3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW ;

    this.rearrange(0);
  }


  //重新布局所有图片
  rearrange(centerIndex){
    let imageArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],

        topImgNum = Math.floor(Math.random() * 2), // 取一个或者不屈  floor 向下取证  ceil 向上取证
        topImgSpliceIndex = 0,

        //从imageArr中拿出图片，一张
        imgsArrangeCenterArr = imageArrangeArr.splice(centerIndex, 1);

        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true,
          isInverse: false
        };

        // 取出要布局上测的图片信息的状态信息，从数组中拿出一张或者0张图片
        topImgSpliceIndex = Math.ceil(Math.random() * (imageArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imageArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
              pos: {
                top: getRangeRandow(vPosRangeTopY[0], vPosRangeTopY[1]),
                left: getRangeRandow(vPosRangeX[0], vPosRangeX[1])
              },
              rotate: get30DegRandow(),
              isCenter: false,
              isInverse: false
            };
        });

        for(var i = 0 , j = imageArrangeArr.length, k = j /2; i < j; i++) {
          var hPosRangeLORX = null;

          // 前左半部分 // 前右半部分
          if (i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
          } else {
            hPosRangeLORX = hPosRangeRightSecX;
          }
          imageArrangeArr[i].pos = {
            top: getRangeRandow(hPosRangeY[0], hPosRangeY[1]),
            left: getRangeRandow(hPosRangeLORX[0], hPosRangeLORX[1])
          }

          imageArrangeArr[i].rotate = get30DegRandow();
          imageArrangeArr[i].isCenter = false;
          imageArrangeArr[i].isInverse = false;
        }

        debugger

        // 追加toparr
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imageArrangeArr.splice(topImgSpliceIndex, 0, imageArrangeArr[0]);
        }

        // 追加center
        imageArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr: imageArrangeArr
        });

  }

  render() {

    let controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach(function(value, index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left:0,
            top: 0
          }
        };
      }
      imgFigures.push(<ImageFigure
          data={value}
          ref={'imgFigure' + index}
          key={index}
          arrange={this.state.imgsArrangeArr[index]}
          center={this.centerAction(index)}
          inverse={this.inverse(index)}
      />);

      controllerUnits.push(<ControllerUnit
        data={value}
        key={index}
        inverse={this.inverse(index)}
        arrange={this.state.imgsArrangeArr[index]}
        center={this.centerAction(index)}
      />)
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
