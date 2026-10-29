import fs from 'node:fs'
import path from 'node:path'
import { parseStarbucksProtocol, protocolFile } from '../services/starbucksProtocol.js'

const source = process.argv[2]
if (!source) throw new Error('用法：npm run starbucks:configure -- /绝对路径/参考脚本.user.js')
const config = parseStarbucksProtocol(fs.readFileSync(source, 'utf8'))
const target = protocolFile()
fs.mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 })
fs.writeFileSync(target, JSON.stringify(config), { mode: 0o600 })
fs.chmodSync(target, 0o600)
console.log('星巴克协议已导入本机私有运行配置；未执行脚本，未写入 Git 或前端。')
