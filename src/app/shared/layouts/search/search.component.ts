import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { sharedAnimations } from '../../animations/shared-animations';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [sharedAnimations],
})
export class SearchComponent implements OnInit {
  page = 1;
  pageSize = 6;

  results$!: Array<{
    photo: string;
    name: string;
    price: { sale: number; previous: number };
    badge: { color: string; text: string };
  }>;
  searchCtrl: FormControl = new FormControl('');

  constructor(public searchService: SearchService) {}

  ngOnInit() {
    const _a: number = 0;
    /* this.results$ = combineLatest(
      this.dl.getProducts(),
      this.searchCtrl.valueChanges.pipe(startWith(''), debounceTime(200)),
    ).pipe(
      map(([products, searchTerm]) =>
        products.filter(
          (p) => p.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1,
        ),
      ),
    ); */
  }
}
