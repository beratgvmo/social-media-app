import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/index.css";
import Sources from "quill";

interface WritingTextProps {
    handleInput: (value: string) => void;
    quillRef: React.MutableRefObject<ReactQuill | null>;
    setRange: (range: number | null) => void;
}

const WritingText: React.FC<WritingTextProps> = ({
    handleInput,
    quillRef,
    setRange,
}) => {
    const handleInputChange = (
        value: string,
        delta: any,
        source: any,
        editor: ReactQuill.UnprivilegedEditor
    ) => {
        handleInput(editor.getText());
    };

    const handleSelectionChange = (
        selection: ReactQuill.Range | null,
        source: Sources,
        editor: ReactQuill.UnprivilegedEditor
    ) => {
        if (selection) {
            setRange(selection.index);
        }
    };

    return (
        <div className="h-auto">
            <ReactQuill
                ref={quillRef}
                onChange={handleInputChange}
                onChangeSelection={handleSelectionChange}
                className="w-full h-full ql-container"
                placeholder="Ne hakkında konuşmak istiyorsunuz?"
                modules={{ toolbar: false }}
                style={{ border: "none" }}
            />
        </div>
    );
};

export default WritingText;
