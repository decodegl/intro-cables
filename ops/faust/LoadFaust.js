const LIB = 'libFaust-0.0.42.js';

const inLoad = op.inTriggerButton("Load lib");
const outTrigger = op.outTrigger('Loaded');
const outFaust = op.outObject("Faust Module");
const outVersion = op.outString("Version");

inLoad.onTriggered = async () => {
    const name = '/assets/654a0b835ae6c809058fb603/' + LIB;
    const url = op.patch.getFilePath(name);
    let fullUrl = url;
    if (op.patch.isEditorMode())
        fullUrl = window.location.origin + url;
	const {
		instantiateFaustModule,
		LibFaust,
		WavEncoder,
		FaustWasmInstantiator,
		FaustMonoDspGenerator,
		FaustPolyDspGenerator,
		FaustMonoWebAudioDsp,
		FaustOfflineProcessor,
		FaustCompiler,
		FaustSvgDiagrams
	} = await import(fullUrl);
    const faustModule = await instantiateFaustModule();

    const libFaust = new LibFaust(faustModule);
    const compiler = new FaustCompiler(libFaust);
    const svgDiagrams = new FaustSvgDiagrams(compiler);

	globalThis.Faust = {
	    libFaust: libFaust,
	    compiler: compiler,
	    FaustWasmInstantiator: FaustWasmInstantiator,
	    FaustMonoDspGenerator: FaustMonoDspGenerator,
	    FaustPolyDspGenerator: FaustPolyDspGenerator,
	    FaustMonoWebAudioDsp: FaustMonoWebAudioDsp,
	    FaustOfflineProcessor: FaustOfflineProcessor,
	    svgDiagrams: svgDiagrams,
	    WavEncoder: WavEncoder
	}

	outVersion.set(libFaust.version());
    outFaust.set(globalThis.Faust);
    outTrigger.trigger();
};
