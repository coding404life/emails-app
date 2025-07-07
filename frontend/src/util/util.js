export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
