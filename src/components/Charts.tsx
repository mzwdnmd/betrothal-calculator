import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import type { Category } from "../types/models";
import { sumByCategory, sumCategories } from "../utils/calc";
import { getMemeComment } from "../utils/memes";

type Props = {
  bridePrice: Category[];
  dowry: Category[];
};

function toCNY(n: number) {
  return `¥${Math.round(n).toLocaleString()}`;
}

export default function Charts({ bridePrice, dowry }: Props) {
  const totalLeft = sumCategories(bridePrice);
  const totalRight = sumCategories(dowry);

  const byCatLeft = sumByCategory(bridePrice);
  const byCatRight = sumByCategory(dowry);

  const names = useMemo(() => byCatLeft.map((x) => x.name), [byCatLeft]);

  const barRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);

  const diff = totalLeft - totalRight;
  const meme = getMemeComment(totalLeft, totalRight);

  useEffect(() => {
    if (!barRef.current || !stackRef.current) return;

    const barChart = echarts.init(barRef.current);
    const stackChart = echarts.init(stackRef.current);

    barChart.setOption({
      title: { text: "总额对比" },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: ["彩礼", "嫁妆"] },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: [totalLeft, totalRight],
          label: { show: true, formatter: (p: any) => toCNY(p.value) },
        },
      ],
    });

    stackChart.setOption({
      title: { text: "按类目对比（堆叠）" },
      tooltip: { trigger: "axis" },
      legend: { data: ["彩礼", "嫁妆"] },
      xAxis: { type: "category", data: names },
      yAxis: { type: "value" },
      series: [
        { name: "彩礼", type: "bar", stack: "total", data: byCatLeft.map((x) => x.total) },
        { name: "嫁妆", type: "bar", stack: "total", data: byCatRight.map((x) => x.total) },
      ],
    });

    const onResize = () => {
      barChart.resize();
      stackChart.resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      barChart.dispose();
      stackChart.dispose();
    };
  }, [totalLeft, totalRight, names, byCatLeft, byCatRight]);

  const memeBg =
    meme.level === "ok"
      ? "bg-white"
      : meme.level === "mild"
      ? "bg-gray-50"
      : meme.level === "medium"
      ? "bg-gray-100"
      : "bg-gray-200";

  return (
    <div className="space-y-4">
      {/* 结果概览 */}
      <div className="rounded-2xl border shadow-sm p-4">
        <div className="text-lg font-semibold">结果概览</div>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border p-3">
            <div className="text-sm text-gray-600">彩礼总额</div>
            <div className="text-xl font-semibold">{toCNY(totalLeft)}</div>
          </div>
          <div className="rounded-2xl border p-3">
            <div className="text-sm text-gray-600">嫁妆总额</div>
            <div className="text-xl font-semibold">{toCNY(totalRight)}</div>
          </div>
          <div className="rounded-2xl border p-3">
            <div className="text-sm text-gray-600">差额（彩礼-嫁妆）</div>
            <div className="text-xl font-semibold">{toCNY(diff)}</div>
            <div className="text-xs text-gray-500 mt-1">正数：彩礼更高；负数：嫁妆更高</div>
          </div>
        </div>
      </div>

      {/* 梗评语 */}
      <div className={`rounded-2xl border shadow-sm p-4 ${memeBg}`}>
        <div className="font-semibold">{meme.title}</div>
        <div className="text-sm text-gray-700 mt-1">{meme.text}</div>
        <div className="text-xs text-gray-500 mt-2">
          提示：梗评语仅用于轻松提醒，最终以双方沟通和现实情况为准。
        </div>
      </div>

      {/* 图表 1：总额对比 */}
      <div className="rounded-2xl border shadow-sm p-4">
        <div ref={barRef} style={{ width: "100%", height: 320 }} />
      </div>

      {/* 图表 2：类目堆叠对比 */}
      <div className="rounded-2xl border shadow-sm p-4">
        <div ref={stackRef} style={{ width: "100%", height: 360 }} />
      </div>
    </div>
  );
}
