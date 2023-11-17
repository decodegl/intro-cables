const inAudioNode = op.inObject("In Audio Node");
const inKeyOn = op.inTriggerButton("Key on");
const inKeyOff = op.inTriggerButton("Key off");
const inAllOff = op.inTriggerButton("All keys off");

const inChannel = op.inInt('Channel', 0);
const inPitch = op.inInt('Pitch', 64);
const inVelocity = op.inInt('Velocity', 100);


const outNode = op.outObject('Audio node');
const outNext = op.outTrigger("Changed");

const getValues = () => {
    return {
        'channel': Math.max(0, Math.floor(inChannel.get())),
        'pitch': Math.max(0, Math.floor(inPitch.get())),
        'velocity': Math.min(100, Math.max(0, Math.floor(inVelocity.get()))),
    }
}

inKeyOn.onTriggered = () => {
    const node = inAudioNode.get();
    if (!node) {
        outNode.set(null);
        return;
    }

    const v = getValues();
    node.keyOn(v.channel, v.pitch, v.velocity);

    outNode.setRef(node);
    outNext.trigger();
}

inKeyOff.onTriggered = () => {
    const node = inAudioNode.get();
    if (!node) {
        outNode.set(null);
        return;
    }

    const v = getValues();
    node.keyOff(v.channel, v.pitch, v.velocity);

    outNode.setRef(node);
    outNext.trigger();
}

inAllOff.onTriggered = () => {
    const node = inAudioNode.get();
    if (!node) {
        outNode.set(null);
        return;
    }

    node.allNotesOff();

    outNode.setRef(node);
    outNext.trigger();
}


