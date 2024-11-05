import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "blue" | "gray" | "red" | "outline" | "rounded";
    size?: "normal" | "small";
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "blue",
    size = "normal",
    className,
    disabled,
    ...props
}) => {
    const baseStyles = `inline-flex items-center font-medium focus:outline-none transition ease-in-out duration-150`;

    const variantStyles = {
        blue: `bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg text-white ${
            disabled &&
            "bg-gray-200 text-gray-400 hover:bg-gray-200 cursor-not-allowed"
        }`,
        red: "bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-lg text-white",
        gray: "bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900 rounded-lg",
        outline:
            "border-2 border-gray-500 bg-transparent text-gray-500 rounded-3xl hover:border-gray-800 hover:text-gray-800 transition",
        rounded:
            "bg-blue-500 border-2 border-transparent hover:bg-blue-600 active:bg-blue-700 rounded-3xl text-white",
    }[variant];

    const sizeStyles = {
        normal: "px-4 py-1.5 text-sm",
        small: "px-2 py-1.5 text-xs",
    }[size];

    return (
        <button
            className={classNames(
                baseStyles,
                variantStyles,
                sizeStyles,
                className
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
