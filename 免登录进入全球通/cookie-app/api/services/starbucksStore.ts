import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { encryptJson, decryptJson } from './cryptoBox.js'
import { StarbucksError, maskStarbucksValue, type StarbucksSession, type StoredStarbucksCoupon } from './starbucksProtocol.js'
import { effectiveCouponStatus, type StarbucksAccount } from '../../shared/starbucks.js'

export type StoredStarbucksAccount = {
  id: string; phone: string; session: StarbucksSession; updatedAt: string
  queriedAt?: string; invalidAt?: string; coupons: StoredStarbucksCoupon[]
}
export class StarbucksStore {
  constructor(readonly directory = process.env.STARBUCKS_DATA_DIR || path.resolve('data/starbucks/accounts')) {}
  private file(owner: string) { return path.join(this.directory, `${crypto.createHash('sha256').update(owner).digest('hex')}.local`) }
  read(owner: string): StoredStarbucksAccount[] {
    const file = this.file(owner)
    if (!fs.existsSync(file)) return []
    // A corrupt/undecryptable file must never be silently replaced with empty data.
    const data = decryptJson<{ version: number; accounts: StoredStarbucksAccount[] }>(fs.readFileSync(file, 'utf8'))
    if (data.version !== 1 || !Array.isArray(data.accounts)) throw new Error('INVALID_STARBUCKS_STORE')
    return data.accounts
  }
  write(owner: string, accounts: StoredStarbucksAccount[]) {
    fs.mkdirSync(this.directory, { recursive: true, mode: 0o700 })
    const file = this.file(owner), temporary = `${file}.${crypto.randomUUID()}.tmp`
    try {
      fs.writeFileSync(temporary, encryptJson({ version: 1, accounts }), { mode: 0o600, flag: 'wx' })
      fs.renameSync(temporary, file)
    } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary) }
  }
  account(owner: string, id: string) {
    const account = this.read(owner).find(a => a.id === id)
    if (!account) throw new StarbucksError('此星巴克账号不存在或不属于当前用户', 404, 'ACCOUNT_NOT_FOUND')
    return account
  }
  view(owner: string): StarbucksAccount[] {
    return this.read(owner).map(a => ({
      id: a.id, phoneMasked: maskStarbucksValue(a.phone, true), customerMasked: a.session.customer_id ? maskStarbucksValue(a.session.customer_id) : '未返回会员号',
      updatedAt: a.updatedAt, queriedAt: a.queriedAt, invalidAt: a.invalidAt,
      coupons: a.coupons.map(({ code: _code, shortCode: _short, ...coupon }) => ({ ...coupon, status: effectiveCouponStatus(coupon) })),
    }))
  }
}
