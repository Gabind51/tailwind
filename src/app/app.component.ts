import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { User } from './models/User';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { faGamepad } from '@fortawesome/free-solid-svg-icons/faGamepad';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, RouterOutlet, HttpClientModule],
  providers: [HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  users!: User[]

  view: 'grid' | 'table' = 'grid';

  faTable = faTable
  faGrid = faGamepad

  searchTerm: string = '';
  searchTerms: string[] = [];
  isTableView: boolean = true;
  count: number = 0;
  totalUsers: number = 0
  currentPage: number = 1

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
      this.searchUsers()
  }

  searchUsers() {
    this.httpClient.post(`http://localhost:3000/user/${this.currentPage}`, {terms: this.searchTerms}).subscribe((res: any) => {
      this.users = res.data
      this.count = this.users.length
      this.totalUsers = res.count
    })
  }

  addTerm() {
    if (this.searchTerm.trim() && !this.searchTerms.includes(this.searchTerm.trim())) {
      this.searchTerms.push(this.searchTerm.trim());
    }
    this.searchTerm = '';
    this.searchUsers()
  }

  removeTerm(index: number) {
    this.searchTerms.splice(index, 1);
    this.searchUsers()
  }

  toggleView(view: string) {
    this.isTableView = view === 'table';
  }

  loadMore() {
    this.currentPage++;
    this.httpClient.post(`http://localhost:3000/user/${this.currentPage}`, {terms: this.searchTerms}).subscribe((res: any) => {
      this.users = [...this.users, ...res.data]
      this.count = this.users.length
    })
  }

}
