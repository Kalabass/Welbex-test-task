import { Box, Button, Modal, Stack, TextField } from '@mui/material';
import { FC, useState } from 'react';

export const AuthModal: FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 550,
          height: 690,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box>
          <Stack gap={3}>
            <TextField />
            <TextField />
            <Button variant='contained' fullWidth>
              войти
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
