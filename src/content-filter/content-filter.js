import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const { InspectorControls, ColorPalette, MediaUpload } = wp.blockEditor;
const { SelectControl, RangeControl, ToggleControl, TextControl, CheckboxControl, PanelBody, Button } = wp.components;
const { registerBlockType } = wp.blocks;

registerBlockType( 'interfolio/block-content-filter', {
	title: __( 'Interfolio Content Filter' ),
	icon: 'megaphone',
	category: 'common',
	supports: {
		align: true,
	},
	attributes: {
		hasErrors: {
			type: 'boolean',
			default: false,
		},
		errorMessage: {
			type: 'string',
			default: '',
		},
		contentType: {
			type: 'string',
			default: '',
		},
		taxonomy: {
			type: 'string',
			default: '',
		},
		allContentTypes: {
			type: 'array',
			default: [],
		},
		categories: {
			type: 'array',
			default: [],
		},
		exposeControlsToUser: {
			type: 'boolean',
			default: 'false',
		},
		includeAllOption: {
			type: 'boolean',
			default: 'true',
		},
		featuredPosts: {
			type: 'boolean',
			default: 'true',
		},
		categoryOptions: {
			type: 'array',
			default: [],
		},
		filteredCategory: {
			type: 'string',
			default: '',
		},
		includeCustomFields: {
			type: 'boolean',
			default: false,
		},
		includeExcerpt: {
			type: 'boolean',
			default: false,
		},
		fieldsToInclude: {
			type: 'string',
			default: '',
		},
		itemsPerRow: {
			type: 'number',
			default: 1,
		},
		paginateResults: {
			type: 'boolean',
			default: false,
		},
		allowUserToPaginate: {
			type: 'boolean',
			default: false,
		},
		paginateAmount: {
			type: 'string',
			default: '3',
		},
		paginateButtonBackgroundColor: {
			type: 'string',
			default: 'transparent',
		},
		paginateButtonTextColor: {
			type: 'string',
			default: '#000',
		},
		paginateButtonTextSize: {
			type: 'number',
			default: 16,
		},
		gutterSize: {
			type: 'number',
			default: 5,
		},
		itemBackgroundColor: {
			type: 'string',
			default: 'transparent',
		},
		alignment: {
			type: 'string',
			default: 'left',
		},
		titleIsClickable: {
			type: 'boolean',
			default: false,
		},
		itemTextColor: {
			type: 'string',
			default: '#000',
		},
		textSize: {
			type: 'number',
			default: 24,
		},
		textProperties: {
			type: 'object',
			default: {
				underline: false,
				italic: false,
				bold: false,
			},
		},
		itemPadding: {
			type: 'number',
			default: 0,
		},
		includeImage: {
			type: 'boolean',
			default: false,
		},
		imageIsClickable: {
			type: 'boolean',
			default: false,
		},
		includeOverlay: {
			type: 'boolean',
			default: false,
		},
		imageStyle: {
			type: 'string',
			default: 'content-width',
		},
		equalizeImages: {
			type: 'boolean',
			default: false,
		},
		placeholderImageUrl: {
			type: 'string',
			default: '',
		},
		includePostLink: {
			type: 'boolean',
			default: false,
		},
		linkSource: {
			type: 'string',
			default: 'post',
		},
		linkSourceField: {
			type: 'string',
			default: '',
		},
		postLinkText: {
			type: 'string',
			default: 'Learn More',
		},
		linkTextColor: {
			type: 'string',
			default: '#000',
		},
		linkProperties: {
			type: 'object',
			default: {
				underline: false,
				italic: false,
				bold: false,
				arrow: false,
			},
		},
	},
	keywords: [
		__( 'interfolio' ),
		__( 'content' ),
	],

	edit: ( { attributes, className, setAttributes } ) => {
		async function getContentTypes() {
			const options = [];
			const request = await fetch( '/wp-json/wp/v2/types' )
				.then( response => response.json() );
			const keys = Object.keys( request );
			keys.forEach( ( key ) => {
				const title = request[ key ].name;
				options.push( {
					label: title,
					value: key,
				} );
			} );
			if ( JSON.stringify( options ) !== JSON.stringify( attributes.allContentTypes ) ) {
				setAttributes( { allContentTypes: options } );
			}
		}

		async function getCategories() {
			const contentTypeDataRequest = await fetch( '/wp-json/wp/v2/types/' + attributes.contentType );
			if ( ! contentTypeDataRequest.ok ) {
				setAttributes( {
					hasErrors: true,
					errorMessage: 'Failed to retrieve data for that content type.',
				} );
				return false; //error
			}
			const contentTypeData = await contentTypeDataRequest.json();
			if ( ! contentTypeData.taxonomies || contentTypeData.taxonomies.length === 0 ) {
				setAttributes( {
					hasErrors: true,
					errorMessage: 'That content type doesn\'t have any accessible taxonomies',
				} );
				return false; //error
			}
			let taxonomy;
			for ( let i = 0; i < contentTypeData.taxonomies.length; i++ ) {
				if ( ! [ 'post_tag', 'yst_prominent_words' ].includes( contentTypeData.taxonomies[ i ] ) ) {
					taxonomy = contentTypeData.taxonomies[ i ];
				}
			}
			if ( ! taxonomy ) {
				setAttributes( {
					hasErrors: true,
					errorMessage: 'No valid taxonomy was found.',
				} );
				return false;
			}
			if ( attributes.taxonomy !== taxonomy ) {
				setAttributes( { taxonomy } );
			}
			const categoryReq = await fetch( '/wp-json/wp/v2/' + taxonomy );
			if ( ! categoryReq.ok ) {
				setAttributes( {
					hasErrors: true,
					errorMessage: 'Failed to retrieve terms for that taxonomy.',
				} );
				return false;
			}
			const categories = await categoryReq.json();
			if ( attributes.includeAllOption ) {
				categories.unshift( {
					id: 'all',
					name: 'All',
				} );
			}
			if ( JSON.stringify( categories ) !== JSON.stringify( attributes.categories ) ) {
				setAttributes( { categories } );
			}
			const options = categories.map( ( cat ) => {
				return {
					value: cat.id,
					label: cat.name,
				};
			} );
			options.unshift( {
				value: 'all',
				label: 'All',
			} );
			if ( JSON.stringify( options ) !== JSON.stringify( attributes.categoryOptions ) ) {
				setAttributes( { categoryOptions: options } );
			}
		}

		const updateTextProperties = ( property ) => {
			const properties = JSON.parse( JSON.stringify( attributes.textProperties ) );
			properties[ property ] = ! properties[ property ];
			setAttributes( { textProperties: properties } );
		};

		const updateLinkProperties = ( property ) => {
			const properties = JSON.parse( JSON.stringify( attributes.linkProperties ) );
			properties[ property ] = ! properties[ property ];
			setAttributes( { linkProperties: properties } );
		};

		const getPaginationControls = () => {
			const paginationButtonStyles = {};
			paginationButtonStyles.color = attributes.paginateButtonTextColor ? attributes.paginateButtonTextColor : '#000';
			paginationButtonStyles.backgroundColor = attributes.paginateButtonBackgroundColor ? attributes.paginateButtonBackgroundColor : 'transparent';
			paginationButtonStyles.fontSize = attributes.paginateButtonTextSize ? attributes.paginateButtonTextSize : 24;

			return [
				<div key="prev" className="pagination-previous-container">
					<button style={ paginationButtonStyles } className="previous-button">Previous</button>
				</div>,
				<div key="next" className="pagination-next-container">
					<button style={ paginationButtonStyles } className="next-button">Next</button>
				</div>,
			];
		};

		const generateSampleResults = () => {
			const results = [];

			const containerStyles = {
				width: `${ 100 / attributes.itemsPerRow }%`,
				padding: attributes.gutterSize,
			};

			const itemStyles = {
				padding: attributes.itemPadding,
				backgroundColor: attributes.itemBackgroundColor,
				textAlign: attributes.alignment,
			};

			const textStyles = {
				color: attributes.itemTextColor,
				fontSize: attributes.textSize,
			};

			textStyles.textDecorationLine = attributes.textProperties.underline ? 'underline' : 'none';
			textStyles.fontWeight = attributes.textProperties.bold ? 'bold' : 'normal';
			textStyles.fontStyle = attributes.textProperties.italic ? 'italic' : 'normal';

			const imageStyles = {
				margin: 0,
			};

			if ( attributes.imageStyle === 'full-bleed' ) {
				imageStyles.marginTop = -attributes.itemPadding;
				imageStyles.marginRight = -attributes.itemPadding;
				imageStyles.marginLeft = -attributes.itemPadding;
			}

			const linkStyles = {
				color: attributes.linkTextColor,
			};

			linkStyles.textDecorationLine = attributes.linkProperties.underline ? 'underline' : 'none';
			linkStyles.fontWeight = attributes.linkProperties.bold ? 'bold' : 'normal';
			linkStyles.fontStyle = attributes.linkProperties.italic ? 'italic' : 'normal';

			for ( let i = 0; i < 4; i++ ) {
				results.push(
					<div className="sample-result-item-container" style={ containerStyles }>
						<div className="sample-result-item" style={ itemStyles }>
							{
								attributes.includeImage && (
									<div className="sample-result-image-container" style={ imageStyles }>
										{
											attributes.includeOverlay && (
												<div className="image-overlay"><span className="type-label">Category</span></div>
											)
										}
										<img className="sample-result-item-image" src={ attributes.placeholderImageUrl } alt="example" />
									</div>
								)
							}
							<div className="sample-result-header-container">
								<span style={ textStyles } className="sample-result-header">Sample Result</span>
							</div>
							{
								attributes.includeExcerpt && (
									<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
								)
							}
							{
								attributes.includePostLink && (
									<div className="sample-result-link-container">
										<a href="/" style={ linkStyles }>
											{ attributes.postLinkText }
											{
												attributes.linkProperties.arrow && (
													<i style={ { marginLeft: 5 } } className="fal fa-arrow-right"></i>
												)
											}
										</a>
									</div>
								)
							}
						</div>
					</div>
				);
			}

			return results;
		};

		getContentTypes();
		getCategories();

		return (
			[
				<InspectorControls key="inspector-controls">
					{
						!! attributes.hasErrors && (
							<Button className="button button-large interfolio-full-width-inspector-button" onClick={ () => setAttributes( { hasErrors: false, errorMessage: '' } ) }>
								Try Again
							</Button>
						)
					}
					<PanelBody title="Content Settings" initialOpen={ false }>
						<SelectControl
							label="Content Settings"
							value={ attributes.contentType }
							options={ attributes.allContentTypes }
							onChange={ value => setAttributes( { contentType: value } ) }
						/>
						<ToggleControl
							label={ !! attributes.exposeControlsToUser ? __( 'User can filter by category' ) : __( 'User has no filter controls' ) }
							checked={ !! attributes.exposeControlsToUser }
							onChange={ () => setAttributes( { exposeControlsToUser: ! attributes.exposeControlsToUser } ) }
						/>
						{
							! attributes.exposeControlsToUser && (
								<SelectControl
									label="Limit To"
									value={ attributes.filteredCategory }
									options={ attributes.categoryOptions }
									onChange={ value => setAttributes( { filteredCategory: value } ) }
								/>
							)
						}
						{
							!! attributes.exposeControlsToUser && (
								<ToggleControl
									label={ !! attributes.includeAllOption ? __( 'User can select all categories' ) : __( 'User can not select all categories' ) }
									checked={ !! attributes.includeAllOption }
									onChange={ () => setAttributes( { includeAllOption: ! attributes.includeAllOption } ) }
								/>
							)
						}
						<ToggleControl
							label={ !! attributes.featuredPosts ? __( 'Featured posts appear first and full width' ) : __( 'All posts appear normally' ) }
							checked={ !! attributes.featuredPosts }
							onChange={ () => setAttributes( { featuredPosts: ! attributes.featuredPosts } ) }
						/>
						<ToggleControl
							label={ !! attributes.includeCustomFields ? __( 'Custom Fields Included' ) : __( 'Custom Fields not included' ) }
							checked={ !! attributes.includeCustomFields }
							onChange={ () => setAttributes( { includeCustomFields: ! attributes.includeCustomFields } ) }
						/>
						{
							!! attributes.includeCustomFields && (
								<TextControl
									label="Fields To Include"
									value={ attributes.fieldsToInclude }
									help="A comma seperated list of the machine names of fields to include (e.g. post_field_1,post_field_2)"
									onChange={ fieldsToInclude => setAttributes( { fieldsToInclude } ) }
								/>
							)
						}
						<ToggleControl
							label={ !! attributes.includeExcerpt ? __( 'Excerpt Included' ) : __( 'Excerpt not included' ) }
							checked={ !! attributes.includeExcerpt }
							onChange={ () => setAttributes( { includeExcerpt: ! attributes.includeExcerpt } ) }
						/>
					</PanelBody>
					<PanelBody title="Pagination Settings" initialOpen={ false }>
						<RangeControl
							label="Items Per Row"
							value={ attributes.itemsPerRow }
							onChange={ value => setAttributes( { itemsPerRow: value } ) }
							min={ 1 }
							max={ 5 }
						/>
						<RangeControl
							label="Gutter Size"
							value={ attributes.gutterSize }
							onChange={ value => setAttributes( { gutterSize: value } ) }
							min={ 0 }
							max={ 10 }
						/>
						<ToggleControl
							label={ !! attributes.paginateResults ? __( 'Results Paginated' ) : __( 'Results Not Paginated' ) }
							help={ !! attributes.paginateResults ? __( 'A limited number of results will be returned' ) : __( 'All results will be returned' ) }
							checked={ !! attributes.paginateResults }
							onChange={ () => setAttributes( { paginateResults: ! attributes.paginateResults } ) }
						/>
						{
							!! attributes.paginateResults && (
								<div>
									<ToggleControl
										label={ !! attributes.allowUserToPaginate ? __( 'User can move through pages' ) : __( 'User limited to first page' ) }
										checked={ !! attributes.allowUserToPaginate }
										onChange={ () => setAttributes( { allowUserToPaginate: ! attributes.allowUserToPaginate } ) }
									/>
									<TextControl
										label="Items per page"
										value={ attributes.paginateAmount }
										type="number"
										onChange={ value => setAttributes( { paginateAmount: value } ) }
									/>
									{
										!! attributes.allowUserToPaginate && (
											<div>
												<strong className="label">Paginate Button Text Color</strong>
												<ColorPalette
													value={ attributes.paginateButtonTextColor }
													onChange={ value => setAttributes( { paginateButtonTextColor: value } ) }
												/>
												<strong className="label">Paginate Button Background Color:</strong>
												<ColorPalette
													value={ attributes.paginateButtonBackgroundColor }
													onChange={ value => setAttributes( { paginateButtonBackgroundColor: value } ) }
												/>
												<RangeControl
													label="Paginate Button Size"
													value={ attributes.paginateButtonTextSize }
													onChange={ value => setAttributes( { paginateButtonTextSize: value } ) }
													min={ 8 }
													max={ 40 }
												/>
											</div>
										)
									}
								</div>
							)
						}
					</PanelBody>
					<PanelBody title="Item Appearance" initialOpen={ false }>
						<RangeControl
							label="Item Padding"
							value={ attributes.itemPadding }
							onChange={ value => setAttributes( { itemPadding: value } ) }
							min={ 0 }
							max={ 20 }
						/>
						<strong className="label">Item Background Color:</strong>
						<ColorPalette
							value={ attributes.itemBackgroundColor }
							onChange={ value => setAttributes( { itemBackgroundColor: value } ) }
						/>
					</PanelBody>
					<PanelBody title="Item Text" initialOpen={ false }>
						<ToggleControl
							label={ !! attributes.titleIsClickable ? __( 'Title is clickable' ) : __( 'Title is not clickable' ) }
							checked={ !! attributes.titleIsClickable }
							onChange={ () => setAttributes( { titleIsClickable: ! attributes.titleIsClickable } ) }
						/>
						<SelectControl
							label="Text Alignment"
							value={ attributes.alignment }
							options={ [
								{ label: 'Left', value: 'left' },
								{ label: 'Center', value: 'center' },
								{ label: 'Right', value: 'right' },
							] }
							onChange={ alignment => setAttributes( { alignment } ) }
						/>
						<strong className="label">Item Text Color:</strong>
						<ColorPalette
							value={ attributes.itemTextColor }
							onChange={ value => setAttributes( { itemTextColor: value } ) }
						/>
						<RangeControl
							label="Item Text Size"
							value={ attributes.textSize }
							onChange={ value => setAttributes( { textSize: value } ) }
							min={ 12 }
							max={ 75 }
						/>
						<div className="checkbox-container">
							<strong className="label">Text Properties:</strong>
							<CheckboxControl
								label="Underline"
								checked={ attributes.textProperties.underline }
								onChange={ () => updateTextProperties( 'underline' ) }
							/>
							<CheckboxControl
								label="Italic"
								checked={ attributes.textProperties.italic }
								onChange={ () => updateTextProperties( 'italic' ) }
							/>
							<CheckboxControl
								label="Bold"
								checked={ attributes.textProperties.bold }
								onChange={ () => updateTextProperties( 'bold' ) }
							/>
						</div>
					</PanelBody>
					<PanelBody title="Item Link" initialOpen={ false }>
						<ToggleControl
							label={ !! attributes.includePostLink ? __( 'Link Included' ) : __( 'Link Not Included' ) }
							help={ !! attributes.includePostLink ? __( 'Will add a link to the post item at the bottom' ) : __( 'Will not add a link' ) }
							checked={ !! attributes.includePostLink }
							onChange={ () => setAttributes( { includePostLink: ! attributes.includePostLink } ) }
						/>
						{
							!! attributes.includePostLink && (
								<div>
									<TextControl
										label="Post Link Text"
										value={ attributes.postLinkText }
										onChange={ value => setAttributes( { postLinkText: value } ) }
									/>
									<SelectControl
										label="Link Source"
										value={ attributes.linkSource }
										options={ [
											{ label: 'Post Link', value: 'post' },
											{ label: 'Custom Field', value: 'field' },
										] }
										onChange={ linkSource => setAttributes( { linkSource } ) }
									/>
									{
										attributes.linkSource === 'field' && (
											<TextControl
												label="Link Source Field"
												value={ attributes.linkSourceField }
												onChange={ linkSourceField => setAttributes( { linkSourceField } ) }
											/>
										)
									}
									<strong className="label">Link Text Color:</strong>
									<ColorPalette
										value={ attributes.linkTextColor }
										onChange={ value => setAttributes( { linkTextColor: value } ) }
									/>
									<div className="checkbox-container">
										<strong className="label">Link Properties:</strong>
										<CheckboxControl
											label="Underline"
											checked={ attributes.linkProperties.underline }
											onChange={ () => updateLinkProperties( 'underline' ) }
										/>
										<CheckboxControl
											label="Italic"
											checked={ attributes.linkProperties.italic }
											onChange={ () => updateLinkProperties( 'italic' ) }
										/>
										<CheckboxControl
											label="Bold"
											checked={ attributes.linkProperties.bold }
											onChange={ () => updateLinkProperties( 'bold' ) }
										/>
										<CheckboxControl
											label="Arrow"
											checked={ attributes.linkProperties.arrow }
											onChange={ () => updateLinkProperties( 'arrow' ) }
										/>
									</div>
								</div>
							)
						}
					</PanelBody>
					<PanelBody title="Item Image" initialOpen={ false }>
						<ToggleControl
							label={ !! attributes.includeImage ? __( 'Image Included' ) : __( 'Image Not Included' ) }
							help={ !! attributes.includeImage ? __( 'Will attempt to find an image for the associated post and display it' ) : __( 'Will not display an image' ) }
							checked={ !! attributes.includeImage }
							onChange={ () => setAttributes( { includeImage: ! attributes.includeImage } ) }
						/>
						{
							!! attributes.includeImage && (
								<div>
									<ToggleControl
										label={ !! attributes.imageIsClickable ? __( 'Image is clickable' ) : __( 'Image is not clickable' ) }
										checked={ !! attributes.imageIsClickable }
										onChange={ () => setAttributes( { imageIsClickable: ! attributes.imageIsClickable } ) }
									/>
									<ToggleControl
										label={ !! attributes.includeOverlay ? __( 'Image overlay included' ) : __( 'Image overlay not included' ) }
										checked={ !! attributes.includeOverlay }
										onChange={ () => setAttributes( { includeOverlay: ! attributes.includeOverlay } ) }
									/>
									<SelectControl
										label="Image Style"
										value={ attributes.imageStyle }
										options={ [
											{ label: 'Full Bleed', value: 'full-bleed' },
											{ label: 'Content Width', value: 'content-width' },
										] }
										onChange={ value => setAttributes( { imageStyle: value } ) }
									/>
									<ToggleControl
										label={ !! attributes.equalizeImages ? __( 'Images equal height' ) : __( 'Images default height' ) }
										help={ !! attributes.includeImage ? __( 'Will force all images to be equal height, risking image content on sides being lost' ) : __( 'Will use native image height' ) }
										checked={ !! attributes.equalizeImages }
										onChange={ () => setAttributes( { equalizeImages: ! attributes.equalizeImages } ) }
									/>
									<MediaUpload
										onSelect={ value => setAttributes( { placeholderImageUrl: value.sizes.full.url } ) }
										type="image"
										value={ attributes.placeholderImageUrl }
										render={ ( { open } ) => (
											<Button onClick={ open } className="button button-large interfolio-block-full-width-button">
												Select Placeholder Image
											</Button>
										) }
									/>
								</div>
							)
						}
					</PanelBody>
				</InspectorControls>,
				<div key="edit-block">
					{
						! attributes.hasErrors && (
							<div className={ className + ' container' }>
								{
									attributes.exposeControlsToUser && (
										<div className="categories-row">
											{
												attributes.categories.map( ( cat, index ) => {
													if ( index !== attributes.categories.length - 1 ) {
														return (
															<div key={ index }>
																<span>{ cat.name }</span>|
															</div>
														);
													}
													return (
														<div key={ index }>
															<span>{ cat.name }</span>
														</div>
													);
												} )
											}
										</div>
									)
								}

								<div className="results-container">
									{ generateSampleResults() }
								</div>
								{
									!! attributes.paginateResults && !! attributes.allowUserToPaginate && (
										<div className="pagination-controls-container">
											{ getPaginationControls() }
										</div>
									)
								}
							</div>
						)
					}
					{
						!! attributes.hasErrors && (
							<div>
								<span>{ attributes.errorMessage }</span>
							</div>
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
