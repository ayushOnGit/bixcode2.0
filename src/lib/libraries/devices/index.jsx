import React from "react";
import { FormattedMessage } from "react-intl";
import { defaults } from "lodash";
import log from "../../log";
import { DeviceType } from "../../device";

import arduinoBaseToolBox from "./baseToolbox/arduino";
import microbitBaseToolBox from "./baseToolbox/microbit";
import micropythonBaseToolBox from "./baseToolbox/micropython";

import unselectDeviceIconURL from "./unselectDevice/unselectDevice.png";

import arduinoUnoIconURL from "./arduinoUno/arduinoUno.png";
import arduinoUnoConnectionIconURLL from "./arduinoUno/arduinoUno-illustration.svg";
import arduinoUnoConnectionSmallIconURL from "./arduinoUno/arduinoUno-small.svg";

import modularIconURL from "./modular/modular.png";
import modularConnectionIconURLL from "./modular/modular-illustration.svg";
import modularConnectionSmallIconURL from "./modular/modular-small.svg";

import intellectoIconURL from "./Intellecto/intellecto.png";
import intellectoConnectionIconURL from "./intellecto/intellecto-illustration.svg";
import intellectoConnectionSmallIconURL from "./Intellecto/intellecto-small.svg";

import machineIconURL from "./machines/machines.png";
import machineConnectionIconURL from "./machines/machines-illustration.svg";
import machineConnectionSmallIconURL from "./machines/machines-small.svg";

import spaceroverIconURL from "./spacerover/spacerover.png";
import spaceroverConnectionIconURL from "./spacerover/spacerover-illustration.svg";
import spaceroverConnectionSmallIconURL from "./spacerover/spacerover-small.svg";

import acceleroIconURL from "./accelero/accelero.png";
import acceleroConnectionIconURLL from "./accelero/accelero-illustration.svg";
import acceleroConnectionSmallIconURL from "./accelero/accelero-small.svg";

import army_tankIconURL from "./army_tank/army_tank.png";
import army_tankConnectionIconURLL from "./army_tank/army_tank-illustration.svg";
import army_tankConnectionSmallIconURL from "./army_tank/army_tank-small.svg";

import arduinoNanoIconURL from "./arduinoNano/arduinoNano.png";
import arduinoNanoConnectionIconURLL from "./arduinoNano/arduinoNano-illustration.svg";
import arduinoNanoConnectionSmallIconURL from "./arduinoNano/arduinoNano-small.svg";

import arduinoLeonardoIconURL from "./arduinoLeonardo/arduinoLeonardo.png";
import arduinoLeonardoConnectionIconURLL from "./arduinoLeonardo/arduinoLeonardo-illustration.svg";
import arduinoLeonardoConnectionSmallIconURL from "./arduinoLeonardo/arduinoLeonardo-small.svg";

import arduinoMega2560IconURL from "./arduinoMega2560/arduinoMega2560.png";
import arduinoMega2560ConnectionIconURLL from "./arduinoMega2560/arduinoMega2560-illustration.svg";
import arduinoMega2560ConnectionSmallIconURL from "./arduinoMega2560/arduinoMega2560-small.svg";

import microbitIconURL from "./microbit/microbit.png";
import microbitConnectionIconURLL from "./microbit/microbit-illustration.svg";
import microbitConnectionSmallIconURL from "./microbit/microbit-small.svg";

import microbitV2IconURL from "./microbitV2/microbitV2.png";
import microbitV2ConnectionIconURLL from "./microbitV2/microbitV2-illustration.svg";
import microbitV2ConnectionSmallIconURL from "./microbitV2/microbitV2-small.svg";

import esp32IconURL from "./esp32/esp32.png";
import esp32ConnectionIconURLL from "./esp32/esp32-illustration.svg";
import esp32ConnectionSmallIconURL from "./esp32/esp32-small.svg";

import esp8266NodeMCUIconURL from "./esp8266NodeMCU/esp8266NodeMCU.png";
import esp8266NodeMCUConnectionIconURL from "./esp8266NodeMCU/esp8266NodeMCU-illustration.svg";
import esp8266NodeMCUConnectionSmallIconURL from "./esp8266NodeMCU/esp8266NodeMCU-small.svg";

import k210MaixDockIconURL from "./k210MaixDock/k210MaixDock.png";
import k210MaixDockConnectionIconURLL from "./k210MaixDock/k210MaixDock-illustration.svg";
import k210MaixDockConnectionSmallIconURL from "./k210MaixDock/k210MaixDock-small.svg";

import k210MaixduinoIconURL from "./k210Maixduino/k210Maixduino.png";
import k210MaixduinoConnectionIconURLL from "./k210Maixduino/k210Maixduino-illustration.svg";
import k210MaixduinoConnectionSmallIconURL from "./k210Maixduino/k210Maixduino-small.svg";

import raspberryPiPicoIconURL from "./raspberryPiPico/raspberryPiPico.png";
import raspberryPiPicoConnectionIconURL from "./raspberryPiPico/raspberryPiPico-illustration.svg";
import raspberryPiPicoConnectionSmallIconURL from "./raspberryPiPico/raspberryPiPico-small.svg";

import makeymakeyIconURL from "./makeymakey/makeymakey.png";
import makeymakeyConnectionIconURL from "./makeymakey/makeymakey-illustration.svg";
import makeymakeyConnectionSmallIconURL from "./makeymakey/makeymakey-small.svg";

import AiKitIconUrl from "./AI_kit_esp32/AI_kit.png";
import AikitConnectionIconURL from "./AI_kit_esp32/esp_32Cam_small.png";
import AikitConnectionSmallIconURL from "./AI_kit_esp32/esp_32Cam_small.png";

import maxAIIConUrl from "./max_AI/maxAI.png";

const deviceData = [
    /**
     * Unselect the deivce back to pure scratch mode
     */
    {
        name: (
            <FormattedMessage
                defaultMessage="Unselect device"
                description="Name for the unselect device"
                id="gui.device.unselectDevice.name"
            />
        ),
        deviceId: "null",
        iconURL: unselectDeviceIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Unselect the device, return to pure realtime programming mode."
                description="Description for the unselect device"
                id="gui.device.unselectDevice.description"
            />
        ),
        featured: true,
        hide: false,
        programMode: ["realtime"],
        programLanguage: ["block"],
        tags: ["realtime"],
    },
    {
        name: "Arduino Uno",
        deviceId: "arduinoUno",
        manufactor: "arduino.cc",
        learnMore: "https://store.arduino.cc/usa/arduino-uno-rev3",
        type: DeviceType.arduino,
        iconURL: arduinoUnoIconURL,
        description: (
            <FormattedMessage
                defaultMessage="A great board to get started with electronics and coding."
                description="Description for the Arduino Uno device"
                id="gui.device.arduinoUno.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: arduinoUnoConnectionIconURLL,
        connectionSmallIconURL: arduinoUnoConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoUno.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["realtime", "upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink: "https://store.arduino.cc/usa/arduino-uno-rev3",
    },
    {
        name: "Modular",
        deviceId: "modular",
        basedeviceId: "arduinoUno",
        manufactor: "learningbix.com",
        learnMore: "https://learningbix.com",
        type: DeviceType.arduino,
        iconURL: modularIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Use Port to Connect Sensor and Output"
                description="Description for Modular device"
                id="gui.device.modular.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: modularConnectionIconURLL,
        connectionSmallIconURL: modularConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoUno.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["realtime", "upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        deviceExtensions: ["Modular"],
        // deviceExtensionsCompatible: 'arduinoUno',
        helpLink: "https://store.arduino.cc/usa/arduino-uno-rev3",
    },

    {
        name: "Intellecto",
        deviceId: "intellecto",
        basedeviceId: "arduinoUno",
        manufactor: "learningbix.com",
        learnMore: "https://learningbix.com",
        type: DeviceType.arduino,
        iconURL: intellectoIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Use Port to Connect Sensor and Output"
                description="Description for Intellecto device"
                id="gui.device.intellecto.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: intellectoConnectionIconURL,
        connectionSmallIconURL: intellectoConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoUno.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        deviceExtensionsCompatible: "arduinoEsp8266",
        programMode: ["upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        deviceExtensions: ["Intellecto"],
        // deviceExtensionsCompatible: 'arduinoUno',
        helpLink: "https://store.arduino.cc/usa/arduino-uno-rev3",
    },
    {
        name: "Hive 2.0",
        deviceId: "ESP32CAM",
        // deviceId: "microbit",
        manufactor: "learningbix",
        learnMore: "https://learningbix.com/",
        type: DeviceType.microPython,
        iconURL: AiKitIconUrl,
        description: (
            <FormattedMessage
                defaultMessage="The pocket-sized computer transforming digital skills learning."
                description="Description for the micro:bit device"
                id="gui.device.microbit.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "115200",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: AikitConnectionIconURL,
        connectionSmallIconURL: AikitConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.microbit.connectingMessage"
            />
        ),
        baseToolBoxXml: micropythonBaseToolBox,
        programMode: ["upload"],
        programLanguage: ["block", "microPython"],
        tags: ["microPython"],
        helpLink: "https://microbit.org/get-started/first-steps/introduction/",
    },
    {
        name: "MAXAI",
        deviceId: "maxAI",
        // deviceId: "microbit",
        manufactor: "learningbix",
        learnMore: "https://learningbix.com/",
        type: DeviceType.microPython,
        iconURL: maxAIIConUrl,
        description: (
            <FormattedMessage
                defaultMessage="The pocket-sized computer transforming digital skills learning."
                description="Description for the micro:bit device"
                id="gui.device.microbit.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "115200",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: AikitConnectionIconURL,
        connectionSmallIconURL: AikitConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.microbit.connectingMessage"
            />
        ),
        baseToolBoxXml: micropythonBaseToolBox,
        programMode: ["upload"],
        programLanguage: ["block", "microPython"],
        tags: ["microPython"],
        helpLink: "https://microbit.org/get-started/first-steps/introduction/",
    },
    {
        name: "Machines 7 in 1",
        deviceId: "machines",
        basedeviceId: "arduinoUno",
        manufactor: "learningbix.com",
        learnMore: "https://learningbix.com",
        type: DeviceType.arduino,
        iconURL: machineIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Use Port to Connect Sensor and Output"
                description="Description for Machine 7 in 1 device"
                id="gui.device.machines.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: machineConnectionIconURL,
        connectionSmallIconURL: machineConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoUno.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["realtime", "upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["kit"],
        deviceExtensions: ["Modular"],
        // deviceExtensionsCompatible: 'arduinoUno',
        helpLink: "https://store.arduino.cc/usa/arduino-uno-rev3",
    },
    {
        name: "Space Rover",
        deviceId: "spacerover",
        basedeviceId: "arduinoUno",
        manufactor: "learningbix.com",
        learnMore: "https://learningbix.com",
        type: DeviceType.arduino,
        iconURL: spaceroverIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Use Port to Connect Sensor and Output"
                description="Description for Modular device"
                id="gui.device.Modular.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: spaceroverConnectionIconURL,
        connectionSmallIconURL: spaceroverConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoUno.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["realtime", "upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["kit"],
        deviceExtensions: ["spacerover"],
        // deviceExtensionsCompatible: 'arduinoUno',
        helpLink: "https://store.arduino.cc/usa/arduino-uno-rev3",
    },
    {
        name: "Arduino Nano",
        deviceId: "arduinoNano",
        manufactor: "arduino.cc",
        learnMore: "https://store.arduino.cc/usa/arduino-nano",
        type: DeviceType.arduino,
        iconURL: arduinoNanoIconURL,
        description: (
            <FormattedMessage
                defaultMessage="The Arduino Nano is a classic small board to build your projects with."
                description="Description for the Arduino Nano device"
                id="gui.device.arduinoNano.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: arduinoNanoConnectionIconURLL,
        connectionSmallIconURL: arduinoNanoConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoNano.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["realtime", "upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink: "https://store.arduino.cc/usa/arduino-nano",
    },
    {
        name: "Accelero",
        deviceId: "accelero",
        basedeviceId: "arduinoUno",
        manufactor: "learningbix.com",
        learnMore: "https://learningbix.com",
        type: DeviceType.arduino,
        iconURL: acceleroIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Use Port to Connect Sensor and Output"
                description="Description for Accelero device"
                id="gui.device.accelero.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: acceleroConnectionIconURLL,
        connectionSmallIconURL: acceleroConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoUno.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["realtime", "upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["kit"],
        deviceExtensions: ["Modular"],
        // deviceExtensionsCompatible: 'arduinoUno',
        helpLink: "https://www.learningbix.com/",
    },
    {
        name: "Army Tank",
        deviceId: "armyTank",
        basedeviceId: "arduinoUno",
        manufactor: "learningbix.com",
        learnMore: "https://learningbix.com",
        type: DeviceType.arduino,
        iconURL: army_tankIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Use Port to Connect Sensor and Output"
                description="Description for Army Tank device"
                id="gui.device.army_tank.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: army_tankConnectionIconURLL,
        connectionSmallIconURL: army_tankConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoUno.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["realtime", "upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["kit"],
        deviceExtensions: ["Modular"],
        // deviceExtensionsCompatible: 'arduinoUno',
        helpLink: "https://www.learningbix.com/",
    },
    {
        name: "Arduino Leonardo",
        deviceId: "arduinoLeonardo",
        manufactor: "arduino.cc",
        learnMore: "https://store.arduino.cc/usa/leonardo",
        type: DeviceType.arduino,
        iconURL: arduinoLeonardoIconURL,
        description: (
            <FormattedMessage
                defaultMessage="The classic Arduino board that can act as a mouse or keyboard."
                description="Description for the Arduino Leonardo device"
                id="gui.device.arduinoLeonardo.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: arduinoLeonardoConnectionIconURLL,
        connectionSmallIconURL: arduinoLeonardoConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoLeonardo.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["upload"], // due to the software serilport realtim mode is unstable
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink: "https://store.arduino.cc/usa/leonardo",
    },
    {
        name: "Arduino Mega 2560",
        deviceId: "arduinoMega2560",
        manufactor: "arduino.cc",
        learnMore: "https://store.arduino.cc/usa/mega-2560-r3",
        type: DeviceType.arduino,
        iconURL: arduinoMega2560IconURL,
        description: (
            <FormattedMessage
                defaultMessage="The 8-bit board with 54 digital pins, 16 analog inputs, and 4 serial ports."
                description="Description for the Arduino Mega 2560 device"
                id="gui.device.arduinoMega2560.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: arduinoMega2560ConnectionIconURLL,
        connectionSmallIconURL: arduinoMega2560ConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoMega2560.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["realtime", "upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink: "https://store.arduino.cc/usa/mega-2560-r3",
    },
    {
        name: "ESP32",
        deviceId: "arduinoEsp32",
        manufactor: "espressif",
        learnMore: "https://www.espressif.com/",
        type: DeviceType.arduino,
        iconURL: esp32IconURL,
        description: (
            <FormattedMessage
                defaultMessage="Wi-Fi & Bluetooth control board with rich functions."
                description="Description for the esp32 device"
                id="gui.device.esp32.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "115200",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: esp32ConnectionIconURLL,
        connectionSmallIconURL: esp32ConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their esp32."
                id="gui.device.esp32.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["upload", "realtime"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink:
            "https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/hw-reference/esp32/get-started-devkitc.html",
    },
    {
        name: "NodeMCU",
        deviceId: "arduinoEsp8266NodeMCU",
        manufactor: "espressif",
        learnMore: "https://www.nodemcu.com",
        type: DeviceType.arduino,
        iconURL: esp8266NodeMCUIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Low-cost Wi-Fi SOC control board."
                description="Description for the esp8266 NodeMCU device"
                id="gui.device.esp8266NodeMCU.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "76800",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: esp8266NodeMCUConnectionIconURL,
        connectionSmallIconURL: esp8266NodeMCUConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.esp8266NodeMCU.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        deviceExtensionsCompatible: "arduinoEsp8266",
        programMode: ["upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink: "https://arduino-esp8266.readthedocs.io/en/3.0.0/index.html",
    },
    {
        name: "MaixDock",
        deviceId: "arduinoK210MaixDock",
        manufactor: "sipeed",
        learnMore: "https://wiki.sipeed.com/",
        type: DeviceType.arduino,
        iconURL: k210MaixDockIconURL,
        description: (
            <FormattedMessage
                defaultMessage="A control board based on the K210 RISC-V chip that only has basic functions and leads out all IO pins." // eslint-disable-line max-len
                description="Description for the K210 MaixDock device"
                id="gui.device.k210MaixDock.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "115200",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: k210MaixDockConnectionIconURLL,
        connectionSmallIconURL: k210MaixDockConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.k210MaixDock.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink:
            "https://wiki.sipeed.com/hardware/zh/maix/maixpy_develop_kit_board/Maix_dock.html",
    },
    {
        name: "Maixduino",
        deviceId: "arduinoK210Maixduino",
        manufactor: "sipeed",
        learnMore: "https://maixduino.sipeed.com/",
        type: DeviceType.arduino,
        iconURL: k210MaixduinoIconURL,
        description: (
            <FormattedMessage
                defaultMessage="The K210 RISC-V board with ESP32 inside."
                description="Description for the K210 maixduino device"
                id="gui.device.k210Maixduino.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "115200",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: k210MaixduinoConnectionIconURLL,
        connectionSmallIconURL: k210MaixduinoConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.k210Maixduino.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink:
            "https://wiki.sipeed.com/soft/maixpy/en/develop_kit_board/maix_duino.html",
    },
    {
        name: "Raspberry Pi Pico",
        deviceId: "arduinoRaspberryPiPico",
        manufactor: "Raspberry Pi Foundation",
        learnMore: "https://www.raspberrypi.com/",
        type: DeviceType.arduino,
        iconURL: raspberryPiPicoIconURL,
        description: (
            <FormattedMessage
                defaultMessage="The powerful, flexible microcontroller board."
                description="Description for the Raspberry Pi Pico device"
                id="gui.device.raspberryPiPicoIconURL.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: raspberryPiPicoConnectionIconURL,
        connectionSmallIconURL: raspberryPiPicoConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.raspberryPiPicoIconURL.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink:
            "https://wiki.openblock.cc/general-hardware-guidelines/boards/raspberry-pi-pico",
    },
    {
        name: "Micro:bit",
        deviceId: "microbit",
        manufactor: "microbit.org",
        learnMore: "https://microbit.org/",
        type: DeviceType.microbit,
        iconURL: microbitIconURL,
        description: (
            <FormattedMessage
                defaultMessage="The pocket-sized computer transforming digital skills learning."
                description="Description for the micro:bit device"
                id="gui.device.microbit.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "115200",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: microbitConnectionIconURLL,
        connectionSmallIconURL: microbitConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.microbit.connectingMessage"
            />
        ),
        baseToolBoxXml: microbitBaseToolBox,
        programMode: ["upload"],
        programLanguage: ["block", "microPython"],
        tags: ["microPython"],
        helpLink: "https://microbit.org/get-started/first-steps/introduction/",
    },

    {
        name: "Micro:bit V2",
        deviceId: "microbitV2",
        manufactor: "microbit.org",
        learnMore: "https://microbit.org/",
        type: DeviceType.microbit,
        iconURL: microbitV2IconURL,
        description: (
            <FormattedMessage
                defaultMessage="Upgraded processor, built-In speaker and microphone, touch sensitive logo."
                description="Description for the micro:bit V2 device"
                id="gui.device.microbitV2.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "115200",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: microbitV2ConnectionIconURLL,
        connectionSmallIconURL: microbitV2ConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.microbitV2.connectingMessage"
            />
        ),
        baseToolBoxXml: microbitBaseToolBox,
        programMode: ["upload"],
        programLanguage: ["block", "microPython"],
        tags: ["microPython"],
        helpLink: "https://microbit.org/get-started/first-steps/introduction/",
    },
    {
        name: "Makey Makey",
        deviceId: "makeyMakey",
        manufactor: "makeymakey.com",
        learnMore: "https://makeymakey.com/",
        type: DeviceType.arduino,
        iconURL: makeymakeyIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Make anything into a key."
                description="Description for the Makey Makey device"
                id="gui.device.makeymakey.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "115200",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: makeymakeyConnectionIconURL,
        connectionSmallIconURL: makeymakeyConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.makeyMakey.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink: "https://makeymakey.com",
    },
    /**
     * For those parent devices that exist in VM but are not displayed in GUI
     */
    {
        deviceId: "arduinoUnoUltra",
        type: DeviceType.arduino,
        featured: true,
        disabled: false,
        hide: true,
        baseToolBoxXml: arduinoBaseToolBox,
    },
    {
        deviceId: "arduinoSE",
        type: DeviceType.arduino,
        featured: true,
        disabled: false,
        hide: true,
        baseToolBoxXml: arduinoBaseToolBox,
    },
    {
        deviceId: "arduinoEsp8266",
        type: DeviceType.arduino,
        featured: true,
        disabled: false,
        hide: true,
        baseToolBoxXml: arduinoBaseToolBox,
    },
];

/**
 * To get real device id. eg: the third party id like ironKit_arduinoUno.
 * @param {string} deviceId - the id of the device.
 * @return {string} deviceId - the real device id.
 */
const analysisRealDeviceId = (deviceId) => {
    if (deviceId) {
        // if the id contain '_' use the string afer the '_'.
        if (deviceId.indexOf("_") !== -1) {
            deviceId = deviceId.split("_")[1];
        }
    }
    return deviceId;
};

/**
 * Make device data from the input data. If it is a buid-in device, return the buid-in
 * data. If it is a third party device, find it's parent device, and overwrite its attributes
 * with the input data.
 * @param {string} deviceList - the list of devices.
 * @return {string} fullData - processed data of devices.
 */
const makeDeviceLibrary = (deviceList = null) => {
    let regeneratedDeviceData = [];

    if (deviceList) {
        deviceList.forEach((dev) => {
            // Because the micropython framework is not included in the community version,
            // for a control board that supports multiple programming frameworks, if it
            // also supports arduino, then we only load the arduino version of the device.
            if (
                typeof dev.typeList !== "undefined" &&
                dev.deviceId.indexOf("arduino") !== -1
            ) {
                dev.hide = false;
            }

            // Check if this is a build-in device.
            const matchedDevice = deviceData.find(
                (item) => dev.deviceId === item.deviceId
            );
            if (matchedDevice) {
                return regeneratedDeviceData.push(matchedDevice);
            }

            // This is a third party device. Try to parse it's parent deivce.
            const realDeviceId = analysisRealDeviceId(dev.deviceId);
            if (realDeviceId) {
                const parentDevice = deviceData.find(
                    (item) => realDeviceId === item.deviceId
                );
                if (parentDevice) {
                    return regeneratedDeviceData.push(
                        defaults({}, dev, { hide: false }, parentDevice)
                    );
                }
            }
            log.warn(
                "Cannot find this device or it's parent device :",
                dev.deviceId
            );
            return null;
        });

        regeneratedDeviceData.unshift(deviceData[0]); // add unselect deive in the head.
    } else {
        regeneratedDeviceData = deviceData;
    }

    return regeneratedDeviceData;
};

export { deviceData as default, makeDeviceLibrary };
