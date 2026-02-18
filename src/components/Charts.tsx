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

  const barElRef = useRef<HTMLDivElement | null>(null);
  const stackElRef = useRef<HTMLDivElement | null>(null);

  const barChartRef = useRef<echarts.EChartsType | null>(null);
  const stackChartRef = useRef<echarts.EChartsType | null>(null);

  const diff = totalLeft - totalRight;
  const meme = getMemeComment(totalLeft, totalRight);

  useEffect(() => {
    if (!barElRef.current || !stackElRef.current) return;

    // 复用实例：避免重复 init 导致异常
    barChartRef.current =
      barChartRef.current ?? echarts.init(barElRef.current);
    stackChartRef.current =
      stackChartRef.current ?? echarts.init(stackElRef.current);

    const barChart = barChartRef.current;
    const stackChart = stackChartRef.current;

    // 每次更新先清空，再 setOption
    barChart.clear();
    stackChart.clear();

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

    // 页面首次渲染时有时容器尺寸还没稳定，延迟一次 resize 更稳
    const t = window.setTimeout(onResize, 50);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
      // 注意：不 dispose，避免 StrictMode/重复挂载造成闪断
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

      <div className={`rounded-2xl border shadow-sm p-4 ${memeBg}`}>
        <div className="font-semibold">{meme.title}</div>
        <div className="text-sm text-gray-700 mt-1">{meme.text}</div>
        <div className="text-xs text-gray-500 mt-2">
          提示：梗评语仅用于轻松提醒，最终以双方沟通和现实情况为准。
        </div>
      </div>

      <div className="rounded-2xl border shadow-sm p-4">
        <div ref={barElRef} style={{ width: "100%", height: 320 }} />
      </div>

      <div className="rounded-2xl border shadow-sm p-4">
        <div ref={stackElRef} style={{ width: "100%", height: 360 }} />
      </div>
    </div>
  );
}
