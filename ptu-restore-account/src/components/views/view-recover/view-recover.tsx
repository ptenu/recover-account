import { Component, Host, h, State, Prop } from '@stencil/core';
import { request } from '../../..';
import state from '../../../global/store';
import { RouterHistory } from '@stencil/router';

@Component({
  tag: 'view-recover',
  styleUrl: 'view-recover.css',
})
export class ViewRecover {
  @Prop() history: RouterHistory;

  @State() code = '';
  @State() error = '';

  updateCode(e) {
    const element = document.getElementById('pin-input');
    this.code = element.getAttribute('value') + e.target.value;

    if (this.code.length == 6) {
      this.verify();
    }
  }

  verify() {
    console.log(state.challengeMethod);
    this.error = '';
    request
      .post('account/recover', { [state.challengeMethod]: this.code })
      .then(_resp => {
        this.history.push('/done');
      })
      .catch(err => {
        if (err.response.status == 400) {
          this.error = 'The code you entered was not recognised.';
          return;
        }
        if (err.response.status == 404) {
          this.error = 'The token you tried to use has expired. One-time codes are only valid for 15 minutes.';
          return;
        }
        try {
          this.error = err.response.data['description'];
        } catch {
          this.error = 'There was a problem communicating with the server.';
        }
      });
  }

  render() {
    return (
      <Host>
        <content-container>
          <header>
            <h1>Verify</h1>
          </header>
          <section>
            {state.challengeMethod == 'sms' && (
              <p>
                We've sent a text message to the mobile number registered to your account. When you get this text, please enter the code below.{' '}
                <strong>It may take several minutes to arrive</strong>
              </p>
            )}
            {state.challengeMethod == 'email' && (
              <p>
                We've sent you a one time code via email, once you get the code, enter it below. It might take a minute or two to arrive - and please check your 'Other' or 'Junk'
                folders.
              </p>
            )}

            <alert-element dismissable={false} theme="warning">
              <p class="bold">Do not refresh this page.</p>
              <p>If you refresh this page now, you will be locked out and will not be able to use this service again until tomorrow.</p>
            </alert-element>
          </section>
          <section>
            {this.error.length > 0 && (
              <alert-element dismissable={false} theme="danger">
                <strong>There was a problem. </strong>
                <p></p>
                <p>{this.error}</p>
              </alert-element>
            )}
            <field-element label="One time code">
              <text-input id="pin-input" type="number" width={18} onInput={this.updateCode.bind(this)} hint="The next page will load as soon as you enter 6 digits."></text-input>
            </field-element>
          </section>
        </content-container>
      </Host>
    );
  }
}
