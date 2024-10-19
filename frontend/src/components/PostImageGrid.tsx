import React from "react";

interface ImageGridProps {
    postImages: string[];
}

const PostImageGrid: React.FC<ImageGridProps> = ({ postImages }) => {
    return (
        postImages.length > 0 && (
            <div>
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
                        <div className="relative">
                            <img
                                src={postImages[0]}
                                className="rounded-md w-[306px] h-[306px] object-cover "
                                alt="Uploaded image 1"
                            />
                        </div>

                        <div className="relative">
                            <img
                                src={postImages[1]}
                                className="rounded-md w-[306px] h-[306px] object-cover "
                                alt="Uploaded image 2"
                            />
                        </div>
                    </div>
                )}

                {postImages.length === 3 && (
                    <div className="flex space-x-2 w-full">
                        <div className="w-full relative">
                            <img
                                src={postImages[0]}
                                className="rounded-md w-[400px] h-[400px] object-cover"
                            />
                        </div>
                        <div className="flex flex-col space-y-2 w-[50%] justify-between">
                            <div className="relative">
                                <img
                                    src={postImages[1]}
                                    className="rounded-md w-[194px] h-[194px] object-cover"
                                />
                            </div>
                            <div className="relative">
                                <img
                                    src={postImages[2]}
                                    className="rounded-md w-[194px] h-[194px] object-cover"
                                />
                            </div>
                        </div>
                    </div>
                )}
                {postImages.length === 4 && (
                    <div className="flex space-x-2 w-full">
                        <div className="w-full  relative">
                            <img
                                src={postImages[0]}
                                className="rounded-md w-[458px] h-[458px] object-cover"
                            />
                        </div>
                        <div className="flex flex-col space-y-2 w-[32%] justify-between">
                            <div className="relative">
                                <img
                                    src={postImages[1]}
                                    className="rounded-md w-[146px] h-[146px] object-cover"
                                />
                            </div>
                            <div className="relative">
                                <img
                                    src={postImages[2]}
                                    className="rounded-md w-[146px] h-[146px] object-cover"
                                />
                            </div>
                            <div className="relative">
                                <img
                                    src={postImages[3]}
                                    className="rounded-md w-[146px] h-[146px] object-cover"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    );
};

export default PostImageGrid;
