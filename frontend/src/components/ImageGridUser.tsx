import { TbPencil, TbTrash, TbX } from "react-icons/tb";

interface ImageGridProps {
    postImages: File[];
    handleDeleteImage: () => void;
    handleOpenPhotoModal: () => void;
}

const ImageGridUser: React.FC<ImageGridProps> = ({
    postImages,
    handleDeleteImage,
    handleOpenPhotoModal,
}) => {
    return (
        postImages.length > 0 && (
            <div className="relative">
                <div className="flex justify-end gap-4 mb-1.5 mr-1.5">
                    <button
                        type="button"
                        onClick={() => handleOpenPhotoModal()}
                    >
                        <TbPencil className="text-white bg-gray-700 text-3xl p-1.5 hover:bg-gray-800 transition-all cursor-pointer rounded-full" />
                    </button>
                    <button type="button" onClick={() => handleDeleteImage()}>
                        <TbX className="text-white bg-gray-700 text-3xl p-1.5 hover:bg-gray-800 transition-all cursor-pointer rounded-full" />
                    </button>
                </div>
                {postImages.length === 1 && (
                    <div className="relative">
                        <img
                            src={URL.createObjectURL(postImages[0])}
                            className="rounded-md border w-full"
                            alt="Uploaded image 1"
                        />
                    </div>
                )}

                {postImages.length === 2 && (
                    <div className="flex space-x-2">
                        <div className="relative">
                            <img
                                src={URL.createObjectURL(postImages[0])}
                                className="rounded-md w-[306px]  h-[306px] border object-cover "
                                alt="Uploaded image 1"
                            />
                        </div>

                        <div className="relative">
                            <img
                                src={URL.createObjectURL(postImages[1])}
                                className="rounded-md w-[306px] h-[306px] border object-cover "
                                alt="Uploaded image 2"
                            />
                        </div>
                    </div>
                )}

                {postImages.length === 3 && (
                    <div className="flex space-x-2 w-full">
                        <div className="w-full relative">
                            <img
                                src={URL.createObjectURL(postImages[0])}
                                className="rounded-md w-[400px] h-[400px] border object-cover"
                            />
                        </div>
                        <div className="flex flex-col space-y-2 w-[50%] justify-between">
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(postImages[1])}
                                    className="rounded-md w-[194px] h-[194px] border object-cover"
                                />
                            </div>
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(postImages[2])}
                                    className="rounded-md w-[194px] h-[194px] border object-cover"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {postImages.length === 4 && (
                    <div className="flex space-x-2 w-full">
                        <div className="w-full  relative">
                            <img
                                src={URL.createObjectURL(postImages[0])}
                                className="rounded-md w-[458px] h-[458px] border object-cover"
                            />
                        </div>
                        <div className="flex flex-col space-y-2 w-[32%] justify-between">
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(postImages[1])}
                                    className="rounded-md w-[146px] h-[146px] border object-cover"
                                />
                            </div>
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(postImages[2])}
                                    className="rounded-md w-[146px] h-[146px] border object-cover"
                                />
                            </div>
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(postImages[3])}
                                    className="rounded-md w-[146px] h-[146px] border object-cover"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    );
};

export default ImageGridUser;
