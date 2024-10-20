import { TbUser } from "react-icons/tb";
import ProfileSidebar from "../components/ProfileSidebar";
import Button from "../components/Button";

const MyNetwork: React.FC = () => {
    return (
        <div className="mt-6 flex gap-5">
            <ProfileSidebar />
            <div className="w-full">
                <div className="pt-3 bg-white rounded-lg border w-full">
                    <p className="px-4 pb-3">Davetler</p>
                    <div className="">
                        <div className="flex px-4 border-t justify-between items-center py-3">
                            <div className="flex items-center gap-2">
                                <TbUser className="w-14 h-14 p-2 flex items-center border rounded-full text-blue-500" />
                                <div className="">
                                    <p className="font-medium text-gray-800">
                                        Berat Güven
                                    </p>
                                    <p className="text-xs text-gray-700">
                                        3 saat önce
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">Yoksay</Button>
                                <Button variant="rounded">Kabul Et</Button>
                            </div>
                        </div>
                        <div className="flex px-4 border-t justify-between items-center py-3">
                            <div className="flex items-center gap-2">
                                <TbUser className="w-14 h-14 p-2 flex items-center border rounded-full text-blue-500" />
                                <p>Berat Güven</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">Yoksay</Button>
                                <Button variant="rounded">Kabul Et</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyNetwork;
