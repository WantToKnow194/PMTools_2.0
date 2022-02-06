import React, { FC, useEffect } from "react";
import styles from './DataTablePMD.module.scss';
import { MenuList, MenuItem, Button, Input } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useAppDispatch, useAppSelector } from "../../../services/store/hooks";
import { setInputFiles } from "../../../services/reducers/files";
import { getDirectionalData, IDirData, IPmdData } from "../../../utils/files/fileManipulations";
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

interface IMetaDataTablePMD {
  data: IPmdData['metadata'];
};

const MetaDataTablePMD: FC<IMetaDataTablePMD> = ({ data }) => {

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', type: 'string' },
    { field: 'a', headerName: 'Core Azimuth', type: 'string' },
    { field: 'b', headerName: 'Core Dip', type: 'number' },
    { field: 's', headerName: 'Bedding Strike', type: 'number' },
    { field: 'd', headerName: 'Bedding Dip', type: 'number' },
    { field: 'v', headerName: 'Volume', type: 'number' }
  ];

  columns.forEach((col) => {
    col.align = 'center';
    col.headerAlign = 'center';
    col.hideSortIcons = true;
    col.disableColumnMenu = true;
  })

  const rows = [{...data, id: 0}];

  return (
    <DataGrid 
      rows={rows} 
      columns={columns} 
      sx={{
        color: 'white',
        maxHeight: '78px'
      }}
      hideFooter={true}
      autoHeight={true}
      density={'compact'}
      disableSelectionOnClick={true}
    />
  )

}

interface IDataTablePMD {
  data: IPmdData;
};

const DataTablePMD: FC<IDataTablePMD> = ({ data }) => {

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', type: 'string', width: 40 },
    { field: 'step', headerName: 'Step', type: 'string', width: 70 },
    { field: 'Dgeo', headerName: 'Dgeo', type: 'number', width: 70 },
    { field: 'Igeo', headerName: 'Igeo', type: 'number', width: 70 },
    { field: 'Dstrat', headerName: 'Dstrat', type: 'number', width: 70 },
    { field: 'Istrat', headerName: 'Istrat', type: 'number', width: 70 },
    { field: 'mag', headerName: 'MAG', type: 'number', width: 70 },
    { field: 'a95', headerName: 'a95', type: 'number', width: 50 },
    { field: 'comment', headerName: 'Comment', type: 'string', width: 200 }
  ];

  columns.forEach((col) => {
    col.align = 'center';
    col.headerAlign = 'center';
    col.hideSortIcons = true;
  })

  const rows = data.steps.map((stepData, index) => {
    const { step, Dgeo, Igeo, Dstrat, Istrat, mag, a95, comment } = stepData;
    return {
      id: index,
      step,
      Dgeo,
      Igeo,
      Dstrat,
      Istrat,
      mag: mag.toExponential(2).toLocaleUpperCase(),
      a95,
      comment
    };
  });

  return (
    <div className={styles.dataTable}>
      <MetaDataTablePMD 
        data={data.metadata}
      />
      <DataGrid 
        rows={rows} 
        columns={columns} 
        sx={{
          color: 'white'
        }}
        checkboxSelection
        components={{
          Toolbar: GridToolbar,
        }}
        hideFooter={true}
      />
    </div>
  )
}

export default DataTablePMD;
