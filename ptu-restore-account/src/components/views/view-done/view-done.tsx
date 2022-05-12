import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'view-done',
  styleUrl: 'view-done.css',
  shadow: true,
})
export class ViewDone {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
