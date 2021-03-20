export default function (json) {
    return '?' +
        Object.keys(json).map(function (key) {
            if (json[key] === undefined) {
                json[key] = ""
            }
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);

        }).join('&');
}