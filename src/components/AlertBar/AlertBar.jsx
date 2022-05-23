import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';

import './SnackBar.scss';

class AlertBar extends PureComponent {
  closeTimer = null;

  static propTypes = {
    type: PropTypes.oneOf(['error', 'info', 'done']).isRequired,
    className: PropTypes.string,
    messages: PropTypes.array.isRequired,
    autoHideDuration: PropTypes.number,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    onClose: undefined,
    autoHideDuration: 5000,
  };

  state = {
    isOpen: false,
  };

  componentDidMount() {
    const {autoHideDuration} = this.props;

    // надо для анимации
    setTimeout(() => {
      this.setState({isOpen: true}); // eslint-disable-line react/no-did-mount-set-state
    }, 100);

    if (autoHideDuration > 0) {
      this.closeTimer = setTimeout(() => this.handleClose(), autoHideDuration);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.closeTimer);
  }


  handleClose = () => {
    this.setState({isOpen: false});

    if (this.props.onClose) {
      // надо для анимации
      this.closeTimer = setTimeout(() => this.props.onClose(), 300);
    }
  };

  render() {
    const {messages, type, className} = this.props;

    return messages.map((item, key) => {
      return <React.Fragment key={key}>
        <Alert severity={type}>{item}</Alert>
      </React.Fragment>
    });
  }
}

export default AlertBar;
