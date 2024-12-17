import MathUtil from "../lib/math-util.js";
import Cast from "../lib/cast.js";
import Scratch3LooksBlocks from "openblock-vm/src/blocks/scratch3_looks.js";

const STORE_WAITING = true;

class SpriteController {
    constructor(vm, targetIndex) {
        this.vm = vm;
        this.waitingSounds = {};
        this.targetIndex = targetIndex;
        // const { targets } = this.vm.runtime;
        // const target = targets[this.targetIndex];
        console.log(vm.runtime.targets);
    }
    static get EFFECT_RANGE() {
        return {
            pitch: { min: -360, max: 360 }, // -3 to 3 octaves
            pan: { min: -100, max: 100 }, // 100% left to 100% right
        };
    }

    static get DEFAULT_SOUND_STATE() {
        return {
            effects: {
                pitch: 0,
                pan: 0,
            },
        };
    }

    static simple(original) {
        return JSON.parse(JSON.stringify(original));
    }
    // Motion Blocks Code for Python Render
    moveSteps(steps) {
        const { targets } = this.vm.runtime;

        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }

        const target = targets[this.targetIndex];

        if (target) {
            const radians = MathUtil.degToRad(90 - target.direction);
            const dx = steps * Math.cos(radians);
            const dy = steps * Math.sin(radians);
            target.setXY(target.x + dx, target.y + dy);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    turnRight(degrees) {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];

        if (target) {
            target.setDirection(target.direction + degrees);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    turnLeft(degrees) {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];

        if (target) {
            target.setDirection(target.direction - degrees);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    pointInDirection(degrees) {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];

        if (target) {
            target.setDirection(degrees);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    pointTowards(x, y) {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];

        if (target) {
            // const [targetX, targetY] = this.getTargetXY(targetName);
            const dx = x - target.x;
            const dy = y - target.y;
            const direction = MathUtil.radToDeg(Math.atan2(dy, dx));
            target.setDirection(direction);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    glideTo(x, y, duration) {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];

        if (target) {
            console.log("in loop");
            const startX = target.x;
            const startY = target.y;
            const deltaX = x - startX;
            const deltaY = y - startY;
            const steps = duration * 60; // Assuming 60 frames per second
            const stepX = deltaX / steps;
            const stepY = deltaY / steps;

            let currentStep = 0;
            const interval = setInterval(() => {
                if (currentStep >= steps) {
                    clearInterval(interval);
                    return;
                }
                target.setXY(target.x + stepX, target.y + stepY);
                currentStep++;
            }, 1000 / 60);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    ifOnEdgeBounce() {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        const bounds = target.getBounds();
        if (!bounds) {
            return;
        }
        const stageWidth = this.vm.runtime.constructor.STAGE_WIDTH;
        const stageHeight = this.vm.runtime.constructor.STAGE_HEIGHT;
        const distLeft = Math.max(0, stageWidth / 2 + bounds.left);
        const distTop = Math.max(0, stageHeight / 2 - bounds.top);
        const distRight = Math.max(0, stageWidth / 2 - bounds.right);
        const distBottom = Math.max(0, stageHeight / 2 + bounds.bottom);
        let nearestEdge = "";
        let minDist = Infinity;
        if (distLeft < minDist) {
            minDist = distLeft;
            nearestEdge = "left";
        }
        if (distTop < minDist) {
            minDist = distTop;
            nearestEdge = "top";
        }
        if (distRight < minDist) {
            minDist = distRight;
            nearestEdge = "right";
        }
        if (distBottom < minDist) {
            minDist = distBottom;
            nearestEdge = "bottom";
        }
        if (minDist > 0) {
            return;
        }
        const radians = MathUtil.degToRad(90 - target.direction);
        let dx = Math.cos(radians);
        let dy = -Math.sin(radians);
        if (nearestEdge === "left") {
            dx = Math.max(0.2, Math.abs(dx));
        } else if (nearestEdge === "top") {
            dy = Math.max(0.2, Math.abs(dy));
        } else if (nearestEdge === "right") {
            dx = 0 - Math.max(0.2, Math.abs(dx));
        } else if (nearestEdge === "bottom") {
            dy = 0 - Math.max(0.2, Math.abs(dy));
        }
        const newDirection = MathUtil.radToDeg(Math.atan2(dy, dx)) + 90;
        target.setDirection(newDirection);
        const fencedPosition = target.keepInFence(target.x, target.y);
        target.setXY(fencedPosition[0], fencedPosition[1]);
    }

    setRotationStyle(style) {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        target.setRotationStyle(style);
    }

    changeX(change) {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        // const dx = Cast.toNumber(change.DX);
        target.setXY(target.x + change, target.y);
    }

    setX(X) {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        const x = Cast.toNumber(X);
        target.setXY(X, target.y);
    }

    changeY(change) {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];

        target.setXY(target.x, target.y + change);
    }

    setY(Y) {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        const y = Cast.toNumber(Y);
        target.setXY(target.x, y);
    }

    getX() {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        console.log(typeof target.x);
        return target.x;
    }

    getY() {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        return this.limitPrecision(target.y);
    }

    getDirection() {
        const { targets } = this.vm.runtime;
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        return target.direction;
    }

    limitPrecision(coordinate) {
        const rounded = Math.round(coordinate);
        const delta = coordinate - rounded;
        const limitedCoord = Math.abs(delta) < 1e-9 ? rounded : coordinate;
        return limitedCoord;
    }

    getTargetXY(targetName) {
        let targetX = 0;
        let targetY = 0;
        if (targetName === "_mouse_") {
            targetX = ioQuery("mouse", "getScratchX");
            targetY = ioQuery("mouse", "getScratchY");
        } else if (targetName === "_random_") {
            const stageWidth = this.runtime.constructor.STAGE_WIDTH;
            const stageHeight = this.runtime.constructor.STAGE_HEIGHT;
            targetX = Math.round(stageWidth * (Math.random() - 0.5));
            targetY = Math.round(stageHeight * (Math.random() - 0.5));
        } else {
            targetName = Cast.toString(targetName);
            const goToTarget = this.runtime.getSpriteTargetByName(targetName);
            if (!goToTarget) return;
            targetX = goToTarget.x;
            targetY = goToTarget.y;
        }
        return [targetX, targetY];
    }

    goToXY(x, y) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];

        if (target) {
            target.setXY(x, y);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    // Looks Block Code for Python Render

    say(message) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            this.vm.runtime.emit(
                Scratch3LooksBlocks.SAY_OR_THINK,
                target,
                "say",
                message
            );
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    think(message) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            this.vm.runtime.emit(
                Scratch3LooksBlocks.SAY_OR_THINK,
                target,
                "think",
                message
            );
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    show() {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            target.setVisible(true);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }
    hide() {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            target.setVisible(false);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    _setCostume(target, requestedCostume, optZeroIndex) {
        if (typeof requestedCostume === "number") {
            // Numbers should be treated as costume indices, always
            target.setCostume(
                optZeroIndex ? requestedCostume : requestedCostume - 1
            );
        } else {
            // Strings should be treated as costume names, where possible
            const costumeIndex = target.getCostumeIndexByName(
                requestedCostume.toString()
            );

            if (costumeIndex !== -1) {
                target.setCostume(costumeIndex);
            } else if (requestedCostume === "next costume") {
                target.setCostume(target.currentCostume + 1);
            } else if (requestedCostume === "previous costume") {
                target.setCostume(target.currentCostume - 1);
                // Try to cast the string to a number (and treat it as a costume index)
                // Pure whitespace should not be treated as a number
                // Note: isNaN will cast the string to a number before checking if it's NaN
            } else if (
                !(
                    isNaN(requestedCostume) ||
                    Cast.isWhiteSpace(requestedCostume)
                )
            ) {
                target.setCostume(
                    optZeroIndex
                        ? Number(requestedCostume)
                        : Number(requestedCostume) - 1
                );
            }
        }

        // Per 2.0, 'switch costume' can't start threads even in the Stage.
        return [];
    }

    switchCostume(Costume) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            this._setCostume(target, Costume);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    nextCostume() {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            this._setCostume(target, target.currentCostume + 1, true);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }
    clampEffect(effect, value) {
        let clampedValue = value;
        switch (effect) {
            case "ghost":
                clampedValue = MathUtil.clamp(
                    value,
                    Scratch3LooksBlocks.EFFECT_GHOST_LIMIT.min,
                    Scratch3LooksBlocks.EFFECT_GHOST_LIMIT.max
                );
                break;
            case "brightness":
                clampedValue = MathUtil.clamp(
                    value,
                    Scratch3LooksBlocks.EFFECT_BRIGHTNESS_LIMIT.min,
                    Scratch3LooksBlocks.EFFECT_BRIGHTNESS_LIMIT.max
                );
                break;
        }
        return clampedValue;
    }

    changeEffect(Effect, Change) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            const effect = Cast.toString(Effect).toLowerCase();
            const change = Cast.toNumber(Change);
            if (!target.effects.hasOwnProperty(effect)) return;
            let newValue = change + target.effects[effect];
            newValue = this.clampEffect(effect, newValue);
            target.setEffect(effect, newValue);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    setEffect(Effect, Change) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            const effect = Cast.toString(Effect).toLowerCase();
            let value = Cast.toNumber(Change);
            value = this.clampEffect(effect, value);
            target.setEffect(effect, value);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }
    ClearEffect() {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            target.clearEffects();
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    changeSize(Change) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            const change = Cast.toNumber(Change);
            target.setSize(target.size + change);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    setSize(Size) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            const size = Cast.toNumber(Size);
            target.setSize(size);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    goToFrontBack(layer) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            if (!target.isStage) {
                if (layer === "front") {
                    target.goToFront();
                } else {
                    target.goToBack();
                }
            }
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }
    goForwardBackwardLayers() {
        null;
    }

    // Sensing Blocks Render Code for Python
    askandwait(question) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            this.vm.runtime.emit(
                Scratch3LooksBlocks.ASK_AND_WAIT,
                target,
                question
            );
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    isTouchingObject(object) {
        const { targets } = this.vm.runtime;
        const target = targets[this.targetIndex];
        const object_value = Cast.toString(object);
        return target.isTouchingObject(object_value);
    }

    _getSoundIndex(soundName) {
        const { targets } = this.vm.runtime;
        const target = targets[this.targetIndex];
        // if the sprite has no sounds, return -1
        const len = target.sprite.sounds.length;
        if (len === 0) {
            return -1;
        }

        // look up by name first
        const index = this.getSoundIndexByName(soundName);
        if (index !== -1) {
            return index;
        }

        // then try using the sound name as a 1-indexed index
        const oneIndexedIndex = parseInt(soundName, 10);
        if (!isNaN(oneIndexedIndex)) {
            return MathUtil.wrapClamp(oneIndexedIndex - 1, 0, len - 1);
        }

        // could not be found as a name or converted to index, return -1
        return -1;
    }
    getSoundIndexByName(soundName) {
        const { targets } = this.vm.runtime;
        const target = targets[this.targetIndex];
        const sounds = target.sprite.sounds;
        for (let i = 0; i < sounds.length; i++) {
            if (sounds[i].name === soundName) {
                return i;
            }
        }
        // if there is no sound by that name, return -1
        return -1;
    }

    _playSound(sound, storeWaiting) {
        const { targets } = this.vm.runtime;

        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        console.log(target);
        if (target) {
            const index = this._getSoundIndex(sound);
            console.log(index);
            if (index >= 0) {
                const sprite = target.sprite;
                console.log(sprite);
                const { soundId } = sprite.sounds[index];
                console.log(soundId);
                console.log(sprite.soundBank);
                if (sprite.soundBank) {
                    if (storeWaiting === STORE_WAITING) {
                        console.log(storeWaiting);
                        this._addWaitingSound(target.id, soundId);
                    } else {
                        this._removeWaitingSound(target.id, soundId);
                    }
                    return sprite.soundBank.playSound(target, soundId);
                }
            }
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }

        const index = this._getSoundIndex(sound);
        if (index >= 0) {
            const { targets } = this.vm.runtime;
            const target = targets[this.targetIndex];
            const { soundId } = target.sounds[index];
            console.log(soundId);
            if (sprite.soundBank) {
                if (storeWaiting === STORE_WAITING) {
                    this._addWaitingSound(target.id, soundId);
                } else {
                    this._removeWaitingSound(target.id, soundId);
                }
                return sprite.soundBank.playSound(target, soundId);
            }
        }
    }
    _removeWaitingSound(targetId, soundId) {
        if (!this.waitingSounds[targetId]) {
            return;
        }
        this.waitingSounds[targetId].delete(soundId);
    }

    _addWaitingSound(targetId, soundId) {
        if (!this.waitingSounds[targetId]) {
            this.waitingSounds[targetId] = new Set();
        }
        this.waitingSounds[targetId].add(soundId);
    }
    // sound block functions
    stopAllSounds() {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            if (this.vm.runtime.targets === null) return;
            const allTargets = this.vm.runtime.targets;
            for (let i = 0; i < allTargets.length; i++) {
                this._stopAllSoundsForTarget(allTargets[i]);
            }
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }
    _stopAllSoundsForTarget(target) {
        if (target.sprite.soundBank) {
            target.sprite.soundBank.stopAllSounds(target);
            if (this.waitingSounds[target.id]) {
                this.waitingSounds[target.id].clear();
            }
        }
    }

    _getSoundState(target) {
        console.log(target);
        let soundState = target.getCustomState("Scratch.sound");
        if (!soundState) {
            soundState = SpriteController.simple(
                SpriteController.DEFAULT_SOUND_STATE
            );
            target.setCustomState("Scratch.sound", soundState);
            target.soundEffects = soundState.effects;
        }
        return soundState;
    }

    setEffectSound(Effect, Value) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            return this._updateEffect(Effect, Value, target, false);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    changeEffectSound(Effect, Value) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            return this._updateEffect(Effect, Value, target, false);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    _updateEffect(Effect, Value, target, change) {
        console.log(target);
        const effect = Cast.toString(Effect).toLowerCase();
        const value = Cast.toNumber(Value);

        const soundState = this._getSoundState(target);
        if (!soundState.effects.hasOwnProperty(effect)) return;

        if (change) {
            soundState.effects[effect] += value;
        } else {
            soundState.effects[effect] = value;
        }

        const { min, max } = SpriteController.EFFECT_RANGE[effect];
        soundState.effects[effect] = MathUtil.clamp(
            soundState.effects[effect],
            min,
            max
        );

        this._syncEffectsForTarget(target);
        // Yield until the next tick.
        return Promise.resolve();
    }

    clearEffectSound() {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            const soundState = this._getSoundState(target);
            for (const effect in soundState.effects) {
                if (!soundState.effects.hasOwnProperty(effect)) continue;
                soundState.effects[effect] = 0;
            }
            this._syncEffectsForTarget(target);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    _syncEffectsForTarget(target) {
        if (!target || !target.sprite.soundBank) return;
        target.soundEffects = this._getSoundState(target).effects;

        target.sprite.soundBank.setEffects(target);
    }

    setVolume(volume) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            const volume_cast = Cast.toNumber(volume);
            return this._updateVolume(volume_cast, target);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    changeVolume(volume) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            const volume_cast = Cast.toNumber(volume) + target.volume;
            return this._updateVolume(volume_cast, target);
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }

    _updateVolume(volume, target) {
        volume = MathUtil.clamp(volume, 0, 100);
        target.volume = volume;
        this._syncEffectsForTarget(target);

        // Yield until the next tick.
        return Promise.resolve();
    }

    // Sensing Blocks Render Code for Python
    askandwait(question) {
        const { targets } = this.vm.runtime;
        console.log(targets);
        if (this.targetIndex === null || this.targetIndex >= targets.length) {
            console.error("Invalid targetIndex:", this.targetIndex);
            return;
        }
        const target = targets[this.targetIndex];
        if (target) {
            this.vm.runtime.emit(
                Scratch3LooksBlocks.ASK_AND_WAIT,
                target,
                question
            );
        } else {
            console.error(
                "Target is undefined at index:",
                this.targetIndex + 1
            );
        }
    }
}

export default SpriteController;
