import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {closeRootModal, create} from 'actions';
import {isRootModalVisible, getData} from 'selectors';

import Root from './root';

const mapStateToProps = (state) => ({
    visible: isRootModalVisible(state),
    data: getData(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    close: closeRootModal,
    submit: create,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Root);
