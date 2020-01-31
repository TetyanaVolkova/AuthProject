import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { SearchComponent } from './search-component/search.component';
import { HeaderComponent } from './header/header.component';
import { HistoryListComponent } from './history/history-list/history-list.component';
import { TicketElementComponent } from './history/ticket-element/ticket-element.component';
import { LabListComponent } from './laboratories/lab-list/lab-list.component';
import { RegulatoryListComponent } from './regulatory/regulatory-list/regulatory-list.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { InfoComponent } from './info/info.component';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './register/register.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HeaderComponent,
    LabListComponent,
    RegulatoryListComponent,
    HistoryListComponent,
    TicketElementComponent,
    InfoComponent,
    AuthComponent,
    RegisterComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatIconModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {}
