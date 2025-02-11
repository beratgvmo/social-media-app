import React, { FC, useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImageUtils";
import Modal from "@/components/Modal";
import {
    TbArrowLeft,
    TbCirclePlus,
    TbCloudUpload,
    TbPencil,
    TbReload,
    TbTrash,
} from "react-icons/tb";
import Button from "@/components/button";

interface PhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: File[];
    setImages: (file: File[]) => void;
}

const PhotoModal: FC<PhotoModalProps> = ({
    isOpen,
    onClose,
    images,
    setImages,
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [postImages, setPostImages] = useState<File[]>([]);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null
    );
    const [aspect, setAspect] = useState(1);

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null
    );

    useEffect(() => {
        setPostImages(images);
    }, [isOpen]);

    const onCropCompleteHandler = useCallback(
        (_: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const onImageClick = (image: File, index: number) => {
        const imageUrl = URL.createObjectURL(image);
        setImageSrc(imageUrl);
        setSelectedImageIndex(index);
    };

    const handleCrop = useCallback(async () => {
        if (!croppedAreaPixels || !imageSrc || selectedImageIndex === null)
            return;

        try {
            const croppedBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            );
            if (croppedBlob) {
                const croppedFile = new File(
                    [croppedBlob],
                    postImages[selectedImageIndex].name,
                    {
                        type: "image/jpeg",
                        lastModified: Date.now(),
                    }
                );

                const updatedImages = [...postImages];
                updatedImages[selectedImageIndex] = croppedFile;
                setPostImages(updatedImages);

                setZoom(1);
                setRotation(0);
                setImageSrc(null);
                setSelectedImageIndex(null);
            }
        } catch (error) {
            console.error("Resim kırpılırken bir hata oluştu", error);
        }
    }, [croppedAreaPixels, imageSrc, rotation, postImages, selectedImageIndex]);

    const onImageAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files);

            for (let file of newImages) {
                const img = new Image();
                img.onload = () => {
                    if (img.width > 3000 || img.height > 3000) {
                        alert("Resim boyutu 3000x3000'den büyük olamaz.");
                        return;
                    }
                    setPostImages((prevImages) => [...prevImages, file]);
                };
                img.src = URL.createObjectURL(file);
            }

            event.target.value = "";
        }
    };

    const handleDeleteImage = (index: number) => {
        const updatedImages = [...postImages];
        updatedImages.splice(index, 1);
        setPostImages(updatedImages);
    };

    const handleForward = () => {
        setImages(postImages);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editör" maxWidth="5xl">
            {!postImages.length ? (
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-[450px] border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <TbCloudUpload className="w-12 h-12 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                    Resim Yüklemek için tıklayın
                                </span>
                            </p>
                        </div>
                        <input
                            type="file"
                            onChange={onImageAdd}
                            className="hidden"
                            accept="image/*"
                        />
                    </label>
                </div>
            ) : (
                <div className="h-[450px]">
                    {imageSrc ? (
                        <div className="flex h-full">
                            <div className="relative w-full">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    rotation={rotation}
                                    zoom={zoom}
                                    aspect={aspect}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropCompleteHandler}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <div className="w-[40%] p-2 flex flex-col justify-between">
                                <div className="p-2">
                                    <button
                                        onClick={() => setImageSrc("")}
                                        className="flex items-center gap-2 mb-5 pl-2 pr-4 py-1 hover:bg-gray-200 transition-all rounded-full"
                                    >
                                        <TbArrowLeft className="text-lg" />
                                        <p>Düzenle</p>
                                    </button>
                                    <div className="p-2">
                                        <p className="block mb-2 text-sm font-medium text-gray-700">
                                            Görüntü Oranı
                                        </p>
                                        <div className="flex gap-2">
                                            {[1, 4 / 1, 3 / 4, 16 / 9].map(
                                                (a) => (
                                                    <Button
                                                        key={a}
                                                        variant={
                                                            aspect === a
                                                                ? "rounded"
                                                                : "outline"
                                                        }
                                                        onClick={() =>
                                                            setAspect(a)
                                                        }
                                                    >
                                                        {a === 1
                                                            ? "Kare"
                                                            : `${Math.round(
                                                                  a * 4
                                                              )}:${4}`}
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                        <div className="mt-5">
                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                Yakınlaştır
                                            </label>
                                            <input
                                                type="range"
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                value={zoom}
                                                onChange={(e) =>
                                                    setZoom(
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                                className="w-full h-2 mb-6 bg-gray-200 rounded-lg cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() =>
                                                    setRotation(rotation - 90)
                                                }
                                                className="hover:bg-gray-200 p-2 rounded-full transition-all"
                                            >
                                                <TbReload className="scale-x-[-1] text-gray-700 text-2xl" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setRotation(rotation + 90)
                                                }
                                                className="hover:bg-gray-200 p-2 rounded-full transition-all"
                                            >
                                                <TbReload className="text-gray-700 text-2xl" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleCrop}
                                    variant="rounded"
                                    className="mt-4 mb-2 w-full flex justify-center"
                                >
                                    Uygula
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full border-t flex flex-col justify-between">
                            <div className="flex gap-12 px-6 mt-8">
                                {postImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className="w-52 h-52 flex-shrink-0 relative"
                                    >
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Yüklenen görsel ${index + 1}`}
                                            className="w-full h-full object-contain rounded-xl border-2 hover:border-gray-500 transition-all"
                                        />
                                        <div className="absolute right-2.5 bottom-2.5 bg-black/60 border border-black rounded-full flex flex-col gap-1.5">
                                            <button
                                                onClick={() =>
                                                    onImageClick(image, index)
                                                }
                                                className="text-xl text-gray-200 p-1.5 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-all"
                                            >
                                                <TbPencil />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteImage(index)
                                                }
                                                className="text-xl text-gray-200 p-1.5 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-all"
                                            >
                                                <TbTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {postImages.length < 4 && (
                                    <label className="flex flex-col items-center justify-center w-52 h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <TbCloudUpload className="w-8 h-8 mb-1.5 text-gray-500" />
                                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                Resim Eklemek için tıkla
                                            </p>
                                        </div>
                                        <input
                                            id="dropzone-file"
                                            type="file"
                                            onChange={onImageAdd}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="bg-white py-3 px-6 flex gap-2.5 justify-end border-t rounded-b-xl">
                <Button
                    onClick={() => onClose()}
                    type="button"
                    variant="outline"
                >
                    Vazgeç
                </Button>
                <Button
                    type="button"
                    variant="rounded"
                    onClick={() => handleForward()}
                    className="bg-blue-600 text-white focus:ring-blue-500 hover:bg-blue-700 active:bg-blue-800"
                >
                    Kayet
                </Button>
            </div>
        </Modal>
    );
};

export default PhotoModal;
