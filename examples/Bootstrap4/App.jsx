// @ts-check

import React from 'react';
import ReactDOM from 'react-dom';

import { FormWithConstraints, FormInput, FieldFeedbacks, Async, FieldFeedback } from 'react-form-with-constraints-bootstrap4';
import { DisplayFields } from 'react-form-with-constraints-tools';

import './index.html';
import './App.scss';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkUsernameAvailability(value) {
  console.log('checkUsernameAvailability');
  await sleep(1000);
  return !['john', 'paul', 'george', 'ringo'].includes(value.toLowerCase());
}

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  getInitialState() {
    return {
      username: '',
      password: '',
      passwordConfirm: '',
      submitButtonDisabled: false
    };
  }

  async handleChange(e) {
    const target = e.currentTarget;

    this.setState({
      [target.name]: target.value
    });

    await this.form.validateFields(target);
    this.setState({submitButtonDisabled: !this.form.isValid()});
  }

  async handlePasswordChange(e) {
    const target = e.currentTarget;

    this.setState({
      [target.name]: target.value
    });

    await this.form.validateFields(target, 'passwordConfirm');
    this.setState({submitButtonDisabled: !this.form.isValid()});
  }

  async handleSubmit(e) {
    e.preventDefault();

    await this.form.validateForm();
    const formIsValid = this.form.isValid();
    this.setState({submitButtonDisabled: !formIsValid});
    if (formIsValid) {
      alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    }
  }

  handleReset() {
    this.setState(this.getInitialState());
    this.form.reset();
  }

  render() {
    return (
      <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                           onSubmit={this.handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username <small>(already taken: john, paul, george, ringo)</small></label>
          <FormInput id="username" name="username"
                     value={this.state.username} onChange={this.handleChange}
                     required minLength={3}
                     className="form-control" />
          <FieldFeedbacks for="username">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
            <Async
              promise={checkUsernameAvailability}
              pending="..."
              then={available => available ?
                <FieldFeedback key="1" info style={{color: '#28a745'}}>Username available</FieldFeedback> :
                <FieldFeedback key="2">Username already taken, choose another</FieldFeedback>
              }
            />
            <FieldFeedback when="valid">Looks good!</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <FormInput type="password" id="password" name="password"
                     innerRef={password => this.password = password}
                     value={this.state.password} onChange={this.handlePasswordChange}
                     required pattern=".{5,}"
                     className="form-control" />
          <FieldFeedbacks for="password">
            <FieldFeedback when="valueMissing" />
            <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
            <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
            <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
            <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
            <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
            <FieldFeedback when="valid">Looks good!</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div className="form-group">
          <label htmlFor="password-confirm">Confirm Password</label>
          <FormInput type="password" id="password-confirm" name="passwordConfirm"
                     value={this.state.passwordConfirm} onChange={this.handleChange}
                     required className="form-control" />
          <FieldFeedbacks for="passwordConfirm">
            <FieldFeedback when="*" />
            <FieldFeedback when={value => value !== this.password.value}>Not the same password</FieldFeedback>
            <FieldFeedback when="valid">Looks good!</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <button disabled={this.state.submitButtonDisabled} className="btn btn-primary">Submit</button>{' '}
        <button type="button" onClick={this.handleReset} className="btn btn-secondary">Reset</button>

        <DisplayFields />
      </FormWithConstraints>
    );
  }
}

const App = () => (
  <div className="container">
    <p>
      Inspired by <a href="http://moduscreate.com/reactjs-form-validation-approaches/">Modus Create - ReactJS Form Validation Approaches</a>
      <br />
      Fixed version: <a href="https://codepen.io/tkrotoff/pen/MEeNvO">https://codepen.io/tkrotoff/pen/MEeNvO</a>
    </p>
    <Form />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
