<template>
  <Page actionBarHidden="true">
    <FlexboxLayout justifyContent="center" alignItems="center">
      <StackLayout width="95%">
        <Button
          :text="`${icon} Log In with eeds PIN`"
          class="btn"
          androidElevation="0"
          @tap="goToLogInPage('pin')"
        />

        <StackLayout height="1" backgroundColor="lightgray" />

        <Button
          text="Log In with Email"
          class="btn"
          androidElevation="0"
          @tap="goToLogInPage('email')"
        />

        <StackLayout height="2" backgroundColor="lightgray" />

        <Button
          text="Log In with Phone"
          class="btn"
          androidElevation="0"
          @tap="goToLogInPage('phone')"
        />

        <StackLayout height="2" backgroundColor="lightgray" />

        <Button
          text="Create an Account"
          class="btn"
          androidElevation="0"
          color="#007bff"
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
.btn {
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
}
</style>
