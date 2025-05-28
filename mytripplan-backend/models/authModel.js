// models/authModel.js
const pool = require('../config/db'); // Use the pool from db.js

/**
 * @description Creates a new user in the database.
 * @param {object} userData - Object containing user details (userId, email, phoneNumber, passwordHash, firstName, lastName)
 * @returns {Promise<object>} - A promise that resolves with the created user's details.
 */
exports.createUser = (userData) => {
    const { userId, email, phoneNumber, passwordHash, firstName, lastName } = userData;
    return new Promise(async (resolve, reject) => {
        const query = 'INSERT INTO users (user_id, email, phone_number, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)';
        const params = [
            userId,
            email || null,       // Allow email to be null if not provided (e.g., for phone-only signup if re-enabled)
            phoneNumber || null, // Allow phone_number to be null if not provided (e.g., for email-only signup)
            passwordHash,
            firstName || null,
            lastName || null
        ];

        try {
            const [result] = await pool.execute(query, params);
            resolve({
                id: result.insertId, // MySQL auto-incremented ID (if you have one)
                user_id: userId,
                email,
                phone_number: phoneNumber,
                first_name: firstName,
                last_name: lastName
            });
        } catch (err) {
            console.error("Error creating user:", err);
            reject(err);
        }
    });
};

/**
 * @description Finds a user by their email address.
 * @param {string} email - The email address to search for.
 * @returns {Promise<object|undefined>} - A promise that resolves with the user object if found, otherwise undefined.
 */
exports.findUserByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        const query = 'SELECT user_id, email, phone_number, password_hash, first_name, last_name FROM users WHERE email = ?';
        try {
            const [results] = await pool.execute(query, [email]);
            resolve(results[0]); // Returns the first user found or undefined
        } catch (err) {
            console.error("Error finding user by email:", err);
            reject(err);
        }
    });
};

// You can add findUserByPhoneNumber if you want to support phone-based login/lookup later
// exports.findUserByPhoneNumber = (phoneNumber) => {
//     return new Promise(async (resolve, reject) => {
//         const query = 'SELECT user_id, email, phone_number, password_hash, first_name, last_name FROM users WHERE phone_number = ?';
//         try {
//             const [results] = await pool.execute(query, [phoneNumber]);
//             resolve(results[0]);
//         } catch (err) {
//             console.error("Error finding user by phone number:", err);
//             reject(err);
//         }
//     });
// };
