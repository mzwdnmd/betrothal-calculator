import React, { useMemo, useState } from "react";
import SidePanel from "./components/SidePanel";
import Charts from "./components/Charts";
import type { Category, Item } from "./types/models";
import { defaultCategories } from "./data/defaultCategories";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function cloneDefaults(): Category[] {
  return defaultCategories.map((c) => ({ ...c, items: [] }));
}

export default function App() {
  const [bridePrice, setBridePrice] = useState<Category[]>(cloneDefaults());
  const [dowry, setDowry] = useState<Category[]>(cloneDefaults());
  const [showResult, setShowResult] = useState(false);

  const handlers = useMemo(() => {
    const addItem =
      (setFn: React.Dispatch<React.SetStateAction<Category[]>>) => (categoryId: string) => {
        setFn((prev) =>
          prev.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  items: [
                    ...c.items,
                    { id: uid(), name: "", amount: 0, note: "" } satisfies Item,
                  ],
                }
              : c
          )
        );
      };

    const updateItem =
      (setFn: React.Dispatch<React.SetStateAction<Category[]>>) =>
      (categoryId: string, itemId: string, patch: Partial<Item>) => {
        setFn((prev) =>
          prev.map((c) =>
            c.id === categoryId
              ? { ...c, items: c.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) }
              : c
          )
        );
      };

    const removeItem =
      (setFn: React.Dispatch<React.SetStateAction<Category[]>>) =>
      (categoryId: string, itemId: string) => {
        setFn((prev) =>
          prev.map((c) =>
            c.id === categoryId ? { ...c, items: c.items.filter((it) => it.id !== itemId) } : c
          )
        );
      };

    return {
      left: { addItem: addItem(setBridePrice), updateItem: updateItem(setBridePrice), removeItem: removeItem(setBridePrice) },
      right: { addItem: addItem(setDowry), updateItem: updateItem(setDowry), removeItem: removeItem(setDowry) },
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="max-w-6xl mx-auto px-4 py-6">
        <div className="rounded-3xl border bg-white shadow-sm p-6">
          <h1 className="text-2xl md:text-3xl font-bold">彩礼嫁妆计算器</h1>
          <p className="text-gray-600 mt-2">
            左侧填写彩礼，右侧填写嫁妆。填写后点击“生成对比结果”，图表展示双方差距。
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-6">
          <div className="rounded-3xl border bg-white shadow-sm p-4 md:p-6">
            <SidePanel
              side="bridePrice"
              title="彩礼（左）"
              categories={bridePrice}
              onAddItem={handlers.left.addItem}
              onUpdateItem={handlers.left.updateItem}
              onRemoveItem={handlers.left.removeItem}
            />
          </div>

          <div className="hidden md:block bg-gray-300 rounded-full" />

          <div className="rounded-3xl border bg-white shadow-sm p-4 md:p-6">
            <SidePanel
              side="dowry"
              title="嫁妆（右）"
              categories={dowry}
              onAddItem={handlers.right.addItem}
              onUpdateItem={handlers.right.updateItem}
              onRemoveItem={handlers.right.removeItem}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowResult(true)}
            className="px-5 py-3 rounded-2xl bg-black text-white hover:opacity-90"
          >
            生成对比结果
          </button>
          <button
            onClick={() => {
              setBridePrice(cloneDefaults());
              setDowry(cloneDefaults());
              setShowResult(false);
            }}
            className="px-5 py-3 rounded-2xl border bg-white hover:bg-gray-50"
          >
            清空重置
          </button>
        </div>

        {showResult && (
          <div className="mt-6 rounded-3xl border bg-white shadow-sm p-4 md:p-6">
            <Charts bridePrice={bridePrice} dowry={dowry} />
          </div>
        )}
      </main>
    </div>
  );
}
