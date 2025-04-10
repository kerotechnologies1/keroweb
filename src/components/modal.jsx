/* eslint-disable react/prop-types */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <Transition
            appear
            show={isOpen}
            as={Fragment}
        >
            <Dialog
                as="div"
                className="relative z-50"
                onClose={onClose}
            >
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal Content */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="relative flex max-h-[85%] w-full max-w-lg flex-col rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900 lg:min-w-[50%]">
                            {/* Close Button (Icon) */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>

                            {/* Modal Title */}
                            {title && <h2 className="text-center text-lg font-semibold">{title}</h2>}

                            {/* Modal Content with Custom Scrollbar */}
                            <div className="custom-scrollbar mt-4 flex-1 overflow-y-auto">{children}</div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
