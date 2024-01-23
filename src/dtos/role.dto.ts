import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";


export class RoleDTO {
  title: string;
  modules: ModuleDTO[];
}

export class ModuleDTO {
  uri: string;
  permission: boolean;
  actions: ActionDTO[];
}

export class ActionDTO {
  uri: string;
  permission: boolean;
}

export class RoleRetrieveDto {
  @IsInt()
  @IsPositive()
  pageNumber: number

  @IsInt()
  @IsPositive()
  pageSize: number
}

export class RoleCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string
}

export class AddModuleDto {
  @IsString()
  @IsNotEmpty()
  module_uri: string
}

export class UpdateModuleDto {
  @IsString()
  @IsNotEmpty()
  uri: string

  @IsString()
  @IsNotEmpty()
  new_uri: string
}


export class ToggleModuleDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  module: string
}

export class AddAction {
  @IsString()
  @IsNotEmpty()
  module_uri: string

  @IsString()
  @IsNotEmpty()
  action_uri: string
}

export class UpdateAction {

}
export class ToggleAction {}