import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";

interface WritingCodeProps {
    codeValue: string;
    handleInput: (e: string) => void;
}

export default function WritingCode({
    codeValue,
    handleInput,
}: WritingCodeProps) {
    return (
        <div>
            <div className="rounded-lg min-h-7 mt-2.5 mx-4 mb-5 overflow-hidden border">
                <CodeMirror
                    value={codeValue}
                    height="w-full"
                    extensions={[javascript({ jsx: true, typescript: true })]}
                    theme={githubLight}
                    onChange={(value) => handleInput(value)}
                    className="custom-scrollbar"
                />
            </div>
        </div>
    );
}
