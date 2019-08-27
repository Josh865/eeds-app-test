<template>
  <Page>
    <ActionBar :title="`Log In with ${selectedLogInType.label}`">
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
    </ActionBar>

    <FlexboxLayout justifyContent="center" alignItems="center">
      <StackLayout>
        <TextField
          v-model="value"
          :hint="selectedLogInType.label"
          :autocorrect="false"
          width="95%"
          marginBottom="15"
        />
        <TextField
          v-model="password"
          :secure="true"
          hint="Password"
          width="95%"
        />
        <Button text="Log In" @tap="logIn" />
      </StackLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
const httpModule = require('tns-core-modules/http');

import HomeMenuPage from './HomeMenu';

export default {
  components: {
    HomeMenuPage,
  },

  props: {
    type: {
      type: String,
      default: 'pin',
    },
  },

  data() {
    return {
      busy: false,
      value: '',
      password: '',
      availableLogInTypes: {
        pin: {
          label: 'PIN',
          url: 'https://www.eeds.com/ajax_functions.aspx?Function_ID=5&PIN=',
        },
        email: {
          label: 'Email Address',
          url:
            'https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Email_Address=',
        },
        phone: {
          label: 'Phone Number',
          url:
            'https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Phone_Number=',
        },
      },
    };
  },

  computed: {
    selectedLogInType() {
      return this.availableLogInTypes[this.type];
    },

    logInUrl() {
      return this.selectedLogInType.url + this.value;
    },
  },

  methods: {
    async logIn() {
      this.busy = true;

      // Before proceeding, make sure the data the user entered is valid.
      const isValid = await this.validate();

      if (!isValid) {
        alert(`Please enter your ${this.selectedLogInType.label}`);
        return;
      }

      httpModule.getJSON(this.logInUrl).then(
        response => {
          this.busy = false;

          if (response.PIN_Status !== true) {
            alert('The PIN you entered could not be found.');
            return;
          }

          this.$navigateTo(HomeMenuPage, {
            props: {
              pin: response.PIN,
            },
          });
        },
        error => {
          alert(error);
          this.busy = false;
        }
      );
    },

    validate() {
      return new Promise(resolve => {
        if (this.value === '') {
          resolve(false);
        }

        resolve(true);
      });
    },
  },
};
</script>

<style></style>
