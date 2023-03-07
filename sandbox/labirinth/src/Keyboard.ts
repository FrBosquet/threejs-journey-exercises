export class Keyboard {
  keys: Set<string> = new Set()

  constructor() {
    document.addEventListener('keydown', (e) => {
      this.keys.add(e.code)
    })
    document.addEventListener('keyup', (e) => {
      this.keys.delete(e.code)
    })
  }

  has(keyName: string){
    return this.keys.has(keyName)
  }
}