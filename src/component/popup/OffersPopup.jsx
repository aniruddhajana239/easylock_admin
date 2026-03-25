import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import OfferTopImg from "../../assets/offers/offer-top.png"
import PercentImg from "../../assets/offers/percent.png"
export const OffersPopup = ({ open, onClose }) => {
  return (
    <Dialog open={open} sx={{ padding: 0 }}>
      {/* <DialogTitle>Confirm Action</DialogTitle> */}
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center relative">
          <div className="w-[60%] h-auto  top-0 left-0 ">
            <img src={PercentImg} className="h-auto w-full cover" alt="img" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 relative -mt-12 ">
         
          <span className="text-2xl text-black">Coming Soon</span>
          <span className="text-sm text-slate-500 mt-2">This Service is under development</span>
          <span className="text-xs text-slate-500 mt-4">Click the bellow button to close it</span>
          <button onClick={onClose} className="w-full bg-teal-600 hover:bg-teal-700 border-none outline-none focus:border-none focus:outline-none text-white text-sm shadow-md rounded-md py-2">CLOSE</button>
          {/* <button onClick={onClose} className="px-2 py-1 rounded-full flex justify-center items-center text-xs border-none outline-none focus:border-none focus:outline-none bg-slate-600 hover:bg-slate-700 text-white absolute top-2 right-2 ">x</button> */}
        </div>
      </div>

      {/* <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} color="primary">
          Confirm
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};
