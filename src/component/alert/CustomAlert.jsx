 
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const CustomAlert=({open,hiddenAfter,onClose,type,msg})=>{
 
    return (
        <Stack spacing={2} className='w-2/3 md:w-full absolute bottom-0 right-0'>
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={open} autoHideDuration={hiddenAfter?hiddenAfter : 3000} onClose={() => {onClose() }}>
                <Alert onClose={() => {onClose(false) }} severity={type??"error"} sx={{ width: '100%' }}>
                    {msg??""}
                </Alert>
            </Snackbar>
        </Stack>
    );
}