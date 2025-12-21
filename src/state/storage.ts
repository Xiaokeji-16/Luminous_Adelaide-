import merchantsData from "../data/merchants.json";
import type { Merchant } from "../types/merchant";
import type { SaveData, MerchantProgress } from "../types/save";

const STORAGE_KEY = "luminous_v1";
const SCHEMA_VERSION: SaveData["schemaVersion"] = 1;

function makeDefaultMerchantProgress(m: Merchant): MerchantProgress {
  return {
    visits: 0,
    level: 1,
    lastLitAt: 0,
    storyUnlocked: 0,
    state: m.state, // 先用 merchants.json 里的初始 state
  };
}

export function loadState(): SaveData {
  const merchants = merchantsData as Merchant[];

  // 1) 先生成默认存档（就算没有 localStorage 也能跑）
  const defaults: SaveData = {
    schemaVersion: SCHEMA_VERSION,
    merchants: Object.fromEntries(
      merchants.map((m) => [m.id, makeDefaultMerchantProgress(m)])
    ),
    updatedAt: Date.now(),
  };

  // 2) 读取 localStorage
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaults;

  try {
    const parsed = JSON.parse(raw) as Partial<SaveData>;

    // 3) 版本不对：直接用默认（你以后升级版本可在这里做迁移）
    if (parsed.schemaVersion !== SCHEMA_VERSION) return defaults;

    // 4) 合并：确保新增商户/缺字段不会炸
    const mergedMerchants: SaveData["merchants"] = { ...defaults.merchants };

    if (parsed.merchants) {
      for (const [id, p] of Object.entries(parsed.merchants)) {
        mergedMerchants[id] = {
          ...mergedMerchants[id],
          ...(p as Partial<MerchantProgress>),
        };
      }
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      merchants: mergedMerchants,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    // JSON 坏了：回默认
    return defaults;
  }
}

export function saveState(state: SaveData) {
  const next: SaveData = {
    ...state,
    schemaVersion: SCHEMA_VERSION,
    updatedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearState() {
    localStorage.removeItem("luminous_v1");
}