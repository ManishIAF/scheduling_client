import {forwardRef} from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Alerting({alert,setAlert}) {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({open:false,message:''});
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={alert?.open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}