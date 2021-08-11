import { IsDefined } from 'class-validator'

export default class ReqBody {
    @IsDefined()
    country: string

    @IsDefined()
    city: string
}
