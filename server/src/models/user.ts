import { IsAlphanumeric, IsDefined, IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator'

export default class User {
    @IsDefined()
    @IsAlphanumeric()
    @MinLength(3)
    @MaxLength(24)
    username: string

    @IsDefined()
    @MinLength(6)
    password: string

    @IsOptional()
    @IsEmail()
    email: string

    @IsOptional()
    firstname: string

    @IsOptional()
    lastname: string

    @IsOptional()
    balance: number

    @IsOptional()
    skype: string

    @IsOptional()
    role: string

    token: string
    createdAt: Date
    modifiedAt: Date
}
