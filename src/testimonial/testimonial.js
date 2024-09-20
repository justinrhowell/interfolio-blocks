import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const { InspectorControls, PlainText, MediaUpload} = wp.blockEditor;
const { PanelBody, Button, SelectControl } = wp.components;
const { registerBlockType } = wp.blocks;

registerBlockType('interfolio/block-testimonial', {
    title: __('Interfolio Testimonial'),
    icon: 'megaphone',
    category: 'common',
    attributes: {
        text: {
            type: 'string',
            default: '',
        },
        author: {
            type: 'string',
            default: '',
        },
        backgroundImage: {
            type: 'object',
            default: null,
        },
        backgroundAlignment: {
            type: 'string',
            default: 'top',
        }
    },
    keywords: [
        __('interfolio'),
        __('testimonial'),
    ],

    edit: ({ attributes, className, setAttributes }) => {
        const containerStyle = {};

        if (!!backgroundImage) {
            containerStyle.backgroundImage = 'url(' + backgroundImage.sizes.full.url + ')';
        }

        const {
            backgroundImage,
            author,
            text,
            backgroundAlignment,
        } = attributes;

        return (
            [
                <InspectorControls key="inspector-controls">
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
                        <SelectControl
                            label="Background Image Alignment"
                            value={backgroundAlignment}
                            options={[
                                { label: 'Top', value: 'top' },
                                { label: 'Center', value: 'center' },
                            ]}
                            onChange={(value) => setAttributes({ backgroundAlignment: value })}
                        />
                    </PanelBody>
                </InspectorControls>,
                <div key="edit-block" className={className + ' container'} style={containerStyle}>
                    <PlainText
                        value={attributes.text}
                        placeholder="Enter text here"
                        onChange={value => setAttributes({ text: value })}
                        className="testimonial-text"
                    />
                    <PlainText
                        value={attributes.author}
                        placeholder="Enter quote attribution here"
                        onChange={value => setAttributes({ author: value })}
                        className="testimonial-author"
                    />
                </div>,
            ]
        );
    },

    save: function () {
        return null;
    },
});
