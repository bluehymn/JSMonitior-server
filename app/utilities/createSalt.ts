export default function (): string {
  const dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_/+-#'
  const dictLen = dict.length

  let salt = ''
  const saltLen = 20

  for (let i = 0; i < saltLen; i++) {
    salt += dict.charAt(Math.floor(Math.random() * dictLen))
  }
  return salt
}
