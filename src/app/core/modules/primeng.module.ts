import { NgModule } from '@angular/core';

// Modules
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenubarModule } from 'primeng/menubar'
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [],
  imports: [
    MenuModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    TableModule,
    PanelModule,
    CalendarModule,
    DropdownModule,
    ConfirmPopupModule,
    InputNumberModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    RadioButtonModule,
    MultiSelectModule,
    InputSwitchModule,
    TooltipModule,
    CheckboxModule,
    ProgressSpinnerModule,
    SplitButtonModule,
    MenubarModule,
    PanelMenuModule,
    SidebarModule,
    BadgeModule,
    RippleModule
  ],

  exports: [
    MenuModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    TableModule,
    PanelModule,
    CalendarModule,
    DropdownModule,
    ConfirmPopupModule,
    InputNumberModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    RadioButtonModule,
    MultiSelectModule,
    InputSwitchModule,
    TooltipModule,
    CheckboxModule,
    ProgressSpinnerModule,
    SplitButtonModule,
    MenubarModule,
    MessageModule,
    PanelMenuModule,
    SidebarModule,
    BadgeModule,
    RippleModule
  ],

  providers: [ConfirmationService, MessageService]
})

export class PrimengModule { }