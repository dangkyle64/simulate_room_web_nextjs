module.exports = {
    presets: [
      '@babel/preset-env',  // Ensure compatibility with Node.js versions Jest uses
    ],
    plugins: [
      '@babel/plugin-transform-modules-commonjs',  // This converts ES modules to CommonJS
    ],
  };
  