export interface RegionNode {
  value: string
  label: string
  children?: RegionNode[]
}

export const regions: RegionNode[] = [
  {
    value: 'shanghai',
    label: '上海市',
    children: [
      {
        value: 'shanghai-pudong',
        label: '浦东新区',
        children: [
          { value: 'shanghai-pudong-zhangjiang', label: '张江街道' },
          { value: 'shanghai-pudong-lujiazui', label: '陆家嘴街道' },
          { value: 'shanghai-pudong-jinqiao', label: '金桥镇' },
        ],
      },
      {
        value: 'shanghai-xuhui',
        label: '徐汇区',
        children: [
          { value: 'shanghai-xuhui-tianlin', label: '田林街道' },
          { value: 'shanghai-xuhui-xujiahui', label: '徐家汇街道' },
          { value: 'shanghai-xuhui-huating', label: '华亭街道' },
        ],
      },
      {
        value: 'shanghai-huangpu',
        label: '黄浦区',
        children: [
          { value: 'shanghai-huangpu-nanshi', label: '南京东路街道' },
          { value: 'shanghai-huangpu-laoximen', label: '老西门街道' },
          { value: 'shanghai-huangpu-nanshic', label: '南市街道' },
        ],
      },
    ],
  },
  {
    value: 'beijing',
    label: '北京市',
    children: [
      {
        value: 'beijing-chaoyang',
        label: '朝阳区',
        children: [
          { value: 'beijing-chaoyang-cbd', label: 'CBD街道' },
          { value: 'beijing-chaoyang-sanyuanqiao', label: '三元桥街道' },
          { value: 'beijing-chaoyang-wangjing', label: '望京街道' },
        ],
      },
      {
        value: 'beijing-haidian',
        label: '海淀区',
        children: [
          { value: 'beijing-haidian-zhongguancun', label: '中关村街道' },
          { value: 'beijing-haidian-xierqi', label: '西二旗街道' },
          { value: 'beijing-haidian-shangdi', label: '上地街道' },
        ],
      },
      {
        value: 'beijing-daxing',
        label: '大兴区',
        children: [
          { value: 'beijing-daxing-yizhuang', label: '亦庄镇' },
          { value: 'beijing-daxing-lixian', label: '礼贤镇' },
          { value: 'beijing-daxing-xihongmen', label: '西红门镇' },
        ],
      },
    ],
  },
  {
    value: 'guangdong',
    label: '广东省',
    children: [
      {
        value: 'guangzhou',
        label: '广州市',
        children: [
          {
            value: 'guangzhou-tianhe',
            label: '天河区',
            children: [
              { value: 'guangzhou-tianhe-shipai', label: '石牌街道' },
              { value: 'guangzhou-tianhe-zhujiang', label: '珠江新城街道' },
              { value: 'guangzhou-tianhe-longdong', label: '龙洞街道' },
            ],
          },
          {
            value: 'guangzhou-haizhu',
            label: '海珠区',
            children: [
              { value: 'guangzhou-haizhu-jiangnan', label: '江南中街道' },
              { value: 'guangzhou-haizhu-chigang', label: '赤岗街道' },
              { value: 'guangzhou-haizhu-huangpu', label: '黄埔街道' },
            ],
          },
          {
            value: 'guangzhou-nansha',
            label: '南沙区',
            children: [
              { value: 'guangzhou-nansha-jiaomen', label: '蕉门街道' },
              { value: 'guangzhou-nansha-hengli', label: '横沥镇' },
              { value: 'guangzhou-nansha-wanqingsha', label: '万顷沙镇' },
            ],
          },
        ],
      },
      {
        value: 'shenzhen',
        label: '深圳市',
        children: [
          {
            value: 'shenzhen-nanshan',
            label: '南山区',
            children: [
              { value: 'shenzhen-nanshan-shekou', label: '蛇口街道' },
              { value: 'shenzhen-nanshan-xili', label: '西丽街道' },
              { value: 'shenzhen-nanshan-houhai', label: '后海街道' },
            ],
          },
          {
            value: 'shenzhen-futian',
            label: '福田区',
            children: [
              { value: 'shenzhen-futian-huanggang', label: '皇岗街道' },
              { value: 'shenzhen-futian-lianhua', label: '莲花街道' },
              { value: 'shenzhen-futian-fubao', label: '福保街道' },
            ],
          },
          {
            value: 'shenzhen-luohu',
            label: '罗湖区',
            children: [
              { value: 'shenzhen-luohu-dongmen', label: '东门街道' },
              { value: 'shenzhen-luohu-liantang', label: '莲塘街道' },
              { value: 'shenzhen-luohu-caiwuwei', label: '蔡屋围街道' },
            ],
          },
        ],
      },
    ],
  },
]
