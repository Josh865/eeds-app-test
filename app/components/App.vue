<template>
  <HomeMenu v-if="pin" :pin="pin" />
  <AwaitingApproval v-else-if="!pin && accountAwaitingApproval" />
  <SelectLogInType v-else />
</template>

<script>
// NativeScript package to store client-side data. It's used to store the user's PIN.
const appSettings = require('application-settings');

import HomeMenu from './HomeMenu';
import SelectLogInType from './SelectLogInType';
import AwaitingApproval from './AwaitingApproval';

export default {
  name: 'App',

  components: {
    HomeMenu,
    SelectLogInType,
    AwaitingApproval,
  },

  data() {
    return {
      // getString returns undefined if the key isn't found, that's why we explicit set
      // the value to an empty string if we haven't stored a PIN
      pin: appSettings.getString('pin') || '',
      lastName: appSettings.getString('lastName') || '',
      email: appSettings.getString('email') || '',
      // This will be true if the use registered for a new account using the app and it
      // hasn't been approved yet. The default is false.
      accountAwaitingApproval: appSettings.getBoolean(
        'accountAwaitingApproval',
        false
      ),
    };
  },

  created() {
    if (!this.pin && this.accountAwaitingApproval) {
      // If we don't have their email address or last name, let them know to contact support.
      if (!this.email || !this.lastName) {
        alert(
          'Email and/or last name not found. Please contact eeds support for assistance at support@eeds.com or 828-252-0233.'
        );
        return;
      }

      this.checkIfAccountHasBeenApproved().then(result => {
        if (result.isApproved) {
          this.pin = result.pin;
          this.accountAwaitingApproval = false;

          // Update app storage to reflect that the user's account has been approved
          appSettings.getBoolean('accountAwaitingApproval', false);
        }
      });
    }
  },

  methods: {
    checkIfAccountHasBeenApproved() {
      return new Promise((resolve, reject) => {
        httpModule
          .getJSON(
            `https://www.eeds.com/ajax_functions.aspx?Function_ID=58&Exclude_Results_if_in_Temp_Table=true&Last_Name=${this.lastName}&Email=${this.email}`
          )
          .then(response => {
            resolve({
              isApproved: response !== '', // true is approved, false otherwise
              pin: response, // PIN if approved, empty string otherwise
            });
          })
          .catch(err => {
            alert(
              `Error checking for recently approved account. ${err.message}`
            );
            reject();
          });
      });
    },
  },
};
</script>

<style scoped>
ActionBar {
  background-color: #1a78e4;
  color: #ffffff;
}
</style>
