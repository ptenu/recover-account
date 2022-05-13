import { Component, Fragment, h } from '@stencil/core';
import 'ptu-elements';
import '@stencil/router';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  render() {
    return (
      <Fragment>
        <header-container
          service-title="Restore Account"
          logo-src="https://static.peterboroughtenants.app/SVG/ptu_logo_header.svg"
          logo-small="https://static.peterboroughtenants.app/SVG/ptu_logo_colour.svg"
        >
          <ul role="list">
            <li>
              <a href="https://www.peterboroughtenants.org">Website</a>
            </li>
            <li>
              <a href="https://www.peterboroughtenants.app">Hub</a>
            </li>
          </ul>
        </header-container>

        <main>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url="/" component="view-home" exact={true} />
              <stencil-route url="/identify" component="view-identify" />
              <stencil-route url="/recover" component="view-recover" />
              <stencil-route url="/done" component="view-done" />
            </stencil-route-switch>
          </stencil-router>
        </main>

        <footer-container>
          <address slot="address">
            <p>Peterborough Tenants Union Ltd.</p>
            <p>Company limited by guarantee: 13171833, registered in England & Wales. 82A James Carter Road, Mildenhall, Suffolk, IP28 7DE.</p>
          </address>
        </footer-container>
      </Fragment>
    );
  }
}
