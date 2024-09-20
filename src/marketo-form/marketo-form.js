import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const {
	InspectorControls,
	InnerBlocks,
	ColorPalette,
} = wp.blockEditor;
const { RangeControl, PanelBody, ToggleControl, TextControl, SelectControl } = wp.components;
const { registerBlockType } = wp.blocks;

let expiredId;
var editingCounter = 0;

registerBlockType( 'interfolio/block-marketo-form', {
	title: __( 'Interfolio Marketo Form' ),
	icon: 'layout',
	category: 'common',
	supports: {
		align: true,
	},
	attributes: {
		equalizeHeight: {
			type: 'boolean',
			default: false,
		},
		cardHeight: {
			type: 'string',
			default: '',
		},
		overflowBehavior: {
			type: 'string',
			default: 'scroll',
		},
		columns: {
			type: 'number',
			default: 3,
		},
        formId: {
			type: 'string',
			default: '',
		},
	},
	keywords: [
		__( 'interfolio' ),
		__( 'card' ),
	],

	edit: ( { attributes, className, setAttributes } ) => {
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

        const updatePadding = (newValue, position) => {
            setAttributes({ padding: getUpdatedValue(paddingLock, padding, newValue, position) });
        };

        const togglePaddingLock = () => {
            setAttributes({ paddingLock: !paddingLock });
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

        const constructFormPreview = (value) => {
            setAttributes( { formId: value } );
            var mktoScript = document.getElementById('mktoInitial');
            if (mktoScript == null) {
                var appendScript = document.createElement("script");
                appendScript.src = "//info.interfolio.com/js/forms2/js/forms2.min.js";
                appendScript.id = "mktoInitial";
                document.head.appendChild(appendScript);
            }

            if (expiredId != null && value != null) {
                var currentForm = null;
                var oldForm = document.getElementById('mktoForm_' + expiredId);
                var newForm = document.getElementById('mktoForm_' + value);

                if (oldForm != null) {
                    currentForm = oldForm;
                }else if (newForm != null) {
                    currentForm = newForm;
                }

                if (currentForm != null) {
                    while (currentForm.lastChild) {
                        currentForm.removeChild(currentForm.lastChild);
                    }
                }
            }

            if (typeof MktoForms2 !== 'undefined') {
                MktoForms2.loadForm("//info.interfolio.com", "770-JDV-251", value);
                expiredId = value;
                editingCounter ++;
            }
        };

        if (editingCounter == 0) {
            constructFormPreview(attributes.formId);
        }

		return (
			[
				<InspectorControls key="controls">
                    <PanelBody title="Form ID" initialOpen={ true }>
                        <TextControl
                            value={ attributes.formId }
                            help="Enter a form id to fetch the correct marketo form"
                            label="Marketo Form ID"
                            type="number"
                            onChange={
                                value => constructFormPreview(value)
                            }
                        />
                    </PanelBody>
				</InspectorControls>,
				<div className={ className + ' marketo-form-block-container' } key="preview">
					<div className="preview-marketo-form">
                        Custom Marketo Form Preview (click to reveal):
                        <form id={ "mktoForm_" + attributes.formId }></form>
					</div>
				</div>,
			]
		);
	},

	save: function() {
		return <InnerBlocks.Content />;
	},
} );
