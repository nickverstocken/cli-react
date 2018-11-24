const main = `
class :className extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className=":className">
    
      </div>
    )
  }
}
:className.propTypes = {
}
`

const functional = `
const :className = () => {
  return (
    <div className=":className">
    </div>
  )
}
:className.propTypes = {
}
`

const imports = {
  react: "import React, {Component} from 'react';",
  propTypes: "import PropTypes from 'prop-types';",
stylesheet: "import './:className.scss';",
  observable: "import { inject, observer } from 'mobx-react';",
  connect: "import {connect} from 'react-redux';"
}

const exported = {
  default: "export default :className;",
  observable: "export default (observer(:className));",
  connectDispatch: "export default connect(null, mapDispatchToProps)(:className);",
  connectStateAndDispatch: "export default connect(mapStateToProps, mapDispatchToProps)(:className);"
}

const mapStateToProps = `
function mapStateToProps(state, ownProps) { 
  return {};
};
`

const mapDispatchToProps = `
function mapDispatchToProps(dispatch) {  
  return {};
}
`

module.exports = {
  main: main,
  imports: imports,
  exported: exported,
  functional: functional
}
