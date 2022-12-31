<template>
<pre>
<code>
{{ finalJson }}
</code>
</pre>
</template>
<script>
export default {
  name: 'JsonViewer',
  props: ['json'],
  computed: {
    finalJson () {
      return {
        node: this.json.data?.system?.node,
        flow: this.json.data?.system?.flow
      }
    }
  }
}
</script>

<style scoped>
pre {
  position: fixed;
  width: 300px;
  top: 5vh;
  right: 10px;
  height: 90vh;
  overflow: scroll;
  font-size: 10px;
}
</style>
