import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../list/list.component';
import { TaskComponent } from '../task/task.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';

// import { MatGridListModule } from '@angular/material/grid-list'
import { MatCardModule } from '@angular/material/card'
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthVerifyService } from '../../services/auth-verify.service';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ListComponent, TaskComponent, MatCardModule, MatListModule, MatSidenavModule],
  // templateUrl: './dashboard.component.html',
  template: `
    <mat-card appearance="outlined" id="dashboard" *ngIf="isAuthenticated">
      <mat-sidenav-container>
        <mat-sidenav mode="side" opened>
          <app-list (listSelected)="onListSelected($event)"></app-list>
        </mat-sidenav>
        <mat-sidenav-content>
          <app-task [listId]="selectedListId"></app-task>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </mat-card>
  `, styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  // Not needed(?) may delete if app runs without the lines
  // private readonly oidcSecurityService = inject(OidcSecurityService);
  // userData$ = this.oidcSecurityService.userData$;


  private readonly authService = inject(AuthVerifyService)

  isAuthenticated = false;

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(
      (status) => (this.isAuthenticated = status)
    );
  }

  selectedListId: string | null = null;

  onListSelected(listId: string): void {
    this.selectedListId = listId;
  }
}
