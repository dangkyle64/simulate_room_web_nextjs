'use client';

const { BabylonScene } = require('./_components/BabylonScene/BabylonScene');
const { FurnitureMenuBase } = require('./_components/FurnitureMenuBase/FurnitureMenuBase');
const { confirmPopupWindow } = require('./_utils/confirmationWindow');

export default function RenderPage() {
    return (
        <div>
            <h1>Babylon.js Cube Test</h1>    
            {/* Rendering 3D Scene Here */}
            <BabylonScene />
            <button onClick={confirmPopupWindow} style={{ marginTop: '60px' }}>PopupButton</button>
            <FurnitureMenuBase />
        </div>
    );
};



