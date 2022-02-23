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
    horizontalProjectionData: Array<[number, number]>;
    verticalProjectionData: Array<[number, number]>;
    directionalData: Array<[number, number]>;
    tooltipData: Array<TooltipDot>;
  };
  selectedIndexes: Array<number>;
  handleDotClick: (index: number) => void;
  settings: GraphSettings;
}

const AxesAndData: FC<IAxesAndData> = ({ 
  graphId, width, height,
  areaConstants, 
  dataConstants,
  selectedIndexes,
  handleDotClick,
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
    horizontalProjectionData,
    verticalProjectionData,
    directionalData,
    tooltipData,
    labels,
  } = dataConstants;

  return (
    <g 
      id={`${graphId}-axes-and-data`}
      transform={`translate(${graphAreaMargin}, ${graphAreaMargin})`}
    >
      <g id={`${graphId}-axes`}>
        <Axis 
          graphId={graphId}
          type='x'
          name='N, N'
          zero={zeroY}
          length={width}
          unit={unit}
          unitCount={unitCount}
          tickPosition="both"
          hideTicks={!settings.area.ticks}
        />
        <Axis 
          graphId={graphId}
          type='y'
          name='W, UP'
          namePosition={{x: zeroX - 20, y: -10}}
          zero={zeroX}
          length={height}
          unit={unit}
          unitCount={unitCount}
          tickPosition="both"
          hideTicks={!settings.area.ticks}
        />
      </g>
      {/* 
          Создавать маркеры черезе path нельзя, ибо тогда теряется почти весь их функционал
          Добавить слушатель можно только к конкретному элементу по типу <circle />
          Потому лучше отрисовывать отдельно каждый <circle /> через map массива координат
          Однако hover всё равно работать не будет и потому лучше использовать onMouseOver
          Как раз при этом достигается условие zero-css (я его только что сам придумал)
      */}
      <g id={`${graphId}-data`}>
        <Data 
          graphId={graphId}
          type='h'
          labels={labels}
          data={horizontalProjectionData}
          directionalData={directionalData}
          tooltipData={tooltipData}
          selectedIndexes={selectedIndexes}
          handleDotClick={handleDotClick}
          dotFillColor='black'
          settings={settings.dots}
        />
        <Data 
          graphId={graphId}
          type='v'
          labels={labels}
          data={verticalProjectionData}
          directionalData={directionalData}
          tooltipData={tooltipData}
          selectedIndexes={selectedIndexes}
          handleDotClick={handleDotClick}
          dotFillColor='white'
          settings={settings.dots}
        />
      </g>
    </g>
  )
}

export default AxesAndData
