<template>
  <h1 class="xl:text-9xl lg:text-9xl md:text-8xl sm:text-8xl xs:text-6xl pb-8 flex justify-center">{{ isWearACoat }}</h1>
  <p class="text-gray-600" v-if="comments.length > 0">
    It's {{ formattedComments }}.
  </p>
  <div class="pt-20 flex items-center justify-center">
    <GoBackButton @back="$emit('back')" />
  </div>
</template>

<script>
import GoBackButton from "@/components/GoBackButton.vue";

export default {
  components: {
    GoBackButton,
  },
  props: {
    isWearACoat: {
      type: String,
      required: true,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  computed: {
    formattedComments() {
      if (this.comments.length > 1) {
        return (
          this.comments.slice(0, -1).join(", ") +
          ", and " +
          this.comments.slice(-1)
        );
      } else if (this.comments.length === 1) {
        return this.comments[0];
      } else {
        return "";
      }
    },
  },
};
</script>
