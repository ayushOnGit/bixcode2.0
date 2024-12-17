const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const fetch = require('node-fetch'); // Assuming you have node-fetch installed for API requests

const formatMessage = require('format-message');
/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

const blockIconURI= require('./cloudy.png');
/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3WeatherDataBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * The ID of the renderer Drawable corresponding to the pen layer.
         * @type {int}
         * @private
         */
    }
    /**
     * @return {string} - the ID of this extension.
     */
    get EXTENSION_ID () {
        return 'WeatherData';
    }
 
    getInfo () {
        return [{
            id: 'WeatherData',
            name: "Weather Data",
            blockIconURI: blockIconURI,
            color1: '#1CC7FF',
            blocks: [
                
                {
                    opcode: 'getWeatherData',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gov.weatherData',
                        default: 'Get [DataType] of city [CityName]',
                        description: 'Get temperature, humidity or Pressure for a given city'
                    }),
                    arguments: {
                        DataType: {
                            type: ArgumentType.STRING,
                            menu: 'dataTypeMenu'
                        },
                        CityName: {
                            type: ArgumentType.STRING,
                            defaultValue: "Delhi"
                        },
                        Unit: {
                            type: ArgumentType.STRING,
                            menu: 'unitMenu'
                        }
                    }
                },
                {
                    opcode: 'temperatureComparison',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'gov.tempComparison',
                        default: 'Temperature in [CityName] > [Value]',
                        description: 'Compare temperature of a city with a value'
                    }),
                    arguments: {
                        CityName: {
                            type: ArgumentType.STRING,
                            defaultValue: "Delhi"
                        },
                        Value: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 25
                        },
                        Unit: {
                            type: ArgumentType.STRING,
                            menu: 'unitMenu'
                        }
                    }
                },
                {
                    opcode: 'convertUnits',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gov.convertUnits',
                        default: 'Convert [Value] from [FromUnit] to [ToUnit]',
                        description: 'Convert a value from one unit to another'
                    }),
                    arguments: {
                        Value: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        FromUnit: {
                            type: ArgumentType.STRING,
                            menu: 'unitMenu',
                            defaultValue: 'Celsius'
                        },
                        ToUnit: {
                            type: ArgumentType.STRING,
                            menu: 'unitMenu',
                            defaultValue: 'Fahrenheit'
                        }
                    },
                },
                {
                    opcode: 'getCurrentWeatherCondition',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gov.weatherCondition',
                        default: 'Get current weather condition in [CityName]',
                        description: 'Get the current weather condition like sunny or rainy'
                    }),
                    arguments: {
                        CityName: {
                            type: ArgumentType.STRING,
                            defaultValue: "Delhi"
                        }
                    }
                }
                
            ],
            menus: {
                dataTypeMenu: ['temperature', 'humidity','pressure'],
                unitMenu: ['metric', 'imperial'],
                unitMenu: {
                    acceptReporters: true,
                    items: ['Celsius', 'Fahrenheit']
                }
            }
        }];
    }   
    

    async getWeatherData(args) {
        const cityName = args.CityName;
        const dataType = args.DataType; // temperature or humidity
        const unit = args.Unit || 'metric'; // default to metric if not specified
        const apiKey = '5027b3a25210de9575736a71be34b18c'; // Your API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            if (data.cod === 200) {
                if (dataType === 'temperature') {
                    const temperature = data.main.temp;
                    console.log(`The temperature in ${cityName} is ${temperature}° in ${unit === 'metric' ? 'Celsius' : 'Fahrenheit'}`);
                    return `${temperature}° in ${unit === 'metric' ? 'Celsius' : 'Fahrenheit'}`;
                } else if (dataType === 'humidity') {
                    const humidity = data.main.humidity;
                    return `${humidity}%`;
                }
                  else if(dataType === 'pressure'){
                    const pressure = data.main.pressure;
                    return `${pressure} hPa`;

                  }
            } else {
                console.log(`City not found: ${cityName}`);
                return `City not found`;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return `Error fetching data`;
        }
    }
async temperatureComparison(args) {
    const cityName = args.CityName;
    const value = args.Value;
    const unit = args.Unit || 'metric';
    const apiKey = '5027b3a25210de9575736a71be34b18c'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            const temperature = data.main.temp;
            return temperature > value;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return false;
    }
}
    async getTemperature(args) {
        const cityName = args.CityName;
        const apiKey = '5027b3a25210de9575736a71be34b18c'; 
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod === 200) {
                const temperature = data.main.temp;
                return `${temperature}°C`;
            } else {
                return `City not found`;
            }
        } catch (error) {
            console.error("Error fetching temperature data:", error);
            return `Error fetching data`;
        }
    }

    async getHumidity(args) {
        const cityName = args.CityName;
        const apiKey = '5027b3a25210de9575736a71be34b18c'; 
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod === 200) {
                const humidity = data.main.humidity;
                return `${humidity}%`;
            } else {
                return `City not found`;
            }
        } catch (error) {
            console.error("Error fetching humidity data:", error);
            return `Error fetching data`;
        }
    }
    async convertUnits(args) {
        const value = parseFloat(args.Value);
        const fromUnit = args.FromUnit;
        const toUnit = args.ToUnit;
    
        let convertedValue = value;
    
        // Conversion logic
      if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') {
            convertedValue = (value * 9/5) + 32;
        } else if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') {
            convertedValue = (value - 32) * 5/9;
        } else {
            console.error('Conversion not supported for these units.');
        }
        return convertedValue;
    }
    async getCurrentWeatherCondition(args) {
        const cityName = args.CityName;
        const apiKey = '5027b3a25210de9575736a71be34b18c'; 
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            if (data.cod === 200) {
                const weatherCondition = data.weather[0].main; 
                console.log(weatherCondition);
                if (weatherCondition === 'Sunny') {
                    return 'Sunny';
                }
                else if (weatherCondition === 'Haze') {
                    return 'Haze';
                }
                else if (weatherCondition === 'Cain') {
                    return 'Rainy';
                } else if (weatherCondition === 'Clouds') {
                    return 'Cloudy';
                } else if (weatherCondition === 'Snow') {
                    return 'Snowy';
                } 
                else if (weatherCondition === 'Mist') {
                    return 'Mist';
                } else {
                    return 'Unknown';
                }
                console.log(weatherCondition);
            } else {
                return `City not found`;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return `Error fetching data`;
        }
    }
    
}
module.exports = Scratch3WeatherDataBlocks;
