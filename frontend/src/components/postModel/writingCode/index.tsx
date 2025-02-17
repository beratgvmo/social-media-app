import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import { TbMoon, TbSun } from "react-icons/tb";
import CodeMirror from "@uiw/react-codemirror";
import { motion } from "framer-motion";

interface WritingCodeProps {
    codeValue: string;
    handleInput: (e: string) => void;
    handleCodeLanguage: (e: string) => void;
    codeLanguage: string;
    handleTheme: () => void;
    theme: "light" | "dark";
}

export default function WritingCode({
    codeValue,
    handleInput,
    codeLanguage,
    handleCodeLanguage,
    handleTheme,
    theme,
}: WritingCodeProps) {
    return (
        <div>
            <div className="rounded-lg min-h-7 mt-2.5 mx-4 mb-5 overflow-hidden border">
                <div
                    className={`flex justify-between px-2 py-1 ${
                        theme === "light" ? "bg-gray-100" : "bg-[#0d1117]"
                    }`}
                >
                    <input
                        className={`text-xs my-0.5 bg-transparent outline-none ${
                            theme === "light" ? "text-gray-600" : "text-gray-50"
                        }`}
                        maxLength={12}
                        value={codeLanguage}
                        placeholder="language"
                        onChange={(e) =>
                            handleCodeLanguage(e.target.value.toLowerCase())
                        }
                    />
                    <button
                        type="button"
                        onClick={handleTheme}
                        className="cursor-pointer flex items-center justify-center rounded-md relative w-6 h-6"
                    >
                        <motion.span
                            key={theme}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute"
                        >
                            {theme === "light" ? (
                                <TbSun className="text-gray-600" />
                            ) : (
                                <TbMoon className="text-gray-50" />
                            )}
                        </motion.span>
                    </button>
                </div>
                <div className="border-b"></div>
                <CodeMirror
                    value={codeValue}
                    height="100%"
                    extensions={[javascript({ jsx: true, typescript: true })]}
                    theme={theme === "light" ? githubLight : githubDark}
                    onChange={(value) => handleInput(value)}
                    className="custom-scrollbar"
                />
            </div>
        </div>
    );
}
