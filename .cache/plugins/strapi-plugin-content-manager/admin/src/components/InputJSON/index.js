/**
 *
 * InputJSON
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import cm from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-night.css';

import { isEmpty, trimStart } from 'lodash';
import jsonlint from './jsonlint';
import Wrapper from './components';

const WAIT = 600;
const stringify = JSON.stringify;
const DEFAULT_THEME = '3024-night';

class InputJSON extends React.Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
    this.state = { error: false, markedText: null };
  }

  componentDidMount() {
    // Init codemirror component
    this.codeMirror = cm.fromTextArea(this.editor.current, {
      autoCloseBrackets: true,
      lineNumbers: true,
      matchBrackets: true,
      mode: 'application/json',
      readOnly: this.props.disabled,
      smartIndent: true,
      styleSelectedText: true,
      tabSize: 2,
      theme: DEFAULT_THEME,
      fontSize: '13px',
    });
    this.codeMirror.on('change', this.handleChange);
    this.codeMirror.on('blur', this.handleBlur);

    this.setSize();
    this.setInitValue();
  }

  componentDidUpdate(prevProps) {
    if (
      isEmpty(prevProps.value) &&
      !isEmpty(this.props.value) &&
      !this.state.hasInitValue
    ) {
      this.setInitValue();
    }
  }

  setInitValue = () => {
    const { value } = this.props;

    try {
      this.setState({ hasInitValue: true });

      if (value === null) return this.codeMirror.setValue('');

      return this.codeMirror.setValue(stringify(value, null, 2));
    } catch (err) {
      return this.setState({ error: true });
    }
  };

  setSize = () => this.codeMirror.setSize('100%', 'auto');

  getContentAtLine = line => this.codeMirror.getLine(line);

  getEditorOption = opt => this.codeMirror.getOption(opt);

  getValue = () => this.codeMirror.getValue();

  markSelection = ({ message }) => {
    let line = parseInt(message.split(':')[0].split('line ')[1], 10) - 1;
    let content = this.getContentAtLine(line);

    if (content === '{') {
      line = line + 1;
      content = this.getContentAtLine(line);
    }
    const chEnd = content.length;
    const chStart = chEnd - trimStart(content, ' ').length;
    const markedText = this.codeMirror.markText(
      { line, ch: chStart },
      { line, ch: chEnd },
      { className: 'colored' }
    );
    this.setState({ markedText });
  };

  timer = null;

  handleBlur = ({ target }) => {
    const { name, onBlur } = this.props;

    if (target === undefined) {
      // codemirror catches multiple events
      onBlur({
        target: {
          name,
          type: 'json',
          value: this.getValue(),
        },
      });
    }
  };

  handleChange = () => {
    const { hasInitValue } = this.state;
    const { name, onChange } = this.props;
    let value = this.codeMirror.getValue();

    if (value === '') {
      value = null;
    }

    // Update the parent
    onChange({
      target: {
        name,
        value,
        type: 'json',
      },
    });

    if (!hasInitValue) {
      this.setState({ hasInitValue: true });
    }

    // Remove higlight error
    if (this.state.markedText) {
      this.state.markedText.clear();
      this.setState({ markedText: null, error: null });
    }

    clearTimeout(this.timer);
    this.timer = setTimeout(
      () => this.testJSON(this.codeMirror.getValue()),
      WAIT
    );
  };

  testJSON = value => {
    try {
      jsonlint.parse(value);
    } catch (err) {
      this.markSelection(err);
    }
  };

  render() {
    if (this.state.error) {
      return <div>error json</div>;
    }

    return (
      <Wrapper>
        <textarea
          ref={this.editor}
          autoComplete="off"
          id={this.props.name}
          defaultValue=""
        />
      </Wrapper>
    );
  }
}

InputJSON.defaultProps = {
  disabled: false,
  onBlur: () => {},
  onChange: () => {},
  value: null,
};

InputJSON.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.any,
};

export default InputJSON;
