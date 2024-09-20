( function( $ ) {
	$( window ).load( equalizeHeight );
	$( window ).on( 'resize', equalizeHeight );

	function equalizeHeight() {
		const cardGrid = $( '.card-grid.equalize-height' );
		$( '.interfolio-card-block-wrapper', cardGrid ).height( 'auto' );
		if ( window.innerWidth >= 768 ) {
			let height = 0;
			$( '.interfolio-card-block-wrapper', cardGrid ).each( function() {
				if ( $( this ).height() > height ) {
					height = $( this ).height();
				}
			} );

			$( '.interfolio-card-block-wrapper', cardGrid ).height( height );
		}
	}
}( jQuery ) );
