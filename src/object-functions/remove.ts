/**
 * 
 * @param incoming The object to remove the keys from
 * @param keyToRemove The key to remove from the object
 * @returns The object with the keys removed
 */
export const removeValueForKey = (incoming: any, keyToRemove: string) => {
  incoming = typeof incoming === 'string' ? JSON.parse(incoming) : incoming
  Object.keys(incoming)?.forEach((key) => {
    key === keyToRemove ? delete incoming[key] : typeof incoming[key] === 'object' && removeValueForKey(incoming[key], keyToRemove)
  })
  return incoming
}

/**
 * Given an object and an array of keys, remove the keys from the object. This recursively traversely all keys of the object and removes the keys from all objects of the object.
 * 
 * @param incoming The object you want to remove keys from
 * @param keysToRemove The keys of the object you want to remove
 * @returns The object with the keys removed
 */
export function removeValuesForKeys<T>(incoming: T, keysToRemove: (keyof any)[]): T {
  return keysToRemove.reduce((acc: T, key: any) => removeValueForKey(acc, key), incoming)
} 
