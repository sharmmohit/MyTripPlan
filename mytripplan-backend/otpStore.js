  // otpStore.js
    // A simple in-memory store for OTPs.
    // In a production environment, consider using Redis or a database for persistence and scalability.
    const otpMap = new Map(); // Stores { email: { otp: '123456', expiryTime: timestamp } }

    module.exports = {
        set: (identifier, data) => {
            otpMap.set(identifier, data);
        },
        get: (identifier) => {
            return otpMap.get(identifier);
        },
        delete: (identifier) => {
            otpMap.delete(identifier);
        },
        // Optional: Clean up expired OTPs periodically
        cleanup: () => {
            const now = Date.now();
            for (let [identifier, data] of otpMap.entries()) {
                if (now > data.expiryTime) {
                    otpMap.delete(identifier);
                    console.log(`Cleaned up expired OTP for ${identifier}`);
                }
            }
        }
    };

    // Clean up expired OTPs every 1 minute
    setInterval(() => {
        module.exports.cleanup();
    }, 60 * 1000);