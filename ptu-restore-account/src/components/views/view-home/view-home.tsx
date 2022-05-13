import { Component, Host, h, Prop } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

@Component({
  tag: 'view-home',
  styleUrl: 'view-home.css',
})
export class ViewHome {
  @Prop() history: RouterHistory;

  start() {
    this.history.push('/identify');
  }

  render() {
    return (
      <Host>
        <content-container>
          <header>
            <h1>Account recovery</h1>
          </header>
          <section>
            <p>You can use this service to authenticate yourself, and change your password, if you have never logged into your PTU acount, or you have forgotten your password.</p>
            <p>
              If you use two factor authentication, or we don't have enough information to verify you, then you won't be able to use this service and will need to get in touch.
            </p>
          </section>
          <footer class="buttons">
            <button-control label="Start" theme="primary" aside="→" onClick={this.start.bind(this)}></button-control>
          </footer>
        </content-container>
      </Host>
    );
  }
}
