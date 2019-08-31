<template>
  <HomeMenu v-if="pin" :pin="pin" />
  <SelectLogInType v-else />
</template>

<script>
// NativeScript package to store client-side data. It's used to store the user's PIN.
const appSettings = require('application-settings');

import HomeMenu from './HomeMenu';
import SelectLogInType from './SelectLogInType';

export default {
  components: {
    HomeMenu,
    SelectLogInType,
  },

  data() {
    return {
      pin: null,
      lastName: '',
      email: '',
    };
  },

  created() {
    // If the user has signed in before, pull their PIN out of storage. If not found, this
    // will set the value of this.pin to undefined.
    this.pin = appSettings.getString('pin');

    // If PIN wasn't found in storage but we have the user's last name and email address,
    // check for a recently approved account
    if (!this.pin && this.lastName && this.email) {
      this.checkForRecentlyApprovedAccount().then(pinOfApprovedAccount => {
        this.pin = pinOfApprovedAccount;
      });
    }

    // If we couldn't find a saved PIN or the PIN of the user's recently approved account,
    // set it back to null.
    if (!this.pin) this.pin = null;
  },

  methods: {
    checkForRecentlyApprovedAccount() {
      return new Promise((resolve, reject) => {
        httpModule
          .getJSON(
            `https://www.eeds.com/ajax_functions.aspx?Function_ID=58&Exclude_Results_if_in_Temp_Table=true&Last_Name=${this.lastName}&Email=${this.email}`
          )
          .then(response => {
            resolve(response);
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
