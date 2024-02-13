import { Skia } from "@shopify/react-native-skia"

export const glsl = (source, ...values) => {
  const processed = source.flatMap((s, i) => [s, values[i]]).filter(Boolean)
  return processed.join("")
}

export const frag = (source, ...values) => {
  const code = glsl(source, ...values)
  const rt = Skia.RuntimeEffect.Make(code)
  if (rt === null) {
    throw new Error("Couln't Compile Shader")
  }
  return rt
}
