<script setup lang="ts">
import MultiSelect from 'primevue/multiselect'

const model = defineModel()

defineProps<{
  options: any[]
  placeholder: string
  optionLabel: string | undefined
  optionValue: string
  optionDesc: string | null
  invalid?: boolean | undefined
}>()
</script>

<template>
  <MultiSelect
    v-model="model"
    display="chip"
    :invalid="invalid"
    :options="options"
    :optionLabel="optionLabel"
    :optionValue="optionValue"
    :placeholder="placeholder"
    class="w-full md:w-20rem"
    :showToggleAll="false"
    :ptOptions="{ mergeSections: true, mergeProps: false }"
    :pt="{
      label: ({ props }) => ({
        class: [
          'leading-[normal]',
          'block ',

          // Spacing
          {
            'py-3 px-3': !props?.modelValue?.length,
            'pt-1.5 px-3': props?.modelValue?.length > 0
          },

          // Color
          {
            'text-surface-800': props.modelValue?.length,
            'text-surface-400': !props.modelValue?.length
          },
          'placeholder:text-surface-400',

          // Transitions
          'transition duration-200',

          // Misc
          'cursor-pointer'
        ]
      }),
      token: {
        class: [
          // Flex
          'inline-flex items-center',

          // Spacings
          'py-1.5 px-3 mr-2 mb-1.5',

          // Shape
          'rounded-[1.14rem]',

          // Colors
          'bg-surface-200 dark:bg-surface-700',
          'text-surface-700 dark:text-white/70',

          // Misc
          'cursor-default'
        ]
      },
      wrapper: {
        class: [
          // Sizing
          '!max-h-[360px]',

          // Misc
          'overflow-auto'
        ]
      }
    }"
  >
    <template #option="slotProps">
      <div>
        <div class="font-bold">
          {{ optionLabel ? slotProps.option[optionLabel] : slotProps.option[optionValue] }}
        </div>
        <div v-if="optionDesc" class="text-xs text-gray-400 text-wrap">
          {{ slotProps.option[optionDesc] }}
        </div>
      </div>
    </template>
  </MultiSelect>
</template>

<style scoped></style>
