import React, { FC } from "react";
import { GraphSettings, TooltipDot } from "../../../utils/graphs/types";
import { Axis, Data } from "../../Sub/Graphs";

interface IAxesAndData {
  graphId: string;
  width: number;
  height: number;
  areaConstants: {
    graphAreaMargin: number;
    zeroX: number;
    zeroY: number;
    unit: number;
    unitCount: number;
  };
  dataConstants: {
    labels: Array<string>;
    xyData: Array<[number, number]>;
    directionalData: Array<[number, number]>;
    tooltipData: Array<TooltipDot>;
  };
  selectedIndexes: Array<number>;
  settings: GraphSettings;
}

const AxesAndData: FC<IAxesAndData> = ({ 
  graphId, width, height,
  areaConstants,
  dataConstants,
  selectedIndexes,
  settings,
}) => {

  const {
    graphAreaMargin,
    unit,
    unitCount,
    zeroX,
    zeroY,
  } = areaConstants;

  const {
    directionalData,
    tooltipData,
    labels,
    xyData
  } = dataConstants;

  return (
    <g 
      id={`${graphId}-axes-and-data`}
      transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}
    >
      <g id={`${graphId}-axes`}>
        <circle 
          id='stereo-circle-axis'
          cx={zeroX} 
          cy={zeroY} 
          r={width/2}
          fill="none"
          stroke="black"
          strokeWidth={1}
        />
        <Axis 
          graphId={graphId}
          type='x'
          name='E'
          mirrorName='W'
          mirrorNamePosition={{x: -24, y: zeroY + 5}} 
          zero={zeroY}
          length={width}
          unit={unit}
          unitCount={unitCount}
          hideLine={true}
          hideTicks={!settings.area.ticks}
          tickPosition="both"
        />
        <Axis 
          graphId={graphId}
          type='y'
          name='N'
          mirrorName='S'
          mirrorNamePosition={{x: zeroX - 4.5, y: height + 20}} 
          zero={zeroX}
          length={height}
          unit={unit}
          unitCount={unitCount}
          hideLine={true}
          hideTicks={!settings.area.ticks}
          tickPosition="both"
        />
      </g>
      {/* 
          Создавать маркеры черезе path нельзя, ибо тогда теряется почти весь их функционал
          Добавить слушатель можно только к конкретному элементу по типу <circle />
          Потому лучше отрисовывать отдельно каждый <circle /> через map массива координат
          Однако hover всё равно работать не будет и потому лучше использовать onMouseOver
          Как раз при этом достигается условие zero-css (я его только что сам придумал)
      */}
      <g 
        id={`${graphId}-data`}
        transform={
          `
            translate(${width / 2}, ${width / 2})
          `
        }
      >
        <Data 
          graphId={graphId}
          type='all'
          labels={labels}
          data={xyData}
          directionalData={directionalData}
          tooltipData={tooltipData}
          selectedIndexes={selectedIndexes}
          dotFillColor='black'
          differentColors={true}
          colorsType="stereo"
          settings={settings.dots}
        />
      </g>
    </g>
  )
}

export default AxesAndData
