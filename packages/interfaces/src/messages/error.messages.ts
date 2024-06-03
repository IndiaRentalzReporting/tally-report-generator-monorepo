export const errorMessages = {
  invalid: (type: string) => `Invalid ${type}`,
  min: (type: string, min: number) => `${type} must be minimum ${min}`,
  max: (type: string, min: number) => `${type} must be maximum ${min}`,
  length: (type: string, length: number) =>
    `${type} must be of length ${length}`
};
