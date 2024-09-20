import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const { InnerBlocks } = wp.blockEditor;
const { registerBlockType } = wp.blocks;

registerBlockType('interfolio/block-testimonial-slider', {
    title: __('Interfolio Testimonial Slider'),
    icon: 'layout',
    category: 'common',
    supports: {
        align: true,
    },
    keywords: [
        __('interfolio'),
        __('testimonial'),
    ],

    edit: ({ className}) => {
        return (
            <div className={className + ' card-container-block-container'} key="preview">
                <div className="preview-card-grid" style={{ padding: 10 }}>
                    <InnerBlocks
                        allowedBlocks={['interfolio/block-testimonial']}
                    />
                </div>
            </div>
        );
    },

    save: function () {
        return <InnerBlocks.Content />;
    },
});
