import _ from 'underscore';
import React, { Component } from 'react';
import './App.css';
import { CharInput } from './components/CharInput';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFields: [],
      size: 20,
    };
    this.onClick = this.onClick.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    this.ctx    = this.canvas.getContext('2d');
    const img   = new Image();
    img.src     = 'crypto.png';
    img.onload  = () => {
      this.canvas.width  = img.width;
      this.canvas.height = img.height;
      this.ctx.drawImage(img, 0, 0, img.width, img.height);
    }
  }

  isWhite(color) {
    const bool =
      color[0] === 255 &&
      color[1] === 255 &&
      color[2] === 255 &&
      color[3] === 255
    return bool;
  }

  isBlack(color) {
    const bool = color[0] === 0 &&
      color[1] === 0 &&
      color[2] === 0 &&
      color[3] === 255
    return bool;
  }

  square(x, y) {
    let color = this.ctx.getImageData(x, y, 1, 1).data;
    if(!this.isWhite(color)) {
      console.log('Not a white pixel : (');
      return;
    }
    const startX = x;
    const startY = y;
    let right, left, top, bottom;
    // Find left border
    for(let x = 0; x < 30; x++) {
      const pos = startX - x;
      color = this.ctx.getImageData(pos, startY, 1, 1).data;
      if(!this.isWhite(color)) {
        left = pos;
        break;
      }
    }
    // Find right border
    for(let x = 0; x < 30; x++) {
      const pos = startX + x;
      color = this.ctx.getImageData(pos, startY, 1, 1).data;
      if(!this.isWhite(color)) {
        right = pos;
        break;
      }
    }
    // Find top border
    for(let y = 0; y < 30; y++) {
      const pos = startY - y;
      color = this.ctx.getImageData(startX, pos, 1, 1).data;
      if(!this.isWhite(color)) {
        top = pos;
        break;
      }
    }
    // Find bottom border
    for(let y = 0; y < 30; y++) {
      const pos = startY + y;
      color = this.ctx.getImageData(startX, pos, 1, 1).data;
      if(!this.isWhite(color)) {
        bottom = pos;
        break;
      }
    }
    const height = bottom - top;
    const width  = right  - left;
    const centerX = left + width  / 2;
    const centerY = top  + height / 2;
    if(width > 50 || height > 50 || !height || !width) {
      console.log('Could not find center');
      return;
    }
    return { x: centerX, y: centerY, size: width - 2 }
  }

  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    this.placeField(canvasX, canvasY)
  }

  placeField(canvasX, canvasY) {
    const square = this.square(canvasX, canvasY);
    if (!square) return;
    let { x, y, size } = square;

    x -= ( size / 2 )
    y -= ( size / 2 )

    const field = { x: x, y: y, size: size }
    // Check if obj is in array
    const exists = this.state.inputFields.find((i) => {
      return JSON.stringify({ x: i.x, y: i.y }) === JSON.stringify({ x: field.x, y: field.y });
    })
    if(exists) {
      // TODO Set focus!
      return;
    }
    this.setState(prevState => ({
      inputFields: prevState.inputFields.concat(field),
      size: size
    }))
  }

  onKeyUp(e, x, y, size) {
    // Pressed backspace, remove input field
    console.log(e)
    if(e.keyCode === 8) {
      this.setState(prevState => ({
        inputFields: prevState.inputFields.filter((f) => f.x !== x && f.y !== y )
      }));
    }
    // Pressed Enter, add input field below
    if(e.keyCode === 13) {
      this.placeField(x, y + size * 2)
    }
    if(e.keyCode === 32) {
      this.placeField(x + size * 2, y)
    }
  }

  drawFields() {
    return this.state.inputFields.map((f, i) => {
      return <CharInput 
        onKeyUp={ this.onKeyUp } 
        key={ i }
        top={ f.y }
        left={ f.x }
        size={ this.state.size } />
    });
  }

  render() {
    return (
      <div className="App">
        <canvas 
          className="canvas"
          id="canvas" 
          onClick={ this.onClick } 
        />
        { this.drawFields() }        
      </div>
    );
  }
}

export default App;
