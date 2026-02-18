function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export type MemeResult = {
  level: "ok" | "mild" | "medium" | "heavy";
  title: string;
  text: string;
};

export function getMemeComment(totalLeft: number, totalRight: number): MemeResult {
  const diff = totalLeft - totalRight; // >0 彩礼更高；<0 嫁妆更高
  const absDiff = Math.abs(diff);
  const maxTotal = Math.max(totalLeft, totalRight, 1);
  const ratio = absDiff / maxTotal;

  const higherSide =
    diff > 0 ? "彩礼方（左侧）" : diff < 0 ? "嫁妆方（右侧）" : "双方";
  const lowerSide =
    diff > 0 ? "嫁妆方（右侧）" : diff < 0 ? "彩礼方（左侧）" : "双方";

  // 0) 完美或接近
  if (ratio < 0.05) {
    return {
      level: "ok",
      title: "很均衡 🤝",
      text: pick([
        "你们这波属于“势均力敌”，谈判桌都得起立鼓掌。",
        "差距不大：主打一个‘合伙人模式’，继续甜甜蜜蜜。",
        "这配置很健康：别卷了，去吃顿好的。",
      ]),
    };
  }

  // 1) 轻度
  if (ratio < 0.15 && absDiff < 50000) {
    return {
      level: "mild",
      title: "有点落差，但可聊 🧾",
      text: pick([
        `现在是“可以坐下来谈”的级别：重点看你们对 ${higherSide} 的压力能不能接受。`,
        "小幅差距：建议把‘哪些算投入、哪些是回流’讲清楚。",
        "差距不算离谱：把口径统一一下，别被亲戚带节奏。",
      ]),
    };
  }

  // 2) 中度（热梗开始）
  if (ratio < 0.35 && absDiff < 100000) {
    return {
      level: "medium",
      title: "差额明显：建议先别上头 🧊",
      text: pick([
        `差距已经到“别急着下单”的程度：${lowerSide} 可能会觉得自己在当‘项目甲方’。`,
        "友情提示：这不是爱情综艺，不用硬凑 KPI。",
        "现在属于“信息不对称警报”：先对齐预期，再谈情绪价值。",
        "建议开启‘冷静期’：先算账，后谈爱。",
      ]),
    };
  }

  // 3) 重度（大差距）
  if (ratio >= 0.60 || absDiff >= 200000) {
    return {
      level: "heavy",
      title: "差额过大：建议暂停、冷静、复盘 🛑",
      text: pick([
        `这差距有点像“你谈恋爱，对方在融资”：${lowerSide} 压力会很大。`,
        "你们现在更像在做并购尽调：建议先把条款谈清楚再谈感情。",
        "警告：可能出现‘一边掏空钱包，一边掏空耐心’。",
        "如果两边都觉得委屈：不一定是不爱，可能是不合适（至少不适合现在的方案）。",
      ]),
    };
  }

  // 兜底（介于中重之间）
  return {
    level: "medium",
    title: "差距偏大：建议对齐预期 🧠",
    text: pick([
      "差额偏大：建议把‘必须项/可选项/面子项’拆开重算一次。",
      "建议先统一家庭口径：别让你们两个人替四个家庭背锅。",
    ]),
  };
}
