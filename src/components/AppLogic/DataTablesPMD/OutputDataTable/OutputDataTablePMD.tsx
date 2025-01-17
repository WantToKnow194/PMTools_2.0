import React, { FC, useCallback, useEffect, useState } from "react";
import styles from './OutputDataTablePMD.module.scss';
import { useAppDispatch, useAppSelector } from "../../../../services/store/hooks";
import { useDebounce } from "../../../../utils/GlobalHooks";
import equal from "deep-equal"
import { GetDataTableBaseStyle } from "../styleConstants";
import StatisticsDataTablePMDSkeleton from './OutputDataTablePMDSkeleton';
import PMDOutputDataTableToolbar from '../../../Sub/DataTable/Toolbar/PMDOutputDataTableToolbar';
import { DataGridDIRFromPCARow } from "../../../../utils/GlobalTypes";
import { deleteAllInterpretations, deleteInterpretation, setAllInterpretations, setOutputFilename, updateCurrentFileInterpretations, updateCurrentInterpretation } from "../../../../services/reducers/pcaPage";
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { 
  DataGrid, 
  GridActionsCellItem, 
  GridColumnHeaderParams, 
  GridColumns, 
  GridEditRowsModel,
  GridValueFormatterParams, 
} from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

const OutputDataTablePMD: FC = () => {
  
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const data = useAppSelector(state => state.pcaPageReducer.allInterpretations);
  const { treatmentData, currentDataPMDid } = useAppSelector(state => state.parsedDataReducer);
  const [editRowsModel, setEditRowsModel] = useState<GridEditRowsModel>({});
  const [filename, setFilename] = useState<string>('PCA Interpretations');
  const debouncedFilename = useDebounce(filename, 500);

  const handleEditRowsModelChange = useCallback((model: GridEditRowsModel) => {
    setEditRowsModel(model);
  }, []);
  
  const handleRowDelete = (uuid: string) => (event: any) => {
    event.stopPropagation();
    dispatch(deleteInterpretation(uuid));
        
    // это всё надо упростить и перенести в мидлвару
    // и ещё заполнять поле currentFile при обновлении currentDataDIR/PMDid (тоже в мидлваре)
    const currentFileName = treatmentData![currentDataPMDid || 0]?.metadata.name;
    const deletedRowParentFile = data.filter(
      interpretation => interpretation.uuid === uuid
    )[0].parentFile;

    if (deletedRowParentFile === currentFileName) {
      dispatch(updateCurrentFileInterpretations(deletedRowParentFile));
      dispatch(updateCurrentInterpretation());
    };
  };

  const handleDeleteAllRows = (event: any) => {
    event.stopPropagation();
    dispatch(deleteAllInterpretations());
  };

  const columns: GridColumns = [
    {
      field: 'actions',
      type: 'actions',
      width: 40,
      renderHeader: (params: GridColumnHeaderParams) => (
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete all interpretations"
          onClick={handleDeleteAllRows}
          color="inherit"
        />
      ),
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete interpretation"
            onClick={handleRowDelete(id as string)}
            color="inherit"
          />,
        ];
      },
    },
    { field: 'id', headerName: 'ID', type: 'string', width: 50, hide: true},
    { field: 'label', headerName: 'Label', type: 'string', width: 120  },
    { field: 'code', headerName: 'Code', type: 'string', width: 70 },
    { field: 'stepRange', headerName: 'StepRange', type: 'string', width: 120 },
    { field: 'stepCount', headerName: 'N', type: 'number', width: 40 },
    { field: 'Dgeo', headerName: 'Dgeo', type: 'number', width: 70,
      valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
    },
    { field: 'Igeo', headerName: 'Igeo', type: 'number', width: 70,
      valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
    },
    { field: 'Dstrat', headerName: 'Dstrat', type: 'number', width: 70,
      valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
    },
    { field: 'Istrat', headerName: 'Istrat', type: 'number', width: 70,
      valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
    },
    { field: 'confidenceRadius', headerName: 'MAD', type: 'string', width: 70,
      valueFormatter: (params: GridValueFormatterParams) => (params.value as number)?.toFixed(1)
    },
    { field: 'comment', headerName: 'Comment', type: 'string', minWidth: 320, flex: 1, editable: true, cellClassName: styles[`editableCell_${theme.palette.mode}`] },
  ];

  columns.forEach((col) => {
    col.align = 'center';
    col.headerAlign = 'center';
    col.hideSortIcons = true;
    col.disableColumnMenu = true;
  });

  useEffect(() => {
    if (debouncedFilename) {
      dispatch(setOutputFilename(debouncedFilename as string));
    } else {
      dispatch(setOutputFilename(filename));
    };
  }, [debouncedFilename]);

  useEffect(() => {
    if (data && Object.keys(editRowsModel).length !== 0) {
      const updatedData = data.map((interpretation, index) => {
        const rowId = Object.keys(editRowsModel)[0];
        const newComment = editRowsModel[rowId]?.comment?.value as string;
        if (rowId !== interpretation.label) return interpretation;
        return {
          ...interpretation,
          comment: newComment
        };
      });
      if (!equal(updatedData, data)) {
        dispatch(setAllInterpretations(updatedData));
        const currentFileName = treatmentData![currentDataPMDid || 0]?.metadata.name;
        dispatch(updateCurrentFileInterpretations(currentFileName));
        dispatch(updateCurrentInterpretation());
      }
    };
  }, [data, editRowsModel]);

  if (!data || !data.length) return <StatisticsDataTablePMDSkeleton />;

  const rows: Array<Omit<DataGridDIRFromPCARow, 'id' | 'label' | 'uuid'>> = data.map((statistics, index) => {
    const { uuid, label, code, stepRange, stepCount, Dgeo, Igeo, Dstrat, Istrat, confidenceRadius, comment } = statistics;
    console.log(label)
    return {
      id: uuid, 
      label,
      code, 
      stepRange,
      stepCount,
      Dgeo: +Dgeo.toFixed(1),
      Igeo: +Igeo.toFixed(1),
      Dstrat: +Dstrat.toFixed(1),
      Istrat: +Istrat.toFixed(1),
      confidenceRadius: +confidenceRadius.toFixed(1),
      comment
    };
  });

  const handleFilenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(event.target.value);
  };  

  return (
    <>
      <div className={styles.toolbar}>
        <TextField
          id="allInterpretationsPCA_filename"
          label="File name"
          value={filename}
          onChange={handleFilenameChange}
          variant="standard"
        />
      </div>
      <StatisticsDataTablePMDSkeleton>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          editRowsModel={editRowsModel}
          onEditRowsModelChange={handleEditRowsModelChange}
          sx={GetDataTableBaseStyle()}
          hideFooter={rows.length < 100}
          density={'compact'}
          components={{
            Toolbar: PMDOutputDataTableToolbar,
          }}
          disableSelectionOnClick={true}
        />
      </StatisticsDataTablePMDSkeleton>
    </>
    
  );
};

export default OutputDataTablePMD;
