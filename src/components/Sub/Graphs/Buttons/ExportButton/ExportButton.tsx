import React, { FC } from 'react';
import style from './ExportButton.module.scss';
import IconButton from '@mui/material/IconButton';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { handleExportGraph } from '../../../../../utils/graphs/export';

interface IExportButton {
  graphId: string;
}

const ExportButton: FC<IExportButton> = ({ graphId }) => {
  return (
    <div className={style.exportButton}>
      <IconButton 
        color="primary" 
        component="span"
        onClick={() => handleExportGraph(graphId)}
      >
        <FileDownloadOutlinedIcon />
      </IconButton>
    </div>
  );
};

export default ExportButton;