import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    Button,
    CircularProgress,
} from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
export const WarningPopup = ({ open, onClose, onYes,isLoading }) => {

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs">

            <DialogContent>

                <div className="flex flex-col gap-2 items-center justify-center">
                    <WarningAmberIcon color="warning" fontSize="large" sx={{height:"50px",width:"50px"}} />
                    <span className="text-sm font-semibold text-black">
                        Are You Sure?
                    </span>
                    <div className="flex justify-between mt-4 gap-4">
                        <Button
                            onClick={onClose}
                            color="error"
                            variant="outlined"
                           sx={{width:"100px"}}
                           size="small"
                           className="focus:border-none focus:outline-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="small"
                               onClick={onYes}
                            color="primary"
                            variant="contained"
                            sx={{width:"100px"}}
                            disabled={isLoading}
                            className="flex items-center gap-2 border-none outline-none focus:border-none focus:outline-none"
                        >
                            {isLoading&&<CircularProgress size={20}/>}
                            Yes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

