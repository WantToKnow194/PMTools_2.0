import React, { FC, useEffect, useState } from "react";
import styles from "./MagGraph.module.scss";
import { IGraph } from "../../../utils/GlobalTypes";
import { SelectableGraph, GraphSymbols, Unit} from "../../Sub/Graphs";
import AxesAndData from "./AxesAndData";
import dataToMag from "../../../utils/graphs/formatters/dataToMag";
import { useAppSelector } from "../../../services/store/hooks";
import { IPmdData } from "../../../utils/files/fileManipulations";
import { GraphSettings, TMenuItem } from "../../../utils/graphs/types";


export interface IMagGraph extends IGraph {
  width: number;
  height: number;
  data: IPmdData;
}


const MagGraph: FC<IMagGraph> = ({ graphId, width, height, data }) => {

  // ToDo: 
  // 1. менять viewBox в зависимости от размера группы data (horizontal-data + vertical-data) || STOPPED
  // 2. zoom&pan

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [selectableNodes, setSelectableNodes] = useState<ChildNode[]>([]);

  const [tooltips, setTooltips] = useState<boolean>(true);
  const [ticks, setTicks] = useState<boolean>(true);
  const [annotations, setAnnotations] = useState<boolean>(true);
  const [stepID, setStepID] = useState<boolean>(true);
  const [stepLabel, setStepLabel] = useState<boolean>(true);

  const menuItems: Array<TMenuItem> = [
    {label: 'Tooltips', onClick: () => setTooltips(!tooltips), state: tooltips},
    {label: 'Ticks', onClick: () => setTicks(!ticks), state: ticks, divider: true},
    {label: 'Annotations', onClick: () => setAnnotations(!annotations), state: annotations},
    {label: 'Step ID', onClick: () => setStepID(!stepID), state: stepID},
    {label: 'Step label', onClick: () => setStepLabel(!stepLabel), state: stepLabel},
  ];

  const settings: GraphSettings = {
    area: {ticks},
    dots: {
      annotations,
      tooltips,
      id: stepID,
      label: stepLabel,
    },
  };

  const { 
    xyData, 
    stepLabels, 
    maxMag,
    tooltipData,
    labels,
  } = dataToMag(data, width);

  const demagnetizationType = data.steps[0].demagType;

  const graphAreaMargin = 40;
  const viewWidth = width + graphAreaMargin * 2;
  const viewHeight = height + graphAreaMargin * 2;

  const unitCountX = stepLabels.length - 1;
  const unitCountY = 10;
  const unitX = (width / unitCountX);
  const unitY = (height / unitCountY);
  const zeroX = (0);
  const zeroY = (height);

  // selectableNodes - все точки на графике 
  useEffect(() => {
    const elementsContainer = document.getElementById(`${graphId}-all-dots`);
    if (elementsContainer) {
      const nodes = Array.from(elementsContainer.childNodes);
      setSelectableNodes(nodes);
    }
  }, [graphId])

  const handleDotClick = (index: number) => {
    const selectedIndexesUpdated = Array.from(selectedIndexes);

    if (selectedIndexes.includes(index)) {
      selectedIndexesUpdated.splice(
        selectedIndexesUpdated.findIndex((selectedIndex) => selectedIndex === index),
        1
      );
    } else {
      selectedIndexesUpdated.push(index);
    }
    setSelectedIndexes(selectedIndexesUpdated);
    return null;
  };

  console.log("nodes:", selectableNodes)

  return (
    <>
      <SelectableGraph
        graphId={graphId}
        width={viewWidth}
        height={viewHeight}
        selectableNodes={selectableNodes}
        selectedIndexes={selectedIndexes}
        setSelectedIndexes={setSelectedIndexes}
        nodesDuplicated={false}
        menuItems={menuItems}
      >
        <g>
          <AxesAndData 
            graphId={graphId}
            graphAreaMargin={graphAreaMargin}
            zeroX={zeroX}
            zeroY={zeroY}
            width={width}
            height={height}
            unitX={unitX}
            unitY={unitY}
            unitCountX={unitCountX}
            unitCountY={unitCountY}
            labels={labels}
            data={xyData}
            tooltipData={tooltipData}
            maxMAG={maxMag}
            stepLabels={stepLabels}
            demagnetizationType={demagnetizationType}
            selectedIndexes={selectedIndexes}
            handleDotClick={handleDotClick}
            settings={settings}
          />
        </g>
      </SelectableGraph>
    </>
  )
}

export default MagGraph;