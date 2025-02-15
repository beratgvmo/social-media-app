import { TbX } from "react-icons/tb";

interface ImageGridProps {
    postImages?: string[];
    handleDeleteImage?: () => void;
}

const PostImageGrid: React.FC<ImageGridProps> = ({
    postImages = [],
    handleDeleteImage,
}) => {
    if (!postImages.length) return null;

    return (
        <div className="relative">
            {handleDeleteImage && (
                <div className="flex justify-end gap-4 mb-1.5 mr-1.5">
                    <button type="button" onClick={handleDeleteImage}>
                        <TbX className="text-white bg-gray-700 text-3xl p-1.5 hover:bg-gray-800 transition-all cursor-pointer rounded-full" />
                    </button>
                </div>
            )}
            {postImages.length === 1 && (
                <div className="relative">
                    <img
                        src={postImages[0]}
                        className="rounded-md w-full"
                        alt="Uploaded image 1"
                    />
                </div>
            )}
            {postImages.length === 2 && (
                <div className="flex space-x-2">
                    {postImages.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={image}
                                className="rounded-md w-[306px] h-[306px] object-cover"
                                alt={`Uploaded image ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
            )}
            {postImages.length === 3 && (
                <div className="flex space-x-2 w-full">
                    <div className="w-full relative">
                        <img
                            src={postImages[0]}
                            className="rounded-md w-[400px] h-[400px] object-cover"
                            alt="Uploaded image 1"
                        />
                    </div>
                    <div className="flex flex-col space-y-2 w-[50%] justify-between">
                        {postImages.slice(1, 3).map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image}
                                    className="rounded-md w-[194px] h-[194px] object-cover"
                                    alt={`Uploaded image ${index + 2}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {postImages.length === 4 && (
                <div className="flex space-x-2 w-full">
                    <div className="w-full relative">
                        <img
                            src={postImages[0]}
                            className="rounded-md w-[458px] h-[458px] object-cover"
                            alt="Uploaded image 1"
                        />
                    </div>
                    <div className="flex flex-col space-y-2 w-[32%] justify-between">
                        {postImages.slice(1, 4).map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image}
                                    className="rounded-md w-[146px] h-[146px] object-cover"
                                    alt={`Uploaded image ${index + 2}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostImageGrid;
