import algosdk from 'algosdk';
export var Utils;
(function (Utils) {
    function getReadableState(delta) {
        var r = {};
        delta.forEach(function (d) {
            var key = Buffer.from(d.key, 'base64').toString('utf8');
            var value;
            if (d.value.bytes) {
                var raw = new Uint8Array(Buffer.from(d.value.bytes, 'base64'));
                var utf8 = Buffer.from(d.value.bytes, 'base64').toString();
                value = { type: 'bytes', raw: raw, string: utf8 };
                var address = algosdk.encodeAddress(raw);
                if (algosdk.isValidAddress(address))
                    value.address = address;
            }
            else {
                var numberValue = d.value.uint;
                value = { type: 'int', raw: algosdk.encodeUint64(numberValue), number: numberValue };
            }
            r[key] = value;
        });
        return r;
    }
    Utils.getReadableState = getReadableState;
})(Utils || (Utils = {}));
export default Utils;
//# sourceMappingURL=utils.js.map