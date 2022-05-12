import { Component, Host, h, State, Fragment } from '@stencil/core';
import { request } from '../../..';

@Component({
  tag: 'view-identify',
  styleUrl: 'view-identify.css',
})
export class ViewIdentify {
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

  next() {
    this.validate();
    this.submited = true;
    if (this.errors.length > 0) {
      return;
    }

    // @TODO: make request to identify user.
    this.loading = true;
    request
      .post('account/identify', {
        email: this.emailAddress,
        family_name: this.familyName,
      })
      .catch(error => {
        this.loading = false;

        if (error.response.status == 403) {
          this.errors = ['You have already used this service today. Please try again tomorrow'];
        }

        try {
          let errors = [];
          const error_text = error.response.data['description'];
          errors.push(error_text);
          this.errors = errors;
        } catch (error) {
          this.errors = ['There was an error with the server. Please contact an administrator.'];
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
            <Fragment>
              <section>
                {this.errors.length > 0 && this.submited && (
                  <alert-element theme="danger" dismissable={false}>
                    <strong style={{ marginBottom: '2ex', display: 'block' }}>There was a problem:</strong>
                    <ul style={{ columnWidth: 'unset' }}>
                      {this.errors.map(err => (
                        <li>{err}</li>
                      ))}
                    </ul>
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
            </Fragment>
          )}
        </content-container>
      </Host>
    );
  }
}
