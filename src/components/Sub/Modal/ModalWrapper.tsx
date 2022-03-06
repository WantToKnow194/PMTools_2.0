import React, { FC } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: '16px',
};

interface IModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalWrapper: FC<IModal> = ({ open, setOpen, children }) => {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={{ ...style }}>
          { children }
          <Button variant='outlined' onClick={handleClose}>Закрыть</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalWrapper;
