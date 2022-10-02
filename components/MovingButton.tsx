import React, { useState, useEffect, MouseEventHandler, useRef } from "react";
import styles from "../styles/Home.module.css";

type MovingButtonProps = {
    onClick: MouseEventHandler<HTMLButtonElement>,
    className: string,
    children: string
}

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>


function calculateTopPosition(left: number, desiredDistanceFromTheCenter: number): number {
    let top = Math.sqrt(Math.pow(desiredDistanceFromTheCenter, 2) - Math.pow(left, 2));
    return top;
}

type Position = {
    top: number,
    left: number,
    width: number,
    height: number
}

function wouldBeMovedInside(childPos: Position) {
    let leftThreshHold = 0;
    let rightThreshHold = 0 + window.innerWidth - childPos.width;
    let topThreshHold = 0;
    let bottomThreshHold = 0 + window.innerHeight - childPos.height;

    return !(childPos.left < leftThreshHold || childPos.left > rightThreshHold || childPos.top < topThreshHold || childPos.top > bottomThreshHold);
}

function calculateLeftPosition(): Range<0, 300>{
    let leftRightThreshold = 0.5;

    let leftRightChance = Math.floor(Math.random() * 101 ) / 100;
    let leftRight = leftRightChance < leftRightThreshold ? -1 : 1;

    return Math.floor(Math.random() * 301) * leftRight as Range<0, 300>;

}

export default function MovingButton({onClick, className, children} : MovingButtonProps) : JSX.Element {

    let left = useRef(0);
    let top = useRef(0);
    let buttonRef = useRef(null);
    let [ buttonDisabled , setButtonDisabled ] = useState(false);

    function moveButtonInRandomDirection(): void{
        let topBottomThreshold = 0.5;

        let topBottomChance = Math.floor(Math.random() * 101 ) / 100;
        let topBottom = topBottomChance < topBottomThreshold ? -1 : 1;
    
        let newLeft = calculateLeftPosition()
        let newTop = calculateTopPosition(newLeft, 300);
    
        console.log(newTop)
    
        if(buttonRef.current){
            let topInit = buttonRef.current['offsetTop']
            let leftInit = buttonRef.current['offsetLeft']
            let buttonWidth = buttonRef.current['offsetWidth']
            let buttonHeight = buttonRef.current['offsetHeight']

            let childPos = {
                top: topInit + top.current + newTop * topBottom,
                left: leftInit + left.current + newLeft,
                width: buttonWidth,
                height: buttonHeight
            }
    
            if(!wouldBeMovedInside(childPos)){
                moveButtonInRandomDirection()
            }else{

                left.current = childPos.left - leftInit;
                top.current += newTop * topBottom;
            }
        }
    }

    function mouseEnterHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        let movingThreshold = 0.5;
        let unclickableThreshold = 0.4;

        let movingChance = Math.floor(Math.random() * 101 ) / 100;
        let unclickableChance = Math.floor(Math.random() * 101 ) / 100;

        if(movingChance < movingThreshold){
            moveButtonInRandomDirection();
            e.currentTarget.style.transform = `translateX(${left.current}px ) translateY(${top.current}px)`;
        }

        if(unclickableChance < unclickableThreshold){
            setButtonDisabled(true);
        }else{
            setButtonDisabled(false)
        }

    }

    return(
        <div ref={buttonRef} className={styles.cashOutButtonWrapper} onMouseEnter={mouseEnterHandler}>
            <button 
            className={buttonDisabled ? styles.cashOutButtonDisabled : className} onClick={onClick} 
            disabled={buttonDisabled}>{children}</button>
        </div>
    )
}