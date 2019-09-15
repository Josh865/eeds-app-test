<template>
  <FlexboxLayout justifyContent="center" marginTop="75">
    <StackLayout width="90%">
      <Label
        text="Thank you for registering!"
        textWrap="true"
        fontSize="20"
        fontWeight="500"
      />
      <Label
        text="We will review your account and let you know once it is ready to use."
        textWrap="true"
        marginTop="5"
      />
      <Button text="Return to Home Menu" marginTop="25" @tap="handleTap" />
    </StackLayout>
  </FlexboxLayout>
</template>

<script>
import SelectLogInType from './SelectLogInType';

export default {
  methods: {
    handleTap() {
      this.$navigateTo(SelectLogInType);
    },
  },
};
</script>

<style></style>
