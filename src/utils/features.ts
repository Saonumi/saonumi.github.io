export const features = { sounds: true } as const;

export const isFeatureEnabled = (feature: keyof typeof features) => features[feature];
