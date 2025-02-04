import { TbTrash } from "react-icons/tb";

interface ImageGridProps {
    postImages: File[];
    handleDeleteImage: (index: number) => void;
}

const ImageGridUser: React.FC<ImageGridProps> = ({
    postImages,
    handleDeleteImage,
}) => {
    return (
        postImages.length > 0 && (
            <div>
                {postImages.length === 1 && (
                    <div className="relative">
                        <img
                            src={URL.createObjectURL(postImages[0])}
                            className="rounded-md w-full"
                            alt="Uploaded image 1"
                        />
                        <button
                            onClick={() => handleDeleteImage(0)}
                            className="absolute group top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                            <span className="animate-ping group-hover:inline-flex hidden transition absolute top-0 right-0 h-6 w-6 rounded-full bg-red-400 opacity-75"></span>

                            <TbTrash />
                        </button>
                    </div>
                )}

                {postImages.length === 2 && (
                    <div className="flex space-x-2">
                        <div className="relative">
                            <img
                                src={URL.createObjectURL(postImages[0])}
                                className="rounded-md w-[306px] h-[306px] object-cover "
                                alt="Uploaded image 1"
                            />
                            <button
                                onClick={() => handleDeleteImage(0)}
                                className="absolute group top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                                <span className="animate-ping group-hover:inline-flex hidden transition absolute top-0 right-0 h-6 w-6 rounded-full bg-red-400 opacity-75"></span>

                                <TbTrash />
                            </button>
                        </div>

                        <div className="relative">
                            <img
                                src={URL.createObjectURL(postImages[1])}
                                className="rounded-md w-[306px] h-[306px] object-cover "
                                alt="Uploaded image 2"
                            />
                            <button
                                onClick={() => handleDeleteImage(1)}
                                className="absolute group top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                                <span className="animate-ping group-hover:inline-flex hidden transition absolute top-0 right-0 h-6 w-6 rounded-full bg-red-400 opacity-75"></span>
                                <TbTrash />
                            </button>
                        </div>
                    </div>
                )}

                {postImages.length === 3 && (
                    <div className="flex space-x-2 w-full">
                        <div className="w-full relative">
                            <img
                                src={URL.createObjectURL(postImages[0])}
                                className="rounded-md w-[400px] h-[400px] object-cover"
                            />
                            <button
                                onClick={() => handleDeleteImage(0)}
                                className="absolute group top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                                <span className="animate-ping group-hover:inline-flex hidden transition absolute top-0 right-0 h-6 w-6 rounded-full bg-red-400 opacity-75"></span>
                                <TbTrash />
                            </button>
                        </div>
                        <div className="flex flex-col space-y-2 w-[50%] justify-between">
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(postImages[1])}
                                    className="rounded-md w-[194px] h-[194px] object-cover"
                                />
                                <button
                                    onClick={() => handleDeleteImage(1)}
                                    className="absolute group top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <span className="animate-ping group-hover:inline-flex hidden transition absolute top-0 right-0 h-6 w-6 rounded-full bg-red-400 opacity-75"></span>
                                    <TbTrash />
                                </button>
                            </div>
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(postImages[2])}
                                    className="rounded-md w-[194px] h-[194px] object-cover"
                                />
                                <button
                                    onClick={() => handleDeleteImage(2)}
                                    className="absolute group top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <span className="animate-ping group-hover:inline-flex hidden transition absolute top-0 right-0 h-6 w-6 rounded-full bg-red-400 opacity-75"></span>
                                    <TbTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {postImages.length === 4 && (
                    <div className="flex space-x-2 w-full">
                        <div className="w-full  relative">
                            <img
                                src={URL.createObjectURL(postImages[0])}
                                className="rounded-md w-[458px] h-[458px] object-cover"
                            />
                            <button
                                onClick={() => handleDeleteImage(0)}
                                className="absolute group top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                                <span className="animate-ping group-hover:inline-flex hidden transition absolute top-0 right-0 h-6 w-6 rounded-full bg-red-400 opacity-75"></span>
                                <TbTrash />
                            </button>
                        </div>
                        <div className="flex flex-col space-y-2 w-[32%] justify-between">
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(postImages[1])}
                                    className="rounded-md w-[146px] h-[146px] object-cover"
                                />
                                <button
                                    onClick={() => handleDeleteImage(1)}
                                    className="absolute group top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <span className="animate-ping group-hover:inline-flex hidden transition absolute top-0 right-0 h-6 w-6 rounded-full bg-red-400 opacity-75"></span>
                                    <TbTrash />
                                </button>
                            </div>
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(postImages[2])}
                                    className="rounded-md w-[146px] h-[146px] object-cover"
                                />
                                <button
                                    onClick={() => handleDeleteImage(2)}
                                    className="absolute group top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <span className="animate-ping group-hover:inline-flex hidden transition absolute top-0 right-0 h-6 w-6 rounded-full bg-red-400 opacity-75"></span>
                                    <TbTrash />
                                </button>
                            </div>
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(postImages[3])}
                                    className="rounded-md w-[146px] h-[146px] object-cover"
                                />
                                <button
                                    onClick={() => handleDeleteImage(3)}
                                    className="absolute group top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <span className="animate-ping group-hover:inline-flex hidden transition absolute top-0 right-0 h-6 w-6 rounded-full bg-red-400 opacity-75"></span>
                                    <TbTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    );
};

export default ImageGridUser;
