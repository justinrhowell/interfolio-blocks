const toggleButton = jQuery( '#video-toggle-button' );

toggleButton.on( 'click', toggleVideo );

function toggleVideo() {
	const vid = jQuery( '#interfolio-block-header-video' ).get( 0 );
	if ( isVideoPlaying( vid ) ) {
		vid.pause();
	} else {
		vid.play();
	}
	toggleIcon();
}

function toggleIcon() {
	const icon = toggleButton.find( '.fal' );
	if ( icon.hasClass( 'fa-play' ) ) {
		icon.removeClass( 'fa-play' );
		icon.addClass( 'fa-pause' );
	} else {
		icon.removeClass( 'fa-pause' );
		icon.addClass( 'fa-play' );
	}
}

const isVideoPlaying = video => !! ( video.currentTime > 0 && ! video.paused && ! video.ended && video.readyState > 2 );
