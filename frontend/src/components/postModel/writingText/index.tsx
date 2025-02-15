import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/index.css";
import Sources from "quill";

interface WritingTextProps {
    handleInput: (value: string) => void;
    quillRef: React.MutableRefObject<ReactQuill | null>;
    setRange: (range: number | null) => void;
    postValue: string;
}

const WritingText: React.FC<WritingTextProps> = ({
    handleInput,
    quillRef,
    setRange,
    postValue,
}) => {
    const [editorValue, setEditorValue] = useState(postValue || "");

    const handleInputChange = (
        value: string,
        delta: any,
        source: any,
        editor: ReactQuill.UnprivilegedEditor
    ) => {
        handleInput(editor.getText());
        setEditorValue(value);
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
                value={editorValue}
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
