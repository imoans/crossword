// @flow

import { connect } from 'react-redux'
import Start from '../components/start'

const mapStateToProps = ({ domain }) => ({ domain })
const mapDispatchToProps = (dispatch: any) => ({ dispatch })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Start)
