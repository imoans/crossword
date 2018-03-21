// @flow

import { connect } from 'react-redux'
import Start from '../components/start'
import { withRouter } from 'react-router-dom'

const mapStateToProps = ({ domain }) => ({ domain })
const mapDispatchToProps = (dispatch: any) => ({ dispatch })

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Start))
