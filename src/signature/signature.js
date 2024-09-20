import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const { PlainText, InspectorControls, MediaUpload } = wp.blockEditor;
const { PanelBody, Button } = wp.components;
const { registerBlockType } = wp.blocks;

registerBlockType( 'interfolio/block-signature', {
	title: __( 'Interfolio Signature' ),
	icon: 'megaphone',
	category: 'common',
	attributes: {
		image: {
			type: 'object',
			default: null,
		},
		authorName: {
			type: 'string',
			default: '',
		},
		bodyText: {
			type: 'string',
			default: '',
		},
	},
	keywords: [
		__( 'interfolio' ),
		__( 'signature' ),
	],

	edit: ( { attributes, className, setAttributes } ) => {
		const imageSource = !! attributes.image ? attributes.image.sizes.full.url : 'http://1.gravatar.com/avatar/dfaf20f50dd0a89a3331d67286e71f60?s=96&d=mm&r=g';
		const buttonText = !! attributes.image ? 'Change Image' : 'Add Image';
		return ( [
			<InspectorControls key="inspector-controls">
				<PanelBody title="Signature Image" initialOpen={ false }>
					<MediaUpload
						type="image"
						onSelect={ ( value ) => setAttributes( { image: value } ) }
						value={ attributes.image }
						render={ ( { open } ) => (
							<Button onClick={ open } className="button button-large interfolio-block-full-width-button">
								{ buttonText }
							</Button>
						) }
					/>
				</PanelBody>
			</InspectorControls>,
			<div key="edit-block" className={ className + ' container' }>
				<div className="image-container">
					<img src={ imageSource } alt="user avatar placeholder" />
				</div>
				<div className="text-container">
					<PlainText
						value={ attributes.authorName }
						placeholder="Author Name..."
						onChange={ value => setAttributes( { authorName: value } ) }
						className="author-name"
					/>
					<PlainText
						value={ attributes.bodyText }
						placeholder="Blurb..."
						onChange={ value => setAttributes( { bodyText: value } ) }
						className="body-text"
					/>
				</div>
			</div>,
		] );
	},

	save: function() {
		return null;
	},
} );
