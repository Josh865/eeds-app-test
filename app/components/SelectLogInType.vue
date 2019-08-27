<template>
  <Page>
    <ActionBar title="Log In">
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
    </ActionBar>
    <FlexboxLayout justifyContent="center" alignItems="center">
      <StackLayout width="95%">
        <Button
          text="Log In with eeds PIN"
          class="btn"
          marginBottom="20"
          @tap="goToLogInPage('pin')"
        />
        <Button
          text="Log In with Email"
          class="btn"
          marginBottom="20"
          @tap="goToLogInPage('email')"
        />
        <Button
          text="Log In with Phone"
          class="btn"
          @tap="goToLogInPage('phone')"
        />
      </StackLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import LogIn from './LogIn';

export default {
  components: {
    LogIn,
  },

  methods: {
    goToLogInPage(type) {
      this.$navigateTo(LogIn, {
        props: {
          type: type,
        },
      });
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
</style>
