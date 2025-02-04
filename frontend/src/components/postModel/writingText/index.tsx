import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/index.css";

interface WritingTextProps {
    postValue: string;
    handleInput: (value: string) => void;
    quillRef: React.RefObject<ReactQuill>;
    setRange: React.Dispatch<
        React.SetStateAction<{ index: number; length: number } | null>
    >;
}

const WritingText: React.FC<WritingTextProps> = ({
    postValue,
    handleInput,
    quillRef,
    setRange,
}) => {
    const handleSelectionChange = (range: any, source: string, editor: any) => {
        setRange(range);
    };

    return (
        <div className="h-auto">
            <ReactQuill
                ref={quillRef}
                value={postValue}
                onChange={handleInput}
                onChangeSelection={handleSelectionChange}
                className="w-full h-full ql-container"
                placeholder="ne hakkında konuşmak istiyorsunuz?"
                modules={{ toolbar: false }}
                style={{ border: "none" }}
            />
        </div>
    );
};

export default WritingText;
