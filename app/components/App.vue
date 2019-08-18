<template>
  <Page>
    <ActionBar title="Welcome to NativeScript-Vue!" />
    <GridLayout columns="*" rows="*">
      <Button class="message" :text="msg" col="0" row="0" @tap="goToPage" />
    </GridLayout>
  </Page>
</template>

<script>
import SelectLogInType from './SelectLogInType';

export default {
  components: {
    SelectLogInType,
  },

  data() {
    return {
      msg: 'Hello World!',
    };
  },

  methods: {
    goToPage() {
      this.$showModal(SelectLogInType);
    },
  },
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
