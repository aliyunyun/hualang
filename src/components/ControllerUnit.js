/**
 * Created by yuanyunlong on 2016/12/6.
 */

import React from 'react';

export class ControllerUnit extends React.Component {

    constructor(props){
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

    render(){

      let spanClass = "controller-unit";
      spanClass += this.props.arrange.isCenter ? " is-center" : " ";
      spanClass += this.props.arrange.isInverse ? " is-inverse" : " " ;

      return (<span className={spanClass} onClick={this.handleClick.bind(this)}></span>);
    }

}
