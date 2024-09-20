import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const { InnerBlocks } = wp.blockEditor;
const { registerBlockType } = wp.blocks;

registerBlockType('interfolio/block-numbered-list', {
    title: __('Interfolio Numbered List'),
    icon: 'layout',
    category: 'common',
    supports: {
        align: true,
    },
    keywords: [
        __('interfolio'),
        __('testimonial'),
    ],

    edit: ({ className }) => {
        return (
            <div className={className + ' numbered-list-block-container'} key="preview">
                <div className="preview-numbered-list" style={{ padding: 10 }}>
                    <InnerBlocks
                        allowedBlocks={['interfolio/block-numbered-list-card']}
                    />
                </div>
            </div>
        );
    },

    save: function () {
        return <InnerBlocks.Content />;
    },
});
