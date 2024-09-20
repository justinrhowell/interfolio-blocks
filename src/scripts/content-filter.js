( function( $ ) {
	let initialLoad = 0;
	$( window ).load( () => intializeContentFilters() );
	$(window).load(() => initializerStart() );
	$( '.category-select-mobile' ).change( ( e ) => {
		const id = $( e.target ).closest( '.interfolio-content-filter-block' ).data( 'id' );
		fetchResults( id );
	} );
	$( '.pagination-next-container' ).on( 'click', '.next-button', ( e ) => handleNextPage( e ) );
	$( '.pagination-previous-container' ).on( 'click', '.previous-button', ( e ) => handlePreviousPage( e ) );

	$( '.desktop-category-select' ).click( ( e ) => {
		const catID = $( e.target ).data( 'category' );
		$( '.category-select-mobile' ).val( catID ).change();
	} );

	function intializeContentFilters() {
		$( '.interfolio-content-filter-block' ).each( function() {
			const id = $( this ).data( 'id' );
			fetchResults( id );
		} );
	}

	async function fetchResults( containerId, categoryId = null, offset = 0 ) {
		resetContainer( containerId );
		const meta = window[ 'blockmeta_' + containerId ];
		const atts = meta.atts;
		console.log('test', initialLoad);

		if (initialLoad == 0) {
			let currentUrl = $(location).attr('href');
			if (currentUrl.search('/resources/') != -1 || currentUrl.search('/news-and-events/') != -1) {
				if (currentUrl.search('category=blog') != -1) {
					initialLoad++;
					categoryId = '49';
				}else if (currentUrl.search('category=case-studies') != -1) {
					initialLoad++;
					categoryId = '19';
				}else if (currentUrl.search('category=research') != -1) {
					initialLoad++;
					categoryId = '20';
				}else if (currentUrl.search('category=events') != -1) {
					initialLoad++;
					categoryId = '4545';
				}else if (currentUrl.search('category=press') != -1) {
					initialLoad++;
					categoryId = '4546';
				}else if (currentUrl.search('category=webinars') != -1) {
					initialLoad++;
					categoryId = '4541';
				}
			} 
		}

		if ( ! categoryId ) {
			if ( atts.exposeControlsToUser ) {
				categoryId = $( '.category-select-mobile' ).val();
			} else {
				categoryId = atts.filteredCategory ? atts.filteredCategory : 'all';
			}
		}
		if ( atts.hasErrors ) {
			giveErrorMessage( atts.errorMessage );
		}
		let url = `/wp-json/wp/v2/${ atts.contentType }`;
		const params = [
			'tax=' + atts.taxonomy,
			...( categoryId && categoryId !== 'all' ? [ `${ atts.taxonomy }=${ categoryId }` ] : [] ),
			...( atts.paginateResults && atts.paginateAmount ? [ `per_page=${ atts.paginateAmount }` ] : atts.paginateResults ? [ 'per_page=3' ] : [ 'per_page=100' ] ),
			...( offset ? [ `offset=${ offset }` ] : [] ),
			...( atts.featuredPosts ? [ 'get_featured' ] : [] ),
		];

		params.map( ( param, index ) => {
			const first = index === 0 ? '?' : '&';
			url += first + param;
		} );
		console.log( url );
		const req = await fetch( url );
		if ( req.ok ) {
			meta.totalResults = parseFloat( req.headers.get( 'X-WP-Total' ) );
			const results = await req.json();
			if ( ! results || results.length === 0 ) {
				giveErrorMessage( containerId, 'We did not find any results, please try again!' );
			} else {
				handleResults( containerId, results, offset );
			}
			updateActiveCategory( containerId, categoryId );
		} else {
			giveErrorMessage( containerId, 'Sorry! We could not complete that request!' );
		}
	}

	function resetContainer( containerId ) {
		const container = $( '.container-' + containerId );
		const resultsContainer = container.find( '.results-container' );
		const errorMessageContainer = container.find( '.error-message-container' );
		resultsContainer.show();
		errorMessageContainer.hide();

		resultsContainer.height( resultsContainer.height() );
		resultsContainer.html( '<span>Loading...</span>' );

		errorMessageContainer.height( resultsContainer.height() );
		errorMessageContainer.text( '' );
	}

	function giveErrorMessage( containerId, message ) {
		const container = $( '.container-' + containerId );
		const resultsContainer = container.find( '.results-container' );
		const errorMessageContainer = container.find( '.error-message-container' );
		const paginationContainer = container.find( '.pagination-controls-container' );
		resultsContainer.hide();
		errorMessageContainer.show();

		paginationContainer.height( paginationContainer.height() );
		paginationContainer.find( '.pagination-previous-container' ).html( '' );
		paginationContainer.find( '.pagination-next-container' ).html( '' );

		errorMessageContainer.text( message );
	}

	function handleNextPage( e ) {
		const currentOffset = $( e.target ).data( 'offset' );
		const containerId = $( e.target ).closest( '.interfolio-content-filter-block' ).data( 'id' );
		const meta = window[ 'blockmeta_' + containerId ];
		const atts = meta.atts;
		const newOffset = atts.paginateAmount ? currentOffset + parseInt( atts.paginateAmount ) : currentOffset + 3;
		fetchResults( containerId, null, newOffset );
	}

	function handlePreviousPage( e ) {
		const currentOffset = $( e.target ).data( 'offset' );
		const containerId = $( e.target ).closest( '.interfolio-content-filter-block' ).data( 'id' );
		const meta = window[ 'blockmeta_' + containerId ];
		const atts = meta.atts;
		let newOffset = atts.paginateAmount ? currentOffset - parseInt( atts.paginateAmount ) : currentOffset - 3;
		newOffset = newOffset < 0 ? 0 : newOffset;
		fetchResults( containerId, null, newOffset );
	}

	function handleResults( containerId, results, offset ) {
		const container = $( '.container-' + containerId );
		const resultsContainer = container.find( '.results-container' );
		const meta = window[ 'blockmeta_' + containerId ];
		const atts = meta.atts;

		resultsContainer.height( 'auto' );

		let html = '';

		let containerStyles = '';
		containerStyles += atts.itemsPerRow ? `--col-width:${ 100 / atts.itemsPerRow }%;` : '--col-width:100%;';
		containerStyles += atts.gutterSize ? `padding:${ atts.gutterSize }px;` : 'padding: 5px;';

		let featuredContainerStyles = '--col-width:100%;';
		featuredContainerStyles += atts.gutterSize ? `padding:${ atts.gutterSize }px;` : 'padding: 5px;';

		let itemStyles = '';
		itemStyles += atts.itemBackgroundColor ? `background-color:${ atts.itemBackgroundColor };` : '';
		itemStyles += atts.itemPadding ? `padding:${ atts.itemPadding }px;` : '';
		itemStyles += atts.alignment ? `text-align:${ atts.alignment };` : '';

		let textStyles = '';
		textStyles += atts.itemTextColor ? `color:${ atts.itemTextColor };` : 'color: #000;';
		textStyles += atts.textSize ? `font-size: ${ atts.textSize }px;` : 'font-size: 24px;';
		textStyles += atts.textProperties && atts.textProperties.underline ? 'text-decoration: underline;' : '';
		textStyles += atts.textProperties && atts.textProperties.bold ? 'font-family:Gotham Bold;' : '';
		textStyles += atts.textProperties && atts.textProperties.italic ? 'font-style: italic;' : '';

		let featuredTextStyles = '';
		featuredTextStyles += atts.itemTextColor ? `color:${ atts.itemTextColor };` : 'color: #000;';
		featuredTextStyles += atts.textSize ? `font-size: ${ atts.textSize * 1.5 }px;` : 'font-size: 36px;';
		featuredTextStyles += atts.textProperties && atts.textProperties.underline ? 'text-decoration: underline;' : '';
		featuredTextStyles += atts.textProperties && atts.textProperties.bold ? 'font-family:Gotham Bold;' : '';
		featuredTextStyles += atts.textProperties && atts.textProperties.italic ? 'font-style: italic;' : '';

		let linkStyles = '';
		linkStyles += atts.linkTextColor ? `color:${ atts.linkTextColor };` : 'color: #000;';
		linkStyles += atts.linkProperties && atts.linkProperties.underline ? 'text-decoration: underline;' : '';
		linkStyles += atts.linkProperties && atts.linkProperties.bold ? 'font-family:Gotham Bold;' : '';
		linkStyles += atts.linkProperties && atts.linkProperties.italic ? 'font-style: italic;' : '';

		let buttonStyles = '';
		buttonStyles += atts.paginateButtonBackgroundColor ? `background-color:${ atts.paginateButtonBackgroundColor };` : 'background-color: transparent;';
		buttonStyles += atts.paginateButtonTextColor ? `color:${ atts.paginateButtonTextColor };` : 'color: #000;';
		buttonStyles += atts.paginateButtonTextSize ? `font-size:${ atts.paginateButtonTextSize }px;` : 'font-size:16px;';

		const imageStyles = atts.imageStyle === 'full-bleed' && atts.itemPadding ? `margin: -${ atts.itemPadding }px -${ atts.itemPadding }px 0` : 'margin:0;';
		const linkText = atts.postLinkText ? atts.postLinkText : 'Learn More';

		results.forEach( ( result ) => {
			let link = result.link;

			if ( atts.linkSource && atts.linkSource === 'field' && atts.linkSourceField ) {
				link = result.custom_fields[ atts.linkSourceField ];
			}

			if ( result.custom_fields && result.custom_fields.is_featured && atts.featuredPosts ) {
				html += `<div class="content-filter-result-container featured-result" style="${ featuredContainerStyles }">`;
			} else {
				html += `<div class="content-filter-result-container" style="${ containerStyles }">`;
			}
			html += `<div class="content-filter-result-item" style="${ itemStyles }">`;

			if ( atts.includeImage ) {
				const imgSrc = result.fimg_url ? result.fimg_url : atts.placeholderImageUrl;
				const equalizeClass = atts.equalizeImages ? 'equalize' : '';
				html += `<div class="result-item-image-container" style="${ imageStyles }">`;
				html += atts.imageIsClickable ? `<a href="${ link }" >` : '';
				html += atts.includeOverlay ? '<div class="image-overlay">' : '';
				html += atts.includeOverlay && result.term ? `<span class="type-label">${ result.term }</span>` : '';
				html += atts.includeOverlay ? '</div>' : '';
				html += `<img class="result-item-image ${ equalizeClass }" src="${ imgSrc }" />`;
				html += atts.imageIsClickable ? '</a>' : '';
				html += '</div>';
			}
			html += '<div class="result-item-text-container">';

			html += atts.titleIsClickable ? `<a href="${ link }" >` : '';
			if ( result.custom_fields && result.custom_fields.is_featured && atts.featuredPosts ) {
				html += `<span class="result-item-title" style="${ featuredTextStyles }">${ result.title.rendered }</span>`;
			} else {
				html += `<span class="result-item-title" style="${ textStyles }">${ result.title.rendered }</span>`;
			}
			html += atts.titleIsClickable ? '</a>' : '';

			if ( atts.includeCustomFields ) {
				html += '<div class="custom-fields">';
				const fields = result.custom_fields;
				let fieldsToInclude = atts.fieldsToInclude ? atts.fieldsToInclude : '';
				fieldsToInclude = fieldsToInclude.split( ',' );
				fieldsToInclude.map( ( field ) => {
					html += `<p class="custom-field">${ fields[ field ] }</p>`;
				} );
				html += '</div>';
			}
			if ( atts.includeExcerpt ) {
				html += '<div class="excerpt">';
				html += result.excerpt ? result.excerpt : '';
				html += '</div>';
			}
			if ( atts.includePostLink ) {
				html += '<div class="result-item-link-container">';
				html += `<a href="${ link }" style="${ linkStyles }">${ linkText }`;
				html += atts.linkProperties && atts.linkProperties.arrow ? '<i style="margin-left:5px;" class="fal fa-arrow-right"></i>' : '';
				html += '</a>';
				html += '</div>';
			}
			html += '</div>';
			html += '</div>';
			html += '</div>';
		} );

		resultsContainer.html( html );

		if ( atts.paginateResults && atts.allowUserToPaginate ) {
			const paginationContainer = container.find( '.pagination-controls-container' );
			paginationContainer.height( 'auto' );
			const paginateAmount = atts.paginateAmount ? atts.paginateAmount : 3;
			if ( offset === 0 && parseInt( paginateAmount ) >= meta.totalResults ) {
				paginationContainer.find( '.pagination-previous-container' ).html( '' );
				paginationContainer.find( '.pagination-next-container' ).html( '' );
			} else if ( offset === 0 ) {
				paginationContainer.find( '.pagination-previous-container' ).html( '' );
				paginationContainer.find( '.pagination-next-container' ).html(
					`<button style="${ buttonStyles }"class="next-button" data-offset="${ offset }">Next</button>`
				);
			} else if ( offset + parseInt( paginateAmount ) >= meta.totalResults ) {
				paginationContainer.find( '.pagination-previous-container' ).html(
					`<button style="${ buttonStyles }"class="previous-button" data-offset="${ offset }">Previous</button>`
				);
				paginationContainer.find( '.pagination-next-container' ).html( '' );
			} else {
				paginationContainer.find( '.pagination-previous-container' ).html(
					`<button style="${ buttonStyles }"class="previous-button" data-offset="${ offset }">Previous</button>`
				);
				paginationContainer.find( '.pagination-next-container' ).html(
					`<button style="${ buttonStyles }"class="next-button" data-offset="${ offset }">Next</button>`
				);
			}
		}
	}

	function updateActiveCategory( containerId, catID ) {
		$( '.container-' + containerId + ' .desktop-category-select' ).each( function() {
			$( this ).removeClass( 'active' );
			if ( catID === $( this ).data( 'category' ) || $( this ).data( 'category' ) === parseInt( catID ) ) {
				$( this ).addClass( 'active' );
			}
		} );
	}
}( jQuery ) );
