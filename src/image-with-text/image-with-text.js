import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const { MediaUpload, InspectorControls, BlockControls, AlignmentToolbar, InnerBlocks } = wp.blockEditor;
const { SelectControl } = wp.components;
const { registerBlockType } = wp.blocks;
const { Button } = wp.components;

registerBlockType('interfolio/block-interfolio-image-with-text', {
    title: __('Interfolio Image With Text'),
    icon: 'layout',
    category: 'common',
    attributes: {
        imageUrl: {
            type: 'string',
            default: null,
        },
        size: {
            type: 'string',
            default: '350px',
        },
        textColor: {
            type: 'string',
            default: '#000000',
        },
        alignment: {
            type: 'string',
            default: 'left',
        },
    },
    keywords: [
        __('interfolio'),
        __('header'),
        __('hero'),
    ],

    edit: ({ attributes, className, setAttributes }) => {
        const containerStyle = {
            color: attributes.textColor,
            textAlign: attributes.alignment,
        };

        return (
            [
                <InspectorControls key="0">
                    <div className={className + '-option-container'}>
                        <SelectControl
                            label="Size"
                            value={attributes.size}
                            options={[
                                { label: 'Large', value: '500px' },
                                { label: 'Medium', value: '350px' },
                                { label: 'Small', value: '200px' },
                            ]}
                            onChange={size => setAttributes({ size })}
                        />
                    </div>
                    <div className={className + '-option-container'}>
                        <strong className="label">Select an image:</strong>
                        <MediaUpload
                            onSelect={(imageObject) => setAttributes({ imageUrl: imageObject.sizes.full.url })}
                            type="image"
                            value={attributes.imageUrl}
                            render={({ open }) => (
                                <Button onClick={open} className="button button-large">
                                    Select an Image
								</Button>
                            )}
                        />
                        <Button className="button button-large" onClick={() => setAttributes({ imageUrl: '' })}>
                            Clear Image
						</Button>
                    </div>
                </InspectorControls>,
                <div key="1" className={className + ' container'} style={containerStyle}>
                    {
                        <BlockControls>
                            <AlignmentToolbar
                                value={attributes.alignment}
                                onChange={value => setAttributes({ alignment: value })}
                            />
                        </BlockControls>
                    }
                    <div className="overlay"></div>
                    <div className="content-container">
                        <img src={attributes.imageUrl}></img>
                        <InnerBlocks />
                    </div>
                </div>,
            ]
        );
    },

    save: function () {
        return <InnerBlocks.Content />;
    },
});
