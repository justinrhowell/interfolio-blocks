( function( $ ) {
	$( '.interfolio-testimonial-slider-block' ).each( function() {
		const slider = $( this );
		const quote = $( this ).find( '.interfolio-testimonial-slider' ).find( '.wp-block-quote' );
		quote.first().css( 'display', 'block' );
		quote.first().css( 'visibility', 'hidden' );

		quote.each( function() {
			const dot = $( '<span class="dot"></span>' );
			$( slider ).find( '.dot-container' ).append( dot );
		} );

		const dots = $( slider ).find( '.dot' ).each( function() {
			$( this ).toArray();
		} );

		$( slider ).find( '.dot' ).first().addClass( 'active' );

		$( slider ).find( '.dot' ).each( function( dotIndex ) {
			$( this ).click( function() {
				makeActive( dotIndex );
			} );
		} );

		function makeActive( index ) {
			changeSlide( index );
			$( dots[ index ] ).addClass( 'active' );
		}

		let slideTimer = setInterval( slideTransition, 5000 );

		function changeSlide( dotIndex ) {
			clearInterval( slideTimer );
			slideTimer = setInterval( slideTransition, 5000 );
			$( slider ).find( '.dot' ).each( function() {
				$( this ).removeClass( 'active' );
			} );
			quote.each( function( index ) {
				if ( index === dotIndex ) {
					$( this ).css( 'display', 'block' );
				} else {
					$( this ).css( 'display', 'none' );
				}
			} );
			fontScaling();
		}

		function slideTransition() {
			for ( let i = 0; i < dots.length; i++ ) {
				if ( dots[ i ].classList.contains( 'active' ) ) {
					if ( i !== dots.length - 1 ) {
						makeActive( i + 1 );
						return;
					}
					makeActive( 0 );
					return;
				}
			}
		}

		function fontScaling() {
			$( slider ).find( '.wp-block-quote' ).each( function() {
				if ( $( this ).height() > $( slider ).find( '.interfolio-testimonial-slider' ).height() ) {
					const quoteHeight = $( this ).height();
					const containerHeight = $( '.interfolio-testimonial-slider' ).height();
					const fontSize = $( this ).find( 'p' ).css( 'font-size' );
					const sizeRatio = containerHeight / quoteHeight;
					const scaledFont = parseInt( fontSize ) * sizeRatio;
					const scaledQuote = 1.2*scaledFont;
					const scaledAuthor = .6*scaledFont;

					$( this ).find( 'p' ).css( 'font-size', scaledQuote + 'px' );
					$( this ).find('cite').css('font-size', scaledAuthor + 'px');
				}
			} );
		}

		$( window ).resize( function() {
			$( '.wp-block-quote' ).each( function() {
				$( this ).find( 'p' ).css( 'font-size', '2em' );
			} );
			fontScaling();
		} );

		$( window ).load( function() {
			fontScaling();
			quote.first().css( 'visibility', 'visible' );
		} );
	} );
}( jQuery ) );
