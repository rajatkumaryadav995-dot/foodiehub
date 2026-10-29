const calcEstimatedTime = (items) => {
  if (!items.length) return 0;
  const longestPrepTime = Math.max(...items.map((item) => item.prepTime));
  const quantity = items.reduce((total, item) => total + item.qty, 0);
  return longestPrepTime + 2 * (quantity - 1);
};

module.exports = calcEstimatedTime;
