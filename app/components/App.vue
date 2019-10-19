<template>
  <!-- If the user has already signed in, take them directly to the home menu -->
  <HomeMenu v-if="pin" :pin="pin" />

  <!-- If the user created an account but it hasn't been approved yet, display a message
  informing them that their accout is awaiting approval -->
  <CreateAccountCompleted v-else-if="!pin && accountAwaitingApproval" />

  <!-- If this is the first time they've ever opened the app or if they've signed out,
  ask them how they would like to log in (PIN, email, or phone) -->
  <SelectLogInType v-else />
</template>

<script>
// NativeScript package to store client-side data. It's used to store the user's PIN.
const appSettings = require('application-settings');

import HomeMenu from './HomeMenu';
import SelectLogInType from './SelectLogInType';
import CreateAccountCompleted from './CreateAccountCompleted';

export default {
  name: 'App',

  components: {
    HomeMenu,
    SelectLogInType,
    CreateAccountCompleted,
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
      // If their account is in awaiting approval status but we don't have their email
      // address or last name, let them know to contact support since we can't check the
      // status of their account.
      if (!this.email || !this.lastName) {
        alert(
          'Email and/or last name not found. Please contact eeds support for assistance at support@eeds.com or 828-252-0233.'
        );
        return;
      }

      this.checkIfAccountHasBeenApproved().then(newPin => {
        if (newPin !== '') {
          this.pin = newPin;
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
            // If the account was approved, we'll get the user's new PIN back from the
            // server. Otherwise, we'll just get an empty string.
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

<style scoped></style>
