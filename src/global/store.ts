import { createStore } from '@stencil/store';

const { state, onChange } = createStore({
  challengeMethod: null,
});

export default state;
