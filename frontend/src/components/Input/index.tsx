import React, {
    forwardRef,
    useEffect,
    useRef,
    InputHTMLAttributes,
} from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    type?: string;
    className?: string;
    isFocused?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ type = "text", className = "", isFocused = false, ...props }, ref) => {
        const input = ref || useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (isFocused && input && "current" in input && input.current) {
                input.current.focus();
            }
        }, [isFocused]);

        return (
            <input
                {...props}
                type={type}
                className={
                    "border-gray-300 focus:border-blue-500 rounded-md shadow-sm w-full mt-1 px-2.5 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400" +
                    className
                }
                ref={input}
            />
        );
    }
);

export default TextInput;
