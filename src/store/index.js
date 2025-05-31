import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#EFBD48',
  isLogoTexture: false,
  isFullTexture: false,
  logoDecal: '/threejs.png',
  fullDecal: '/threejs.png',
  isNewUpload: false, // Track if this is a newly uploaded texture
});

export default state;