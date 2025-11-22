import { useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "@/utils/api";

const SOSDeactivationModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            handleDeactivateSOS();
        }
    }, [isOpen]);

    const handleDeactivateSOS = async () => {
        const result = await Swal.fire({
            title: "Deactivate SOS",
            html: `
                <div style="text-align: center;">
                    <div style="font-size: 60px; margin-bottom: 20px;">🚨</div>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                        Are you sure you want to deactivate the SOS system?<br/>
                        This action will disable emergency alerts.
                    </p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#9ca3af",
            confirmButtonText: "Yes, Deactivate",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            customClass: {
                popup: "rounded-xl",
                confirmButton: "px-6 py-2.5 rounded-lg font-medium",
                cancelButton: "px-6 py-2.5 rounded-lg font-medium",
            },
            buttonsStyling: true,
            allowOutsideClick: true,
            allowEscapeKey: true,
        });

        if (result.isConfirmed) {
            // Show loading
            Swal.fire({
                title: "Deactivating...",
                html: "Please wait while we deactivate the SOS system.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            try {
                await api.post("/admin/dactivate-sos");

                Swal.fire({
                    icon: "success",
                    title: "Deactivated!",
                    text: "SOS system has been deactivated successfully.",
                    confirmButtonColor: "#aa8642",
                    confirmButtonText: "OK",
                    customClass: {
                        popup: "rounded-xl",
                        confirmButton: "px-6 py-2.5 rounded-lg font-medium",
                    },
                });

                toast.success("SOS deactivated successfully");
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: error.response?.data?.message || "Failed to deactivate SOS system.",
                    confirmButtonColor: "#aa8642",
                    confirmButtonText: "OK",
                    customClass: {
                        popup: "rounded-xl",
                        confirmButton: "px-6 py-2.5 rounded-lg font-medium",
                    },
                });

                toast.error(error.response?.data?.message || "Error deactivating SOS");
            }
        }

        // Close the modal state
        onClose();
    };

    return null;
};

SOSDeactivationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default SOSDeactivationModal;
