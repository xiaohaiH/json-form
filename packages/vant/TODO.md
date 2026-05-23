# 组件改造任务清单

## 每个组件需要满足的两个条件：
1. **slotProps**: `const { slotProps } = useCommonSetup(props, ctx, plain);` 并在 setup 返回 slotProps
2. **Slots声明+渲染**: types.ts 中声明插槽类型 + index.vue 中 v-for 遍历渲染插槽

## 各组件状态一览

### ✅ 已完成（不需要修改）
- cascader - ✅ slotProps + slots渲染
- checkbox - ✅ slotProps + slots渲染
- input - ✅ slotProps + slots渲染
- radio - ✅ slotProps + slots渲染

### ❌ 缺少 useCommonSetup + slotProps (但Slots已声明)
- datepicker - ❌ 无useCommonSetup/slotProps，无slots渲染
- number-keyboard - ❌ 无useCommonSetup/slotProps，无slots渲染
- rate - ❌ 无useCommonSetup/slotProps，无slots渲染
- signature - ❌ 无useCommonSetup/slotProps，无slots渲染
- slider - ❌ 无useCommonSetup/slotProps，无slots渲染
- stepper - ❌ 无useCommonSetup/slotProps，无slots渲染
- switch - ❌ 无useCommonSetup/slotProps，无slots渲染
- timepicker - ❌ 无useCommonSetup/slotProps，无slots渲染
- upload - ❌ 无useCommonSetup/slotProps，无slots渲染

### ❌ 缺少 slotProps 渲染 + types.ts 中Slots需要修复
- password-input - ❌ 无slots声明，无useCommonSetup/slotProps，无slots渲染，PasswordInputSlots为空

### ❌ 已有slotProps但模板缺少slots渲染
- checkbox-group - ✅ slotProps，但模板缺少slots渲染
- radio-group - ✅ slotProps，但模板缺少slots渲染

### ⬜ 不适用（非标准表单组件）
- group - 不适用
- input-slot - 不适用
- wrapper - 不适用
