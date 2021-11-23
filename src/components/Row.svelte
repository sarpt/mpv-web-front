<script lang="ts">
  export let selected: boolean;
  export let odd: boolean;
</script>

<div class="row {selected ? 'row-selected' : ''} {odd ? 'row-odd' : ''}">
  <slot name="content" class="content"></slot>
</div>

<style lang="scss">
  @media (max-width: 640px) {
    .row {
      padding: 6px 4px;
      font-size: small;
      line-height: 1em;
      margin-bottom: 0;
    }
  }

  .row {
    padding: 9px 12px;
    line-height: 1em;
    border-radius: 0.5rem;
  }

  .row-selected {
    border-color: #cc99e4;
    border-style: solid;
    border-width: 3px;
    padding: 6px 9px;
  }

  .row-odd {
    background-color: #f2f3f4;
  }
</style>