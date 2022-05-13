import { Component, Host, h, State, Prop } from '@stencil/core';
import { request } from '../../..';
import { RouterHistory } from '@stencil/router';
import state from '../../../global/store';

@Component({
  tag: 'view-identify',
  styleUrl: 'view-identify.css',
})
export class ViewIdentify {
  @Prop() history: RouterHistory;

  @State() familyName: string = '';
  @State() emailAddress: string = '';
  @State() errors: Array<string> = [];
  @State() submited: boolean = false;
  @State() loading: boolean = false;

  componentWillLoad() {
    if (localStorage.getItem('SESSION_CREATED') != null) {
      const last_session_date = localStorage.getItem('SESSION_CREATED');
      const now = new Date().toDateString();
      if (now == last_session_date) {
        return;
      }
    }
    this.loading = true;
    request({
      method: 'post',
      url: 'session',
      data: {},
    })
      .then(_r => {
        this.loading = false;
        const now = new Date().toDateString();
        localStorage.setItem('SESSION_CREATED', now);
      })
      .catch(error => {
        this.loading = false;
        this.errors = [`${error.message}. Please try again later.`];
        this.submited = true;
      });
  }

  validate() {
    let errors = [];
    if (this.emailAddress.length < 1) {
      errors.push('You must enter an email.');
    }

    if (this.familyName.length < 1) {
      errors.push('You must enter your last (family) name.');
    }
    this.errors = errors;
  }

  setEmail(event) {
    this.emailAddress = event.target.value;
    this.validate();
  }

  setName(event) {
    this.familyName = event.target.value;
    this.validate();
  }

  async next(event) {
    event.preventDefault();
    this.validate();
    this.submited = true;
    if (this.errors.length > 0) {
      return;
    }

    this.loading = true;
    request
      .post('account/identify', {
        email: this.emailAddress,
        family_name: this.familyName,
      })
      .then(resp => {
        this.loading = false;
        try {
          state.challengeMethod = resp.data;
          this.history.push('/recover');
        } catch {
          this.errors = ['The response from the server was invalid, please contact an administrator.'];
        }
      })
      .catch(err => {
        this.loading = false;
        try {
          const errorMessage = err.response.data['description'];
          this.errors = [errorMessage];
        } catch {
          this.errors = ['There was a problem communicating with the server. Please contact an administrator.'];
        }
      });
  }

  render() {
    return (
      <Host>
        <content-container>
          <header>
            <h1>Your details</h1>
          </header>
          {this.loading && (
            <section>
              <loading-element></loading-element>
            </section>
          )}
          {!this.loading && (
            <form onSubmit={this.next.bind(this)}>
              <section>
                {this.errors.length > 0 && this.submited && (
                  <alert-element theme="danger" dismissable={false}>
                    <strong style={{ marginBottom: '2ex', display: 'block' }}>There was a problem:</strong>
                    {this.errors.length > 1 && (
                      <ul style={{ columnWidth: 'unset' }}>
                        {this.errors.map(err => (
                          <li>{err}</li>
                        ))}
                      </ul>
                    )}
                    {this.errors.length == 1 && <p>{this.errors[0]}</p>}
                  </alert-element>
                )}

                <field-element label="Last Name">
                  <text-input name="family_name" hint="Please enter your family name" autoComplete="family_name" onInput={this.setName.bind(this)}></text-input>
                </field-element>

                <field-element label="Email address">
                  <text-input name="email" hint="You must use the email address you signed up with." autoComplete="email" onInput={this.setEmail.bind(this)}></text-input>
                </field-element>
              </section>
              <footer class="buttons">
                <button-control label="Next" theme="primary" onClick={this.next.bind(this)}></button-control>
              </footer>
            </form>
          )}
        </content-container>
      </Host>
    );
  }
}
