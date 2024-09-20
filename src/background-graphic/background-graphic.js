import './_style.scss';

const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { SelectControl, RangeControl, PanelBody } = wp.components;
const { registerBlockType } = wp.blocks;

registerBlockType( 'interfolio/block-background-graphic', {
	title: __( 'Background Graphic' ),
	icon: 'megaphone',
	category: 'common',
	attributes: {
		position: {
			type: 'string',
			default: 'left',
		},
		size: {
			type: 'string',
			default: 'small',
		},
		color: {
			type: 'string',
			default: 'gray',
		},
		trailingShapes: {
			type: 'number',
			default: 0,
		},
	},
	keywords: [
		__( 'interfolio' ),
		__( 'cta' ),
	],

	edit: ( { attributes, className, setAttributes } ) => {
		const getTrailingShapes = () => {
			const shapes = [];
			for ( let i = 0; i < attributes.trailingShapes; i++ ) {
				shapes.push(
					<div className="secondary-shape"></div>
				);
			}

			return shapes;
		};
		return (
			[
				<InspectorControls key="inspector-controls">
					<PanelBody title="Graphic Settings" initialOpen={ false }>
						<SelectControl
							label="Size"
							value={ attributes.size }
							options={ [
								{ label: 'Extra Small', value: 'xsmall' },
								{ label: 'Small', value: 'small' },
								{ label: 'Medium', value: 'medium' },
								{ label: 'Large', value: 'large' },
								{ label: 'Extra Large', value: 'xlarge' },
							] }
							onChange={ size => setAttributes( { size } ) }
						/>
						<SelectControl
							label="Position"
							value={ attributes.position }
							options={ [
								{ label: 'Left', value: 'left' },
								{ label: 'Center', value: 'center' },
								{ label: 'Right', value: 'right' },
							] }
							onChange={ position => setAttributes( { position } ) }
						/>
						<SelectControl
							label="Color"
							value={ attributes.color }
							options={ [
								{ label: 'Gray', value: 'gray' },
								{ label: 'Light Blue', value: 'light-blue' },
								{ label: 'Dark Blue', value: 'dark-blue' },
								{ label: 'Red', value: 'red' },
							] }
							onChange={ color => setAttributes( { color } ) }
						/>
						<RangeControl
							label="Trailing Shapes"
							value={ attributes.trailingShapes }
							onChange={ trailingShapes => setAttributes( { trailingShapes } ) }
							initialPosition={ 0 }
							min={ 0 }
							max={ 5 }
							allowReset
						/>
					</PanelBody>
				</InspectorControls>,
				<div key="edit-block" className={ className + ' interfolio-background-graphic-container' }>
                    Background Graphic Here
					<div className={ attributes.color + ' ' + attributes.position + ' ' + attributes.size + ' interfolio-background-graphic' }>
						<div className="primary-shape"></div>
						{ getTrailingShapes() }
					</div>
				</div>,
			]
		);
	},

	save: ( { attributes } ) => {
		const getTrailingShapes = () => {
			const shapes = [];
			for ( let i = 0; i < attributes.trailingShapes; i++ ) {
				shapes.push(
					<div className="secondary-shape"></div>
				);
			}

			return shapes;
		};

		return (
			<div className="interfolio-background-graphic-container">
				<div className={ attributes.color + ' ' + attributes.position + ' ' + attributes.size + ' interfolio-background-graphic' }>
					<div className="primary-shape"></div>
					{ getTrailingShapes() }
				</div>
			</div>
		);
	},
} );
