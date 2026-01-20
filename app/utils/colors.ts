// 日系清新風格配色 - 柔和粉彩色調
const WHEEL_COLORS = [
  '#F8B4C4', // 櫻花粉
  '#A8D8EA', // 天空藍
  '#FFDAC1', // 蜜桃橘
  '#B5EAD7', // 薄荷綠
  '#E2B6CF', // 藤紫色
  '#FFE5B4', // 奶油黃
  '#C7CEEA', // 薰衣草
  '#F6D6AD', // 杏桃色
  '#98D8C8', // 青瓷綠
  '#F7CAC9', // 玫瑰粉
  '#ABDEE6', // 水藍色
  '#FFFFB5', // 檸檬黃
  '#CBAACB', // 淡紫藤
  '#FFB7B2', // 珊瑚粉
  '#B5D8EB', // 淺水藍
  '#E0BBE4', // 淡蘭紫
]

export function generateColors(count: number): string[] {
  const colors: string[] = []
  for (let i = 0; i < count; i++) {
    colors.push(WHEEL_COLORS[i % WHEEL_COLORS.length])
  }
  return colors
}

export function getColorForIndex(index: number): string {
  return WHEEL_COLORS[index % WHEEL_COLORS.length]
}
