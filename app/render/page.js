'use client';

const { BabylonScene } = require('./_components/BabylonScene/BabylonScene');
const { FurnitureMenuBase } = require('./_components/FurnitureMenuBase/FurnitureMenuBase');

export default function RenderPage() {
    return (
        <div>
            <h1>Babylon.js Cube Test</h1>    
            {/* Rendering 3D Scene Here */}
            <BabylonScene />
            <FurnitureMenuBase />
        </div>
    );
};



