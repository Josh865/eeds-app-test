<template>
  <Page actionBarHidden="true">
    <FlexboxLayout justifyContent="center" alignItems="center" class="gradient">
      <StackLayout width="95%">
        <Image src="~/assets/images/eeds.png" width="50%" class="m-b-30" />

        <Button
          text="Log In with eeds PIN"
          class="btn btn-white btn-rounded-sm m-b-10"
          androidElevation="0"
          @tap="goToLogInPage('pin')"
        />

        <Button
          text="Log In with Email"
          class="btn btn-white btn-rounded-sm m-b-10"
          androidElevation="0"
          @tap="goToLogInPage('email')"
        />

        <Button
          text="Log In with Phone"
          class="btn btn-white btn-rounded-sm m-b-20"
          androidElevation="0"
          @tap="goToLogInPage('phone')"
        />

        <Button
          text="Create an Account"
          class="btn btn-transparent"
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

<style scoped>
.btn-white {
  background-color: white;
  color: #1c79e4;
}

.btn-transparent {
  background-color: transparent;
  color: white;
}

.btn-transparent:highlighted {
  background-color: white;
  color: #1c79e4;
}

.img {
  max-width: 80%;
}

.gradient {
  background-image: linear-gradient(
    90deg,
    rgba(28, 121, 228, 1) 0%,
    rgba(77, 144, 222, 1) 50%,
    rgba(28, 121, 228, 1) 100%
  );
}
</style>
