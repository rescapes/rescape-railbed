import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Carousel, {Modal, ModalGateway} from 'react-images';

import DownloadButton from './DownloadButton';
import * as settingsActions from '../actions/settings';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {forceDownload} from '../utils/fileHelpers';

class Gallery extends Component {
  constructor() {
    super();

    this.state = {
      lightboxIsOpen: false,
      currentImage: 0
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
        lightboxIsOpen: false
      });
    }
  }

  openLightbox(index, event) {
    event.preventDefault();
    this.setState({
      currentImage: index,
      lightboxIsOpen: true
    });
    this.props.setLightboxVisibility(true);
  }

  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    });
    this.props.setLightboxVisibility(false);
  }

  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  }

  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  }

  handleClickImage() {
    if (this.state.currentImage === this.props.images.length - 1) return;

    this.gotoNext();
  }

  /***
   * The thumbnail view of the images.
   * Hovering enlarges the image. Clicking creates the lightbox
   * @returns {XML}
   */
  renderGallery() {
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
    // Use the largest image from the srcset
    const src = this.props.images[this.state.currentImage].srcset[0].split(' ')[0];
    forceDownload(document, src);
  }

  state = {modalIsOpen: false};
  toggleModal = () => {
    this.setState(state => ({modalIsOpen: !state.modalIsOpen}));
  };
  renderImageCredits () {

    const {
      currentImage,
      images,
    } = this.props;

    if (!images || !images.length) return null;

    const image = images[currentImage];

    const dates = (image.date || '').split(';').map((date, i) => date ?
      <div key={i}>{date}</div> :
      <span key={i} />)

    const sourceUrls = image.sourceUrl ? image.sourceUrl.split(',') : []
    const credits = image.credit ? image.credit.split(',') : []
    const links = sourceUrls.map((sourceUrl, i) =>
      <a key={credits[i]} target="rescape_source" href={sourceUrls[i]}>{credits[i]}</a>)
    const title = links.length > 1 ? 'Sources:' : 'Source:'
    return <div ref='wrapper' className='footer-wrapper'>
      {ret}
      <span className={`image-credit ${this.props.force ? 'force-open' : ''} ${image.date ? 'date' : ''}`}>
                <i>{title} </i>
        {this.intersperse(links, ' and ')}
        <span className='image-date'>{this.intersperse(dates, ' and ')}</span>
            </span>
    </div>
  }
  render() {
    const {modalIsOpen} = this.state;

    let customControls = [
      <DownloadButton key="Download" handler={this.handleDownload.bind(this)}/>
    ]

    return (
      <div className="section">
      <ModalGateway>
        {modalIsOpen ? (
          <Modal onClose={this.toggleModal}>
            <Carousel
              views={this.props.images}
              isModal={this.props.force != false && (this.props.force == true || this.state.lightboxIsOpen)}
              currentIndex={(this.props.images || []).indexOf(this.state.currentImage)}
              footer={this.renderImageCredits()}
              /*
              backdropClosesModal
              customControls={customControls}
              overlayDocumentIsShowing={this.props.overlayDocumentIsShowing}
              force={this.props.force}
              showCloseButton={!this.props.force}
              onClickPrev={this.gotoPrevious}
              onClickNext={this.gotoNext}
              onClickImage={this.handleClickImage}
              onClose={this.closeLightbox}
              theme={this.props.theme}

               */
            />
          </Modal>
        ) : null}
      </ModalGateway><
      /div>
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
  overlayDocumentIsShowing: PropTypes.bool
};

function mapStateToProps(state) {
  return {};
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the settings actions so that the child components can send the actions based on events.
 */
export default connect(
  mapStateToProps,
  Object.assign(settingsActions)
)(Gallery);
