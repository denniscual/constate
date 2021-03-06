import React from "react";
import PropTypes from "prop-types";
import Context from "./Context";
import { mapStateToActions, mapStateToSelectors } from "./utils";

class ConsumerChild extends React.Component {
  static propTypes = {
    initialState: PropTypes.object,
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
    actions: PropTypes.objectOf(PropTypes.func),
    selectors: PropTypes.objectOf(PropTypes.func),
    children: PropTypes.func.isRequired,
    context: PropTypes.string
  };

  constructor(props) {
    super(props);
    const { context, initialState, setState } = this.props;
    setState(state => ({
      [context]: { ...initialState, ...state[context] }
    }));
  }

  render() {
    const { setState, state, context, children } = this.props;

    const actions =
      this.props.actions &&
      mapStateToActions(
        fn =>
          setState(s => ({
            [context]: { ...s[context], ...fn(s[context]) }
          })),
        this.props.actions
      );

    const selectors =
      this.props.selectors &&
      mapStateToSelectors(state[context] || {}, this.props.selectors);

    return children({
      ...state[context],
      ...actions,
      ...selectors
    });
  }
}

const Consumer = props => (
  <Context.Consumer>
    {context => <ConsumerChild {...context} {...props} />}
  </Context.Consumer>
);

export default Consumer;
