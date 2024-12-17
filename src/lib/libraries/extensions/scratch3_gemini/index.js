const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const formatMessage = require('format-message');
const getMonitorIdForBlockWithArgs = require('../../util/get-monitor-id');




const languages = [
    { name: 'English', code: 'en' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Chinese (Simplified)', code: 'zh-CN' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Korean', code: 'ko' },
    { name: 'Russian', code: 'ru' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Hindi', code: 'hi' }
];

const partsOfSpeech = [
    { name: 'Noun', value: 'noun' },
    { name: 'Pronoun', value: 'pronoun' },
    { name: 'Verb', value: 'verb' },
    { name: 'Adverb', value: 'adverb' },
    { name: 'Adjective', value: 'adjective' },
    { name: 'Preposition', value: 'preposition' },
    { name: 'Conjunction', value: 'conjunction' },
    { name: 'Interjection', value: 'interjection' }
];

// Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
const blockIconURI = require('./GemeniIcon.png');

class Scratch3_gemini {
    constructor(runtime) {
        this.runtime = runtime;
        this.apiKey = 'AIzaSyBD5sPP-pqCBs-ysV7q-LO0iW4hXgVoxN4';
        // this.apiKey = process.env.REACT_APP_API_KEY;
        console.log(process.env.REACT_APP_API_KEY);
        this.client = new GoogleGenerativeAI(this.apiKey);
        this.modelId = 'gemini-1.5-flash';
        this._questionQueue = [];
    }

    get EXTENSION_ID() {
        return 'gemini';
    }

    getInfo() {
        return [{
            id: 'gemini',
            name: 'AI Assistant',
            blockIconURI: blockIconURI,
            color1: '#AD6EE8',
            blocks: [
                {
                    opcode: 'AiTranslate',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'ai.AiTranslate',
                        default: 'Translate [text] into [Hindi]',
                        description: 'Get the AI response for a given prompt'
                    }),
                    arguments: {
                        text: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Mango'
                        },
                        Hindi: {
                            type: ArgumentType.STRING,
                            menu: 'languages',
                            defaultValue: 'Hindi'
                        }
                    }
                },
                {
                    opcode: 'AskAI',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'ai.AskAI',
                        default: 'ask AI [text]',
                        description: 'Get the AI response for a given prompt'
                    }),
                    arguments: {
                        text: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello AI'
                        },
                    }
                },
                {
                    opcode: 'extractPartOfSpeech',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'ai.extractPOS',
                        default: 'Get [PartOfSpeech] from [Text]',
                        description: 'Extract specific part of speech from a given text'
                    }),
                    arguments: {
                        PartOfSpeech: {
                            type: ArgumentType.STRING,
                            menu: 'partsOfSpeech',
                            defaultValue: 'Noun'
                        },
                        Text: {
                            type: ArgumentType.STRING,
                            defaultValue: 'The quick brown fox jumps over the lazy dog.'
                        }
                    }
                },
                {
                    opcode: 'askAndWait',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'ai.askAndWaitBlock',
                        default: 'Ask [question] and wait',
                        description: 'Ask a question and wait for the user\'s response'
                    }),
                    arguments: {
                        question: {
                            type: ArgumentType.STRING,
                            defaultValue: 'What is your name?'
                        }
                    }
                },
            ],
            menus: {
                languages: {
                    acceptReporters: true,
                    items: languages.map(lang => lang.name),
                    sort: 'alphabetical'
                },
                partsOfSpeech: {
                    acceptReporters: true,
                    items: partsOfSpeech.map(pos => pos.name)
                }
            }
        }];
    }

    async AiTranslate(args) {
        const text = args.text;
        const targetLanguage = args.Hindi; // Assuming 'Hindi' is used to specify the target language    
        try {
            const model = this.client.getGenerativeModel({ model: this.modelId });
            const prompt = `Translate the following text into ${targetLanguage}: ${text} just translate don't add extra words` ;
            const result = await model.generateContent(prompt);    
            // Return the translated text
            return result.response.text();
        } catch (error) {
            return 'Error fetching translation response';
        }
    }

    async AskAI(args){
        const text = args.text;
        try {
            const model = this.client.getGenerativeModel({ model: this.modelId });
            const prompt = `Translate the following text into : ${text} in short` ;
            const result = await model.generateContent(prompt);
            return result.response.text();
        } 
        catch (error) {
            return 'Error fetching response';
        }
    }

    async extractPartOfSpeech(args) {
        const text = args.Text;
        const partOfSpeech = args.PartOfSpeech;   
        try {
            const model = this.client.getGenerativeModel({ model: this.modelId });
            
            const prompt = `Extract all ${partOfSpeech} from the following text: "${text}" in few words`;
            const result = await model.generateContent(prompt);
            
            // Return the extracted part of speech
            return result.response.text();
        } catch (error) {
            return `Error fetching ${partOfSpeech} from the text`;
        }
    }

    getPrimitives () {
        return {
            sensing_askandwait: this.askAndWait,
        };
    }

    getMonitored () {
        return {
            sensing_answer: {
                getId: () => 'ai.askAndWaitBlock'
            },
        };
    }

    async askAndWait(args, util) {
        const question = String(args.question);
        const target = util.target;
        
        return new Promise((resolve) => {
            this._enqueueAsk(question, resolve, target);
            
            this._askNextQuestion();
        });
    }
    

    _enqueueAsk(question, resolve, target) {
        console.log(`Enqueuing question: ${question}`);
        this._questionQueue.push({
            question,
            resolve,
            target,
            visible: target.visible,
            isStage: target.isStage
        });
    }

    async _askNextQuestion() {
        if (this._questionQueue.length === 0) return;
        
        const current = this._questionQueue.shift();
        const { question, resolve, target, visible, isStage } = current;
        console.log(`Processing question: ${question}`);

        setTimeout(async () => {
            try {
                const prompt = `Answer the question: "${question}" in a few words.`;
                const model = this.client.getGenerativeModel({ model: this.modelId });
                const result = await model.generateContent(prompt);
                const answer = result.response.text();
                
                if (visible && !isStage) {
                    this.runtime.emit('SAY', target, 'say', answer);
                } else {
                    this.runtime.emit('QUESTION', answer);
                }
                console.log(`Answer received: ${answer}`);
                resolve(answer);
            } catch (error) {
                console.error('Error fetching AI answer:', error);
                resolve('Error fetching answer');
            }
        }, 1000); 
    }
}

module.exports = Scratch3_gemini;
