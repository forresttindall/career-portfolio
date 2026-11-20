import { GrainGradient } from '@paper-design/shaders-react';

// The WebGL grain gradient (same shader as Material Lab). Its own file so GrainBackdrop can lazy-load it:
// the shader code only downloads once a backdrop scrolls near the screen.
const GrainShader = (props) => <GrainGradient style={{ width: '100%', height: '100%' }} {...props} />;

export default GrainShader;
