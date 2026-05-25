# Slider 滑块

滑块选择组件，基于 Vant `Slider` + `Field` 组件实现。

## 类型标识

- `t: 'slider'`

## 额外 Props

| 属性名 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| sliderProps | `Partial<SliderProps>` | - | VanSlider 组件的属性 |
| sliderOn | `object` | `{}` | VanSlider 组件的事件 |
| sliderSlots | `SliderSlots` | - | VanSlider 组件的插槽 |

### SliderSlots

| 插槽名 | 绑定值 | 描述 |
| :--- | :--- | :--- |
| button | `CommonSlotsProps` | 自定义滑块按钮 |
| leftButton | `CommonSlotsProps` | 自定义左侧滑块按钮（双滑块模式下） |
| rightButton | `CommonSlotsProps` | 自定义右侧滑块按钮（双滑块模式下） |

## Slots

支持所有 [CommonSlots](/options/shares/share-slots) 插槽。

## 示例

### 基础用法

```typescript
const formConfig = defineOption([
    {
        field: 'volume',
        t: 'slider',
        label: '音量',
        defaultValue: 50,
        sliderProps: {
            min: 0,
            max: 100,
            step: 1,
            activeColor: '#1989fa',
        },
    },
]);
```

### 双滑块

```typescript
const formConfig = defineOption([
    {
        field: 'range',
        t: 'slider',
        label: '价格范围',
        defaultValue: [0, 100],
        sliderProps: {
            range: true,
            min: 0,
            max: 1000,
            step: 10,
        },
    },
]);
```

### 自定义滑块按钮

```tsx
const formConfig = defineOption([
    {
        field: 'volume',
        t: 'slider',
        label: '音量',
        sliderSlots: {
            button: () => <div class="custom-button">||</div>,
        },
    },
]);
```
