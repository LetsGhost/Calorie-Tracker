export function calculateCalories(weight: number, calories: number) {
  // Calculate the calories based of the weight of the food and the calories per 100g
  const calculatedCalories = (weight / 100) * calories;
  return Math.round(calculatedCalories * 100) / 100; // Round to two decimal places
}