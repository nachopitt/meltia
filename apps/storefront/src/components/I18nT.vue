<script setup lang="ts">
import { computed, useSlots } from "vue"
import { useI18n } from "@/composables/useI18n"

interface Props {
  keypath: string
  tag?: string | false
}

const props = withDefaults(defineProps<Props>(), {
  tag: "span"
})

defineOptions({
  inheritAttrs: true
})

const slots = useSlots()
const { $t } = useI18n()

const tokens = computed(() => {
  const raw = $t(props.keypath)

  return raw.split(/(\{[\w]+\})/g).map((part) => {
    const match = part.match(/^\{(\w+)\}$/)

    return match ? { isSlot: true, name: match[1] } : { isSlot: false, text: part }
  })
})
</script>

<template>
  <component :is="tag" v-if="tag">
    <template v-for="(token, idx) in tokens" :key="idx">
      <slot v-if="token.isSlot && token.name && slots[token.name]" :name="token.name" />
      <template v-else-if="token.isSlot">{{ "{" + token.name + "}" }}</template>
      <template v-else>{{ token.text }}</template>
    </template>
  </component>
  <template v-else>
    <template v-for="(token, idx) in tokens" :key="idx">
      <slot v-if="token.isSlot && token.name && slots[token.name]" :name="token.name" />
      <template v-else-if="token.isSlot">{{ "{" + token.name + "}" }}</template>
      <template v-else><span>{{ token.text }}</span></template>
    </template>
  </template>
</template>
