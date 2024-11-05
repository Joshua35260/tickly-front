import { CommonModule } from '@angular/common';
import { Component, OnInit, DestroyRef, input, ViewChild, ChangeDetectionStrategy, signal, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OverlayPanel } from 'primeng/overlaypanel';
import { debounceTime } from 'rxjs';
import { SearchType, SearchTypeLabels } from '@app/core/models/enums/search-type.enum';

@Component({
  selector: 'app-list-and-map-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list-and-map-search.component.html',
  styleUrls: ['./list-and-map-search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
  ],
})
export class ListAndMapSearchComponent implements OnInit {
  @ViewChild('overlaypanel') overlayPanel: OverlayPanel;

  searchType = input.required<SearchType>();
  searchTypeLabels = SearchTypeLabels;

  searchForm: FormGroup;
  canClear = signal<boolean>(false);
  searchOutput =output<string>();
  constructor(
    private destroyRef: DestroyRef,

  ) {}

  ngOnInit() {
    this.initSearchForm();
  }
  initSearchForm() {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  
 
    this.searchForm.get('search').valueChanges
      .pipe(
        debounceTime(400),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.canClear.set(!!value);
        this.searchOutput.emit(value);
      });
  }

  onSave() {
    this.searchOutput.emit(this.searchForm.get('search').value);
  }


  onClear() {
    this.searchForm.patchValue({
      search: '',
    });
  }


}