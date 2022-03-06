import { 
  GridToolbarContainer, 
  GridToolbarColumnsButton, 
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { FC } from "react";
import { useAppSelector } from "../../../../services/store/hooks";
import { IDirData, IPmdData } from "../../../../utils/files/fileManipulations";
import ExportDIR from "./ExportButton/ExportDIR";
import ExportPMD from './ExportButton/ExportPMD';

const PMDOutputDataTableToolbar = () => {

  const { treatmentData } = useAppSelector(state => state.parsedDataReducer);

  if (!treatmentData) return null;
  const data = treatmentData[0];

  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <ExportPMD data={data as IPmdData}/>
    </GridToolbarContainer>
  );
};

export default PMDOutputDataTableToolbar;
