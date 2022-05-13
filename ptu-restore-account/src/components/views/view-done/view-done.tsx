import { Component, Host, h, State, Fragment } from '@stencil/core';
import { request } from '../../..';

@Component({
  tag: 'view-done',
  styleUrl: 'view-done.css',
})
export class ViewDone {
  @State() finished = false;
  @State() loading = false;
  @State() error: string = '';
  @State() password: string;

  next() {
    this.validatePassword();

    if (this.error.length > 0) {
      return;
    }

    this.loading = true;
    request
      .put('password', { password: this.password })
      .then(_resp => {
        this.loading = false;
        this.finished = true;
      })
      .catch(err => {
        this.loading = false;
        try {
          this.error = err.response.data['description'];
        } catch {
          this.error = 'There was a problem with the server, and your password has not been set. You might be able to try again.';
        }
      });
  }

  validatePassword() {
    this.error = '';
    const element = document.getElementById('repeated_password');
    const repetition = element.getAttribute('value');

    if (repetition != this.password) {
      this.error = 'The two passwords you entered do not match. Please check them and try again.';
    }
  }

  updatePassword(e) {
    this.password = e.target.value;
  }

  render() {
    return (
      <Host>
        <div hidden>
          <nav-link></nav-link>
        </div>
        {!this.finished && (
          <content-container>
            <header>
              <h1>Update your password</h1>
            </header>
            <section>
              <p>We have been able to authenticate you, please change your password using the form below.</p>
              <p>Once you have changed your password, all your current sessions will be ended, and you will be logged out everywhere you are currently logged in.</p>

              {this.error.length > 0 && (
                <alert-element dismissable={false} theme="danger">
                  <p class="bold">There was a problem.</p>
                  <p>{this.error}</p>
                </alert-element>
              )}
            </section>

            <section>{this.loading && <loading-element />}</section>
            {!this.loading && (
              <Fragment>
                <section>
                  <field-element label="Password">
                    <text-input autoComplete="off" type="password" onInput={this.updatePassword.bind(this)} name="password"></text-input>
                  </field-element>
                  <blockquote>
                    <p>Your password must be strong and must:</p>
                    <p>
                      <ul class="password-rules" role="list">
                        <li>be at least 8 characters long</li>
                        <li>contain at least 1 upper-case character</li>
                        <li>contain at least 2 numbers</li>
                        <li>contain at least 1 special character (i.e. not a number or letter)</li>
                      </ul>
                    </p>
                    <p>
                      <a target="_blank" href="https://help.uis.cam.ac.uk/service/security/cyber-security-awareness/passwords">
                        Click here for advice on how to chose a strong password.
                      </a>
                    </p>
                  </blockquote>
                  <field-element label="Repeat password">
                    <text-input autoComplete="off" type="password" id="repeated_password" name="p_verify"></text-input>
                  </field-element>
                </section>
                <footer>
                  <button-control label="Save & Finish" theme="green" onClick={this.next.bind(this)}></button-control>
                </footer>
              </Fragment>
            )}
          </content-container>
        )}

        {this.finished && (
          <content-container>
            <header>
              <h1>Finished</h1>
            </header>
            <section>
              <alert-element dismissable={false} theme="good">
                <header>
                  <p>Your password has been changed.</p>
                </header>
                <p>You can now use your email address and new password to log into any PTU service.</p>
              </alert-element>
            </section>
          </content-container>
        )}
      </Host>
    );
  }
}
