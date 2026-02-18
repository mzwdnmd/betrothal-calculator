
import type { Category, Item, Side } from "../types/models";

type Props = {
  side: Side;
  title: string;
  categories: Category[];
  onAddItem: (categoryId: string) => void;
  onUpdateItem: (categoryId: string, itemId: string, patch: Partial<Item>) => void;
  onRemoveItem: (categoryId: string, itemId: string) => void;
};

export default function SidePanel({
  title,
  categories,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-white/80 backdrop-blur border-b py-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">单位：元（¥）。支持按类目添加条目。</p>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="rounded-2xl border shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{cat.name}</div>
              <div className="text-xs text-gray-500">
                小计：¥
                {cat.items
                  .reduce((a, it) => a + (Number(it.amount) || 0), 0)
                  .toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => onAddItem(cat.id)}
              className="px-3 py-2 rounded-xl border hover:bg-gray-50 text-sm"
            >
              + 新增条目
            </button>
          </div>

          {cat.items.length === 0 ? (
            <div className="text-sm text-gray-500">暂无条目</div>
          ) : (
            <div className="space-y-2">
              {cat.items.map((it) => (
                <div key={it.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    className="col-span-5 rounded-xl border px-3 py-2 text-sm"
                    value={it.name}
                    placeholder="例如：三金/首付/酒席"
                    onChange={(e) => onUpdateItem(cat.id, it.id, { name: e.target.value })}
                  />
                  <input
                    className="col-span-4 rounded-xl border px-3 py-2 text-sm"
                    value={String(it.amount ?? "")}
                    placeholder="金额"
                    inputMode="numeric"
                    onChange={(e) =>
                      onUpdateItem(cat.id, it.id, { amount: Number(e.target.value || 0) })
                    }
                  />
                  <input
                    className="col-span-2 rounded-xl border px-3 py-2 text-sm"
                    value={it.note ?? ""}
                    placeholder="备注"
                    onChange={(e) => onUpdateItem(cat.id, it.id, { note: e.target.value })}
                  />
                  <button
                    onClick={() => onRemoveItem(cat.id, it.id)}
                    className="col-span-1 rounded-xl border px-2 py-2 hover:bg-gray-50 text-sm"
                    title="删除"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
