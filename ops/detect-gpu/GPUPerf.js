// /assets/6555defbfb3813d1e0778105/detect-gpu.esm.min.js
// 5.0.37

const inLoad = op.inTriggerButton("Load library");
const outTrigger = op.outTrigger('Loaded');
const outPerf = op.outObject("GPU Tier");
const outVersion = op.outString("Version");

inLoad.onTriggered = async () => {
    const name = '/assets/6555defbfb3813d1e0778105/detect-gpu.esm.min.js';
    const url = op.patch.getFilePath(name);
    let fullUrl = url;
    if (op.patch.isEditorMode())
        fullUrl = window.location.origin + url;

	const {
		getGPUTier
	} = await import(fullUrl);

	const gpuTier = await getGPUTier();
	outVersion.set('5.0.37');
    outPerf.setRef(gpuTier);
    outTrigger.trigger();
}