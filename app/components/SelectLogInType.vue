<template>
  <Page actionBarHidden="true">
    <FlexboxLayout justifyContent="center" alignItems="center">
      <StackLayout width="95%">
        <FlexboxLayout alignItems="center">
          <Label
            :text="String.fromCharCode(0xf0e0)"
            class="far"
            fontSize="30"
            backgroundColor="red"
          />
          <Button
            text="Log In with eeds PIN"
            padding="20"
            backgroundColor="red"
            @tap="goToLogInPage('pin')"
          />
        </FlexboxLayout>

        <Button :text="`${icon} Tap Me!`" tap="onTap" class="my-button" />

        <Button
          text="Log In with Email"
          class="btn"
          marginBottom="20"
          @tap="goToLogInPage('email')"
        />
        <Button
          text="Log In with Phone"
          class="btn"
          marginBottom="20"
          @tap="goToLogInPage('phone')"
        />
        <Button
          text="Create an Account"
          class="btn"
          backgroundColor="lightblue"
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
  padding: 20;
  border-width: 1;
  border-radius: 5;
  border-color: gray;
  background-color: white;
}

.my-button {
  background-color: orangered;
  border-radius: 5;
  color: white;
  font-family: 'Font Awesome 5 Free', 'fa-regular-400';
  font-size: 24;
  vertical-align: middle;
  width: 80%;
}
</style>
