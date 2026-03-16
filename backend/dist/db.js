"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.saveDB = saveDB;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.join(__dirname, '..', 'data', 'database.json');
// Ensure data directory exists
const dataDir = path_1.default.dirname(DB_PATH);
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
// Initial database structure
const initialDB = {
    users: [],
    jobs: [],
    candidates: [],
    paymentMethods: [],
};
// Load or initialize database
function loadDB() {
    try {
        if (fs_1.default.existsSync(DB_PATH)) {
            const data = fs_1.default.readFileSync(DB_PATH, 'utf-8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.log('Creating new database...');
    }
    saveDB(initialDB);
    return initialDB;
}
// Save database
function saveDB(db) {
    fs_1.default.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
// Database instance
let db = loadDB();
exports.db = db;
// Auto-save on exit
process.on('exit', () => saveDB(db));
process.on('SIGINT', () => {
    saveDB(db);
    process.exit(0);
});
//# sourceMappingURL=db.js.map