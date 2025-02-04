import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

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
            <div className="rounded-lg overflow-hidden p-1.5 bg-[#282c34]">
                <CodeMirror
                    value={codeValue}
                    height="w-full"
                    extensions={[javascript()]}
                    theme={"dark"}
                    onChange={(value) => handleInput(value)}
                    className="custom-scrollbar"
                />
            </div>
            {/* <ul>
                {messages.map((message) => (
                    <li key={message.id} className="rounded-lg bg-[#282c34]">
                        <CodeMirror
                            value={message.content}
                            height="200px"
                            extensions={[javascript()]}
                            theme={"dark"}
                            readOnly={true}
                            className="custom-scrollbar"
                        />
                    </li>
                ))}
            </ul> */}
        </div>
    );
}
