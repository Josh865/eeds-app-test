<template>
  <Page actionBarHidden="true">
    <FlexboxLayout justifyContent="center" alignItems="center">
      <StackLayout width="95%">
        <Button
          text="Log In with eeds PIN"
          class="btn btn-primary btn-rounded-sm"
          androidElevation="0"
          @tap="goToLogInPage('pin')"
        />

        <StackLayout class="hr-light" />

        <Button
          text="Log In with Email"
          class="btn btn-primary btn-rounded-sm"
          androidElevation="0"
          @tap="goToLogInPage('email')"
        />

        <StackLayout class="hr-light" />

        <Button
          text="Log In with Phone"
          class="btn btn-primary btn-rounded-sm"
          androidElevation="0"
          @tap="goToLogInPage('phone')"
        />

        <StackLayout class="hr-dark" />

        <Button
          text="Create an Account"
          class="btn btn-primary btn-rounded-sm"
          androidElevation="0"
          @tap="goToCreateAccountPage"
        />
      </StackLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import LogIn from './LogIn';
import CreateAccount from './CreateAccount';

export default {
  components: {
    LogIn,
    CreateAccount,
  },

  data() {
    return {
      icon: String.fromCharCode(0xf0f3),
    };
  },

  methods: {
    goToLogInPage(type) {
      this.$navigateTo(LogIn, {
        props: {
          type: type,
        },
      });
    },

    goToCreateAccountPage() {
      this.$navigateTo(CreateAccount);
    },
  },
};
</script>

<style>
/* .btn {
  color: gray;
  font-family: 'Font Awesome 5 Free', 'fa-regular-400';
  font-size: 18;
  vertical-align: middle;
  width: 100%;
  border-width: 0;
  border-radius: 0;
  padding-top: 20;
  padding-bottom: 20;
  text-align: left;
  background-color: white;
} */
</style>
