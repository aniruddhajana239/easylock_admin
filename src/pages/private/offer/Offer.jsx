// pages/Offers.js
import { useEffect, useState } from "react";
import Breadcrumb from "../../../component/breadcrumb/Breadcrumb";
import Table from "../../../component/table/Table";
import { Button, Dialog, Paper, Box, Modal } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Loader from "../../../component/loader/Loader";
import { OffersApi } from "../../../api/offer/OffersApi";
import { FaTrash, FaEye, FaTimes, FaImage } from "react-icons/fa";
import { useAlert } from "../../../context/customContext/AlertContext";
import OfferModal from "../../../component/dialog/offer/OfferDialog";
import { WarningPopup } from "../../../component/popup/WarningPopup";

const Offers = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const [offersData, setOffersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "edit"
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [viewImageModal, setViewImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Offers", path: "/device-lock/offers" },
  ];

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await OffersApi.getAll();
      if (response.data.status) {
        setOffersData(response.data.data || []);
      } else {
        showAlert("error", response.data.message || "Failed to fetch offers");
        setOffersData([]);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      showAlert("error", "Error fetching offers");
      setOffersData([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalType("add");
    setSelectedOffer(null);
    setIsModalOpen(true);
  };

  // const openEditModal = (offer) => {
  //   setModalType("edit");
  //   setSelectedOffer(offer);
  //   setIsModalOpen(true);
  // };

  const openViewModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setViewImageModal(true);
  };

  const closeModal = (isSuccess) => {
    setIsModalOpen(false);
    setSelectedOffer(null);
    if (isSuccess) {
      fetchOffers();
    }
  };

  const closeViewModal = () => {
    setViewImageModal(false);
    setSelectedImage("");
  };

  const handleDeleteClick = (offerId, offerName = "this offer") => {
    setOfferToDelete({ id: offerId, name: offerName });
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!offerToDelete?.id) return;

    try {
      setLoading(true);
      const response = await OffersApi.deleteOffer(offerToDelete.id);
      
      if (response.data.status) {
        showAlert("success", response.data.message || "Offer deleted successfully");
        fetchOffers();
      } else {
        showAlert("error", response.data.message || "Failed to delete offer");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      showAlert("error", error.response?.data?.message || "Failed to delete offer");
    } finally {
      setLoading(false);
      setDeleteConfirmationOpen(false);
      setOfferToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setOfferToDelete(null);
  };

  const columns = ["Image", "Actions"];

  const renderTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {offersData?.map((item, index) => (
        <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
          {/* Image Column */}
          <td className="py-3 px-4">
            <div className="flex items-center">
              <div 
                className="relative group cursor-pointer"
                onClick={() => openViewModal(item.offerImage)}
              >
                <img
                  src={item.offerImage}
                  alt={`Offer ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200 group-hover:border-blue-300 transition-all duration-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200 flex items-center justify-center">
                  <FaEye className="text-white text-lg" />
                </div>
              </div>
            </div>
          </td>
          
          {/* Actions Column */}
          <td className="py-3 px-4">
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => openViewModal(item.offerImage)}
                className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                title="View Image"
              >
                <FaEye size={16} />
              </button>
              {/* <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors duration-150"
                title="Edit Offer"
              >
                <FaEdit size={16} />
              </button> */}
              <button
                onClick={() => handleDeleteClick(item.id, `Offer ${item.id}`)}
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-150"
                title="Delete Offer"
              >
                <FaTrash size={15} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="min-h-screen py-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light text-slate-900">
                Offers Management
                <span className="text-base font-normal text-slate-400 ml-3">
                  {offersData.length > 0 && `(${offersData.length} total)`}
                </span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Create and manage promotional offers
              </p>
            </div>
            
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={openAddModal}
              sx={{
                backgroundColor: '#16AFF6',
                color: '#FFF',
                fontWeight: 500,
                fontSize: '0.875rem',
                padding: '6px 16px',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#0F8FC9',
                  boxShadow: 'none',
                },
              }}
            >
              Add New Offer
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Paper 
          elevation={0} 
          sx={{ 
            padding: 3, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.08)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader />
            </div>
          ) : Array.isArray(offersData) && offersData?.length > 0 ? (
            <Table
              columns={columns}
              count={offersData.length}
              showPagination={false}
              isOfferTable={true}
            >
              {renderTableBody()}
            </Table>
          ) : (
            <div className="py-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <FaImage className="text-slate-400 text-2xl" />
                </div>
                <h3 className="text-sm font-medium text-slate-900 mb-1">No Offers Found</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Get started by creating your first offer
                </p>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={openAddModal}
                  sx={{
                    backgroundColor: '#16AFF6',
                    color: '#FFF',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    padding: '6px 16px',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#0F8FC9',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Create Offer
                </Button>
              </div>
            </div>
          )}
        </Paper>

        {/* Add/Edit Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => closeModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }
          }}
        >
          <OfferModal
            closeModal={closeModal}
            modalType={modalType}
            selectedOffer={selectedOffer}
            fetchOffers={fetchOffers}
          />
        </Dialog>

        {/* Image View Modal */}
        <Modal
          open={viewImageModal}
          onClose={closeViewModal}
          aria-labelledby="image-view-modal"
          aria-describedby="view-offer-image"
          className="flex items-center justify-center p-4"
        >
          <Box
            className="bg-white rounded-xl max-w-3xl max-h-[90vh] overflow-auto outline-none shadow-xl"
            onClick={(e) => e.stopPropagation()}
            sx={{ border: '1px solid #e2e8f0' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Offer Image
              </h2>
              <button
                onClick={closeViewModal}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage}
                alt="Full Size Offer"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </Box>
        </Modal>

        {/* Delete Confirmation Modal */}
        <WarningPopup
          open={deleteConfirmationOpen}
          onYes={handleConfirmDelete}
          onClose={handleCancelDelete}
          message={`Are you sure you want to delete ${offerToDelete?.name || 'this offer'}? This action cannot be undone.`}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Offers;