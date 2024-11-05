import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImageUtils";

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedImage: Blob | null) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
    imageSrc,
    onCropComplete,
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1.5);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null
    );

    const onCropCompleteHandler = useCallback(
        (_: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const handleCrop = useCallback(async () => {
        if (!croppedAreaPixels) return;

        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );

            onCropComplete(croppedImage);
        } catch (error) {
            console.error("Resim kırpılırken bir hata oluştu", error);
        }
    }, [croppedAreaPixels, imageSrc]);

    useEffect(() => {
        handleCrop();
    }, [handleCrop]);

    return (
        <div>
            <div style={{ position: "relative", width: "100%", height: 400 }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropCompleteHandler}
                />
            </div>
        </div>
    );
};

export default ImageCropper;
