// component/dialog/offers/OfferModal.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  DialogActions,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAlert } from "../../../context/customContext/AlertContext";
import { OffersApi } from "../../../api/offer/OffersApi";
import { FaImage, FaTimes, FaUpload, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { MdAddPhotoAlternate, MdDelete } from "react-icons/md";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

// Validation schema - different for add and edit
const getOfferSchema = (modalType) => {
  return yup.object().shape({
    offerImage: yup
      .mixed()
      .test("required", "Image is required", (value) => {
        if (modalType === "add") {
          return value !== null && value !== undefined;
        }
        return true;
      })
      .test("fileSize", "File size is too large (max 5MB)", (value) => {
        if (!value || typeof value === "string") return true;
        return value.size <= 5242880;
      })
      .test("fileType", "Unsupported file format", (value) => {
        if (!value || typeof value === "string") return true;
        return ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(
          value.type
        );
      }),
  });
};

const OfferModal = ({ closeModal, modalType, selectedOffer, fetchOffers }) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(getOfferSchema(modalType)),
    defaultValues: {
      offerImage: null,
    },
  });

  const watchOfferImage = watch("offerImage");

  useEffect(() => {
    if (modalType === "edit" && selectedOffer?.offerImage) {
      setPreviewImage(selectedOffer.offerImage);
      setValue("offerImage", selectedOffer.offerImage);
      setHasImageChanged(false);
    } else {
      reset();
      setPreviewImage("");
      setSelectedFile(null);
      setHasImageChanged(false);
    }
  }, [modalType, selectedOffer, setValue, reset]);

  useEffect(() => {
    if (modalType === "edit" && selectedOffer?.offerImage) {
      const isNewFile = typeof watchOfferImage !== "string" && watchOfferImage !== null;
      setHasImageChanged(isNewFile);
    }
  }, [watchOfferImage, modalType, selectedOffer]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file) => {
    setSelectedFile(file);
    setValue("offerImage", file);
    trigger("offerImage");
    setHasImageChanged(modalType === "edit");

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setSelectedFile(null);
    setValue("offerImage", null);
    trigger("offerImage");
    setHasImageChanged(modalType === "edit" && selectedOffer?.offerImage ? true : false);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (modalType === "add") {
        const formData = new FormData();
        formData.append("offerImage", data.offerImage);
        
        const response = await OffersApi.createOffer(formData);
        
        if (response.data.status) {
          showAlert("success", response.data.message || "Offer created successfully");
          closeModal(true);
        } else {
          showAlert("error", response.data.message || "Failed to create offer");
        }
      } else if (modalType === "edit" && selectedOffer?._id) {
        if (hasImageChanged && data.offerImage) {
          const formData = new FormData();
          formData.append("offerImage", data.offerImage);
          
          const response = await OffersApi.updateOffer({
            id: selectedOffer._id,
            ...formData
          });
          
          if (response.data.status) {
            showAlert("success", response.data.message || "Offer updated successfully");
            closeModal(true);
          } else {
            showAlert("error", response.data.message || "Failed to update offer");
          }
        } else {
          showAlert("info", "No changes made");
          closeModal(false);
        }
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      showAlert("error", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openFileDialog = () => {
    document.getElementById("file-input").click();
  };

  const isSubmitDisabled = () => {
    if (loading) return true;
    if (modalType === "add") return !previewImage;
    if (modalType === "edit") return !hasImageChanged;
    return true;
  };

  return (
    <Box className="p-5">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-md">
            <FaImage className="text-blue-600 text-sm" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              {modalType === "add" ? "Add Offer" : "Edit Offer"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {modalType === "add" 
                ? "Upload a new promotional offer image" 
                : "Update the existing offer image"}
            </p>
          </div>
        </div>
      </div>

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Image Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
            previewImage 
              ? 'border-blue-300 bg-blue-50/30' 
              : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            id="file-input"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Offer Preview"
                className="w-full max-w-md h-64 object-contain rounded-lg mx-auto border border-slate-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-rose-50 hover:border-rose-200 transition-colors"
              >
                <FaTimes className="text-rose-500 text-sm" />
              </button>
              <div className="mt-3 flex items-center justify-center gap-2">
                <FaUpload className="text-blue-500 text-xs" />
                <span className="text-xs text-slate-500">Click to change image</span>
              </div>
              {modalType === "edit" && !hasImageChanged && (
                <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                  <FaCheckCircle className="text-blue-600 text-xs" />
                  <span className="text-xs text-blue-700 font-medium">Using existing image</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 py-4">
              <div className="p-3 bg-slate-100 rounded-full">
                <MdAddPhotoAlternate className="text-slate-400 text-4xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {modalType === "add" ? "Upload Offer Image" : "Change Offer Image"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Click to browse or drag and drop
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                <FaInfoCircle className="text-slate-400 text-[10px]" />
                <span>JPG, PNG, GIF, WebP (Max 5MB)</span>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {errors.offerImage && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
            <p className="text-xs text-rose-600 text-center">
              {errors.offerImage.message}
            </p>
          </div>
        )}

        {/* Info Message for Edit */}
        {modalType === "edit" && !hasImageChanged && previewImage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-600 text-center">
              Upload a new image to update, or keep the existing one
            </p>
          </div>
        )}
      </Box>

      {/* Dialog Actions */}
      <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
        <Button
          onClick={() => closeModal(false)}
          variant="outlined"
          size="small"
          disabled={loading}
          sx={{
            color: '#64748b',
            borderColor: '#e2e8f0',
            fontSize: '0.75rem',
            padding: '4px 12px',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#94a3b8',
              backgroundColor: '#f8fafc',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitDisabled()}
          startIcon={loading && <CircularProgress size={14} sx={{ color: '#FFF' }} />}
          sx={{
            backgroundColor: '#16AFF6',
            color: '#FFF',
            fontSize: '0.75rem',
            padding: '4px 12px',
            textTransform: 'none',
            boxShadow: 'none',
            minWidth: '100px',
            '&:hover': {
              backgroundColor: '#0F8FC9',
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              backgroundColor: '#94a3b8',
            },
          }}
        >
          {loading 
            ? 'Processing...' 
            : modalType === "add" 
              ? 'Add Offer' 
              : 'Update Offer'
          }
        </Button>
      </div>
    </Box>
  );
};

export default OfferModal;