import { CgSpinner } from "react-icons/cg";
import { TbChessFilled } from "react-icons/tb";

const Loading: React.FC = () => {
    return (
        <div className="min-h-screen min-w-full flex justify-center items-center flex-col pb-20">
            <div className="flex items-center justify-center mb-6">
                <TbChessFilled size={40} className="text-blue-600" />
                <p className="text-3xl font-semibold text-blue-600">
                    Sosyal Medya
                </p>
            </div>
            <CgSpinner className="animate-spin text-blue-600" size={45} />
        </div>
    );
};

export default Loading;
