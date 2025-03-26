import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImageUrl: string) => void;
    onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
    image,
    onCropComplete,
    onCancel
}) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropChange = (crop: Point) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImage = async () => {
        try {
            if (!croppedAreaPixels) return;

            const canvas = document.createElement('canvas');
            const img = new Image();
            img.src = image;

            await new Promise<void>((resolve) => {
                img.onload = () => resolve();
            });

            const scaleX = img.naturalWidth / img.width;
            const scaleY = img.naturalHeight / img.height;

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Could not get 2D rendering context');
            }

            ctx.drawImage(
                img,
                croppedAreaPixels.x * scaleX,
                croppedAreaPixels.y * scaleY,
                croppedAreaPixels.width * scaleX,
                croppedAreaPixels.height * scaleY,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            const croppedImageUrl = canvas.toDataURL('image/jpeg');
            onCropComplete(croppedImageUrl);
        } catch (e) {
            console.error('Error creating cropped image:', e);
        }
    };

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 cropcontrol-box">
            <div className="relative h-full flex flex-col">
                <div className="flex-grow relative test">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropCompleteHandler}
                    />
                </div>
                <div className="p-2 bg-gray-100 ">
                    <div className="mb-0">
                        <input
                            id="zoom"
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 p-2 btn-groups">
                    <button
                        onClick={onCancel}
                        className="px-3  btn-cancel transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={getCroppedImage}
                        className="px-3 py-1 bg-blue-500 btn-crop mx-2 transition"
                    >
                        Crop & Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;