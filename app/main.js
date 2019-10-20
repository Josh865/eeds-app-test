import Vue from 'nativescript-vue';

import PickerField from 'nativescript-picker/vue';

Vue.use(PickerField);

import App from './components/App';

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === 'production';

new Vue({
  render: h => h('frame', [h(App)]),
}).$start();
