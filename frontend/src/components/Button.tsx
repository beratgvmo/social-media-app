import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    disabled,
    className = "",
    ...props
}) => {
    return (
        <button
            disabled={disabled}
            className={`
        inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 ${
            disabled && "opacity-50 cursor-not-allowed"
        } ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
