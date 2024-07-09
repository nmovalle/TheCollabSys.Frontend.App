export class MenuRoleDetailDTO {
    label: string;
    icon: string;
    menuId: number;
    roleId: string;
    items: SubMenuRoleDTO[];
  
    constructor() {
      this.items = [];
    }
  }
  
  export class SubMenuRoleDTO {
    roleId: string;
    roleName: string;
    label: string;
    icon: string;
    routerLink: string;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
    import: boolean;
  }

  export class MenuEntity {
    menuId?: number;
    menuName?: string;
  }
  
  export class SubMenuEntity {
    subMenu?: number;
    subMenuName?: string;
  }