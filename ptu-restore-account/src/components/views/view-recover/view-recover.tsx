import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'view-recover',
  styleUrl: 'view-recover.css',
  shadow: true,
})
export class ViewRecover {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
