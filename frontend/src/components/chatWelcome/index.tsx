import { TbChessFilled } from "react-icons/tb";

const ChatWelcome: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center pb-6 w-full h-full">
            <TbChessFilled className="text-gray-400 text-5xl" />
            <div className="flex flex-col mt-1 items-center justify-center">
                <p className="text-gray-700">Arkadaşlarla Sohbet etmek</p>
                <p className="text-gray-500 text-sm">için güzel bir gün</p>
            </div>
        </div>
    );
};

export default ChatWelcome;
