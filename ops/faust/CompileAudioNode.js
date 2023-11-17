const inRun = op.inTriggerButton("Run");
const inFM = op.inObject('Faust Module');
const inAudioCode = op.inStringEditor("Audio Code", '');
const inMode = op.inSwitch("Mode",["Monophonic","Polyphonic"], "Monophonic");
const inStart = op.inTriggerButton('Play');
const inStop = op.inTriggerButton('Stop');

const outNode = op.outObject('Faust Audio Node');
const outFinished = op.outTrigger("Finished");

const outError = op.outBool('Has error');

let audioCtx = CABLES.WEBAUDIO.createAudioContext(op);

inRun.onTriggered = run;

let node = null;
let hasRun = false;
let generator = null;

async function run() {
    const code = inAudioCode.get();
    if (!code) return;
    const faustModule = inFM.get();
    if (!faustModule || !faustModule.FaustMonoDspGenerator) {
        return;
    }

    generator = null;

    if (inMode.get == "Monophonic") {
        generator = new faustModule.FaustMonoDspGenerator();
    } else {
        generator = new faustModule.FaustPolyDspGenerator();
    }

    try {

        await generator.compile(faustModule.compiler, "dsp", code, "");
        if (node) {
            node.disconnect();
        }
        if (inMode.get == "Monophonic") {
            node = await generator.createNode(audioCtx);
        }
        else {
             node = await generator.createNode(audioCtx, 4); // voices
        }

        if (node) {
            // node.connect(audioCtx.destination);
            // outNode.setRef(node);
            outError.set(false);
            hasRun = true;
        }

    } catch(e) {
        outError.set(true);
        node = null;
        // console.error(e);
        outNode.set(null);
        op.setUiError("CompileAudioNode", e);
    }
}

inStart.onTriggered = () => {
    if (!hasRun) run();
    if (!node) {
        outNode.set(null);
        return;
    }

    node.connect(audioCtx.destination);
    outNode.setRef(node);
    outFinished.trigger();
}

inStop.onTriggered = () => {
    if (!node) return;
    node.disconnect();
}


op.onDelete = () => {
    if (node) {
        try {
            node.disconnect();
        } catch(e) {}
    }

};



