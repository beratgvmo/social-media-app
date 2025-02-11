export const getCroppedImg = async (
    imageSrc: string,
    croppedAreaPixels: any,
    rotation: number = 0
): Promise<Blob | null> => {
    const image = await loadImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const { width, height, x, y } = croppedAreaPixels;

    // **Rotasyon işlemi için yeni canvas oluştur**
    const rotatedCanvas = document.createElement("canvas");
    const rotatedCtx = rotatedCanvas.getContext("2d");

    if (!rotatedCtx) return null;

    // **Yeni genişlik ve yükseklik hesapla (rotasyon sonrası)**
    const radians = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));

    const newWidth = image.width * cos + image.height * sin;
    const newHeight = image.width * sin + image.height * cos;

    rotatedCanvas.width = newWidth;
    rotatedCanvas.height = newHeight;

    // **Rotasyon işlemi (orta noktaya göre)**
    rotatedCtx.translate(newWidth / 2, newHeight / 2);
    rotatedCtx.rotate(radians);
    rotatedCtx.drawImage(image, -image.width / 2, -image.height / 2);

    // **Kırpma işlemi**
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(rotatedCanvas, x, y, width, height, 0, 0, width, height);

    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // CORS hatası almamak için
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
    });
};
