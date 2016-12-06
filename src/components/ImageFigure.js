/**
 * Created by yuanyunlong on 16/12/5.
 */
import React from 'react';

export class ImageFigure extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick(e){

    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    let path = this.props.data.imageURL;
    let title = this.props.data.title;

    var styles = {};
    if(this.props.arrange.pos){
      styles = this.props.arrange.pos;
    }

    if(this.props.arrange.rotate){
      (["WebkitTransform"],["transform"]).forEach(function (value) {
        styles[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    let imageFigureClassName = "img-figure";
        imageFigureClassName += this.props.arrange.isInverse ? " img-inverse" : " ";

    return (
      <figure className={imageFigureClassName} style={styles} onClick={this.handleClick.bind(this)}>
        <img src={path} alt={title} />
        <figcaption >
          <h2 className="img-title">{title}</h2>
          <div className="img-back">
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );

  }
}


