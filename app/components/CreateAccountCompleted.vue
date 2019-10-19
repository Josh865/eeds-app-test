<template>
  <FlexboxLayout justifyContent="center">
    <StackLayout width="90%">
      <Label
        text="Thank you for registering!"
        class="h2 m-t-30"
        textWrap="true"
      />
      <Label
        text="We will review your account and let you know once it is ready to use."
        textWrap="true"
      />
      <Button
        text="Visit eeds.com"
        class="btn btn-primary m-t-20"
        @tap="handleTap"
      />
    </StackLayout>
  </FlexboxLayout>
</template>

<script>
import WebViewContainer from './WebViewContainer';

export default {
  methods: {
    handleTap() {
      this.$navigateTo(WebViewContainer, {
        props: {
          url: `https://www.eeds.com`,
        },
      });
    },
  },
};
</script>

<style></style>
