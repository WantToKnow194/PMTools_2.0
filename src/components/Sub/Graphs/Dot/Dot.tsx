import React, { FC, useState } from "react";
import styles from './Dot.module.scss';
import { Tooltip } from "../index";
import { ITooltip } from "../Tooltip/Tooltip";
import { DotSettings, TooltipDot } from "../../../../utils/graphs/types";

interface IDot {
  x: number;
  y: number;
  r?: number;
  id: string;
  annotation: {id: string, label: string};
  tooltip?: TooltipDot;
  selected?: boolean;
  onClick: (index: number) => void;
  showText?: boolean;
  fillColor: string;
  strokeColor: string;
  settings: DotSettings;
}

const Dot: FC<IDot> = ({
  x, 
  y, 
  r, 
  id,
  annotation,
  tooltip,
  onClick,
  selected, 
  showText, 
  fillColor, 
  strokeColor,
  settings,
}) => {

  const [tooltipData, setTooltipData] = useState<ITooltip>();

  // можно хранить в сторе позиции мыши для каждого графика, доставить их здесь
  // потом сравнивать позицию мыши (в useEffect) с позицией точки
  // и если, например, расстояние <= 1.5 радиусов точки, тогда показывать тултип
  // но тут ещё как-то надо проверять, нет ли рядом ещё точки (в пределах 1.5 радиусов)
  // и если есть, то надо сравнить до какой точки расстояние меньше, и именно для неё показать тултип...

  const handleOver = (id: string) => {
    const dot = document.getElementById(id);
    if (dot) {
      dot.style.setProperty('fill', 'orange');
      setTooltipData({
        isVisible: true,
        position: {
          left: dot.getBoundingClientRect().left,
          top: dot.getBoundingClientRect().top
        },
      })
    }
  }

  const handleOut = (id: string) => {
    const dot = document.getElementById(id);
    if (dot) {
      setTooltipData(undefined);
      dot.style.setProperty('fill', fillColor);
    }
  }

  return (
    <g>
      {
        [
          ((showText || selected) && settings.annotations) &&
          <text 
            id={`${id}__annotation`}
            x={x}
            y={y - 8}
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
              fill: 'purple', 
              stroke: 'purple',
              opacity: '50%',
            }} 
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
        onClick={() => onClick(+id.split('-')[id.split('-').length - 1])}
        onMouseOver={() => handleOver(id)}
        onMouseOut={() => handleOut(id)}
      />
      {
        (tooltipData && settings.tooltips) ? 
          <Tooltip
            position={tooltipData.position} 
            isVisible={tooltipData.isVisible} 
            data={tooltip}
          /> 
        : null
      }
    </g>
  )
}

export default Dot;