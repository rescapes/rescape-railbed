import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux'
import ExtendedLightbox from './ExtendedLightbox';
import DownloadButton from './DownloadButton';
import * as settingsActions from '../actions/settings'
import ImmutablePropTypes from 'react-immutable-proptypes'

class Gallery extends Component {
	constructor () {
		super();

		this.state = {
			lightboxIsOpen: false,
			currentImage: 0,
		};

		this.closeLightbox = this.closeLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
		this.handleClickImage = this.handleClickImage.bind(this);
		this.openLightbox = this.openLightbox.bind(this);
	}

	/***
	 * If the store has been updated to lightbox open false, reflect it in the state
	 * The store never turns the lightbox on, that is done by openLightbox or forceOpen
	 * @param nextProps
	 */
	componentWillReceiveProps(nextProps) {
		if (!nextProps.isOpen) {
			this.setState({
				currentImage: 0,
				lightboxIsOpen: false,
			})
		}
	}
	openLightbox (index, event) {
		event.preventDefault();
		this.setState({
			currentImage: index,
			lightboxIsOpen: true,
		});
		this.props.setLightboxVisibility(true)
	}
	closeLightbox () {
		this.setState({
			currentImage: 0,
			lightboxIsOpen: false,
		});
		this.props.setLightboxVisibility(false)
	}
	gotoPrevious () {
		this.setState({
			currentImage: this.state.currentImage - 1,
		});
	}
	gotoNext () {
		this.setState({
			currentImage: this.state.currentImage + 1,
		});
	}
	handleClickImage () {
		if (this.state.currentImage === this.props.images.length - 1) return;

		this.gotoNext();
	}

	/***
	 * The thumbnail view of the images.
	 * Hovering enlarges the image. Clicking creates the lightbox
	 * @returns {XML}
     */
	renderGallery () {
		if (!this.props.images) return;
		const gallery = this.props.images.map((obj, i) => {
			return (
				<a
                    className='gallery-thumbnail'
					href={obj.src}
					key={i}
					title='Click to View Gallery'
					onClick={(e) => this.openLightbox(i, e)}
					>
					<img
                        className='gallery-thumbnail-image'
						src={obj.thumbnail}
					/>
				</a>
			);
		});

		return (
			<div className='gallery'>
				{gallery}
			</div>
		);
	}
	// from http://stackoverflow.com/questions/283956/
	handleDownload() {
		var link = document.createElement('a');
		// Use the largest image from the srcset
        const src = this.props.images[this.state.currentImage].srcset[0].split(' ')[0]
		if (typeof link.download === 'string') {
			document.body.appendChild(link); //Firefox requires the link to be in the body
			link.download = ''
			link.href = src
			link.click();
			document.body.removeChild(link); //remove the link when done
		} else {
			location.replace(src);
		}
	}

	render () {
		let customControls = [
			<DownloadButton key="Download" handler={this.handleDownload.bind(this)} />,
		];
		return (
			<div className="section">
				{this.renderGallery()}
				<ExtendedLightbox
					backdropClosesModal
					currentImage={this.state.currentImage}
					customControls={customControls}
					images={this.props.images}
					isOpen={this.props.forceOpen || this.state.lightboxIsOpen}
					onClickPrev={this.gotoPrevious}
					onClickNext={this.gotoNext}
					onClickImage={this.handleClickImage}
					onClose={this.closeLightbox}
					theme={this.props.theme}
				/>
			</div>
		);
	}
};

Gallery.displayName = 'Gallery';
Gallery.propTypes = {
	media: ImmutablePropTypes.orderedMap,
	theme: PropTypes.object,
	modelKey: PropTypes.string,
	forceOpen: PropTypes.bool,
	// The current state of openness of the lightbox
	isOpen: PropTypes.bool,
};

function mapStateToProps(state) {
	return {}
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the settings actions so that the child components can send the actions based on events.
 */
export default connect(
	mapStateToProps,
	Object.assign(settingsActions)
)(Gallery)
