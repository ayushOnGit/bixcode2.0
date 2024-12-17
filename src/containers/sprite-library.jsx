import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import { injectIntl, intlShape, defineMessages } from "react-intl";
import VM from "openblock-vm";

import spriteLibraryContent from "../lib/libraries/sprites.json";
import randomizeSpritePosition from "../lib/randomize-sprite-position";
import spriteTags from "../lib/libraries/sprite-tags";

import LibraryComponent from "../components/library/library.jsx";

const messages = defineMessages({
    libraryTitle: {
        defaultMessage: "Choose a Sprite",
        description: "Heading for the sprite library",
        id: "gui.spriteLibrary.chooseASprite",
    },
});

class SpriteLibrary extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, ["handleItemSelect"]);
    }
    handleItemSelect(item) {
        console.log("Item selected:", item); // Debug log
        // Randomize position of library sprite
        randomizeSpritePosition(item);
        console.log("Item after randomize:", item); // Debug log
        this.props.vm
            .addSprite(JSON.stringify(item))
            .then(() => {
                console.log("Sprite added to VM"); // Debug log
                this.props.onActivateBlocksTab();
            })
            .catch((err) => {
                console.error("Error adding sprite to VM:", err); // Debug log
            });
    }
    render() {
        console.log("Rendering SpriteLibrary"); // Debug log
        return (
            <LibraryComponent
                data={spriteLibraryContent}
                id="spriteLibrary"
                tags={spriteTags}
                title={this.props.intl.formatMessage(messages.libraryTitle)}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

SpriteLibrary.propTypes = {
    intl: intlShape.isRequired,
    onActivateBlocksTab: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(SpriteLibrary);
