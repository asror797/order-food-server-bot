// import { Type } from 'class-transformer'
// import {
//   IsArray,
//   IsBoolean,
//   IsEnum,
//   IsInt,
//   IsNotEmpty,
//   IsNumber,
//   IsPositive,
//   IsString,
//   ValidateNested
// } from 'class-validator'

import { IsBoolean, IsString } from 'class-validator'

// export class GetOrderDto {
//   @IsNumber()
//   page: number
//   @IsNumber()
//   size: number
// }

// class FoodWithAmount {
//   @IsString()
//   food: string

//   @IsNumber()
//   amount: number
// }

// export class CreateOrderDto {
//   @IsString()
//   client: string

//   @IsString()
//   org: string

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => FoodWithAmount)
//   foods: FoodWithAmount[]
// }

export class UpdateOrder {
  @IsString()
  order: string

  @IsBoolean()
  type: boolean
}

// export class OrderRetrieveByUserDto {
//   @IsString()
//   @IsNotEmpty()
//   id: string

//   @IsInt()
//   @IsPositive()
//   page: number

//   @IsInt()
//   @IsPositive()
//   size: number
// }

// enum TypeDate {
//   day = 'day',
//   week = 'week',
//   month = 'month',
//   year = 'year'
// }

// export class OrderRetrieveAllDto {
//   @IsString()
//   @IsNotEmpty()
//   user: string

//   @IsEnum(TypeDate)
//   @IsNotEmpty()
//   type: string
// }
