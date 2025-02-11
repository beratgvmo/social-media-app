import { FC, useEffect } from "react";
import { TbX } from "react-icons/tb";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "5xl";
}

const Modal: FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "2xl",
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
        "5xl": "sm:max-w-5xl",
    }[maxWidth];

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center mt-10 justify-center z-50"
            onClick={onClose}
        >
            <div
                className={`bg-white w-full ${maxWidthClass} rounded-xl shadow-lg`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center py-2 px-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-90">
                        {title}
                    </h3>
                    <button
                        className="text-gray-500 p-2 rounded-full hover:bg-gray-100 hover:text-gray-800 text-2xl transition"
                        onClick={onClose}
                    >
                        <TbX />
                    </button>
                </div>
                <div className="bg-gray-50 rounded-b-xl">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
