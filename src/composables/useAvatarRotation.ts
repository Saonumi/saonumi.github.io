import { ref } from "vue";

// Only the Hero instance reads this angle; About and Contact stay independent.
export const avatarRotation = ref(0);

export const setAvatarRotation = (degrees: number) => {
  avatarRotation.value = ((degrees + 180) % 360 + 360) % 360 - 180;
};
