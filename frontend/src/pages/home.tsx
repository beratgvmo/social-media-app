import { useState } from "react";

import { useAuthStore } from "../store/useAuthStore";
import { TbUser, TbUserHeart } from "react-icons/tb";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { HiOutlinePhoto } from "react-icons/hi2";

import ProfileSidebar from "../components/ProfileSidebar";
import RightbarFollow from "../components/RightbarFollow";
import Modal from "../components/Modal";
import Button from "../components/Button";
import banner from "../pages/banner.jpg";
import EmojiPicker, { EmojiStyle, EmojiClickData } from "emoji-picker-react";

const Home: React.FC = () => {
    const { user } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const [postValue, setPostValue] = useState<string>("");
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
    const [postImages, setPostImages] = useState<string[]>([]);
    const onEmojiClick = (emojiData: EmojiClickData) => {
        setPostValue((prevInput) => prevInput + emojiData.emoji);
        setIsEmojiPickerOpen(false);
    };

    const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
        setPostValue(event.currentTarget.innerHTML);
    };

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (file) {
            const imageUrl = URL.createObjectURL(file);

            setPostImages((prevImages) => [...prevImages, imageUrl]);
        }
    };

    return (
        <div className="flex gap-5 mt-6">
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Gönderi Olusturma"
                maxWidth="2xl"
            >
                <div>
                    <div className="px-5 py-4 h-96 overflow-auto">
                        <div className="relative mb-10">
                            <div
                                className="w-full text-lg focus:outline-none"
                                contentEditable="true"
                                onInput={handleInput}
                                dangerouslySetInnerHTML={{ __html: postValue }}
                                role="textbox"
                                aria-multiline="true"
                                suppressContentEditableWarning={true}
                            ></div>
                            {postValue === "" && (
                                <p className="absolute top-0 text-gray-500 text-lg select-none pointer-events-none">
                                    Ne hakkında konuşmak istiyorsunuz?
                                </p>
                            )}
                        </div>
                        {postImages.length > 0 && (
                            <div className="border rounded-md">
                                {postImages.length === 1 && (
                                    <img
                                        src={postImages[0]}
                                        className="rounded-md w-full"
                                        alt="Uploaded image 1"
                                    />
                                )}

                                {postImages.length === 2 && (
                                    <div className="flex space-x-2">
                                        <img
                                            src={postImages[0]}
                                            className="rounded-md w-[306px] h-[306px] object-cover "
                                            alt="Uploaded image 1"
                                        />
                                        <img
                                            src={postImages[1]}
                                            className="rounded-md w-[306px] h-[306px] object-cover "
                                            alt="Uploaded image 2"
                                        />
                                    </div>
                                )}

                                {postImages.length === 3 && (
                                    <div className="flex space-x-2 w-full">
                                        <div className="w-full">
                                            <img
                                                src={postImages[0]}
                                                className="rounded-md w-[400px] h-[400px] object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2 w-[50%] justify-between">
                                            <img
                                                src={postImages[1]}
                                                className="rounded-md w-[194px] h-[194px] object-cover"
                                            />
                                            <img
                                                src={postImages[2]}
                                                className="rounded-md w-[194px] h-[194px] object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                                {postImages.length === 4 && (
                                    <div className="flex space-x-2 w-full">
                                        <div className="w-full">
                                            <img
                                                src={postImages[0]}
                                                className="rounded-md w-[458px] h-[458px] object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2 w-[32%] justify-between">
                                            <img
                                                src={postImages[1]}
                                                className="rounded-md w-[146px] h-[146px] object-cover"
                                            />
                                            <img
                                                src={postImages[2]}
                                                className="rounded-md w-[146px] h-[146px] object-cover"
                                            />
                                            <img
                                                src={postImages[3]}
                                                className="rounded-md w-[146px] h-[146px] object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="relative px-6 flex gap-3">
                        <button
                            onClick={() =>
                                setIsEmojiPickerOpen(!isEmojiPickerOpen)
                            }
                        >
                            <MdOutlineEmojiEmotions className="w-11 h-11 hover:bg-gray-200 transition p-2.5 rounded-full" />
                        </button>
                        {isEmojiPickerOpen && (
                            <div className="absolute bottom-12 -left-36">
                                <EmojiPicker
                                    height="330px"
                                    emojiStyle={EmojiStyle.GOOGLE}
                                    searchPlaceholder="Arama Yap"
                                    onEmojiClick={onEmojiClick}
                                    skinTonesDisabled={true}
                                />
                            </div>
                        )}

                        <div>
                            <label>
                                <div>
                                    <HiOutlinePhoto className="w-11 h-11 hover:bg-gray-200 transition p-2.5 rounded-full" />
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    onChange={onImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <TbUserHeart className="w-11 h-11 hover:bg-gray-200 transition p-2.5 rounded-full" />
                    </div>
                </div>
                <div className="mt-6 bg-white py-3 px-6 flex gap-2 justify-end border-t rounded-b-xl">
                    <Button className="bg-blue-600 text-white focus:ring-blue-500 hover:bg-blue-700 active:bg-blue-800">
                        Fotoğrafı kaydet
                    </Button>
                </div>
            </Modal>
            <ProfileSidebar />
            <div className="w-[570px]">
                <div className="pt-4 px-4 pb-3 bg-white rounded-lg border mb-3">
                    <div className="mb-2.5 flex gap-3">
                        <div className="w-14">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="Profil Resmi"
                                    className="w-12 h-12 ml-1 rounded-full border bg-white"
                                />
                            ) : (
                                <TbUser className="w-10 h-10 p-2 flex items-center border rounded-full text-blue-500" />
                            )}
                        </div>
                        <button
                            onClick={handleOpenModal}
                            className="w-full text-start transition px-4 border rounded-3xl border-gray-400 text-sm text-gray-600 font-medium focus:outline-none hover:bg-gray-200"
                        >
                            Gönderi Yazın
                        </button>
                    </div>
                    <div className="flex items-center justify-around">
                        <div className="flex items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                            <HiOutlinePhoto className="text-red-500 mr-1 w-5 h-5" />
                            <p className="font-medium text-red-500 text-sm">
                                Resim
                            </p>
                        </div>
                        <div className="flex items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                            <MdOutlineEmojiEmotions className="text-orange-500 mr-1 w-5 h-5" />
                            <p className="font-medium text-orange-500 text-sm">
                                Emoji
                            </p>
                        </div>
                        <div className="flex items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                            <TbUserHeart className="text-green-500 mr-1 w-5 h-5" />
                            <p className="font-medium text-green-500 text-sm">
                                Etiketle
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border-b-2 border-gray-300"></div>
            </div>
            <RightbarFollow />
        </div>
    );
};

export default Home;
