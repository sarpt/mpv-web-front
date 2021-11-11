<script lang="ts">
  export let selected: boolean;
</script>

<div class="row">
  <slot name="content" class="content"></slot>
</div>

<style lang="scss">
  /* @media (max-width: 640px) {
    .row {
      padding: 9px 6px;
      font-size: small;
      line-height: 1em;
      margin-bottom: 0;
    }
  } */
</style>