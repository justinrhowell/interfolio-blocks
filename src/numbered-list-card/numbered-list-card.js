import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const {
    MediaUpload,
    PlainText,
    BlockControls,
    InspectorControls,
    ColorPalette,
    AlignmentToolbar,
} = wp.blockEditor;
const { Button, PanelBody, RangeControl, TextControl, CheckboxControl, ToggleControl, SelectControl } = wp.components;
const { registerBlockType } = wp.blocks;

registerBlockType('interfolio/block-numbered-list-card', {
    title: __('Interfolio Numbered List Card'),
    icon: 'layout',
    category: 'common',
    supports: {
        align: true,
    },
    attributes: {
        headerText: {
            type: 'string',
            default: '',
        },
        titleTag: {
			type: 'string',
			default: 'h4',
		},
        descriptionText: {
            type: 'string',
            default: '',
        },
        alignment: {
            type: 'string',
            default: 'center',
        },
        padding: {
            type: 'array',
            default: [5, 5, 5, 5],
        },
        paddingLock: {
            type: 'boolean',
            default: true,
        },
        border: {
            type: 'array',
            default: [0, 0, 0, 0],
        },
        borderLock: {
            type: 'boolean',
            default: true,
        },
        backgroundColor: {
            type: 'string',
            default: '',
        },
        textColor: {
            type: 'string',
            default: '#000000',
        },
        borderColor: {
            type: 'string',
            default: '#000000',
        },
        image: {
            type: 'object',
            default: null,
        },
        imageIsClickable: {
			type: 'boolean',
			default: false,
		},
        imageSize: {
            type: 'string',
            default: 'full',
        },
        backgroundImage: {
            type: 'object',
            default: null,
        },
        showLink: {
            type: 'boolean',
            default: false,
        },
        linkColor: {
            type: 'string',
            default: '#000000',
        },
        linkText: {
            type: 'string',
            default: '',
        },
        linkUrl: {
            type: 'string',
            default: '',
        },
        linkProperties: {
            type: 'object',
            default: {
                underline: false,
                italic: false,
                bold: false,
                arrow: false,
            },
        },
    },
    keywords: [
        __('interfolio'),
        __('card'),
        __('careers'),
    ],

    edit: ({ attributes, className, setAttributes }) => {
        const {
            padding,
            titleTag,
            paddingLock,
            border,
            borderLock,
            backgroundColor,
            backgroundImage,
            textColor,
            borderColor,
            alignment,
            headerText,
            descriptionText,
            image,
            imageIsClickable,
            imageSize,
            showLink,
            linkColor,
            linkText,
            linkUrl,
            linkProperties,
            connectorHeight,
        } = attributes;

        const togglePaddingLock = () => {
            setAttributes({ paddingLock: !paddingLock });
        };

        const toggleBorderLock = () => {
            setAttributes({ borderLock: !borderLock });
        };

        const updatePadding = (newValue, position) => {
            setAttributes({ padding: getUpdatedValue(paddingLock, padding, newValue, position) });
        };

        const updateBorder = (newValue, position) => {
            setAttributes({ border: getUpdatedValue(borderLock, border, newValue, position) });
        };

        const updateLinkProperties = (property) => {
            const properties = JSON.parse(JSON.stringify(linkProperties));
            properties[property] = !properties[property];
            setAttributes({ linkProperties: properties });
        };

        const getUpdatedValue = (lock, map, newVal, position) => {
            const positionMap = {
                top: 0,
                right: 1,
                bottom: 2,
                left: 3,
            };

            const updatedValue = map.map((value, index) => {
                if (!!lock || index === positionMap[position]) {
                    return newVal;
                }
                return value;
            });

            return updatedValue;
        };

        const textStyles = {
            textAlign: alignment,
            color: textColor,
        };

        const linkStyles = {
            textAlign: alignment,
            color: linkColor,
        };

        linkStyles.textDecorationLine = linkProperties.underline ? 'underline' : 'none';
        linkStyles.fontWeight = linkProperties.bold ? 'bold' : 'normal';
        linkStyles.fontStyle = linkProperties.italic ? 'italic' : 'normal';

        const containerStyles = {
            textAlign: alignment,
            paddingTop: `${padding[0]}px`,
            paddingRight: `${padding[1]}px`,
            paddingBottom: `${padding[2]}px`,
            paddingLeft: `${padding[3]}px`,
            borderTop: `${border[0]}px`,
            borderRight: `${border[1]}px`,
            borderBottom: `${border[2]}px`,
            borderLeft: `${border[3]}px`,
            borderColor,
            borderStyle: 'solid',
        };

        if (!!backgroundImage) {
            containerStyles.backgroundImage = 'url(' + backgroundImage.sizes.full.url + ')';
        }

        if (!!backgroundColor) {
            containerStyles.backgroundColor = backgroundColor;
        }

        return (
            [
                <InspectorControls key="controls">
                    <PanelBody title="Text Settings" initialOpen={ false }>
						<SelectControl
							label="Title Tag"
							value={ titleTag }
							options={ [
								{ label: 'H1', value: 'h1' },
								{ label: 'H2', value: 'h2' },
								{ label: 'H3', value: 'h3' },
								{ label: 'H4', value: 'h4' },
								{ label: 'H5', value: 'h5' },
								{ label: 'H6', value: 'h6' },
							] }
							onChange={ ( value ) => setAttributes( { titleTag: value } ) }
						/>
					</PanelBody>
                    <PanelBody title="Padding" initialOpen={false}>
                        <ToggleControl
                            label={!!paddingLock ? __('Padding Locked') : __('Padding Unlocked')}
                            help={!!paddingLock ? __('Change all padding values at once') : __('Change individual padding values')}
                            checked={!!paddingLock}
                            onChange={togglePaddingLock}
                        />
                        <RangeControl
                            label="Padding Top"
                            value={!!padding[0] ? padding[0] : 0}
                            onChange={newPadding => updatePadding(newPadding, 'top')}
                            initialPosition={0}
                            min={0}
                            max={100}
                            allowReset
                            beforeIcon={!!paddingLock && 'lock'}
                        />
                        <RangeControl
                            label="Padding Right"
                            value={!!padding[1] ? padding[1] : 0}
                            onChange={newPadding => updatePadding(newPadding, 'right')}
                            initialPosition={0}
                            min={0}
                            max={100}
                            allowReset
                            beforeIcon={!!paddingLock && 'lock'}
                        />
                        <RangeControl
                            label="Padding Bottom"
                            value={!!padding[2] ? padding[2] : 0}
                            onChange={newPadding => updatePadding(newPadding, 'bottom')}
                            initialPosition={0}
                            min={0}
                            max={100}
                            allowReset
                            beforeIcon={!!paddingLock && 'lock'}
                        />
                        <RangeControl
                            label="Padding Left"
                            value={!!padding[3] ? padding[3] : 0}
                            onChange={newPadding => updatePadding(newPadding, 'left')}
                            initialPosition={0}
                            min={0}
                            max={100}
                            allowReset
                            beforeIcon={!!paddingLock && 'lock'}
                        />
                    </PanelBody>
                    <PanelBody title="Border" initialOpen={false}>
                        <ToggleControl
                            label={!!borderLock ? __('Border Locked') : __('Border Unlocked')}
                            help={!!borderLock ? __('Change all border values at once') : __('Change individual border values')}
                            checked={!!borderLock}
                            onChange={toggleBorderLock}
                        />
                        <RangeControl
                            label="Border Top"
                            value={!!border[0] ? border[0] : 0}
                            onChange={newBorder => updateBorder(newBorder, 'top')}
                            initialPosition={0}
                            min={0}
                            max={100}
                            allowReset
                            beforeIcon={!!borderLock && 'lock'}
                        />
                        <RangeControl
                            label="Border Right"
                            value={!!border[1] ? border[1] : 0}
                            onChange={newBorder => updateBorder(newBorder, 'right')}
                            initialPosition={0}
                            min={0}
                            max={100}
                            allowReset
                            beforeIcon={!!borderLock && 'lock'}
                        />
                        <RangeControl
                            label="Border Bottom"
                            value={!!border[2] ? border[2] : 0}
                            onChange={newBorder => updateBorder(newBorder, 'bottom')}
                            initialPosition={0}
                            min={0}
                            max={100}
                            allowReset
                            beforeIcon={!!borderLock && 'lock'}
                        />
                        <RangeControl
                            label="Border Left"
                            value={!!border[3] ? border[3] : 0}
                            onChange={newBorder => updateBorder(newBorder, 'left')}
                            initialPosition={0}
                            min={0}
                            max={100}
                            allowReset
                            beforeIcon={!!borderLock && 'lock'}
                        />
                        <strong className="label">Border Color:</strong>
                        <ColorPalette
                            value={borderColor}
                            onChange={value => setAttributes({ borderColor: value })}
                        />
                    </PanelBody>
                    <PanelBody title="Image Settings" initialOpen={false}>
                        <MediaUpload
                            type="image"
                            onSelect={(value) => setAttributes({ image: value })}
                            value={image}
                            render={({ open }) => (
                                <Button onClick={open} className="button button-large interfolio-block-full-width-button">
                                    Add Image
								</Button>
                            )}
                        />
                        <Button className="button button-large interfolio-block-full-width-button" onClick={() => setAttributes({ image: null })}>
                            Clear Image
						</Button>
                        <SelectControl
                            label="Image Size"
                            value={imageSize}
                            options={[
                                { label: 'Medium', value: 'medium' },
                                { label: 'Thumbnail', value: 'thumbnail' },
                            ]}
                            onChange={(value) => setAttributes({ imageSize: value })}
                        />
                        <ToggleControl
                            label={ !! imageIsClickable ? __( 'Image is clickable' ) : __( 'Image is not clickable' ) }
                            checked={ !! imageIsClickable }
                            onChange={ () => setAttributes( { imageIsClickable: ! imageIsClickable } ) }
                        />
                    </PanelBody>
                    <PanelBody title="Background Settings" initialOpen={false}>
                        <MediaUpload
                            type="image"
                            onSelect={(value) => setAttributes({ backgroundImage: value })}
                            value={backgroundImage}
                            render={({ open }) => (
                                <Button onClick={open} className="button button-large interfolio-block-full-width-button">
                                    Add Background Image
								</Button>
                            )}
                        />
                        <Button className="button button-large interfolio-block-full-width-button" onClick={() => setAttributes({ backgroundImage: null })}>
                            Clear Background Image
						</Button>
                        <strong className="label">Background color:</strong>
                        <ColorPalette
                            label="Background Color"
                            value={backgroundColor}
                            onChange={value => setAttributes({ backgroundColor: value })}
                        />
                    </PanelBody>
                    <PanelBody title="Color Settings" initialOpen={false}>
                        <strong className="label">Select a text color:</strong>
                        <ColorPalette
                            value={textColor}
                            onChange={value => setAttributes({ textColor: value })}
                        />
                    </PanelBody>
                    <PanelBody title="Connector Height" initialOpen={false}>
                        <RangeControl
                            label="Height of Connecting Line Between Numbers"
							value={attributes.connectorHeight}
                            onChange={value => setAttributes({ connectorHeight: value })}
                            min={150}
                            max={300}>
                        </RangeControl>
                    </PanelBody>
                    <PanelBody title="Link Settings" initialOpen={false}>
                        <ToggleControl
                            label={!!showLink ? __('Link Included') : __('Link not Included')}
                            checked={!!showLink}
                            onChange={() => setAttributes({ showLink: !showLink })}
                        />
                        {
                            !!showLink && (
                                <div>
                                    <TextControl
                                        label="Link Text"
                                        value={linkText}
                                        onChange={value => setAttributes({ linkText: value })}
                                    />
                                    <TextControl
                                        label="Link URL"
                                        value={linkUrl}
                                        onChange={value => setAttributes({ linkUrl: value })}
                                    />
                                    <strong className="label">Select a link color:</strong>
                                    <ColorPalette
                                        value={linkColor}
                                        onChange={value => setAttributes({ linkColor: value })}
                                    />
                                    <div className="checkbox-container">
                                        <strong className="label">Link Properties:</strong>
                                        <CheckboxControl
                                            label="Underline"
                                            checked={linkProperties.underline}
                                            onChange={() => updateLinkProperties('underline')}
                                        />
                                        <CheckboxControl
                                            label="Italic"
                                            checked={linkProperties.italic}
                                            onChange={() => updateLinkProperties('italic')}
                                        />
                                        <CheckboxControl
                                            label="Bold"
                                            checked={linkProperties.bold}
                                            onChange={() => updateLinkProperties('bold')}
                                        />
                                        <CheckboxControl
                                            label="Arrow"
                                            checked={linkProperties.arrow}
                                            onChange={() => updateLinkProperties('arrow')}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </PanelBody>
                </InspectorControls>,
                <div className={className + ' numbered-card-block-container'} style={containerStyles} key="preview">
                    {
                        <BlockControls>
                            <AlignmentToolbar
                                value={alignment}
                                onChange={value => setAttributes({ alignment: value })}
                            />
                        </BlockControls>
                    }
                    {
                        !!image && (
                            <img src={image.sizes[imageSize].url} alt="preview" />
                        )
                    }

                    <PlainText
                        value={headerText}
                        placeholder="Enter text here"
                        onChange={value => setAttributes({ headerText: value })}
                        style={textStyles}
                        className="header-text"
                    />
                    <PlainText
                        value={descriptionText}
                        placeholder="Enter text here"
                        onChange={value => setAttributes({ descriptionText: value })}
                        style={textStyles}
                        className="description-text"
                    />
                    {
                        !!showLink && (
                            <a style={linkStyles} href={linkUrl}>
                                {linkText}
                                {
                                    linkProperties.arrow && (
                                        <i style={{ marginLeft: 5 }} className="fal fa-arrow-right"></i>
                                    )
                                }
                            </a>
                        )
                    }
                </div>,
            ]
        );
    },

    save: function () {
        return null;
    },
});
