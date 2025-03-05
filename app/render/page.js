'use client';

import { BabylonScene } from './_components/BabylonScene/BabylonScene';
import { FurnitureMenuBase } from './_components/FurnitureMenuBase/FurnitureMenuBase';

export default function RenderPage() {
    return (
        <div>
            <h1>Babylon.js Cube Test</h1>    
            {/* Rendering 3D Scene Here */}
            <BabylonScene />
        </div>
    );
};
