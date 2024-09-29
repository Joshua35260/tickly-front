
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, DestroyRef, effect, Injector, input, OnInit, output, signal, TemplateRef, ViewChild, } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { featureGroup, FeatureGroup, icon, latLng, Map, marker, Marker, tileLayer, } from 'leaflet';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SidebarModule } from 'primeng/sidebar';
import { distinctUntilChanged, Observable } from 'rxjs';
import { PaginatedData } from '../../../core/models/paginated-data.class';
import { Address } from '@app/core/models/address.class';


export interface ListAndMapSortOption {
  label: string;
  order: string;
  filter: string;
}

interface ListAndMapItem {
  id: number;
  name: string;
  address: Address;
}

export interface ListAndMapMarker {
  name: string;
  address: Address;
}
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-list-and-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InputSwitchModule,
    FormsModule,
    DropdownModule,
    PaginatorModule,
    LeafletModule,
    SidebarModule,
    RouterModule,
  ],
  templateUrl: './list-and-map.component.html',
  styleUrl: './list-and-map.component.scss',
})
export class ListAndMapComponent<T extends ListAndMapItem = ListAndMapItem> implements OnInit {
  


  paginationFilterBuilder = input<(searchTerm: string) => string>((searchTerm: string) => `"name='@${searchTerm}@'"`);
  paginationFetch = input<(page: number, options?: { filter?: string; sort?: string; pagesize?: number }) => Observable<PaginatedData<T>>>();
  mapMarkersWrapper = input<(item: T) => ListAndMapMarker[]>((item: T) => [{ name: item.name, address: item.address }]);

  sortOptions = input<ListAndMapSortOption[]>([]);
  mapIntegration = input<boolean>(true);
  actionAddTitle = input<string>('Nouvelle entrée');
  showCreateButton = input<boolean>(true);

  closeRightPanel = output<void>();
  displayItemCreation = output<void>();

  @ContentChild('row') rowTemplate: TemplateRef<any>;
  @ViewChild('paginator') paginator: Paginator;



  loading = signal<boolean>(false);
  showMap = signal<boolean>(true);
  hideArchive = signal<boolean>(false);
  filter = signal<string>(null);



  first: number = 0;
  rows: number = 20;
  itemCount: number;
  page: number = 1;
  sort: string;


  items = signal<T[]>([]);

  itemsMarkers: FeatureGroup[] = [];
  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        // attribution: '',
      }),
    ],
    circleMarkerOptions: {
      radius: 10,
      fillColor: '#ff0000',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    },
    zoom: 5,
    center: latLng(48.864716, 2.349014),
  };
  map: Map;

  selectedOptions: ListAndMapSortOption;
  localStorageShowMapKey: string;
  localStorageShowArchiveItemsKey: string;
  sessionStorageSortKey: string;
  sessionStorageSearchKey: string;
  sessionStoragePageKey: string;
  haveItems: boolean = true;

  constructor(
    private destroyRef: DestroyRef,
    private injector: Injector,
    private route: ActivatedRoute,
  ) {

    effect(() => {
      this.loadItems();
    }, {
      allowSignalWrites: true,
      injector: this.injector,
    });
  }
ngOnInit(): void {
    
}


  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.page + 1; // +1 because 4d id start at 1

    this.loadItems();
  
  }


  loadItems() {
    this.loading.set(true);

    let filter = null;


    this.paginationFetch()(this.page, {
      pagesize: this.rows,
      sort: this.sort,
      filter: this.filter() || filter,
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (loadedItems: PaginatedData<T>) => {
        this.resetMarkers();
        if (this.hideArchive()) {
          loadedItems.items = loadedItems.items.filter((item: any) => !item.archive);
        }
        this.items.set(loadedItems.items);
        this.itemCount = loadedItems.total;
        this.haveItems = this.itemCount > 0;
        const maxPages = Math.ceil(this.itemCount / this.rows);
        
        if (this.page > maxPages) {
          this.page = 1;
          this.paginator.first = this.page;
        }
        this.addMarkersToMap();
      },
      error: () => {
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
}




  addMarkersToMap() {
    const filteredDisplayedItems: ListAndMapMarker[] = this.items()
      .flatMap((item: T) => this.mapMarkersWrapper()(item))
      .filter(
        (marker: ListAndMapMarker) =>
          marker &&
          marker.address &&
          marker.address.latitude &&
          marker.address.longitude
      );
    if (filteredDisplayedItems.length > 0) {

      this.itemsMarkers = [
        featureGroup(
          filteredDisplayedItems.map((item: ListAndMapMarker) => {
            const m: Marker = marker(
              [item.address.latitude, item.address.longitude],
              {
                icon: icon({
                  iconSize: [25, 41],
                  iconAnchor: [13, 41],
                  iconUrl: 'leaflet/marker-icon.png',
                  shadowUrl: 'leaflet/marker-shadow.png',
                }),
              }
            );
            m.bindPopup(item.name);
            m.on('click', function () {
              this.openPopup();
            });
            return m;
          })
        ),
      ];
      if (!!this.map && filteredDisplayedItems.length > 0 && this.showMap() && this.mapIntegration()) {
        // very important to invalidate the size of the map before fitting the bounds
        this.map.invalidateSize();
        // center the map, based on the markers loaded
        this.map.fitBounds(this.itemsMarkers[0]?.getBounds(), { maxZoom: 6 });
      }
    } else {
      this.itemsMarkers = [];
    }

  }

  toggleShowMap() {
    this.showMap.update((showMap: boolean) => {
      const newValue = !showMap;
      
      localStorage.setItem(
        this.localStorageShowMapKey,
        JSON.stringify(newValue)
      );
      return newValue;
    });
    setTimeout(() => {
      if (!!this.map && this.itemsMarkers?.length > 0 && this.showMap() && this.mapIntegration()) {
        this.map.invalidateSize();
        this.map.fitBounds(this.itemsMarkers[0]?.getBounds(), { maxZoom: 6 });
      }
    }, 500); //todo: try to do better than shit..
  }
  
  toggleShowArhive() {
    this.hideArchive.update((hideArchive: boolean) => {
      const newValue = !hideArchive;
      localStorage.setItem(
        this.localStorageShowArchiveItemsKey,
        JSON.stringify(newValue)
      );
      return newValue;
    });
    this.loadItems();
  }

  resetMarkers() {
    this.itemsMarkers = [];
  }

  onMapReady(map: Map) {
    this.map = map;
  }

  resetItemList() {
    this.items.set([]);
  }

  reload() {
    this.resetItemList();
    this.loadItems();
  }

  onDisplayNewItem() {
    this.displayItemCreation.emit();
  }

  onCloseRightPanel(close: boolean = true) {
    if (close) {
      this.closeRightPanel.emit();
    }
  }
}
