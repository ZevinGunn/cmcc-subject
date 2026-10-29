import { onUnmounted, ref } from "vue";

export function useCountdown(initial = 60) {
  const seconds = ref(0);
  let timer: number | null = null;

  const start = () => {
    seconds.value = initial;
    if (timer) {
      clearInterval(timer);
    }
    timer = window.setInterval(() => {
      seconds.value -= 1;
      if (seconds.value <= 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  };

  const reset = () => {
    seconds.value = 0;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  onUnmounted(reset);

  return {
    seconds,
    start,
    reset,
    get running() {
      return seconds.value > 0;
    },
  };
}

