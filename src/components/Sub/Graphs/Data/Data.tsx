import React, { FC } from "react";
import { Dot } from "..";
import { createStraightPath } from "../../../../utils/graphs/createPath";
import { TooltipDot } from "../../../../utils/graphs/types";
import DotTooltip from "../Tooltip/DotTooltip";

interface IData {
  graphId: string;
  type: string;
  data: Array<[number, number]>;
  directionalData?: Array<[number, number]>;
  tooltipData?: Array<TooltipDot>;
  selectedIndexes: Array<number>;
  handleDotClick: (index: number) => void;
  dotFillColor: string;
  differentColors?: boolean; 
  colorsType?: 'stereo' | 'colouredStereo';
}

const Data: FC<IData> = ({
  graphId,
  type,
  data,
  directionalData,
  tooltipData,
  selectedIndexes,
  handleDotClick,
  dotFillColor,
  differentColors,
  colorsType,
 }) => {
  
  const colorByType = (
    type: 'stereo' | 'colouredStereo',
    xy: [number, number],
    dec: number,
    inc: number,
    index: number
  ) => {
    if (type === 'stereo') return inc >= 0 ? 'black' : 'white';
    if (type === 'colouredStereo') return inc >= 0 ? 'red' : 'blue';
    return 'black';
  };

  return (
    <g id={`${graphId}-${type}-data`}>
      <path 
        id={`${graphId}-${type}-path`}
        d={createStraightPath(data)}
        fill="none" 
        stroke="black" 
      />
      <g 
        id={`${graphId}-${type}-dots`}
      >
        {
          data.map((xy, index) => (
            <Dot 
              x={xy[0]} 
              y={xy[1]} 
              dec={directionalData ? directionalData[index][0] : undefined}
              inc={directionalData ? directionalData[index][1] : undefined}
              id={`${graphId}-${type}-dot-${index}`} 
              key={index} 
              selected={selectedIndexes.includes(index)}
              tooltip={tooltipData ? tooltipData[index] : undefined}
              fillColor={
                differentColors && colorsType
                  ? colorByType(
                      colorsType, 
                      xy, 
                      directionalData ? directionalData[index][0] : 1, 
                      directionalData ? directionalData[index][1] : 1,
                      index
                    )
                  : dotFillColor
              }
              strokeColor="black"
              onClick={handleDotClick}
            />
          )
        )}
      </g>
    </g>
  )
}

export default Data;
