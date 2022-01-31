import React, { FC } from "react";
import styles from './AppSettings.module.scss';
import { MenuList, MenuItem, Button, Input } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

interface IAppSettings {

}

const AppSettings: FC<IAppSettings> = () => {

  const handleFileUpload = () => {

  }

  return (
    <div className={styles.buttons}>
      <Button
        variant="contained" 
        startIcon={<SettingsOutlinedIcon />}
        sx={{
          textTransform: 'none', 
          marginRight: '16px'
        }}
        component="span"
      >
        Настройки
      </Button>
      <Button
        variant="contained" 
        startIcon={<HelpOutlineOutlinedIcon />}
        sx={{
          textTransform: 'none', 
        }}
        component="span"
      >
        Помощь
      </Button>
      <label htmlFor="upload-file">
        <Input 
          id="upload-file"
          type={'file'}  
          inputProps={{
            multiple: true
          }}
          disableUnderline={true}
          sx={{display: 'none'}}
          onChange={handleFileUpload}
        />

        <Button 
          variant="outlined" 
          startIcon={<UploadFileOutlinedIcon />}
          sx={{
            textTransform: 'none', 
          }}
          component="span"
        >
          Загрузить файл
        </Button>
      </label>
    </div>
  )
}

export default AppSettings;
