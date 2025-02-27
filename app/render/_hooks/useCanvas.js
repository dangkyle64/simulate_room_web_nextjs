const { useRef } = require('react');

function useCanvas() {
    const canvasRef = useRef(null);

    const setCanvas = (canvas) => {
        canvasRef.current = canvas;
    };

    return {
        canvasRef, 
        setCanvas,
    };
};

module.exports = { useCanvas };