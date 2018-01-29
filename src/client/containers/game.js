// @flow

import { connect } from 'react-redux'
import Game from '../components/game'

const mapStateToProps = ({ domain }) => ({ domain })
const mapDispatchToProps = (dispatch: any) => ({ dispatch })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)
