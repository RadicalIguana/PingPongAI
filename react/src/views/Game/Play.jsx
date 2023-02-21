import { useEffect, useRef, Component } from 'react'
import { ReactP5Wrapper } from "react-p5-wrapper";

class Board {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.speed = 0
    }

    display(p5) {
        p5.fill(255)
        p5.rect(this.x, this.y, 25, 70)
    }

    update(p5) {
        this.y += this.speed

        this.y = p5.constrain(this.y, -150, 80)
    }

    move(y) {
        this.speed = y
    }

}

function sketch(p5) {
    
    let board_left
    let board_right
    let board

    p5.setup = () =>{
        p5.createCanvas(600, 300, p5.WEBGL)
        board_left = new Board(-300, -35)
        board_right = new Board(275, -35)

    }

    p5.draw = () => {
        p5.background(0)
        p5.normalMaterial();
        board_left.display(p5)
        board_right.display(p5)
        board_left.update(p5)
        board_right.update(p5)
    }

    p5.keyPressed = () => {
        if (p5.keyCode === 38) {
            board_left.move(-2.5)
        } else if (p5.keyCode == 87) {
            board_right.move(-2.5)
        } else if (p5.keyCode === 40) {
            board_left.move(2.5)
        } else if (p5.keyCode == 83) {
            board_right.move(2.5)
        }
    }

    p5.keyReleased = () => {
        if (p5.keyCode === 38 || p5.keyCode === 40) {
            board_left.move(0)
        }

        if (p5.keyCode === 87 || p5.keyCode === 83) {
            board_right.move(0)
        }
    }
}

export default function Play() {

    return <ReactP5Wrapper sketch={sketch} />;



    // // create a reference to the container in which the p5 instance should place the canvas
    // const p5ContainerRef = useRef();

    // useEffect(() => {
    //     // On component creation, instantiate a p5 object with the sketch and container reference 
    //     const p5Instance = new p5(sketch, p5ContainerRef.current);

    //     // On component destruction, delete the p5 instance
    //     return () => {
    //         p5Instance.remove();
    //     }
    // }, []);

    // return (
    //     <div className="App" ref={p5ContainerRef} />
    // );

}