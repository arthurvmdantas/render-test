import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'path';

// The composition you want to render
const compositionId = 'MyComp';

// You only have to create a bundle once, and you may reuse it
const bundleLocation = await bundle({
	entryPoint: path.resolve('./src/index.ts'),
	// If you have a Webpack override, make sure to add it here
	webpackOverride: (config) => config,
});

// Get the composition you want to render. Pass inputProps if you want to customize the
// duration or other metadata.
const composition = await selectComposition({
	serveUrl: bundleLocation,
	id: compositionId,
});

const onProgress = ({
	renderedFrames,
	encodedFrames,
	encodedDoneIn,
	renderedDoneIn,
	stitchStage,
}) => {
	if (stitchStage === 'encoding') {
		// First pass, parallel rendering of frames and encoding into video
		console.log('Encoding...');
	} else if (stitchStage === 'muxing') {
		// Second pass, adding audio to the video
		console.log('Muxing audio...');
	}
	// Amount of frames rendered into images
	console.log(`${renderedFrames} rendered`);
	// Amount of frame encoded into a video
	console.log(`${encodedFrames} encoded`);
	// Time to create images of all frames
	if (renderedDoneIn !== null) {
		console.log(`Rendered in ${renderedDoneIn}ms`);
	}
	// Time to encode video from images
	if (encodedDoneIn !== null) {
		console.log(`Encoded in ${encodedDoneIn}ms`);
	}
};

// Render the video
await renderMedia({
	composition,
	serveUrl: bundleLocation,
	codec: 'h264',
	outputLocation: `out/${compositionId}.mp4`,
	onProgress,
});

console.log('Render done!');
