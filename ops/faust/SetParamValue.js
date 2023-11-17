const inNode = op.inObject("Audio Node");
const inPath = op.inString('Path');
const inValue = op.inValue('Value');


const outNode = op.outObject('Out node');
const outTrig = op.outTrigger('Value Changed');

inValue.onChange = valueChanged;

function valueChanged() {
    const node = inNode.get();
    if (!node) {
        outNode.set(null);
        return;
    }
    const path = inPath.get();
    if (!path) return;

    node.setParamValue(path, inValue.get());
    outTrig.trigger();
    outNode.setRef(node);
}