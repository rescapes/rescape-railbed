import React, { Component, PropTypes } from 'react';
import DownloadIcon from './icon';

class DownloadButton extends Component {
    constructor () {
        super();
    }
    render () {
        return (
            <button
                title="Download"
                className="download-button"
                onClick={this.props.handler}
            >
                <span
                    dangerouslySetInnerHTML={{ __html: DownloadIcon }}
                />
            </button>
        )
    }
}

export default DownloadButton;
