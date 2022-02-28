import React, { FC, useState } from "react";
import styles from './Dot.module.scss';
import { Tooltip } from "../index";
import { ITooltip } from "../Tooltip/Tooltip";
import { ConfidenceCircle, DotSettings, DotType, TooltipDot } from "../../../../utils/graphs/types";
import { useTheme } from '@mui/material/styles';
import { graphSelectedDotColor, primaryColor } from "../../../../utils/ThemeConstants";
import { createStraightPath } from "../../../../utils/graphs/createPath";

interface IDot {
  x: number;
  y: number;
  r?: number;
  id: string;
  type: DotType;
  annotation: {id: string, label: string};
  tooltip?: TooltipDot;
  selected?: boolean;
  showText?: boolean;
  fillColor: string;
  strokeColor: string;
  confidenceCircle?: ConfidenceCircle;
  settings: DotSettings;
}

const Dot: FC<IDot> = ({
  x, 
  y, 
  r, 
  id,
  type,
  annotation,
  tooltip,
  selected, 
  showText, 
  fillColor, 
  strokeColor,
  confidenceCircle,
  settings,
}) => {

  const [tooltipData, setTooltipData] = useState<ITooltip>();

  // можно хранить в сторе позиции мыши для каждого графика, доставить их здесь
  // потом сравнивать позицию мыши (в useEffect) с позицией точки
  // и если, например, расстояние <= 1.5 радиусов точки, тогда показывать тултип
  // но тут ещё как-то надо проверять, нет ли рядом ещё точки (в пределах 1.5 радиусов)
  // и если есть, то надо сравнить до какой точки расстояние меньше, и именно для неё показать тултип...

  const theme = useTheme();

  const handleOver = (id: string) => {
    const dot = document.getElementById(id);
    if (dot) {
      if (type !== 'mean') dot.style.setProperty('fill', primaryColor(theme.palette.mode));
      setTooltipData({
        isVisible: true,
        position: {
          left: dot.getBoundingClientRect().left,
          top: dot.getBoundingClientRect().top
        },
      });
    };
  };

  const handleOut = (id: string) => {
    const dot = document.getElementById(id);
    if (dot) {
      setTooltipData(undefined);
      dot.style.setProperty('fill', fillColor);
    };
  };

  if (confidenceCircle) console.log(createStraightPath(confidenceCircle.xyData), createStraightPath(confidenceCircle.xyData).split(' '))

  return (
    <g>
      {
        [
          ((showText || selected) && settings.annotations) &&
          <text 
            id={`${id}__annotation`}
            x={x}
            y={y - 8}
            fontSize={'0.8vw'}
          >
           {
             [
               settings.id && annotation.id,
               settings.id && settings.label && ': ',
               settings.label && annotation.label
             ]
           }
          </text>,

          selected && 
          <circle
            cx={x} 
            cy={y} 
            r={r ? r + 2 : 6}
            id={`${id}__selection`}
            style={{
              fill: graphSelectedDotColor(type), 
              stroke: graphSelectedDotColor(type),
              opacity: 0.5,
            }} 
          />,

          type === 'mean' &&
          <g>
            <line x1={x - 8} x2={x + 8} y1={y} y2={y} stroke={graphSelectedDotColor(type)}/>
            <line x1={x} x2={x} y1={y - 8} y2={y + 8} stroke={graphSelectedDotColor(type)}/>
          </g>,

          confidenceCircle &&
          <path 
            d={createStraightPath(confidenceCircle.xyData)}
            fill='transparent'
            stroke={confidenceCircle.color}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ]
      }
      <circle 
        cx={x} 
        cy={y} 
        r={r ? r * 1.5 : 6}
        style={{
          fill: 'transparent', 
          stroke: 'transparent',
        }} 
        onMouseOver={() => handleOver(id)}
        onMouseOut={() => handleOut(id)}
      />
      <circle 
        cx={x} 
        cy={y} 
        r={r ? r : 4}
        id={id}
        style={{
          fill: fillColor, 
          stroke: strokeColor,
          cursor: 'pointer'
        }}
        onMouseOver={() => handleOver(id)}
        onMouseOut={() => handleOut(id)}
      />
      {
        tooltipData && settings.tooltips && 
          <Tooltip
            position={tooltipData.position} 
            isVisible={tooltipData.isVisible} 
            data={tooltip}
            bgColor={type === 'mean' ? graphSelectedDotColor(type) : undefined}
            textColor={type === 'mean' ? '#fff' : undefined}
          /> 
      }
    </g>
  )
}

export default Dot;