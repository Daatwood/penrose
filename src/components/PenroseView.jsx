import React, { Component } from 'react';
import Penrose from '../penrose'

class PenroseView extends Component {
  constructor(props){
    super(props)
    let dpr = window.devicePixelRatio;
    this.setState = {
      dpr: dpr,
      abc: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      // canvas: canvas,
      offset: [0, 0]
    }
  }

  componentDidMount(){
    let canvas = document.getElementById('penrose');
    canvas.style.position = 'absolute'
    canvas.style.left = '0px'
    canvas.style.top = '0px'
    canvas.style.width = window.innerWidth
    canvas.style.height = window.innerHeight
    canvas.width = window.innerWidth * window.devicePixelRatio
    canvas.height = window.innerHeight * window.devicePixelRatio
    let c1 = Math.random() * 255
    let c2 = Math.random() * 255
    let c3 = Math.random() * 255
    let c4 = Math.random() * 255
    let c5 = Math.random() * 255
    let c6 = Math.random() * 255
    var kiteColor =       `rgba(${c1}, ${c2}, ${c3}, 1)`
    var kiteColorInvert = `rgba(${c3}, ${c2}, ${c1}, 1)`
    var dartColor =       `rgba(${c5}, ${c4}, ${c6}, 1)`
    var dartColorInvert = `rgba(${c6}, ${c4}, ${c5}, 1)`
    Penrose(canvas, [0, 0], kiteColor, kiteColorInvert, dartColor, dartColorInvert)
  }

  render() {
    return (<div>
      <h1 style={{zIndex: -1}}>Penrose</h1>
      <canvas id='penrose'/>
    </div>
    )

  }

}
export default PenroseView;