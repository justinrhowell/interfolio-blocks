import './_editor.scss';
import './_style.scss';

const { __ } = wp.i18n;
const { MediaUpload, InspectorControls, ColorPalette, InnerBlocks } = wp.blockEditor;
const { SelectControl, ToggleControl } = wp.components;
const { registerBlockType } = wp.blocks;
const { Button } = wp.components;

registerBlockType( 'interfolio/block-interfolio-header', {
	title: __( 'Interfolio Header' ),
	icon: 'layout',
	category: 'common',
	supports: {
		align: true,
	},
	attributes: {
		backgroundUrl: {
			type: 'string',
			default: null,
		},
		backgroundType: {
			type: 'string',
			default: '',
		},
		fallbackUrl: {
			type: 'string',
			default: null,
		},
		size: {
			type: 'string',
			default: 'medium',
		},
		overlayColor: {
			type: 'string',
			default: '#4791C5',
		},
		overlayOpacity: {
			type: 'string',
			default: '0.3',
		},
		textColor: {
			type: 'string',
			default: '#FFFFFF',
		},
		textAlignment: {
			type: 'string',
			default: 'center',
		},
		autoplay: {
			type: 'boolean',
			default: false,
		},
		fallbackPreview: {
			type: 'boolean',
			default: false,
		},
	},
	keywords: [
		__( 'interfolio' ),
		__( 'header' ),
		__( 'hero' ),
	],

	edit: ( { attributes, className, setAttributes } ) => {
		const containerStyle = {
			backgroundImage: 'url(' + (attributes.backgroundUrl) + ')',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
		};

		const fallbackStyle = {
			backgroundImage: 'url(' + (attributes.fallbackUrl) + ')',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
		};

		const overlayStyle = {
			backgroundColor: attributes.overlayColor,
			opacity: attributes.overlayOpacity,
		};

		const clearBackground = () => {
			setAttributes( {
				backgroundUrl: '',
				backgroundType: '',
			});
		};

		const clearFallback = () => {
			setAttributes({
				fallbackUrl: '',
			});
		};

		const toggleVideo = () => {
			if ( attributes.backgroundType === 'video' ) {
				const vid = document.getElementById( 'preview-video' );
				if ( isVideoPlaying( vid ) ) {
					vid.pause();
				} else {
					vid.play();
				}
			}
		};

		const isVideoPlaying = video => !! ( video.currentTime > 0 && ! video.paused && ! video.ended && video.readyState > 2 );

		const updateBackground = ( value ) => {
			if ( value.type === 'video' ) {
				setAttributes( {
					backgroundUrl: value.url,
					backgroundType: 'video',
				} );
			} else if ( value.type === 'image')  {
				setAttributes( {
					backgroundUrl: value.sizes.full.url,
					backgroundType: 'image',
				} );
			}
		};

		const updateFallback = ( value ) => {
			setAttributes( {
				fallbackUrl: value.sizes.full.url,
			} );
		};

		const preview = () => {
			if( attributes.fallbackPreview == true ) {
				return (
					<div key="1" className={ className + ' ' + attributes.size + ' ' + attributes.backgroundType + ' container' } style={ fallbackStyle }>
						<div className="overlay" style={ overlayStyle }></div>
						<div className="content-container">
							<InnerBlocks />
						</div>
					</div>
				);
			}
			if( attributes.backgroundType === 'video' ) {
				return (
					<div key="1" className={ className + ' ' + attributes.size + ' ' + attributes.backgroundType + ' container' }>
						<video id="preview-video" className="preview-video" muted loop autoPlay={ attributes.autoplay }>
							<source src={ attributes.backgroundUrl } type="video/mp4" />
						</video>
						<div className="overlay" style={ overlayStyle }></div>
						<div className="content-container">
							<InnerBlocks />
						</div>
					</div>
				);
			}

			return (
				<div key="1" className={ className + ' ' + attributes.size + ' ' + attributes.backgroundType + ' container' } style={ containerStyle }>
					<div className="overlay" style={ overlayStyle }></div>
					<div className="content-container">
						<InnerBlocks />
					</div>
				</div>
			);
		};

		return (
			[
				<InspectorControls key="0">
					<div className={ className + '-option-container' }>
						<SelectControl
							label="Size"
							value={ attributes.size }
							options={[
								{ label: 'Full Height', value: 'full' },
								{ label: 'Large', value: 'large' },
								{ label: 'Medium', value: 'medium' },
								{ label: 'Small', value: 'small' },
							]}
							onChange={ size => setAttributes({ size }) }
						/>
					</div>
					<div className={ className + '-option-container' }>
						<strong className="label">Select an overlay color:</strong>
						<ColorPalette
							value={ attributes.overlayColor }
							onChange={value => setAttributes({ overlayColor: value })}
						/>
					</div>
					<div className={ className + '-option-container' }>
						<SelectControl
							label="Overlay Opacity"
							value={ attributes.overlayOpacity }
							options={[
								{ label: '100%', value: '1.0' },
								{ label: '90%', value: '0.9' },
								{ label: '80%', value: '0.8' },
								{ label: '70%', value: '0.7' },
								{ label: '60%', value: '0.6' },
								{ label: '50%', value: '0.5' },
								{ label: '40%', value: '0.4' },
								{ label: '30%', value: '0.3' },
								{ label: '20%', value: '0.2' },
								{ label: '10%', value: '0.1' },
								{ label: '0%', value: '0' },
							]}
							onChange={ overlayOpacity => setAttributes({ overlayOpacity }) }
						/>
					</div>
					<div className={ className + '-option-container' }>
						<strong className="label">Select a background:</strong>
						<MediaUpload
							onSelect={ updateBackground }
							type="image"
							value={ attributes.backgroundUrl }
							render={({ open }) => (
								<Button onClick={ open } className="button button-large interfolio-block-full-width-button">
									Select Background
								</Button>
							)}
						/>
						<Button className="button button-large interfolio-block-full-width-button" onClick={ clearBackground }>
							Clear Background
						</Button>
					</div>
					<div className={ className + '-option-container' }>
						<strong className="label">Video Controls:</strong>
						<Button className="button button-large interfolio-block-full-width-button" onClick={ toggleVideo }>
							Play/Pause Video
						</Button>
						<ToggleControl
							className="interfolio-block-toggle"
							label="Autoplay"
							help={ attributes.autoplay ? 'Will autoplay.' : 'Will not autoplay.' }
							checked={ attributes.autoplay }
							onChange={ autoplay => setAttributes({ autoplay }) }
						/>
						{
							attributes.backgroundType == 'video' && (
								<div>
									<strong className="label">Select a fallback background image:</strong>
									<MediaUpload
										onSelect={updateFallback}
										type="image"
										value={attributes.FallbackUrl}
										render={({ open }) => (
											<Button onClick={open} className="button button-large interfolio-block-full-width-button">
												Select Fallback Background Image
											</Button>
										)}
									/>
									<Button className="button button-large interfolio-block-full-width-button" onClick={clearFallback}>
										Clear Fallback Background Image
        							</Button>
									<ToggleControl
										className="interfolio-block-toggle"
										label="Preview Fallback"
										help={attributes.fallbackPreview ? 'Preview With Fallback.' : 'Preview Without Fallback.'}
										checked={attributes.fallbackPreview}
										onChange={fallbackPreview => setAttributes({ fallbackPreview })}
									/>
								</div>
							)
						}
					</div>
				</InspectorControls>,
				preview(),
			]
		);
	},

	save: function () {
		return <InnerBlocks.Content />;
	},
});
