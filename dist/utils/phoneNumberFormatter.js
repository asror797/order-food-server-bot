"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPhoneNumber = void 0;
function formatPhoneNumber(phoneNumber) {
    const numericPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (numericPhoneNumber.length === 9) {
        return numericPhoneNumber;
    }
    else {
        if (numericPhoneNumber.length > 9) {
            return numericPhoneNumber.slice(-9);
        }
        return null;
    }
}
exports.formatPhoneNumber = formatPhoneNumber;
