import React, { useEffect, useRef, useState, forwardRef } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { MdOutlineEmojiEmotions } from "react-icons/md";

interface EmojiPickerModalProps {
    onEmojiSelectFunc: (emoji: any) => void;
}

const EmojiPickerModal = forwardRef<HTMLDivElement, EmojiPickerModalProps>(
    ({ onEmojiSelectFunc }, ref) => {
        const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
        const pickerRef = useRef<HTMLDivElement>(null);
        const buttonRef = useRef<HTMLButtonElement>(null);

        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (
                    pickerRef.current &&
                    !pickerRef.current.contains(event.target as Node) &&
                    buttonRef.current &&
                    !buttonRef.current.contains(event.target as Node)
                ) {
                    setIsEmojiPickerOpen(false);
                }
            }

            if (isEmojiPickerOpen) {
                document.addEventListener("mousedown", handleClickOutside);
            }

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [isEmojiPickerOpen]);

        return (
            <div className="relative" ref={ref}>
                <button
                    type="button"
                    ref={buttonRef}
                    onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
                    className={`cursor-pointer hover:bg-gray-200 p-2.5 transition rounded-full ${
                        isEmojiPickerOpen && "bg-gray-200"
                    }`}
                >
                    <MdOutlineEmojiEmotions className="w-7 h-7" />
                </button>

                {isEmojiPickerOpen && (
                    <div
                        ref={pickerRef}
                        className="absolute bottom-14 -left-36"
                    >
                        <Picker
                            data={data}
                            onEmojiSelect={onEmojiSelectFunc}
                            locale="tr"
                            previewPosition="none"
                        />
                    </div>
                )}
            </div>
        );
    }
);

export default EmojiPickerModal;
