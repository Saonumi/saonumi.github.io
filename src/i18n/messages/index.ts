export const namespaces = {
  common: import.meta.glob(["./namespaces/common/en.json", "./namespaces/common/vi.json"]),
} as const;
