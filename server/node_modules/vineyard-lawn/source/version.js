"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var pattern = /^(\d+)\.(\d+)(\.[a-z]+)?$/;
var defaultPlatform = 'none';
var Version = (function () {
    function Version(majorOrString, minor, platform) {
        if (minor === void 0) { minor = 0; }
        if (platform === void 0) { platform = defaultPlatform; }
        if (typeof majorOrString === 'string') {
            this.createFromString(majorOrString);
        }
        else {
            this.major = majorOrString;
            this.minor = minor;
            this.platform = platform;
        }
    }
    Version.prototype.createFromString = function (text) {
        var match = text.match(pattern);
        if (!match)
            throw new errors_1.Bad_Request('Invalid version format: ' + text);
        this.major = parseInt(match[1]);
        this.minor = parseInt(match[2]);
        this.platform = match[3]
            ? match[3]
            : defaultPlatform;
    };
    Version.prototype.equals = function (version) {
        return this.major == version.major && this.minor == version.minor;
    };
    Version.prototype.toString = function () {
        return this.major + '.' + this.minor
            + (this.platform && this.platform != 'none' ? '.' + this.platform : '');
    };
    return Version;
}());
exports.Version = Version;
//# sourceMappingURL=version.js.map