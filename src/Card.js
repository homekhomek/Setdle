import React, { forwardRef } from 'react';

//https://lospec.com/palette-list/sweetie-16
//const colorRef = ["#b13e53", "#3b5dc9", "#38b764"];
const colorRef = ["#d12a48", "#2656ed", "#23c45b"];
const stripePattern = "";

const Shape = ({ colorInd, fill, shapeInd }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="70"
            height="30"
            className='my-[2px]'
        >
            <pattern id={`diagonalHatch${colorInd}`} patternUnits="userSpaceOnUse" width="4" height="4">
                <path d="M 2 4 l 0 -4"
                    stroke={colorRef[colorInd]} strokeWidth={2} />
            </pattern>
            {shapeInd == 0 && (
                <rect x="5" y="5" width="60" height="20" ry="10" rx="10"
                    strokeWidth="3" fill={fill == 1 ? `url(#diagonalHatch${colorInd})` : colorRef[colorInd]} fillOpacity={fill == 0 ? "0" : "1"} stroke={colorRef[colorInd]} />
            )}
            {shapeInd == 1 && (
                <polygon points='35 5, 65 15, 35 25,5 15'
                    strokeWidth="3" fill={fill == 1 ? `url(#diagonalHatch${colorInd})` : colorRef[colorInd]} fillOpacity={fill == 0 ? "0" : "1"} stroke={colorRef[colorInd]} />
            )}
            {shapeInd == 2 && (
                <path d='m 6 6 c 4 -8 55 8 59 0 c 4 -8 4 11 0 19 c -4 8 -55 -8 -59 0 c -4 8 -4 -11 0 -19'
                    strokeWidth="3" fill={fill == 1 ? `url(#diagonalHatch${colorInd})` : colorRef[colorInd]} fillOpacity={fill == 0 ? "0" : "1"} stroke={colorRef[colorInd]} />
            )}

        </svg>
    )
}


const Card = forwardRef(({ cardData, clickHandler, selected }, ref) => {



    return (
        <div ref={ref} onClick={(ev) => {
            clickHandler(cardData.uid)
        }} className={`w-[80px] h-[120px] inline-block rounded-lg ml-[10px] mb-[10px] align-top `}>
            <div className={`flex justify-center items-center rounded-lg transition-all flex-col h-full ${selected ? "bg-[#d1d1d1] scale-95" : "bg-[#e8e8e8]"}`}>
                {[...Array(cardData.numberOfSymbols + 1)].map((e, i) => {
                    return (<Shape key={i} colorInd={cardData.color} fill={cardData.fillPattern} shapeInd={cardData.shape}></Shape>)
                })}
            </div>
        </div>
    )
});


export default Card;