import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const { InspectorControls, InnerBlocks } = wp.blockEditor;
const { SelectControl } = wp.components;
const { registerBlockType } = wp.blocks;

registerBlockType('interfolio/block-motion-container', {
    title: __('Interfolio Motion Container'),
    icon: 'megaphone',
    category: 'common',
    attributes: {
        motion: {
            type: 'string',
            default: '',
        }
    },
    keywords: [
        __('interfolio'),
        __('testimonial'),
    ],

    edit: ({ attributes, className, setAttributes }) => {

        const {
            motion
        } = attributes;

        return (
            [
                <InspectorControls key="inspector-controls">
                    <SelectControl
                        label="Motion Fade Settings"
                        value={motion}
                        options={[
                            { label: 'Fade', value: 'fade' },
                            { label: 'Fade-up', value: 'fade-up' },
                            { label: 'Fade-down', value: 'fade-down' },
                            { label: 'Fade-left', value: 'fade-left' },
                            { label: 'Fade-right', value: 'fade-right' },
                            { label: 'Fade-up-right', value: 'fade-up-right' },
                            { label: 'Fade-up-left', value: 'fade-up-left' },
                            { label: 'Fade-down-right', value: 'fade-down-right' },
                            { label: 'Fade-down-left', value: 'fade-down-left' },
                            { label: 'Flip-up', value: 'flip-up' },
                            { label: 'Flip-down', value: 'flip-down' },
                            { label: 'Flip-left', value: 'flip-left' },
                            { label: 'Flip-right', value: 'flip-right' },
                            { label: 'Slide-up', value: 'slide-up' },
                            { label: 'Slide-down', value: 'slide-down' },
                            { label: 'Slide-left', value: 'slide-left' },
                            { label: 'Slide-right', value: 'slide-right' },
                            { label: 'Zoom-in', value: 'zoom-in' },
                            { label: 'Zoom-in-up', value: 'zoom-in-up' },
                            { label: 'Zoom-in-down', value: 'zoom-in-down' },
                            { label: 'Zoom-in-left', value: 'zoom-in-left' },
                            { label: 'Zoom-in-right', value: 'zoom-in-right' },
                            { label: 'Zoom-out', value: 'zoom-out' },
                            { label: 'Zoom-out-up', value: 'zoom-out-up' },
                            { label: 'Zoom-out-down', value: 'zoom-out-down' },
                            { label: 'Zoom-out-left', value: 'zoom-out-left' },
                            { label: 'Zoom-out-right', value: 'zoom-out-right' },
               ]}
                        onChange={(value) => setAttributes({ motion: value })}
                    />
                </InspectorControls>,
                <div key="edit-block" className={className + ' container'}>
                   <InnerBlocks></InnerBlocks>
                </div>,
            ]
        );
    },

    save: function () {
        return <InnerBlocks.Content />;
    },
});
