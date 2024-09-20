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

registerBlockType( 'interfolio/block-card-container', {
	title: __( 'Interfolio Card Container' ),
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
		gridBackgroundColor: {
			type: 'string',
			default: 'transparent',
		},
	},
	keywords: [
		__( 'interfolio' ),
		__( 'card' ),
	],

	edit: ( { attributes, className, setAttributes } ) => {
		return (
			[
				<InspectorControls key="controls">
					<PanelBody title="Columns" initialOpen={ false }>
						<RangeControl
							label="Columns"
							value={ attributes.columns }
							onChange={ columns => setAttributes( { columns } ) }
							min={ 2 }
							max={ 5 }
						/>
					</PanelBody>
					<PanelBody title="Background Color" initialOpen={ false }>
						<ColorPalette
							value={ attributes.gridBackgroundColor }
							onChange={ value => setAttributes( { gridBackgroundColor: value } ) }
						/>
					</PanelBody>
					<PanelBody title="Card Height Settings" initialOpen={ false }>
						<ToggleControl
							label={ !! attributes.equalizeHeight ? __( 'Equal Height' ) : __( 'Content Height' ) }
							help={ !! attributes.equalizeHeight ? __( 'All cards will be set to the height of the tallest card' ) : __( 'All cards will have height based on their content' ) }
							checked={ !! attributes.equalizeHeight }
							onChange={ () => setAttributes( { equalizeHeight: ! attributes.equalizeHeight } ) }
						/>
						<TextControl
							value={ attributes.cardHeight }
							help="If not blank, will force cards to this height in px"
							label="Custom Card Height"
							type="number"
							onChange={ value => setAttributes( { cardHeight: value } ) }
						/>
						{
							!! attributes.cardHeight && (
								<SelectControl
									label="Overflow Behavior"
									help="The setting for content that doesn't fit within the custom height"
									value={ attributes.overflowBehavior }
									options={ [
										{ label: 'Scroll', value: 'scroll' },
										{ label: 'Hidden', value: 'hidden' },
										{ label: 'Visible', value: 'visible' },
									] }
									onChange={ value => setAttributes( { overflowBehavior: value } ) }
								/>
							)
						}
					</PanelBody>
				</InspectorControls>,
				<div className={ className + ' card-container-block-container' } key="preview">
					<div className="preview-card-grid" style={ { backgroundColor: attributes.gridBackgroundColor, padding: 10 } }>
						<InnerBlocks
							allowedBlocks={ [ 'interfolio/block-card' ] }
						/>
					</div>
				</div>,
			]
		);
	},

	save: function() {
		return <InnerBlocks.Content />;
	},
} );
