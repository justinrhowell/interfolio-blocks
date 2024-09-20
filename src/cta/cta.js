import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const { InspectorControls, ColorPalette, PlainText, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { SelectControl, TextControl, PanelBody } = wp.components;
const { registerBlockType } = wp.blocks;

registerBlockType( 'interfolio/block-interfolio-cta', {
	title: __( 'Interfolio CTA' ),
	icon: 'megaphone',
	category: 'common',
	attributes: {
		icon: {
			type: 'string',
			default: 'fa-play',
		},
		iconWeight: {
			type: 'string',
			default: 'fal',
		},
		iconSize: {
			type: 'string',
			default: '32px',
		},
		iconSide: {
			type: 'string',
			default: 'left',
		},
		marginTopBottom: {
			type: 'string',
			default: '0',
		},
		marginLeftRight: {
			type: 'string',
			default: '0',
		},
		text: {
			type: 'string',
			default: '',
		},
		textColor: {
			type: 'string',
			default: '#FFFFFF',
		},
		link: {
			type: 'string',
			default: null,
		},
		alignment: {
			type: 'string',
			default: 'left',
		},
	},
	keywords: [
		__( 'interfolio' ),
		__( 'cta' ),
	],

	edit: ( { attributes, className, setAttributes } ) => {
		const containerStyle = {
			color: attributes.textColor,
			textAlign: attributes.alignment,
			margin: attributes.marginTopBottom + 'px ' + attributes.marginLeftRight + 'px',
		};

		return (
			[
				<InspectorControls key="inspector-controls">
					<PanelBody title="Icon Settings" initialOpen={ false }>
						<SelectControl
							label="Icon Weight"
							value={ attributes.iconWeight }
							options={ [
								{ label: 'Light', value: 'fal' },
								{ label: 'Regular', value: 'far' },
								{ label: 'Solid', value: 'fas' },
							] }
							onChange={ iconWeight => setAttributes( { iconWeight } ) }
						/>
						<SelectControl
							label="Icon"
							value={ attributes.icon }
							options={ [
								{ label: 'Arrow Up', value: 'fa-arrow-up' },
								{ label: 'Arrow Right', value: 'fa-arrow-right' },
								{ label: 'Arrow Down', value: 'fa-arrow-down' },
								{ label: 'Arrow Left', value: 'fa-arrow-left' },
								{ label: 'Cell Phone', value: 'fa-mobile' },
								{ label: 'Cell Phone Alt', value: 'fa-mobile-alt' },
								{ label: 'Envelope', value: 'fa-envelope' },
								{ label: 'Envelope Square', value: 'fa-envelope-square' },
								{ label: 'Handshake', value: 'fa-handshake' },
								{ label: 'Hand Point Up', value: 'fa-hand-point-up' },
								{ label: 'Hand Point Down', value: 'fa-hand-point-down' },
								{ label: 'Hand Point Right', value: 'fa-hand-point-right' },
								{ label: 'Hand Point Left', value: 'fa-hand-point-left' },
								{ label: 'Headset', value: 'fa-headset' },
								{ label: 'Phone', value: 'fa-phone' },
								{ label: 'Phone Square', value: 'fa-phone-square' },
								{ label: 'Play Button', value: 'fa-play' },
								{ label: 'Play Button Circle', value: 'fa-play-circle' },
								{ label: 'Thumbs Up', value: 'fa-thumbs-up' },
							] }
							onChange={ icon => setAttributes( { icon } ) }
						/>
						<SelectControl
							label="Icon Size"
							value={ attributes.iconSize }
							options={ [
								{ label: 'Extra Small', value: '16px' },
								{ label: 'Small', value: '24px' },
								{ label: 'Medium', value: '32px' },
								{ label: 'Large', value: '40px' },
								{ label: 'Extra Large', value: '48px' },
							] }
							onChange={ iconSize => setAttributes( { iconSize } ) }
						/>
						<SelectControl
							label="Icon Side"
							value={ attributes.iconSide }
							options={ [
								{ label: 'Left', value: 'left' },
								{ label: 'Right', value: 'right' },
							] }
							onChange={ iconSide => setAttributes( { iconSide } ) }
						/>
					</PanelBody>
					<PanelBody title="Text Color Settings" initialOpen={ false }>
						<strong className="label">Select a text color:</strong>
						<ColorPalette
							value={ attributes.textColor }
							onChange={ value => setAttributes( { textColor: value } ) }
						/>
					</PanelBody>
					<PanelBody title="Link Settings" initialOpen={ false }>
						<strong className="label">Enter a valid link:</strong>
						<TextControl
							value={ attributes.link }
							placeholder="Enter link here"
							onChange={ value => setAttributes( { link: value } ) }
						/>
					</PanelBody>
					<PanelBody title="Margin Settings" initialOpen={ false }>
						<strong className="label">Enter a top/bottom margin (px):</strong>
						<TextControl
							value={ attributes.marginTopBottom }
							placeholder="Enter Top/Bottom Margin"
							type="number"
							onChange={ value => setAttributes( { marginTopBottom: value } ) }
						/>
						<strong className="label">Enter a left/right margin (px):</strong>
						<TextControl
							value={ attributes.marginLeftRight }
							placeholder="Enter Left/Right Margin"
							type="number"
							onChange={ value => setAttributes( { marginLeftRight: value } ) }
						/>
					</PanelBody>
				</InspectorControls>,
				<div key="edit-block" className={ className + ' container' } style={ containerStyle }>
					{
						<BlockControls>
							<AlignmentToolbar
								value={ attributes.alignment }
								onChange={ value => setAttributes( { alignment: value } ) }
							/>
						</BlockControls>
					}
					{
						attributes.iconSide === 'left' && (
							<i className={ attributes.iconWeight + ' ' + attributes.icon + ' cta-icon' } style={ { fontSize: attributes.iconSize } }></i>
						)
					}
					<PlainText
						value={ attributes.text }
						placeholder="Enter text here"
						onChange={ value => setAttributes( { text: value } ) }
						className="cta-text"
					/>
					{
						attributes.iconSide === 'right' && (
							<i className={ attributes.iconWeight + ' ' + attributes.icon + ' cta-icon' } style={ { fontSize: attributes.iconSize } }></i>
						)
					}
				</div>,
			]
		);
	},

	save: function() {
		return null;
	},
} );
