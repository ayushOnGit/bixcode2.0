const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');
const formatMessage = require('format-message');

// Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
const blockIconURI = require('./firebase.png');


/**
 * Firebase extension for Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */

class Scratch3FirebaseBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.app = null;
        this.database = null;
        this.firebaseConfig = null;
    }
    get EXTENSION_ID() {
        return 'Firebase';
    }
    getInfo() {
        return [{
            id: 'Firebase',
            name: "Firebase Database",
            blockIconURI: blockIconURI,
            color1: '#EE8596',
            blocks: [
                {
                    opcode: 'initializeFirebase',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scratch3.firebase.initializeFirebase',
                        default: 'Enter API Key [APIKey] and Database URL [DatabaseURL]',
                        description: 'Initialize Firebase with user-provided credentials'
                    }),
                    arguments: {
                        APIKey: {
                            type: ArgumentType.STRING,
                            defaultValue: 'YOUR_API_KEY'
                        },
                        DatabaseURL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'YOUR_DATABASE_URL'
                        }
                    }
                },
                {
                    opcode: 'getData',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'scratch3.firebase.getData',
                        default: 'Get data from [Path]',
                        description: 'Fetch data from a specific path in Firebase'
                    }),
                    arguments: {
                        Path: {
                            type: ArgumentType.STRING,
                            defaultValue: 'users'
                        }
                    }
                },
                {
                    opcode: 'setData',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scratch3.firebase.setData',
                        default: 'Set data at [Path] to [Value]',
                        description: 'Set data at a specific path in Firebase'
                    }),
                    arguments: {
                        Path: {
                            type: ArgumentType.STRING,
                            defaultValue: 'users'
                        },
                        Value: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello, Firebase!'
                        }
                    }
                },
                {
                    opcode: 'appendToList',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scratch3.firebase.appendToList',
                        default: 'Append [Value] to list at [Path]',
                        description: 'Append data to a list stored at a specific path in Firebase'
                    }),
                    arguments: {
                        Path: {
                            type: ArgumentType.STRING,
                            defaultValue: 'messages'
                        },
                        Value: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello, Firebase!'
                        }
                    }
                }                
            ]
        }];
    }

    async initializeFirebase(args) {
        const apiKey = args.APIKey;
        const databaseURL = args.DatabaseURL;

        this.firebaseConfig = {
            apiKey,
            databaseURL
        };

        // Initialize Firebase
        this.app = initializeApp(this.firebaseConfig);
        this.database = getDatabase(this.app);

        return 'Firebase initialized successfully';
    }

    async getData(args) {
        if (!this.database) {
            return 'Firebase is not initialized';
        }

        const path = args.Path;
        try {
            const snapshot = await get(ref(this.database, path));
            const data = snapshot.val();
            return data ? JSON.stringify(data) : 'No data found';
        } catch (error) {
            console.error("Error fetching data:", error);
            return 'Error fetching data';
        }
    }

    async setData(args) {
        if (!this.database) {
            return 'Firebase is not initialized';
        }

        const path = args.Path;
        const value = args.Value;
        try {
            await set(ref(this.database, path), value);
            return 'Data set successfully';
        } catch (error) {
            console.error("Error setting data:", error);
            return 'Error setting data';
        }
    }
    async appendToList(args) {
        const path = args.Path;
        const value = args.Value;
    
        if (!this.database) {
            return 'Firebase is not initialized';
        }
    
        try {
            // Get the reference to the list at the specified path
            const listRef = ref(this.database, path);
    
            // Fetch the current data from the list
            const snapshot = await get(listRef);
            let currentList = snapshot.val();
    
            // If the list doesn't exist yet, initialize it as an empty array
            if (!Array.isArray(currentList)) {
                currentList = [];
            }
    
            // Append the new value to the list
            currentList.push(value);
    
            // Set the updated list back in the database
            await set(listRef, currentList);
    
            return 'Value appended to list successfully';
        } catch (error) {
            console.error("Error appending value to list:", error);
            return 'Error appending value to list';
        }
    }
    
}
module.exports = Scratch3FirebaseBlocks;
